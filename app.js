const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
require('dotenv').config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.TOKEN

const getEmojiByName = (message, name) => {
  const emoji = message.guild.emojis.cache.find((emoji) => name === emoji.name);
  return emoji ? `<:${name}:${emoji.id}>` : null;
};

client.on("ready", () => {
  client.user.setPresence({
    activities: [{ name: `meditation`, type: ActivityType.Competing }],
  });
  client.user.setStatus("online");
  console.log("connected");
});

client.on("messageCreate", (message) => {
  const chad = getEmojiByName(message, "chad");
  if (message.content == "adonis") {
    if (chad) message.react(chad);
  }
});

client.login(token);
