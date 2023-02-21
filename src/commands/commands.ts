import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const gratitude = {
    data: new SlashCommandBuilder()
        .setName('gratitude')
        .setDescription('Tell us what are u grateful for!'),
    async execute(interaction: CommandInteraction) {
        await interaction.reply('Pong!');
    },
};
