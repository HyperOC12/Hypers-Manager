const { ChatInputCommandInteraction, SlashCommandBuilder, Client, PermissionFlagsBits } = require('discord.js');
const { Success_Emoji } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Change the bot\'s status.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(option => option
            .setName('text')
            .setDescription('Status text.')
            .setRequired(true)
            .setMaxLength(32)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;
        
        const StatusText = options.getString('text');
        client.user.setActivity({ name: `${StatusText}` });
        
        interaction.reply({ 
            content: `${Success_Emoji} Status changed to **${StatusText}** with type **${ChosenType}**`
        });
    },
};
