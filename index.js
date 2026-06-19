const { Client, EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [] });

const CHANNEL_ID = '1516764241288237136';
const SERVER = 'void.centricxmc.in';

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const channel = await client.channels.fetch(CHANNEL_ID);
    let message = null;

    async function updateStatus() {
        try {
            const res = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER}`);
            const data = await res.json();

            const online = data.online ? "🟢 Online" : "🔴 Offline";
            const players = data.players ? `${data.players.online}/${data.players.max}` : "0/0";
            const version = data.version?.name_clean || "Unknown";

            const embed = new EmbedBuilder()
                .setColor(data.online ? "#57F287" : "#ED4245")
                .setTitle("🌌 CentricXMC Network")
                .setDescription(
`**🟢 Status:** ${online}

👥 **Players:** ${players}
📦 **Version:** ${version}

━━━━━━━━━━━━━━━━━━━━

🖥️ **Java IP**
\`${SERVER}\`

📱 **Bedrock IP**
\`${SERVER}\`

🔌 **Bedrock Port**
\`25591\`

━━━━━━━━━━━━━━━━━━━━

⚔️ Crossplay Enabled
🛡️ Anti-Cheat Active`
                )
                .setTimestamp();

            if (!message) {
                message = await channel.send({ embeds: [embed] });
            } else {
                await message.edit({ embeds: [embed] });
            }

        } catch (err) {
            console.error(err);
        }
    }

    await updateStatus();
    setInterval(updateStatus, 30000);
});

client.login(process.env.TOKEN);
