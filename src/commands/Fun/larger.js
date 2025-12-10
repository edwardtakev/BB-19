const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { InteractionResponseFlags } = require('discord-api-types/v10');
const { default: axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('larger')
    .setDescription('С тая команда правиш еможито по-голямо')
    .addStringOption(option => option.setName('emoji').setDescription('Еможито което искаш да направиш по-голямо').setRequired(true)),
    async execute(interaction, client) {
        let emoji = interaction.options.getString('emoji')?.trim();

        if (emoji.startsWith("<") && emoji.endsWith(">")) {

            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
            .then(image => {
                if(image) return "gif"
                else return "png"
            }).catch(err => {
                return "png"
            })
            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }
        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: "Не можеш да уголемяваш дискорд еможита!", flags: InteractionResponseFlags.Ephemeral})
        }
        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: "Не можеш да уголемяваш дискорд еможита!", flags: InteractionResponseFlags.Ephemeral})
        }

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`**Еможито беше уголемено**`)
        .setImage(emoji)
        .setTimestamp()
        .setFooter({ text: 'BB-9 enlarger', iconURL: 'https://cdn.discordapp.com/app-icons/1043280089711919134/fbfe6d9977272bed5a9e19e6197eae39.png' })

        await interaction.reply({ embeds: [embed] });
    }
}