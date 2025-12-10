const { SlashCommandBuilder, WebhookClient } = require("discord.js");
const { InteractionResponseFlags } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spoof')
        .setDescription('Пиши от името на твоят прияте')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('Кого искаш да имитираш?')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('text')
                .setDescription('Променя този текст на емоджита')
                .setRequired(true)
        ),
        category: 'Забавление',
        cooldown: 0,
    async execute(interaction) {
        let hook = await interaction.channel.createWebhook({
            name: 'nuts',
            avatar: 'https://i.imgur.com/AfFp7pu.png'
        })
        let user = interaction.options.getUser('target')
        const idz = hook.id;
        const tok = hook.token;
        const webhookClient = new WebhookClient({ id: `${idz}`, token: `${tok}` });

        msg = interaction.options.getString('text')
        webhookClient.send({
            content: `${msg}`,
            username: `${user.displayName}`,
            avatarURL: `${user.displayAvatarURL({ dynamic: true })}`,
        });
        if(createWebhook = true) {
            interaction.reply({ content: 'Имитацията беше успешна', flags: InteractionResponseFlags.Ephemeral})
        } else interaction.reply({content: 'Имитацията не успя', flags: InteractionResponseFlags.Ephemeral})

        const hooks1 = await interaction.guild.fetchWebhooks();
        await hooks1.forEach(async webhook => {
            if (!interaction.channel.id == webhook.channelID) {
                console.log(`**${interaction.username}**, Нищо не беше намерено. Може би ти или някой друг е променил името на уебхука. Моля, изтрий го ръчно. Извинявай за неудобството`)
                return;
            }
            if (!webhook.owner.id == '1043280089711919134') { //BOT ID ТУК
                console.log(`**${interaction.username}**, Нищо не беше намерено. Може би ти или някой друг е променил името на уебхука. Моля, изтрий го ръчно. Извинявай за неудобството`)
                return;
            } else {
                webhook.delete(`Изтрито по заявка от Discord, моля последвайте инструкциите`);
            }
        })
    }
}
