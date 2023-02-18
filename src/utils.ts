import {Client, GuildMember} from 'discord.js';

export const getChannel = (client: Client, channelName: string): any => {
    return client.channels.cache.find((channel: any) => channel.name === channelName);
};

export const getGuild = (client: Client, guildName: string): any => {
    return client.guilds.cache.find((guild) => guild.name === guildName);
};

export const getRole = (client: Client, roleName: string): any => {
    return getGuild(client, 'Self Improvement Poland').roles.cache.find((role: any) => role.name === roleName);
};

export const deleteRoles = (client: Client,member: GuildMember, roles: string[]): void =>{
    member.roles.remove(
        roles.map((role) => getRole(client, role)?.id)
    );
};
export const addRoles = (client: Client, member: GuildMember, roles: string[]): void =>{
    member.roles.add(
        roles.map((role) => getRole(client, role)?.id)
    );
};

export const getMember = (client: Client, memberName: string): any => {
    return getGuild(client, 'Self Improvement Poland').members.cache.find((member: any) => member.user.username === memberName);
};

export const chooseRandom = (array: any[]): any => {
    return array[Math.floor(Math.random() * array.length)];
};