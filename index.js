const { Client, ActivityType } = require('discord.js');

const client = new Client({ intents: [] });

const statuses = [
  '🌐 play.centricxmc.in:25565',
  '⚠️ Bedrock Under Maintenance',
  '🎮 CentricXMC Network'
];

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  let i = 0;

  setInterval(() => {
    client.user.setActivity(statuses[i], {
      type: ActivityType.Watching
    });

    i = (i + 1) % statuses.length;
  }, 10000);
});

client.login(process.env.TOKEN);
