import { GatewayIntentBits } from 'discord.js';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import * as dotenv from 'dotenv';
import CargoDB from 'cargodb';

dotenv.config();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

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
export const IS_PROD = !!process.env.SERVER_NAME;
export const BOT_NAME = 'Adonis Bot';
export const GENERAL_CHANNEL = IS_PROD ? '💬gigachat' : 'botchat';
export const SERVER_NAME = process.env.SERVER_NAME || 'Adonis Bot';
export const DB_PATH = process.env.DB_PATH || '~';
export const cargo = new CargoDB('db', DB_PATH);

cargo.create('users');
export type User = {
  ID: string;
  discordId: string;
  bedtime: string;
  bedtimeSkip: string;
};
