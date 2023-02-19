import { ChannelType, Message } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';

export default class ChatAI {
  private openai : OpenAIApi;
  private selfId : string;

  constructor(selfId : string) {
    const configuration = new Configuration({apiKey: process.env.OPEN_AI,});
    this.openai = new OpenAIApi(configuration);
    this.selfId = selfId;
  }

  private static removeRepeatedText(text : string) : string {
    const sliceSize = 50;
    let all = text.slice(0, sliceSize * 2);
    for (let i = 0; i < text.length - sliceSize * 2; i += 1) {
      for (let j = 0; j < all.length - sliceSize * 2; j += 1) {
        if (all.endsWith(text.slice(j, j + sliceSize))) {
          return all.slice(0, i + sliceSize);
        }
      }
      all += text[i + sliceSize * 2];
    }
    return text;
  }

  public async run(message : Message) {
    if (message.channel.type !== ChannelType.GuildText || message.author.bot) return;
    // Allow only channels that match "botchat" in their name
    if (!message.channel.name.match('botchat')) return;
    if (message.content.match(`<@${this.selfId}>`)) {
      const {channel} = message;
      channel.sendTyping();
      const timer = setInterval(() => channel.sendTyping(), 1000);
      const prompt = message.content.replace(`<@${this.selfId}>`, '').trim();
      const completion = await this.openai.createCompletion({
        model: 'text-davinci-003',
        temperature: 0,
        max_tokens: 1000,
        prompt,
      });
      clearInterval(timer);
      const text = completion.data.choices[0].text?.trim() ?? 'Nie wiem co powiedzieć';
      const response = ChatAI.removeRepeatedText(text);
      message.channel.send(response);
    }
  }
}
