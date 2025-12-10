const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { InteractionResponseFlags } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("snipe")
    .setDescription('Последно изтрито съобщение'),
    async execute (interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({ content: "Права требат, без права кво ще направиш?", flags: InteractionResponseFlags.Ephemeral});

        const msg = client.snipes.get(interaction.channel.id);
        if (!msg) return await interaction.reply({ content: "Не мога да намеря изтрито съобщение!", flags: InteractionResponseFlags.Ephemeral});

        const ID = msg.author.id;
        const member = interaction.guild.members.cache.get(ID)
        const URL = member.displayAvatarURL();

        const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle(`Изтрито Съобщение! (${member.user.tag})`)
        .setDescription(`${msg.content}`)
        .setFooter({ text: `Пратено от: ${ID}`, icoURL: `${URL}`})
        .setTimestamp()

        if (msg.image) embed.setImage(msg.image)
        await interaction.reply({ embeds: [embed] })
    }
}