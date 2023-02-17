import dayjs from "dayjs"
import { Message } from "discord.js"
import { chooseRandom } from "./utils"

export default class MessageProcessing {
    private message: Message

    constructor(message: Message) {
        this.message = message
        this.reactAdonis()
        this.goodMorning()
        this.goodNight()
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
            if (dayjs().format('HH:mm') >= '20:00' && dayjs().format('HH:mm') <= '24:00') {
                this.message.reply(chooseRandom(replies))
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
            'Rano jest najlepszą porą dnia na realizację marzeń 🌞'
        ]
        if (this.message.content.match(/dzień dobry/i)) {
            if (dayjs().format('HH:mm') >= '04:00' && dayjs().format('HH:mm') <= '09:00') {
                this.message.reply(chooseRandom(replies))
            }
        }
    }
}