const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { Default_Embed_Colour } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Gets the current number of members.'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild } = interaction;

        interaction.reply({
            content: `Current members: **${guild.memberCount}}**`
        });
    },
};
