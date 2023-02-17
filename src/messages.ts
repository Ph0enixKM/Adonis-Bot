import { Message } from "discord.js"
import { chooseRandom } from "./utils"

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
            'Jutro zdobędziesz wszystko co chcesz 🤩'
        ]
        if (this.message.content.match(/dobranoc/i)) {
            this.message.reply(chooseRandom(replies))
        }
    }
}