const { ChatInputCommandInteraction, SlashCommandBuilder, Client, inlineCode } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Change the bot\'s status.')
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

        interaction.reply({ content: `Status changed to ${inlineCode(StatusText)}`, ephemeral: true })
    },
};