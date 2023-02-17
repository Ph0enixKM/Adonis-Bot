import { Client } from 'discord.js'

export const getChannel = (client: Client, channelName: string): any => {
    return client.channels.cache.find((channel: any) => channel.name === channelName)
}

export const getGuild = (client: Client, guildName: string): any => {
    return client.guilds.cache.find((guild) => guild.name === guildName)
}

export const getRole = (client: Client, roleName: string): any => {
    return getGuild(client, 'Self Improvement Poland').roles.cache.find((role: any) => role.name === roleName)
}

export const chooseRandom = (array: any[]): any => {
    return array[Math.floor(Math.random() * array.length)]
}