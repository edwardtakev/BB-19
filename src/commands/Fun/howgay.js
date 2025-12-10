const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('howgay')
    .setDescription('Колко гей е избран от теб човек')
    .addUserOption(option => option.setName('target').setDescription('Кого искаш да провериш').setRequired(true)),
    async execute(interaction) {
        let target = interaction.options.getUser('target');
        let random = Math.floor(Math.random() * 101);

        const embed = new EmbedBuilder()
        .setTitle('🌈︱Колко е гей?')
        .setColor('#ff33ff')
        .setDescription(`${target} е ` + random + `% гей`)
        .setTimestamp()
        interaction.reply({embeds: [embed] })
    }
}