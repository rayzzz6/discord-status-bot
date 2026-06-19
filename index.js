const { Client, EmbedBuilder } = require('discord.js');
const util = require('minecraft-server-util');

const client = new Client({ intents: [] });

const CHANNEL_ID = '1516764241288237136';
const HOST = 'void.centricxmc.in';
const PORT = 25565;

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const channel = await client.channels.fetch(CHANNEL_ID);
    let message;

    async function updateStatus() {
        try {
            const status = await util.status(HOST, PORT);

            const embed = new EmbedBuilder()
                .setColor('#57F287')
                .setTitle('🌌 CentricXMC Network')
                .setDescription(
`🟢 **Status:** Online

👥 **Players:** ${status.players.online}/${status.players.max}
📦 **Version:** ${status.version.name}

🖥️ **Java IP**
\`${HOST}\`

📱 **Bedrock IP**
\`${HOST}\`

🔌 **Bedrock Port**
\`25591\``
                )
                .setTimestamp();

            if (!message) {
                message = await channel.send({ embeds: [embed] });
            } else {
                await message.edit({ embeds: [embed] });
            }
        } catch {
            const embed = new EmbedBuilder()
                .setColor('#ED4245')
                .setTitle('🌌 CentricXMC Network')
                .setDescription(
`🔴 **Server Offline**

🖥️ Java IP: \`${HOST}\`
📱 Bedrock IP: \`${HOST}\`
🔌 Port: \`25591\``
                )
                .setTimestamp();

            if (!message) {
                message = await channel.send({ embeds: [embed] });
            } else {
                await message.edit({ embeds: [embed] });
            }
        }
    }

    await updateStatus();
    setInterval(updateStatus, 30000);
});

client.login(process.env.TOKEN);
