import { CommandInteraction, Client, ChannelType } from "discord.js";
import { cargo, GENERAL_CHANNEL, SERVER_NAME, User } from "./config";
import { chooseRandom, getChannel, getGuild, getMember } from "./utils";
import dayjs from "dayjs";

export default class Bedtime {
  private static async getUser(interaction: CommandInteraction): Promise<User> {
    let [user] = await cargo.in('users').find(user => user.discord_id === interaction.user.id);
    if (!user) {
      const id = await cargo.in('users').add({
        discord_id: interaction.user.id,
        bedtime: null,
      });
      return await cargo.in('users').get(id);
    }
    return user;
  }

  private static guard(interaction: CommandInteraction, client: Client): boolean {
    const channel = client.channels.resolve(interaction.channelId);
    if (channel?.type !== ChannelType.GuildText) return false;
    return true;
  }

  private static async resetTime(interaction: CommandInteraction, db_user: User) {
    await cargo.in('users').update(db_user.ID, {
      bedtime: null
    });
    await interaction.reply({
      content: 'Już nie będę Cię **w ogóle** gonić do łóżka 👍',
      ephemeral: true
    });
  }

  private static async setTime(interaction: CommandInteraction, db_user: User) {
    const time = interaction.options.get('set')?.value?.toString() ?? '';
    if (time.match(/\d\d:\d\d/)) {
      const hours = parseInt(time.slice(0, 2));
      const minutes = parseInt(time.slice(3, 5));
      // Validate time
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        await interaction.reply({
          content: 'Zły format czasowy. Użyj `HH:mm` (gdzie H = godzina, m = minuta)',
          ephemeral: true
        });
        return;
      }
      // Validate minutes
      if (!(minutes % 10 === 0)) {
        await interaction.reply({
          content: 'Zły format czasowy. Minuty muszą być wielokrotnością 10',
          ephemeral: true
        });
        return;
      }
      // Save to database
      await cargo.in('users').update(db_user.ID, {
        bedtime: time
      });
      await interaction.reply(`Ustawiono bedtime na godzinę ${time} ⏰`);
    } else {
      const bedtime_skip_message = db_user.bedtime_skip
        ? 'dzisiaj **nie będę Cię zaganiać** do łóżka :coffee:'
        : 'dzisiaj Cię zagonię do łóżka 🛌';
      await interaction.reply({
        content: `Twój bedtime jest ustawiony na godzinę **${db_user.bedtime}** oraz ${bedtime_skip_message}`,
        ephemeral: true
      });
    }
  }

  private static async skipBedtime(interaction: CommandInteraction, db_user: User, cancel: boolean = false) {
    if (cancel) {
      await cargo.in('users').update(db_user.ID, {
        bedtime_skip: null
      });
      await interaction.reply({
        content: 'Dzisiaj Cię z powrotem zagonię do łóżka 🛌',
        ephemeral: true
      });
      return;
    }
    await cargo.in('users').update(db_user.ID, {
      bedtime_skip: dayjs().format('YYYY-MM-DD')
    });
    await interaction.reply({
      content: 'Dzisiaj nie będę Cię zaganiać do łóżka :coffee:',
      ephemeral: true
    });
  }


  public static async run(interaction: CommandInteraction, client: Client) {
    if (!this.guard(interaction, client)) return;
    const db_user = await this.getUser(interaction);
    switch(interaction.options.get('config')?.value) {
      case 'reset':
        await this.resetTime(interaction, db_user);
        break;
      case 'skip':
        await this.skipBedtime(interaction, db_user);
        break;
      case 'unskip':
        await this.skipBedtime(interaction, db_user, true);
      default:
        await this.setTime(interaction, db_user);
        break;
    }
  }

  public static async checkBedtime(client: Client) {
    const users: User[] = await cargo.in('users').find(user => user.bedtime);
    const guild = await getGuild(client, SERVER_NAME);
    const members = await guild.members.fetch();
    const sleepy_users = users.filter(user => {
      const member = members.get(user.discord_id);
      if (!member && !user.bedtime) return false;
      const bedtime_time = user.bedtime?.split(':');
      const bedtime = dayjs()
        .set('hour', parseInt(bedtime_time[0]))
        .set('minute', parseInt(bedtime_time[1]))
        .set('second', 0);
      // If we are within 1 hour after bedtime
      if (!(bedtime.isBefore(dayjs()) && bedtime.add(1, 'hour').isAfter(dayjs()))) return false;
      // If member is online or in voice channel
      if (!(member?.presence.status === 'online' || member?.voice.channel)) return false;
      // If user has skipped bedtime
      if (user.bedtime_skip === dayjs().format('YYYY-MM-DD')) return false;
      return false;
    });
    if (!sleepy_users.length) return;
    const sleepy_formatted = sleepy_users.map(user => `<@${user.discord_id}>`).join(' ');
    // Send message
    const sleep_emojis = ['🛌', '🛏', '😴', '🥱'];
    getChannel(client, GENERAL_CHANNEL).send({
      content: `${sleepy_formatted} Czas do spania! ${chooseRandom(sleep_emojis)}`
    });
  }
}
