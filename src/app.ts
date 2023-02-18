import { Client, ActivityType, Message } from 'discord.js';
import cron from 'node-cron';
import dayjs from 'dayjs';
import MessageProcessing from './messages';
import { BOT_NAME, clientConfig } from './config';
import { getChannel, getMember } from './utils';
import ChatAI from './chat';

export default class AdonisBot {
    private selfId: string = ''
    private token: string
    private client: Client
    private message: MessageProcessing = {} as MessageProcessing
    private chat: ChatAI = {} as ChatAI

    constructor() {
        this.token = process.env.TOKEN!;
        this.client = new Client(clientConfig())
        this.client.on('ready', this.onReady.bind(this))
        this.client.on('messageCreate', this.onMessage.bind(this))
        this.client.login(this.token)
    }

    private onReady() {
        this.client.user!.setPresence({ activities: [{ name: `meditation`, type: ActivityType.Competing }] })
        this.client.user!.setStatus('online')
        cron.schedule('* * * * *', this.onEveryMinute.bind(this))
        this.selfId = getMember(this.client, BOT_NAME).id;
        this.message = new MessageProcessing(this.selfId);
        this.chat = new ChatAI(this.selfId);
        console.log('Connected');
    }

    private onEveryMinute() {
        if (dayjs().tz().format('HH:mm') === '21:37') {
            const channel = getChannel(this.client, '💬gigachat');
            channel.send('Pamiętajcie bracia o 9h snu!');
        }
    }

    private onMessage(message: Message) {
        this.message.run(message)
        this.chat.run(message)
    }
}
