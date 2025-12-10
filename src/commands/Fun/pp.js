const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pp')
    .setDescription('Колко е голям?')
    .addUserOption(option => option.setName('target').setDescription('на кого').setRequired(true)),
    async execute(interaction) {
        let user = interaction.options.getUser('target');
        let random = Math.floor(Math.random() * 10) + 1;
        let size = "";

        for (let i = 0; i < random; i++) {
            size += "=";
        }

        let pp = "8" + size + "D";
        let description = `Размера на <@${user.id}> е толкова: ${pp}`;

        const embed = new EmbedBuilder()
            .setTitle('🥵︱Колко е голям?')
            .setColor('LuminousVividPink') // Or use a valid hex color code
            .setDescription(description)
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
}
