import { Client, GuildMember } from 'discord.js';
import { getGuild } from './guilds';

export const getMember = (client : Client, memberName : string) : any => (
    getGuild(client, 'Self Improvement Poland').members.cache.find((member : GuildMember) => member.user.username === memberName)
);
