const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, codeBlock } = require('discord.js');
const { Default_Embed_Colour } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows a list of commands.'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild } = interaction;

        const HelpEmbed = new EmbedBuilder()
        .setColor(Default_Embed_Colour)
        .setTitle('Help')
        .setDescription(`${client.user.username} is a private moderation and utility bot for ${guild.name}, currently managed and maintaned by the lovely development team!`)
        .setThumbnail(client.user.avatarURL())
        .setFields(
            {
                name: '• Info',
                value: codeBlock('help, membercount, serverinfo, userinfo')
            },
            {
                name: '• Moderation',
                value: codeBlock('ban, purge, kick, lock, unlock, mod, mute, unmute, nick, slowmode, unban, warn, rmpunish')
            },
            {
                name: '• Misc',
                value: codeBlock('avatar, chatgpt, poll, reminder, say')
            },
            {
                name: '• Games',
                value: codeBlock('tictactoe, 8ball')
            },
            {
                name: '• Util',
                value: codeBlock('customrole, ping, status, blacklist')
            },
            {
                name: '• Developer',
                value: codeBlock('reload, debug')
            }
        )

        interaction.reply({ embeds: [HelpEmbed] });
    },
};
