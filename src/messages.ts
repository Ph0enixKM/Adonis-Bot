import dayjs from 'dayjs';
import { ChannelType, Message, MessageType } from 'discord.js';
import { chooseRandom } from './utils';

export default class MessageProcessing {
  private message : Message = {} as Message;
  private selfId : string;

  constructor(selfId : string) {
    this.selfId = selfId;
  }

  public async run(message : Message) {
    this.message = message;
    if (await this.isValid()) {
      this.reactAdonis();
      this.goodMorning();
      this.goodNight();
    }
  }

  public async isValid() : Promise<boolean> {
    if (this.message.author.bot) return false;
    if (this.message.channel.type !== ChannelType.GuildText) return false;
    if (this.message.type === MessageType.Reply && this.message?.reference?.messageId) {
      const {channel} = this.message;
      const replied = await channel.messages.fetch(this.message.reference.messageId);
      if (!this.message.author.bot && replied.author.bot) {
        // Special reply
        if (this.message.content.match(/^\s*dzi(ęki|ękuję|ena)\s*(wielkie|bardzo)?\s*$/i)) {
          const reactions = ['🤙', '👌', '👏', '🙏', '🙌', '🤝'];
          this.message.react(chooseRandom(reactions));
          return false;
        }
      }
      if (replied.content.match(`<@${this.selfId}>`)) return true;
      return false;
    }
    if (this.message.content.match(`<@${this.selfId}>`)) return true;
    if (this.message.content.match(/<@\d+>/)) return false;
    return true;
  }

  public getEmojiByName(name : string) {
    const emoji = this.message.guild!.emojis.cache.find((guildEmoji) => name === guildEmoji.name);
    return emoji ? `<:${name}:${emoji.id}>` : null;
  }

  public reactAdonis() {
    const words = ['adonis', 'chad'];
    const chad = this.getEmojiByName('chad');
    if (words.find((word) => this.message.content.replace(/:[^:]+:/, '').match(word))) {
      if (chad) this.message.react(chad);
    }
  }

  public goodNight() {
    const replies = [
      'Dobranoc szefie 🫶',
      'Śpij dobrze bracie 💪',
      'Śpij spokojnie 😴',
      'Śpij z aniołami przyjacielu 🙏',
      'Wyśpij się porządnie 🌙',
      'Rano będziesz miał energię na cały dzień 🌞',
      'Jutro zdobędziesz wszystko co chcesz 🤩',
    ];
    if (this.message.content.match(/dobranoc/i)) {
      if (dayjs().format('HH:mm') >= '20:00' && dayjs().format('HH:mm') <= '24:00') {
        this.message.reply(chooseRandom(replies));
      }
    }
  }

  public goodMorning() {
    const replies = [
      'Dzień dobry szefie 🫶',
      'Dzień dobry bracie 💪',
      'Dzień dobry przyjacielu 🙏',
      'Zaczynamy dzień od dobrego humoru 🤩',
      'Dzisiaj będzie świetny dzień 🌙',
      'Dzisiaj będzie najlepszy dzień w Twoim życiu 🌞',
      'Rano jest najlepszą porą dnia na realizację marzeń 🌞',
    ];
    if (this.message.content.match(/dzień dobry/i)) {
      if (dayjs().tz().format('HH:mm') >= '04:00' && dayjs().tz().format('HH:mm') <= '09:00') {
        this.message.reply(chooseRandom(replies));
      }
    }
  }
}
