const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { InteractionResponseFlags } = require('discord-api-types/v10');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('АСЛ ПЛС?')
    .setDMPermission(false)
    .addUserOption(option =>
        option.setName('user')
          .setDescription('На кого ще го пращаш?')
          .setRequired(true))
    .addStringOption(option =>
        option.setName('message')
          .setDescription('Кво ще му пращаш?')
          .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({ content: "Права требат, без права кво ще направиш?", flags: InteractionResponseFlags.Ephemeral});
    await interaction.deferReply();
    const member = interaction.options.getUser('user');
    const message = interaction.options.getString('message');
 
    const msgEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle('Имаш Поща')
      .setDescription(`:wave: **Пощата:** \n ${message}`)
      .setTimestamp()
      .setFooter({ text: `Изпратено от ${interaction.guild}` });
 
      const row = new ActionRowBuilder()
.addComponents(
    new ButtonBuilder()
    .setCustomId('messgefrom')
    .setLabel(`От: ${interaction.user.tag}`)
    .setDisabled(true)
    .setStyle(ButtonStyle.Primary));
let sendmsg = await member.send({ embeds: [msgEmbed], components: [row] }).catch((err) => { return console.log(`Пейо почива, не можа да прати лично на ${member.tag} | ${err}`) });
    if (sendmsg) {
      await interaction.channel.sendTyping(),
        await interaction.editReply(`Пратих Пейо да го достави на ${member.tag}`)
    } else if (!sendmsg) {
        await interaction.channel.sendTyping(),
      interaction.editReply(`Пейо почива ${member.tag}`)
    }
  },
};