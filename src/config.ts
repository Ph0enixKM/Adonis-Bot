import { GatewayIntentBits } from 'discord.js';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import * as dotenv from 'dotenv';

dotenv.config();

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Europe/Warsaw');

export const clientConfig = () => ({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
  ],
});

export const BOT_NAME = 'Adonis Bot';
export const SERVER_NAME = process.env.SERVER_NAME || 'Adonis Bot';
