import { Client, Guild, GuildChannel, GuildMember } from 'discord.js';
import ServerStatsEnum from '../enums';
import getGuild from '../utils/guilds';
import { getMatchedChannel } from '../utils/channels';

export default class ServerStats {
  private client: Client;
  private guild: Guild;
  private onlineStatuses = ['online', 'idle', 'dnd'];
  private staffRoles = ['CULT MODERATOR', 'CULT ADMIN'];

  constructor(client: Client) {
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

    const membersCount = this.guild.members.cache.filter(
        (member: GuildMember) => this.isMemberOnline(member)
      && ServerStats.isNotABot(member),
    ).size;

    ServerStats.setChannelName(channel, ServerStatsEnum.ONLINE, membersCount);
  }

  private getStaffMembers(): void {
    const channel = getMatchedChannel(this.client, 'Online staff:');

    const staff = this.guild.members.cache.filter(
        (member: GuildMember) => ServerStats.hasMemberRole(member, this.staffRoles),
    );
    const staffCount = staff.filter((member: GuildMember) => this.isMemberOnline(member)
      && ServerStats.isNotABot(member)).size;

    ServerStats.setChannelName(channel, ServerStatsEnum.STAFF, staffCount);
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
    const count = this.guild.members.cache.filter(
        (member: GuildMember) => ServerStats.isNotABot(member)
      && ServerStats.hasMemberRole(member, [roleName]),
    ).size;
    ServerStats.setChannelName(channel, channelNameWithCounts, count);
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
