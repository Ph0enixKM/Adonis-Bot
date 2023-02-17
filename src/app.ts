import { Client, ActivityType, Message } from 'discord.js';
import MessageProcessing from './messages';
import { clientConfig } from './config';

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
        console.log('Connected');
    }

    private onMessage(message: Message) {
        new MessageProcessing(message);
    }
}
