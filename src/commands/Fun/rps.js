const { SlashCommandBuilder } = require("discord.js");
const { RockPaperScissors } = require('discord-gamecord')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('камък, ножица, хартия')
    .addUserOption(option => option.setName('target').setDescription('с кого искаш да играеш').setRequired(true)),
    async execute(interaction) {
        const Game = new RockPaperScissors({
            message: interaction,
            opponent: interaction.options.getUser('target'),
            embed: {
              title: 'камък, ножица, хартия',
              color: '#5865F2',
              description: 'Избери между 3-те бутона отдоло.'
            },
            buttons: {
              rock: 'камък',
              paper: 'хартия',
              scissors: 'ножица'
            },
            emojis: {
              rock: '🌑',
              paper: '📰',
              scissors: '✂️'
            },
            mentionUser: true,
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            pickMessage: 'Ти избра {emoji}.',
            winMessage: '**{player}** Победи! Браво!',
            tieMessage: 'Равенство!',
            timeoutMessage: 'Някой не избра нищо! Никой не печели!',
            playerOnlyMessage: 'Само {player} и {opponent} могат да избират тези бутони.'
          });
          
          Game.startGame();
          Game.on('gameOver', result => {
            return
          });
    }
}