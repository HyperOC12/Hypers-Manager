const { ChatInputCommandInteraction, SlashCommandBuilder, Client, PermissionFlagsBits } = require('discord.js');
const { Success_Emoji } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reload commands/events.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcmd => subcmd
                .setName('commands')
                .setDescription('Reload commands.')
    )
    .addSubcommand(subcmd => subcmd
                .setName('events')
                .setDescription('Reload events.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const subCommand = options.getSubcommand();

        switch (subCommand) {
            case 'commands':
                interaction.reply({
                    content: 'Reloading commands.'
                }).then(() => {
                    client.handleCommands();
                    interaction.editReply({
                        content: `${Success_Emoji} Reloaded commands.`
                    });
                });
                break;
            case 'events':
                interaction.reply({
                    content: 'Reloading events.'
                }).then(() => {
                    client.handleEvents();
                    interaction.editReply({
                        content: `${Success_Emoji} Reloaded events.`
                    });
                });
                break;
        };
    },
};
