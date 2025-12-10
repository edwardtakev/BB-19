const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('coin')
    .setDescription('Ези или Тура?'),
    async execute(interaction) {

        // Създаване на началния embed
        const embed = new EmbedBuilder()
            .setColor("#ffc900")
            .setTitle(`🪙︱Монетата на ${interaction.user.username}`)
            .setDescription("Избери: Ези или Тура?")
            .setTimestamp();

        // Създаване на бутоните за избор
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('heads')  // Custom ID за ези
                    .setLabel('Ези')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('tails')  // Custom ID за тура
                    .setLabel('Тура')
                    .setStyle(ButtonStyle.Primary)
            );

        // Изпращаме съобщение с бутоните
        const msg = await interaction.reply({ embeds: [embed], components: [buttons] });

        // Събирач на съобщенията за бутони
        const collector = msg.createMessageComponentCollector();

        collector.on('collect', async i => {
            // Проверяваме кой бутон е натиснат
            const choice = i.customId === 'heads' ? 'Ези' : 'Тура';
            const result = Math.random() < 0.5 ? 'Ези' : 'Тура';  // Случаен избор за монетата

            // Създаваме embed с резултата
            const resultEmbed = new EmbedBuilder()
                .setColor("#ffc900")
                .setTitle(`🪙︱Резултат за ${interaction.user.username}`)
                .setDescription(`Избора ти беше: **${choice}**\nМонетата падна на: **${result}**`)
                .setTimestamp();

            // Актуализираме съобщението с резултата и премахваме бутоните
            await i.update({ embeds: [resultEmbed], components: [] });
        });
    }
};
