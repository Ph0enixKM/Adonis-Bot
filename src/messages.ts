import { Message } from "discord.js"

export default class MessageProcessing {
    private message: Message

    constructor(message: Message) {
        this.message = message
        this.reactAdonis()
    }

    public getEmojiByName(name: string) {
        const emoji = this.message.guild!.emojis.cache.find((emoji) => name === emoji.name)
        return emoji ? `<:${name}:${emoji.id}>` : null
    }

    public reactAdonis() {
        const words = ['adonis', 'adonisie', 'adonisy', 'chadzie', 'chad', 'chady']
        const chad = this.getEmojiByName('chad')
        if (words.find((word) => this.message.content.match(word))) {
            if (chad) this.message.react(chad);
        }
    }
}