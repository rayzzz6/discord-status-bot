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
            const response = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER}`);
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setColor(data.online ? '#57F287' : '#ED4245')
                .setTitle('🌌 CentricXMC Network')
                .setDescription(
`🟢 **Status:** ${data.online ? 'Online' : 'Offline'}

👥 **Players:** ${data.players?.online ?? 0}/${data.players?.max ?? 0}
📦 **Version:** ${data.version?.name_clean ?? 'Unknown'}

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
            console.error("Status update failed:", err);
        }
    }

    await updateStatus();
    setInterval(updateStatus, 30000);
});

client.login(process.env.TOKEN);
