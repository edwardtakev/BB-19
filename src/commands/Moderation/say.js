const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { InteractionResponseFlags } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Ботя говори вместо теб')
    .addStringOption(option => option.setName('message').setDescription('Съобщението').setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "Права требат, без права кво ще направиш?", flags: InteractionResponseFlags.Ephemeral })
        const message = interaction.options.getString('message');
        await interaction.reply({ content: 'Message sent!', flags: InteractionResponseFlags.Ephemeral });
        await interaction.channel.send(message);
    },
};