const { Client, EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [] });

const CHANNEL_ID = '1516764241288237136';

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const channel = await client.channels.fetch(CHANNEL_ID);

    const embed = new EmbedBuilder()
        .setTitle('🌐 CentricXMC Server Status')
        .setDescription(
            '**Java IP:** `play.centricxmc.in:25565`\n' +
            '**Bedrock:** ⚠️ Under Maintenance\n' +
            '**Status:** 🟢 Online'
        )
        .setTimestamp();

    await channel.send({ embeds: [embed] });
});

client.login(process.env.TOKEN);
