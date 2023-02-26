import {
  CategoryChannel, Client, Guild, GuildMember,
} from 'discord.js';
import { getGuild, getMatchedChannel } from './utils';
import { ServerStatsEnum } from './enums';

export default class ServerStats {
  private selfId: string;
  private client: Client;
  private guild: Guild;
  private onlineStatuses = ['online', 'idle', 'dnd'];
  private staffRoles = ['CULT MODERATOR', 'CULT ADMIN'];

  constructor(selfId: string, client: Client) {
    this.selfId = selfId;
    this.client = client;
    this.guild = getGuild(this.client, 'Self Improvement Poland');
  }

  public run() {
    this.getOnlineMembers();
    this.getStaffMembers();
    this.getAllMembers();
    this.getMembersInDeepWork();
    this.getAdonises();
    this.getDisciple();
    this.getAcolyte();
    this.getInitiate();
  }
  private getOnlineMembers(): void {
    const channel = getMatchedChannel(this.client, 'Online:');
    const members = this.guild.members.cache.filter((member: GuildMember) => (
      this.isMemberOnline(member) && this.isNotABot(member)
    ));
    this.setChannelName(channel, ServerStatsEnum.ONLINE, members.size);
  }

  private getStaffMembers(): void {
    const channel = getMatchedChannel(this.client, 'Online staff:');
    const members = this.guild.members.cache.filter((member: GuildMember) => this.hasMemberRole(member, this.staffRoles));
    const staff = members.filter((member: GuildMember) => (
      this.isMemberOnline(member) && this.isNotABot(member)
    ));
    this.setChannelName(channel, ServerStatsEnum.STAFF, staff.size);
  }

  private getAllMembers(): void {
    const channel = getMatchedChannel(this.client, 'Total members:');
    this.setChannelName(channel, ServerStatsEnum.TOTAL_MEMBERS, this.guild.memberCount);
  }

  private getMembersInDeepWork(): void {
    const channel = getMatchedChannel(this.client, 'Deep work:');
    const membersInDeepWork = this.guild.members.cache.filter(
      (member: GuildMember) => this.isMemberOnline(member)
          && this.isNotABot(member)
          && this.hasMemberRole(member, ['Deep Work']),
    ).size;

    this.setChannelName(channel, ServerStatsEnum.DEEP_WORK, membersInDeepWork);
  }

  private getAdonises(): void {
    this.getMembersByRank('Adonis:', 'ADONIS', ServerStatsEnum.ADONIS);
  }

  private getDisciple(): void {
    this.getMembersByRank('Disciple:', 'CULT DISCIPLE', ServerStatsEnum.DISCIPLE);
  }

  private getAcolyte(): void {
    this.getMembersByRank('Acolyte:', 'CULT ACOLYTE', ServerStatsEnum.ACOLYTE);
  }

  private getInitiate(): void {
    this.getMembersByRank('Initiate:', 'CULT INITIATE', ServerStatsEnum.INITIATE);
  }

  private getMembersByRank(channelName: string, roleName: string, channelNameWithCounts: ServerStatsEnum) {
    const channel = getMatchedChannel(this.client, channelName);
    const count = this.guild.members.cache.filter((member: GuildMember) => this.isNotABot(member)
        && this.hasMemberRole(member, [roleName])).size;
    this.setChannelName(channel, channelNameWithCounts, count);
  }

  private isMemberOnline(member: GuildMember) {
    return member?.presence && (this.onlineStatuses.includes(member.presence.status));
  }

  private isNotABot(member: GuildMember) {
    return !member.user.bot;
  }

  private hasMemberRole(member: GuildMember, roleName: string[]) {
    return member.roles.cache.some((role) => roleName.includes(role.name));
  }

  private setChannelName(channel: CategoryChannel, channelName: ServerStatsEnum, count: number) : void {
    channel.setName(`${channelName} ${count}`);
  }
}
