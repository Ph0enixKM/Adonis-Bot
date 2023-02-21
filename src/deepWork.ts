import { Client, VoiceState } from 'discord.js';
import { addRoles, deleteRoles } from './utils';

export default class DeepWork {
  private client : Client;

  constructor(client : Client) {
    this.client = client;
  }

  public run(oldState : VoiceState, newState : VoiceState) {
    if (newState.channel === oldState.channel) return;
    if (!newState.member) return;
    switch (true) {
      // if disconnect from vc
      case newState.member && !newState.channel:
        deleteRoles(this.client, newState.member, ['Deep Work']);
        break;
      // if change to another vc from deep work
      case newState.member && newState.channel?.name !== 'Deep Work':
        DeepWork.silentUser(newState, false);
        deleteRoles(this.client, newState.member, ['Deep Work']);
        break;
      // if joins deep work vc
      case newState.member && newState.channel?.name === 'Deep Work':
        DeepWork.silentUser(newState, true);
        addRoles(this.client, newState.member, ['Deep Work']);
        break;
      default:
        break;
    }
  }

  private static silentUser(state : VoiceState, silent : boolean) : void {
    state.setDeaf(silent);
    state.setMute(silent);
  }
}
