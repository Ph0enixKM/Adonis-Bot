import { Client, GuildMember, Role } from 'discord.js';
import getGuild from './guilds';

export const getRole = (client : Client, roleName : string) : any => (
    getGuild(client, 'Self Improvement Poland').roles.cache.find((role : Role) => role.name === roleName)
);

export const deleteRoles = (client : Client, member : GuildMember, roles : string[]) : void => {
    member.roles.remove(
        roles.map((role) => getRole(client, role)?.id),
    );
};

export const addRoles = (client : Client, member : GuildMember, roles : string[]) : void => {
    member.roles.add(
        roles.map((role) => getRole(client, role)?.id),
    );
};
