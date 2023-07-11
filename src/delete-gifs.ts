import { Message } from 'discord.js';

export default class DeleteGifs {
  public async run(message: Message) {
    if (message.attachments.some((attachment: { url: string; }) => attachment.url.match(/\.gif$/))) {
      await message.reply('Nie wklejaj gifów');
      message.delete();
    }
  }
}
