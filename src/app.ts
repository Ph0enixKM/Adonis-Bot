import { ActivityType, Client, Message, VoiceState } from 'discord.js';
import cron from 'node-cron';
import dayjs from 'dayjs';
import MessageProcessing from './messages';
import { BOT_NAME, clientConfig } from './config';
import { getChannel, getMember } from './utils';
import ChatAI from './chat';
import DeepWork from './deepWork';
// import ServerStats from './serverStats';

export default class AdonisBot {
  private selfId = '';
  private token: string;
  private client: Client;
  private message: MessageProcessing = {} as MessageProcessing;
  private chat: ChatAI = {} as ChatAI;
  private deepWork: DeepWork = {} as DeepWork;
  // private serverStats: ServerStats = {} as ServerStats;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.token = process.env.TOKEN!;
    this.client = new Client(clientConfig());
    this.client.on('ready', this.onReady.bind(this));
    this.client.on('messageCreate', this.onMessage.bind(this));
    this.client.on('voiceStateUpdate', this.onVoiceStateUpdate.bind(this));
    this.client.on('interactionCreate', this.onInteractionCreate.bind(this));
    this.client.login(this.token);
  }

  private onReady() {
    if (!this.client.user) {
      // eslint-disable-next-line no-console
      console.log('Could not connect to discord');
      return;
    }
    this.client.user.setPresence({ activities: [{ name: 'meditation', type: ActivityType.Competing }] });
    this.client.user.setStatus('online');
    cron.schedule('* * * * *', this.onEveryMinute.bind(this));
    cron.schedule('*/10 * * * *', this.onEvery10Mins.bind(this));
    this.selfId = getMember(this.client, BOT_NAME).id;
    this.message = new MessageProcessing(this.selfId);
    this.chat = new ChatAI(this.selfId);
    this.deepWork = new DeepWork(this.client);
    // this.serverStats = new ServerStats(this.client);
    // eslint-disable-next-line no-console
    console.log('Connected');
  }

  private onEveryMinute() {
    if (dayjs().tz().format('HH:mm') === '21:37') {
      const channel = getChannel(this.client, '????gigachat');
      channel.send('Pami??tajcie bracia o 9h snu!');
    }
  }

  private onInteractionCreate() {
    // TODO: We will use this for slash commands
    // this.client.guilds.cache.forEach((guild) => {
    //   guild.commands.set(this.commands);
    // });
  }

  private onEvery10Mins() {
    // this.serverStats.run();
  }

  private onMessage(message: Message) {
    this.message.run(message);
    this.chat.run(message);
  }

  private onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    this.deepWork.run(oldState, newState);
  }
}
