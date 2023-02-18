import {
  Message,
  ChannelType,
} from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';

export default class ChatAI {
  private openai: OpenAIApi;

  private selfId: string;

  private isRunning: boolean;

  constructor(selfId: string) {
    const configuration = new Configuration({ apiKey: process.env.OPEN_AI });
    this.openai = new OpenAIApi(configuration);
    this.selfId = selfId;
    this.isRunning = false;
  }

  public async run(message: Message) {
    if (this.isRunning) return;
    if (message.channel.type !== ChannelType.GuildText || message.author.bot) return;
    // Allow only channels that match "botchat" in their name
    if (!message.channel.name.match('botchat')) return;
    if (message.content.match(`<@${this.selfId}>`)) {
      const { channel } = message;
      channel.sendTyping();
      this.isRunning = true;
      const timer = setInterval(() => channel.sendTyping(), 1000);
      const prompt = message.content.replace(`<@${this.selfId}>`, '').trim();
      const completion = await this.openai.createCompletion({
        model: 'text-davinci-003',
        temperature: 0,
        max_tokens: 1000,
        prompt,
      });
      clearInterval(timer);
      message.channel.send(completion.data.choices[0].text ?? 'Nie wiem co powiedzieć');
      this.isRunning = false;
    }
  }
}
