const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const { InteractionResponseFlags } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
    .setName ('purge')
    .setDescription('Трие съобщения')
    .addIntegerOption(option => option.setName('amount').setDescription('Колко съобщения искаш да изтриеш').setMinValue(1).setMaxValue(100).setRequired(true)),
    async execute (interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: "Права требат, без права кво ще направиш?", flags: InteractionResponseFlags.Ephemeral })
        let number = interaction.options.getInteger('amount');

        const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setDescription(`☑️ Изтрих ${number} Съобщения`)

        await interaction.channel.bulkDelete(number)

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('purge')
            .setEmoji('🗑️')
            .setStyle(ButtonStyle.Primary),
        )

        const message = await interaction.reply({ embeds: [embed], components: [button] });

        const collector = message.createMessageComponentCollector();

        collector.on("collect", async i => {
            if (i.customId === 'purge') {
                if (!i.member.permissions.has(PermissionsBitField.Flags.ManageMessage)) return;
                interaction.deleteReply();
            }
        })
    }
}