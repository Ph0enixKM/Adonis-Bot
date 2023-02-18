import { GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

export const clientConfig = () => ({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

export const BOT_NAME = 'Adonis Bot';