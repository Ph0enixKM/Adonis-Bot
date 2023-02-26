import { Client, Guild, GuildChannel, GuildMember } from 'discord.js';
import { getGuild, getMatchedChannel } from './utils';
import { ServerStatsEnum } from './enums';
import { SERVER_NAME } from './config';

export default class ServerStats {
  private client: Client;
  private guild: Guild;
  private onlineStatuses = ['online', 'idle', 'dnd'];
  private staffRoles = ['CULT MODERATOR', 'CULT ADMIN'];

  constructor(client: Client) {
    this.client = client;
    this.guild = getGuild(this.client, SERVER_NAME);
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
      this.isMemberOnline(member) && ServerStats.isNotABot(member)
    ));
    ServerStats.setChannelName(channel, ServerStatsEnum.ONLINE, members.size);
  }

  private getStaffMembers(): void {
    const channel = getMatchedChannel(this.client, 'Online staff:');
    const members = this.guild.members.cache.filter((member: GuildMember) => ServerStats.hasMemberRole(member, this.staffRoles));
    const staff = members.filter((member: GuildMember) => (
      this.isMemberOnline(member) && ServerStats.isNotABot(member)
    ));
    ServerStats.setChannelName(channel, ServerStatsEnum.STAFF, staff.size);
  }

  private getAllMembers(): void {
    const channel = getMatchedChannel(this.client, 'Total members:');
    ServerStats.setChannelName(channel, ServerStatsEnum.TOTAL_MEMBERS, this.guild.memberCount);
  }

  private getMembersInDeepWork(): void {
    const channel = getMatchedChannel(this.client, 'Deep work:');
    const membersInDeepWork = this.guild.members.cache.filter(
      (member: GuildMember) => this.isMemberOnline(member)
          && ServerStats.isNotABot(member)
          && ServerStats.hasMemberRole(member, ['Deep Work']),
    ).size;
    ServerStats.setChannelName(channel, ServerStatsEnum.DEEP_WORK, membersInDeepWork);
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

  private getMembersByRank(
      channelName: string,
      roleName: string,
      channelNameWithCounts: ServerStatsEnum,
  ) {
    const channel = getMatchedChannel(this.client, channelName);
    const roleMembers = this.guild.members.cache.filter((member: GuildMember) => (
      ServerStats.isNotABot(member) && ServerStats.hasMemberRole(member, [roleName])
    ));
    ServerStats.setChannelName(channel, channelNameWithCounts, roleMembers.size);
  }

  private isMemberOnline(member: GuildMember) {
    return member?.presence && (this.onlineStatuses.includes(member.presence.status));
  }

  static isNotABot(member: GuildMember) {
    return !member.user.bot;
  }

  static hasMemberRole(member: GuildMember, roleName: string[]) {
    return member.roles.cache.some((role) => roleName.includes(role.name));
  }

  // Cloning channel with new name to bypass discord api channel name change rate
  static setChannelName(channel: GuildChannel, channelName: ServerStatsEnum, count: number): void {
    channel.clone({
      name: `${channelName} ${count}`,
    });
    channel.delete();
  }
}
