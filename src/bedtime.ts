import { CommandInteraction, Client, ChannelType } from 'discord.js';
import dayjs from 'dayjs';
import { cargo, GENERAL_CHANNEL, SERVER_NAME, User } from './config';
import { chooseRandom, getChannel, getGuild } from './utils';

export default class Bedtime {
  private static async getUser(interaction: CommandInteraction): Promise<User> {
    const [user] = await cargo.in('users').find((user) => user.discordId === interaction.user.id);
    if (!user) {
      const id = await cargo.in('users').add({
        discordId: interaction.user.id,
        bedtime: null,
      });
      return cargo.in('users').get(id);
    }
    return user;
  }

  private static guard(interaction: CommandInteraction, client: Client): boolean {
    const channel = client.channels.resolve(interaction.channelId);
    if (channel?.type !== ChannelType.GuildText) return false;
    return true;
  }

  private static async resetTime(interaction: CommandInteraction, dbUser: User) {
    await cargo.in('users').update(dbUser.ID, {
      bedtime: null,
    });
    await interaction.reply({
      content: 'Już nie będę Cię **w ogóle** gonić do łóżka 👍',
      ephemeral: true,
    });
  }

  private static async setTime(interaction: CommandInteraction, dbUser: User) {
    const time = interaction.options.get('set')?.value?.toString() ?? '';
    if (time.match(/\d\d:\d\d/)) {
      const hours = parseInt(time.slice(0, 2), 10);
      const minutes = parseInt(time.slice(3, 5), 10);
      // Validate time
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        await interaction.reply({
          content: 'Zły format czasowy. Użyj `HH:mm` (gdzie H = godzina, m = minuta)',
          ephemeral: true,
        });
        return;
      }
      // Validate minutes
      if (!(minutes % 10 === 0)) {
        await interaction.reply({
          content: 'Zły format czasowy. Minuty muszą być wielokrotnością 10',
          ephemeral: true,
        });
        return;
      }
      // Save to database
      await cargo.in('users').update(dbUser.ID, {
        bedtime: time,
      });
      await interaction.reply(`Ustawiono bedtime na godzinę ${time} ⏰`);
    } else {
      if (dbUser.bedtime === null) {
        await interaction.reply({
          content: 'Nie masz ustawionego bedtime. Ustaw go używając `/bedtime set HH:mm`',
          ephemeral: true,
        });
        return;
      }
      const bedtimeSkipMessage = dbUser.bedtimeSkip === dayjs().format('YYYY-MM-DD')
        ? 'dzisiaj **nie będę Cię zaganiać** do łóżka :coffee:'
        : 'dzisiaj Cię zagonię do łóżka 🛌';
      await interaction.reply({
        content: `Twój bedtime jest ustawiony na godzinę **${dbUser.bedtime}** oraz ${bedtimeSkipMessage}`,
        ephemeral: true,
      });
    }
  }

  private static async skipBedtime(interaction: CommandInteraction, dbUser: User, cancel = false) {
    if (cancel) {
      await cargo.in('users').update(dbUser.ID, {
        bedtime_skip: null,
      });
      await interaction.reply({
        content: 'Dzisiaj Cię z powrotem zagonię do łóżka 🛌',
        ephemeral: true,
      });
      return;
    }
    await cargo.in('users').update(dbUser.ID, {
      bedtime_skip: dayjs().format('YYYY-MM-DD'),
    });
    await interaction.reply({
      content: 'Dzisiaj nie będę Cię zaganiać do łóżka :coffee:',
      ephemeral: true,
    });
  }

  public static async run(interaction: CommandInteraction, client: Client) {
    if (!this.guard(interaction, client)) return;
    const dbUser = await this.getUser(interaction);
    switch (interaction.options.get('config')?.value) {
      case 'reset':
        await this.resetTime(interaction, dbUser);
        break;
      case 'skip':
        await this.skipBedtime(interaction, dbUser);
        break;
      case 'unskip':
        await this.skipBedtime(interaction, dbUser, true);
        break;
      default:
        await this.setTime(interaction, dbUser);
        break;
    }
  }

  public static async checkBedtime(client: Client) {
    const users: User[] = await cargo.in('users').find((user) => user.bedtime);
    const guild = await getGuild(client, SERVER_NAME);
    const members = await guild.members.fetch();
    const sleepyUsers = users.filter((user) => {
      const member = members.get(user.discordId);
      if (!member && !user.bedtime) return false;
      const bedtimeTime = user.bedtime?.split(':');
      const bedtime = dayjs()
        .set('hour', parseInt(bedtimeTime[0], 10))
        .set('minute', parseInt(bedtimeTime[1], 10))
        .set('second', 0);
      // If we are within 1 hour after bedtime
      if (!(bedtime.isBefore(dayjs()) && bedtime.add(1, 'hour').isAfter(dayjs()))) return false;
      // If member is online or in voice channel
      if (!(member?.presence.status === 'online' || member?.voice.channel)) return false;
      // If user has skipped bedtime
      if (user.bedtimeSkip === dayjs().format('YYYY-MM-DD')) return false;
      return false;
    });
    if (!sleepyUsers.length) return;
    const sleepyFormatted = sleepyUsers.map((user) => `<@${user.discordId}>`).join(' ');
    // Send message
    const sleepEmojis = ['🛌', '🛏', '😴', '🥱'];
    getChannel(client, GENERAL_CHANNEL).send({
      content: `${sleepyFormatted} Czas do spania! ${chooseRandom(sleepEmojis)}`,
    });
  }
}
