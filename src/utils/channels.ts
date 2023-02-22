import { Client } from 'discord.js';

export const getMatchedChannel = (client : Client, channelName : string) : any => {
    const regex = `${channelName}`;
    return client.channels.cache.find((channel : any) => new RegExp(regex, 'gm').test(channel.name));
};

export const getChannel = (client : Client, channelName : string) : any => (
    client.channels.cache.find((channel : any) => channel.name === channelName)
);
