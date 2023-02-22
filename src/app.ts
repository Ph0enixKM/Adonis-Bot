import { ActivityType, Client, Collection, Interaction, Message, VoiceState } from 'discord.js';
import cron from 'node-cron';
import dayjs from 'dayjs';
import MessageProcessing from './handlers/messages';
import { BOT_NAME, clientConfig } from './config';
import ChatAI from './handlers/chat';
import DeepWork from './handlers/deepWork';
import ServerStats from './handlers/serverStats';
import { getChannel } from './utils/channels';
import getMember from './utils/members';
import GratitudeJournaling from './handlers/gratitudeJournaling';
import gratitude from './commands/commands';
import ModalSubmit from './handlers/modalSubmit';

export default class AdonisBot {
  private selfId = '';
  private token: string;

  private client: Client;
  private message: MessageProcessing = {} as MessageProcessing;
  private chat: ChatAI = {} as ChatAI;
  private deepWork: DeepWork = {} as DeepWork;
  private serverStats: ServerStats = {} as ServerStats;

  constructor() {
    this.token = process.env.TOKEN!;
    this.client = new Client(clientConfig());
    this.client.on('ready', this.onReady.bind(this));
    this.client.on('messageCreate', this.onMessage.bind(this));
    this.client.on('voiceStateUpdate', this.onVoiceStateUpdate.bind(this));
    this.client.on(
        'interactionCreate',
        (interaction: Interaction) => AdonisBot.onInteractionCreate(interaction),
    );
    this.client.on(
        'interactionCreate',
        (interaction: Interaction) => AdonisBot.onModalSubmit(interaction),
    );
    this.client.login(this.token);
  }

  private onReady() {
    this.client.user!.setPresence({
      activities: [
        {
          name: 'meditation',
          type: ActivityType.Competing,
        },
      ],
    });
    this.client.user!.setStatus('online');
    cron.schedule('* * * * *', this.onEveryMinute.bind(this));
    cron.schedule('*/10 * * * *', this.onEvery10Mins.bind(this));
    this.selfId = getMember(this.client, BOT_NAME).id;

    this.message = new MessageProcessing(this.selfId);
    this.chat = new ChatAI(this.selfId);
    this.deepWork = new DeepWork(this.client);
    this.serverStats = new ServerStats(this.client);

    const commands = new Collection();
    commands.set(gratitude.data.name, gratitude);
    this.client?.application?.commands.set([
        { name: gratitude.data.name, description: gratitude.data.description },
    ]);
    // eslint-disable-next-line no-console
    console.log('Connected');
  }

  private onEveryMinute() {
    if (dayjs().tz().format('HH:mm') === '21:37') {
      const channel = getChannel(this.client, '💬gigachat');
      channel.send('Pamiętajcie bracia o 9h snu!');
    }
  }

  private onEvery10Mins() {
    this.serverStats.run();
  }

  private onMessage(message: Message) {
    this.message.run(message);
    this.chat.run(message);
  }

  private onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    this.deepWork.run(oldState, newState);
  }
  private static async onInteractionCreate(interaction: Interaction) {
    GratitudeJournaling.run(interaction);
  }

  private static async onModalSubmit(interaction: Interaction) {
    await ModalSubmit.run(interaction);
  }
}
