const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('predict')
    .setDescription(`Предсказва с ДА или НЕ!`)
    .addStringOption(option => option.setName('question').setDescription(`Задай си въпроса, ще отговори с ДА или НЕ!`).setRequired(true)),
    async execute (interaction) {
 
        const { options } = interaction;
 
        const question = options.getString('question');
        const choice = ["Сигурно е.", "Определено да.", "Без съмнение.", "Да, определено.", "Може да разчиташ на това.", "Както виждам, да.", "Много вероятно.", "Изгледите са добри.", "Да.", "Признаците сочат към да.", "Отговорът е неясен, опитай пак.", "Попитай отново по-късно.", "По-добре не ти казвам сега.", "Не мога да предскажа сега.", "Концентрирай се и попитай отново.", "Не разчитай на това.", "Отговорът ми е не.", "Източниците ми казват не.", "Изгледите не са много добри.", "Много съмнително."]
        const ball = Math.floor(Math.random() * choice.length);
 
        const embed = new EmbedBuilder()
        .setColor("Purple")
        .setTitle(`🔮︱Предсказaнието на ${interaction.user.username}`)
        .addFields({ name: "Въпрос", value: `${question}`, inline: true})
 
        const embed2 = new EmbedBuilder()
        .setColor("Purple")
        .setTitle(`🔮︱Предсказaнието на ${interaction.user.username}`)
        .addFields({ name: "Въпрос", value: `${question}`, inline: true})
        .addFields({ name: "Отговор", value: `🔮| ${choice[ball]}`, inline: true})
 
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('button')
            .setLabel(`🔮︱Предскажи!`)
            .setStyle(ButtonStyle.Primary)
        )
 
        const msg = await interaction.reply({ embeds: [embed], components: [button] });
 
        const collector = msg.createMessageComponentCollector()
 
        collector.on('collect', async i => {
            if (i.customId == 'button') {
                i.update({ embeds: [embed2], components: [] })
            }
        })
 
    }
}