import { Client, Guild } from 'discord.js';

export const getGuild = (client : Client, guildName : string) : any => (
    client.guilds.cache.find((guild : Guild) => guild.name === guildName)
);
