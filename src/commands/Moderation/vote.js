const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { InteractionResponseFlags } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Създай вот')
    .addStringOption(option => option.setName('description').setDescription('За какво искаш да се гласува').setRequired(true))
    .addIntegerOption(option => option.setName('time').setDescription('Колко време да трае вота (в секунди)').setRequired(true)),
    
    async execute(interaction) {
        const { options } = interaction;
        const description = options.getString('description');
        const voteTime = options.getInteger('time');
        
        // Prepare the embed
        const embed = new EmbedBuilder()
            .setColor('Purple')
            .setDescription(description)
            .setTitle('Стартира вота!')
            .addFields({ name: 'Време до край', value: `${voteTime} секунди`, inline: true })
            .setTimestamp();
        
        // Vote options buttons
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yes_vote')
                    .setLabel('✅ Да')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('no_vote')
                    .setLabel('❌ Не')
                    .setStyle(ButtonStyle.Danger)
            );

        // Send the embed with buttons
        const message = await interaction.reply({ embeds: [embed], components: [buttonRow] });

        // Set to keep track of who voted
        const votedUsers = new Set();

        // Start a collector for the vote buttons
        const filter = i => {
            // Make sure only users who haven't voted yet can interact
                if (votedUsers.has(i.user.id)) {
                i.reply({ content: 'Вече си гласувал!', flags: InteractionResponseFlags.Ephemeral }); // ephemeral reply
                return false;
            }
            return true;
        };

        const collector = message.createMessageComponentCollector({ filter, time: voteTime * 1000 }); // Time in ms

        // Collect votes and update vote count
        let yesVotes = 0;
        let noVotes = 0;

        collector.on('collect', async i => {
            if (i.customId === 'yes_vote') {
                yesVotes++;
            } else if (i.customId === 'no_vote') {
                noVotes++;
            }
            
            // Mark user as voted
            votedUsers.add(i.user.id);

            // Acknowledge the interaction
            await i.reply({ content: `Гласувахте: ${i.customId === 'yes_vote' ? 'Да' : 'Не'}`, flags: InteractionResponseFlags.Ephemeral }); // ephemeral reply
        });

        collector.on('end', async collected => {
            // Create the final embed with results
            const finalEmbed = new EmbedBuilder()
                .setColor('Purple')
                .setTitle('Резултати от вота!')
                .setDescription(description)
                .addFields(
                    { name: 'Да', value: `${yesVotes} гласа`, inline: true },
                    { name: 'Не', value: `${noVotes} гласа`, inline: true }
                )
                .setTimestamp();

            // Edit the message with the results
            await message.edit({ embeds: [finalEmbed], components: [] });
        });
    }
};
