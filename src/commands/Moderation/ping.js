const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Показва пинга на ботя '),
    async execute(interaction, client) {
        await interaction.reply({ content: `**🏓 Време за реакция : **${Math.round(client.ws.ping)}ms` });
    }
}