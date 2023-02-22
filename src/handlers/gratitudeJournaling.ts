import { ActionRowBuilder, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default class GratitudeJournaling {
    static run(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'gratitude') {
            const modal = new ModalBuilder()
                .setCustomId('gratitudeJournaling')
                .setTitle('Gratitude Journal');

            const name = new TextInputBuilder()
                .setCustomId('nameInput')
                .setLabel('Twóje imię / Twój nick?')
                .setStyle(TextInputStyle.Short);

            const journal = new TextInputBuilder()
                .setCustomId('journal')
                .setLabel('Za co jesteś wdzięczny?')
                .setStyle(TextInputStyle.Paragraph);

            const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(name);
            const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(journal);
            modal.addComponents(firstActionRow, secondActionRow);

            interaction.showModal(modal);
        }
    }
}
