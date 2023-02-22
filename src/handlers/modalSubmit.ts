import { Interaction } from 'discord.js';

export default class ModalSubmit {
    static async run(interaction: Interaction) {
        if (!interaction.isModalSubmit()) return;

        const nameResponse = interaction?.fields.getTextInputValue('nameInput');
        const journalResponse = interaction?.fields.getTextInputValue('journal');

        console.log({ nameResponse, journalResponse });

        if (interaction.customId === 'gratitudeJournaling') {
            await interaction.reply({ content: 'Your submission was received successfully!' });

            // Actions after (submit data do database or file)
            // todo: decide what to do with those journals.
        }
    }
}
