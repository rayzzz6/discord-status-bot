const { Client, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [] });

const CHANNEL_ID = '1516764241288237136';
const INFO_CHANNEL_ID = '1499371508206669917';
const SERVER = 'void.centricxmc.in';

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

    const infoEmbed = new EmbedBuilder()
        .setColor('#8A2BE2')
        .setTitle('🌌 CentricXMC Network')
        .setDescription(`
🖥️ **Java Edition**
➤ \`${SERVER}\`

📱 **Bedrock Edition**
➤ \`${SERVER}\`
➤ Port: \`25591\`

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

    async function updateStatus() {
        try {
            const res = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER}`);
            const data = await res.json();

            const online = data.online ? '🟢 Online' : '🔴 Offline';
            const players = data.players
                ? `${data.players.online}/${data.players.max}`
                : '0/0';
            const version = data.version?.name_clean || 'Unknown';

            const embed = new EmbedBuilder()
                .setColor(data.online ? '#57F287' : '#ED4245')
                .setTitle('🌌 CentricXMC Network')
                .setDescription(`
**🟢 Status:** ${online}

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
            console.error(err);
        }
    }

    await updateStatus();
    setInterval(updateStatus, 30000);
});

client.login(process.env.TOKEN);
