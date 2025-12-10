const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require(`discord.js`)
const { InteractionResponseFlags } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`whois`)
    .setDescription(`Информация за потребител`)
    .addUserOption(option => option.setName(`user`).setDescription(`Потребителя за когото искаш Информация`).setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({ content: "Права требат, без права кво ще направиш?", flags: InteractionResponseFlags.Ephemeral});

        const user = interaction.options.getUser(`user`) || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        const icon = user.displayAvatarURL();
        const tag = user.tag;

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({ name: tag, iconURL: icon})
        .setThumbnail(icon)
        .addFields({ name: "Потребител", value: `${user}`, inline: false})
        .addFields({ name: "Присъединил се е", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true})
        .addFields({ name: "Акаунт в дискорд от", value: `<t:${parseInt(user.createdAt / 1000)}:R>`, inline: true})
        .setFooter({ text: `ИД: ${user.id}`})

        await interaction.reply({ embeds: [embed] });
    }
}