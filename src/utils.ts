import { Client, GuildMember } from 'discord.js';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const getChannel = (client: Client, channelName: string): any => (
  client.channels.cache.find((channel: any) => channel.name === channelName)
);

export const getGuild = (client: Client, guildName: string): any => (
  client.guilds.cache.find((guild) => guild.name === guildName)
);

export const getMatchedChannel = (client: Client, channelName: string): any => {
  const regex = `${channelName}`;
  return client.channels.cache.find((channel: any) => new RegExp(regex, 'gm').test(channel.name));
};

export const getRole = (client: Client, roleName: string): any => (
  getGuild(client, 'Self Improvement Poland').roles.cache.find((role: any) => role.name === roleName)
);

export const deleteRoles = (client: Client, member: GuildMember, roles: string[]): void => {
  member.roles.remove(
    roles.map((role) => getRole(client, role)?.id),
  );
};

export const addRoles = (client: Client, member: GuildMember, roles: string[]): void => {
  member.roles.add(
    roles.map((role) => getRole(client, role)?.id),
  );
};

export const getMember = (client: Client, memberName: string): any => (
  getGuild(client, 'Self Improvement Poland').members.cache.find((member: any) => member.user.username === memberName)
);

export const chooseRandom = (array: any[]): any => array[Math.floor(Math.random() * array.length)];

/* eslint-enable @typescript-eslint/no-explicit-any */
