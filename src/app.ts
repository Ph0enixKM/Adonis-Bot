import { ActivityType, Client, Interaction, Message, VoiceState } from 'discord.js';
import cron from 'node-cron';
import dayjs from 'dayjs';
import MessageProcessing from './messages';
import { BOT_NAME, GENERAL_CHANNEL, SERVER_NAME, clientConfig } from './config';
import { getChannel, getMember, getGuild } from './utils';
import COMMANDS from './commands';
import ChatAI from './chat';
import DeepWork from './deepWork';
import Bedtime from './bedtime';
import DeleteGifs from './delete-gifs';

export default class AdonisBot {
  private selfId = '';
  private token: string;
  private client: Client;
  private message: MessageProcessing = {} as MessageProcessing;
  private chat: ChatAI = {} as ChatAI;
  private deepWork: DeepWork = {} as DeepWork;
  private deleteGifs: DeleteGifs = {} as DeleteGifs;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.token = process.env.TOKEN!;
    this.client = new Client(clientConfig());
    this.client.once('ready', this.onReady.bind(this));
    this.client.on('messageCreate', this.onMessage.bind(this));
    this.client.on('voiceStateUpdate', this.onVoiceStateUpdate.bind(this));
    this.client.on('interactionCreate', this.onInteractionCreate.bind(this));
    this.client.login(this.token);
  }

  private async onReady() {
    if (!this.client.user) {
      // eslint-disable-next-line no-console
      console.log('Could not connect to discord');
      return;
    }
    const guild = getGuild(this.client, SERVER_NAME);
    this.client.user.setPresence({ activities: [{ name: 'meditation', type: ActivityType.Competing }] });
    this.client.user.setStatus('online');
    cron.schedule('* * * * *', this.onEveryMinute.bind(this));
    cron.schedule('*/10 * * * *', this.onEvery10Mins.bind(this));
    this.selfId = getMember(this.client, BOT_NAME).id;
    this.message = new MessageProcessing(this.selfId);
    this.chat = new ChatAI(this.selfId);
    this.deepWork = new DeepWork(this.client);
    this.deleteGifs = new DeleteGifs();
    await guild.commands.set(COMMANDS);
    // eslint-disable-next-line no-console
    console.log('Connected');
  }

  private onEveryMinute() {
    if (dayjs().tz().format('HH:mm') === '21:37') {
      const channel = getChannel(this.client, GENERAL_CHANNEL);
      channel.send('Pamiętajcie bracia o 9h snu!');
      channel.setRateLimitPerUser(30);
    } else if (dayjs().tz().format('HH:mm') === '05:30') {
      const channel = getChannel(this.client, GENERAL_CHANNEL);
      channel.send('Pora wstawać! Czeka was produktywny dzień!');
      channel.setRateLimitPerUser(0);
    }
  }

  private async onInteractionCreate(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    const command = COMMANDS.find((c) => c.name === interaction.commandName);
    if (!command) return;
    await command.execute(interaction, this.client);
  }

  private async onEvery10Mins() {
    await Bedtime.checkBedtime(this.client);
  }

  private onMessage(message: Message) {
    this.message.run(message);
    this.chat.run(message);
    this.deleteGifs.run(message);
  }

  private onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    this.deepWork.run(oldState, newState);
  }
}
