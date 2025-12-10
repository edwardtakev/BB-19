const { SlashCommandBuilder } = require('discord.js');
const { InteractionResponseFlags } = require('discord-api-types/v10');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('simjoin')
    .setDescription('Simulate a member join to test the welcome message')
    .addUserOption(opt => opt.setName('user').setDescription('User to simulate').setRequired(false)),

  async execute(interaction, client) {
    await interaction.deferReply({ flags: InteractionResponseFlags.Ephemeral }).catch(() => {});
    try {
      const guild = interaction.guild;
      if (!guild) return interaction.editReply('This command must be used in a guild.');

      const user = interaction.options.getUser('user') || interaction.user;
      const member = await guild.members.fetch(user.id).catch(() => null);
      if (!member) return interaction.editReply('Could not fetch that member.');

      // Emit the same event the bot listens for so the welcome handler runs
      client.emit('guildMemberAdd', member);

      return interaction.editReply({ content: `Simulated join for **${user.tag}**` });
    } catch (err) {
      console.error('simjoin command error:', err);
      try { return interaction.editReply('Simulation failed.'); } catch (e) { return; }
    }
  }
};
