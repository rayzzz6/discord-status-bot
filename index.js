const { Client, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [] });

const CHANNEL_ID = '1516764241288237136';
const INFO_CHANNEL_ID = '1499371508206669917';
const RULES_CHANNEL_ID = '1516485070377058435';
const SERVER = 'centricxmc.ice.lol';

let messageData = {
  statusMessageId: '',
  infoMessageId: ''
};

if (fs.existsSync('./messages.json')) {
  messageData = JSON.parse(fs.readFileSync('./messages.json', 'utf8'));
}

function saveMessages() {
  fs.writeFileSync('./messages.json', JSON.stringify(messageData, null, 2));
}

client.once('clientReady', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const statusChannel = await client.channels.fetch(CHANNEL_ID);
  const infoChannel = await client.channels.fetch(INFO_CHANNEL_ID);
  const rulesChannel = await client.channels.fetch(RULES_CHANNEL_ID);

  const infoEmbed = new EmbedBuilder()
    .setColor('#8A2BE2')
    .setTitle('🌌 CentricXMC Network')
    .setDescription(`
🖥️ **Java Edition**
➤ \`${SERVER}\`

📱 **Bedrock Edition**
➤ \`${SERVER}\`
➤ Port: \`25604\`

━━━━━━━━━━━━━━━━━━━━

⚔️ Pure Anarchy
🌍 Crossplay Support
🛡️ Anti-Cheat Protection
🎉 Events & Giveaways

━━━━━━━━━━━━━━━━━━━━

🚀 Join now and start your adventure!
`)
    .setTimestamp();

  let infoMessage;

  try {
    if (messageData.infoMessageId) {
      infoMessage = await infoChannel.messages.fetch(messageData.infoMessageId);
      await infoMessage.edit({ embeds: [infoEmbed] });
    } else {
      infoMessage = await infoChannel.send({ embeds: [infoEmbed] });
      messageData.infoMessageId = infoMessage.id;
      saveMessages();
    }
  } catch {
    infoMessage = await infoChannel.send({ embeds: [infoEmbed] });
    messageData.infoMessageId = infoMessage.id;
    saveMessages();
  }

  // ---- RULES EMBED ----
  const rulesEmbed = new EmbedBuilder()
    .setColor('#8A2BE2')
    .setTitle('CENTRICXMC RULES')
    .setDescription(`
CentricXMC is an anarchy server, which means griefing, raiding, PvP, stealing, trapping, and base hunting are allowed.

However, the use of hacked clients, cheats, exploits, or any unfair advantage is strictly prohibited. Excessive harassment, threats, hate speech, and disrespect toward players or staff are not allowed. The use of offensive language, slurs, adult jokes, sexual content, or inappropriate discussions is prohibited. Advertising other servers, communities, or services without permission is not allowed. Any attempt to crash, lag, damage, or disrupt the server will result in punishment.

Staff decisions are final. By playing on CentricXMC, you agree to follow these rules and help maintain a fair and respectful community for everyone.
`)
    .setTimestamp();

  try {
    const messages = await rulesChannel.messages.fetch({ limit: 10 });

    const botMessage = messages.find(
      m => m.author.id === client.user.id &&
      m.embeds.length > 0 &&
      m.embeds[0].title === 'CENTRICXMC RULES'
    );

    if (botMessage) {
      await botMessage.edit({ embeds: [rulesEmbed] });
    } else {
      await rulesChannel.send({ embeds: [rulesEmbed] });
    }
  } catch (err) {
    console.error('Rules embed error:', err);
  }
  // ---- END RULES EMBED ----

  async function updateStatus() {
    console.log("Updating status...");

    try {
      const res = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER}`);
      const data = await res.json();

      console.log("Status received:", data.online);

      const online = data.online ? '🟢 Online' : '🔴 Offline';
      const players = data.players
        ? `${data.players.online}/${data.players.max}`
        : '0/0';
      const version = data.version?.name_clean || 'Unknown';

      const embed = new EmbedBuilder()
        .setColor(data.online ? '#57F287' : '#ED4245')
        .setTitle('🌌 CentricXMC Network')
        .setDescription(`
🟢 **Status:** ${online}

👥 **Players:** ${players}
📦 **Version:** ${version}

━━━━━━━━━━━━━━━━━━━━

🖥️ **Java IP**
\`${SERVER}\`

📱 **Bedrock IP**
\`${SERVER}\`

🔌 **Bedrock Port**
\`25604\`

━━━━━━━━━━━━━━━━━━━━

⚔️ Crossplay Enabled
🛡️ Anti-Cheat Active
`)
        .setTimestamp();

      let statusMessage;

      try {
        if (messageData.statusMessageId) {
          statusMessage = await statusChannel.messages.fetch(messageData.statusMessageId);
          await statusMessage.edit({ embeds: [embed] });
        } else {
          statusMessage = await statusChannel.send({ embeds: [embed] });
          messageData.statusMessageId = statusMessage.id;
          saveMessages();
        }
      } catch {
        statusMessage = await statusChannel.send({ embeds: [embed] });
        messageData.statusMessageId = statusMessage.id;
        saveMessages();
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  }

  updateStatus();
  setInterval(updateStatus, 60000);
});

console.log('TOKEN EXISTS:', !!process.env.TOKEN);
console.log('TOKEN LENGTH:', process.env.TOKEN ? process.env.TOKEN.length : 0);
client.login(process.env.TOKEN);
