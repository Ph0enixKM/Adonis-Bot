import { SlashCommandBuilder } from 'discord.js';

const gratitude = {
    data: new SlashCommandBuilder()
        .setName('gratitude')
        .setDescription('Tell us what are u grateful for!'),
};
export default gratitude;
