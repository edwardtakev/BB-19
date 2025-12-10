const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('emojify')
    .setDescription('Текст към еможита')
    .addStringOption(option => option.setName('text').setDescription('текста').setRequired(true)),
    async execute(interaction) {
        const specialCodes = {
            '0': ':zero:',
            '1': ':one:',
            '2': ':two:',
            '3': ':three:',
            '4': ':four:',
            '5': ':five:',
            '6': ':six:',
            '7': ':seven:',
            '8': ':eight:',
            '9': ':nine:',
            '#': ':hash:',
            '*': ':asterisk:',
            ' ': '   ',
            '<': '<:left_arrow:995970283452252240>',
            '>': '<:right_arrow:995962108258820116>',
            '`': '<:backtick:995979594240892968>',
            '~': '<:tilda:995982913474658344>',
            '@': '<:at:995983618067406858>',
            '$': '<:dollar:995984816874995752>',
            '^': '<:caret:995985702502268928>',
            '-': '<:dash:995986596740468797>',
            '_': '<:under_score:995986893546197043>',
            '=': '<:equal:995987268923818044>',
            '+': '<:plus:995987389128396820>',
            '(': '<:left_bracket:995986167046611007>',
            ')': '<:right_bracket:995986306691768362>',
            '[': '<:left_sqare_bracket:995987563527548928>',
            ']': '<:right_sqare_bracket:995987904482512936>',
            '{': '<:curly_left_bracket:995996853860573234>',
            '}': '<:curly_right_bracket:995996953336881183>',
            ';': '<:semicolon:995999480627331143>',
            ':': '<:colon:995999667726856202>',
            '\'': '<:quotation:996000686909182102>',
            '"': '<:double_quotation:996000872272236594>',
            ',': '<:comma:996005051971686511>',
            '.': '<:full_stop:996005199611183164>',
            '?': '<:question_mark:996005322281992204>',
            '!': '<:exclamation_mark:996005489764737025>',
            '/': '<:slash:996006353648750613>',
            '|': '<:vertical_bar:996007379462266880>',
            '&': '<:and:995986013174378527>',
            '%': '<:percent:995984994092716042>'
          }
        const text = interaction.options.getString('text').toLowerCase().split('').map(letter => {
            if(/[a-z]/g.test(letter)) {
                return `:regional_indicator_${letter}:`
            } else if (specialCodes[letter]) {
                return `${specialCodes[letter]}`
            }
            return letter;
        }).join('');

        interaction.reply(text)
    }
}