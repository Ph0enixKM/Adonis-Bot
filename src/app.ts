import { Client, ActivityType, Message } from 'discord.js';
import cron from 'node-cron';
import dayjs from 'dayjs';
import MessageProcessing from './messages';
import { clientConfig } from './config';
import { getChannel } from './utils';

export default class AdonisBot {
    private token: string;
    private client: Client;

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
        console.log('Connected');
    }

    private onEveryMinute() {
        if (dayjs().format('HH:mm') === '21:37') {
            const channel = getChannel(this.client, '💬gigachat');
            channel.send('Pamiętajcie bracia o 9h snu!');
        }
    }

    private onMessage(message: Message) {
        new MessageProcessing(message);
    }
}
