const { ChatInputCommandInteraction, SlashCommandBuilder, Client, PermissionFlagsBits } = require('discord.js');
const { Success_Emoji } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('emit')
    .setDescription('Emit an event (pre-set).')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { member } = interaction;

        client.emit('guildMemberAdd', member);
        interaction.reply({
            content: `${Success_Emoji} Event has been emitted.`,
            ephemeral: true
        });
    },
};
