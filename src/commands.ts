import { Interaction, ApplicationCommandOptionType, Client } from 'discord.js';
import Bedtime from './bedtime';

const COMMANDS = [
  {
    name: 'bedtime',
    description: 'Help yourself to go sleep before given time',
    options: [
      {
        name: 'set',
        type: ApplicationCommandOptionType.String,
        description: 'Set the time you want to go to sleep',
        required: false,
      },
      {
        name: 'config',
        type: ApplicationCommandOptionType.String,
        description: 'What do you want to do with your bedtime?',
        required: false,
        choices: [
          {
            name: 'Reset',
            value: 'reset',
          },
          {
            name: 'Skip',
            value: 'skip',
          },
          {
            name: 'Unskip',
            value: 'unskip',
          },
        ],
      },
    ],
    execute: async (interaction: Interaction, client: Client) => {
      if (!interaction.isCommand()) return;
      Bedtime.run(interaction, client);
    },
  },
];

export default COMMANDS;
