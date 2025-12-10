const { SlashCommandBuilder } = require("discord.js");
const figlet = require('figlet')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('Текст към символи')
        .addStringOption(option => option.setName('text').setDescription('текста').setRequired(true).setMaxLength(25)),
    async execute(interaction) {
        const text = interaction.options.getString('text')

        figlet(`${text}`, function (err, data) {
            if (err) {
                console.log('Нещо се обърка...');
                console.dir(err);
                return;
            }
            interaction.reply(`\`\`\`${data}\`\`\``)
        });
    }
}