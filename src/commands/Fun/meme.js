const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { InteractionResponseFlags } = require('discord-api-types/v10');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Рандом мемета от Reddit!'),
    async execute(interaction) {
        try {
            const response = await fetch('https://www.reddit.com/r/memes/.json?limit=100');
            if (!response.ok) throw new Error('Не успях да заредя мемета.');

            const data = await response.json();
            const memes = data.data.children.filter(post => !post.data.over_18 && post.data.is_reddit_media_domain);
            if (memes.length === 0) throw new Error('Няма налични мемета.');

            const randomMeme = memes[Math.floor(Math.random() * memes.length)].data;

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(randomMeme.title)
                .setImage(randomMeme.url)
                .setURL(`https://reddit.com${randomMeme.permalink}`)
                .setTimestamp()
                .setFooter({ text: 'BB-9 Memer', iconURL: 'https://cdn.discordapp.com/app-icons/1043280089711919134/fbfe6d9977272bed5a9e19e6197eae39.png' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Възникна грешка при зареждането на меме. Опитайте отново по-късно.',
                flags: InteractionResponseFlags.Ephemeral
            });
        }
    }
};
