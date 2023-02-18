import {ChannelType, Client, VoiceState} from "discord.js";
import {addRoles, deleteRoles} from "./utils";

export default class DeepWork {
    private selfId: string;
    private client: Client;

    constructor(selfId: string, client: Client) {
        this.selfId = selfId;
        this.client = client;
    }

    public run(oldState: VoiceState, newState: VoiceState) {
        if(newState.channel !== oldState.channel){
            if(newState.member && !newState.channel){ // if disconnect from vc
                deleteRoles(this.client, newState.member, ['Deep Work']);
                return;
            }
            else if(newState.member && newState.channel?.name !== 'Deep Work'){ // if change to another vc from deep work
                this.silentUser(newState, false);
                deleteRoles(this.client, newState.member, ['Deep Work']);
                return;
            }
            else if(newState.member && newState.channel?.name === 'Deep Work'){ // if joins deep work
                this.silentUser(newState, true);
                addRoles(this.client, newState.member, ['Deep Work']);
                return;
            }
        }
        return;
    }

    private silentUser(state: VoiceState, silent: boolean): void{
        state.setDeaf(silent);
        state.setMute(silent);
    }
}