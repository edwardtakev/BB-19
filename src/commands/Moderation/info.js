const { EmbedBuilder, ChannelType, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Информация за сървъра."),

    async execute(interaction) {
        const { guild } = interaction;
        const {members, channels, emojis, stickers} = guild;
        const botCount = members.cache.filter(member => member.user.bot).size;
        const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;
        const totalChannels = getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildNews, ChannelType.GuildVoice, ChannelType.GuildStageVoice, ChannelType.GuildForum, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread, ChannelType.GuildCategory]);

        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setColor(members.me.roles.highest.hexColor)
                .setTitle(`${guild.name}`)
                .setThumbnail(guild.iconURL({ size: 1024 }))
                .setImage(guild.bannerURL({ size: 1024 }))
                .addFields(
                    {
                        name: "Общ",
                        value: [
                            `📜 **Създаден** <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
                            `📩 **Покана** https://discord.gg/Y8HNNqX5Kp`,
                        ].join("\n")
                    },
                    {
                        name: `Канали (${totalChannels})`,
                        value: [
                            `💬 **Текстoви** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews])}`,
                            `🔊 **Гласови** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                            `🧵 **Нишки** ${getChannelTypeSize([ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread])}`,
                            `📑 **Категории** ${getChannelTypeSize([ChannelType.GuildCategory])}`
                        ].join("\n"),
                        inline: true
                    },
                    {
                        name: `Еможита (${emojis.cache.size + stickers.cache.size})`,
                        value: [
                            `📺 **Гиф** ${emojis.cache.filter(emoji => emoji.animated).size}`,
                            `🗿 **Еможита** ${emojis.cache.filter(emoji => !emoji.animated).size}`,
                            `🏷 **Стикери** ${stickers.cache.size}`
                        ].join("\n"),
                        inline: true
                    },
                    { 
                        name: "Нитро",
                        value: [
                            `📈 **Нитро** ${guild.premiumTier || "None"}`,
                            `💎 **Бустери** ${guild.members.cache.filter(member => member.premiumSince).size}`
                        ].join("\n"),
                        inline: true
                    },
                    {
                        name: `Потребители (${guild.memberCount})`,
                        value: [
                            `👨‍👩‍👧‍👦 **Членове** ${guild.memberCount - botCount}`,
                            `🤖 **Ботове** ${botCount}`
                        ].join("\n"),
                        inline: true
                    },
                )
        ] });
    }
}