import dayjs from 'dayjs';
import { Message, MessageType } from 'discord.js';
import { chooseRandom } from './utils';

export default class MessageProcessing {
  private message: Message = {} as Message;
  private messageFormatted: string = '';
  private selfId: string;

  constructor(selfId: string) {
    this.selfId = selfId;
  }

  public async run(message: Message) {
    this.formatMessage(message.content);
    this.message = message;
    if (await this.isValid()) {
      this.reactAdonis();
      this.reactBalla();
      this.goodMorning();
      this.goodNight();
    }
    this.voting();
    this.votingKeywords();
  }

  private formatMessage(message: string) {
    this.messageFormatted = message.replace(/:[^:]+:/g, '').toLocaleLowerCase();
  }

  public replyThanks(reply: Message): boolean {
    const reactions = ['🤙', '👌', '👏', '🙏', '🙌', '🤝'];
    const thanksRegex = /^\s*dzi(ęki|ękuję|ena|ękuwa)\s*$/gi;
    if (this.message.author.bot || !reply.author.bot) return false;
    if (!this.message.content.match(thanksRegex)) return false;
    this.message.react(chooseRandom(reactions));
    return true;
  }

  public async isValid(): Promise<boolean> {
    if (this.message.author.bot) return false;
    if (this.message.channel.isVoiceBased()) return false;
    if (this.message.type === MessageType.Reply && this.message?.reference?.messageId) {
      const reply = await this.message.channel.messages.fetch(this.message.reference.messageId);
      if (this.replyThanks(reply)) return false;
      if (reply.content.match(`<@${this.selfId}>`)) return true;
      return false;
    }
    if (this.message.content.match(`<@${this.selfId}>`)) return true;
    if (this.message.content.match(/<@\d+>/)) return false;
    return true;
  }

  public getEmojiByName(name: string) {
    if (!this.message.guild) return null;
    const emoji = this.message.guild.emojis.cache.find((guildEmoji) => name === guildEmoji.name);
    return emoji ? `<:${name}:${emoji.id}>` : null;
  }

  public reactAdonis() {
    const words = ['adonis', 'chad'];
    const chad = this.getEmojiByName('chad');
    if (words.find((word) => this.messageFormatted.match(word))) {
      this.message.react(chad ?? '🦾');
    }
  }

  public reactBalla() {
    if (this.messageFormatted.match('balla')) {
      this.message.react('🤙');
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
      if (dayjs().format('HH:mm') >= '19:00' && dayjs().format('HH:mm') <= '24:00') {
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

  private votingKeywords() {
    switch (true) {
      case this.messageFormatted.match(/\$[yt]\/?n/g) !== null:
        this.message.react('👍');
        this.message.react('👎');
        break;
      case this.messageFormatted.match(/\$vote/g) !== null:
        this.message.react('👆');
        break;
      default:
        break;
    }
  }

  private votingGuard() {
    if (this.message.channel.isDMBased()) return;
    if (!this.message.channel.name.toLocaleLowerCase().match('propozycje')) return;
  }

  public voting() {
    this.votingGuard();
    const wordInInfinitive = /^\s*\S{1,10}(a|e|i)[śź]?ć/g;
    if (!this.messageFormatted.match(wordInInfinitive)) return;
    this.message.react('👍');
    this.message.react('👎');
  }
}
