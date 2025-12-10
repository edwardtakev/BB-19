const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('howmuch')
    .setDescription('Калкулира колко някой те обича')
    .addUserOption(option => option.setName('target').setDescription('Кого искаш да провериш').setRequired(true)),
    async execute(interaction) {
        let target = interaction.options.getUser('target');
        let random = Math.floor(Math.random() * 101);

        const embed = new EmbedBuilder()
        .setTitle('❤️︱Колко те обича?')
        .setColor('#ff0000')
        .setDescription(`${target} те обича: ` + random + `%`)
        .setTimestamp()
        interaction.reply({embeds: [embed] })
    }
}