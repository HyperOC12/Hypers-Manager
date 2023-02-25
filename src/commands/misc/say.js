const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, channelMention } = require('discord.js');
const { Success_Emoji } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option
            .setName('message')
            .setDescription('What do you want the bot to say?')
            .setRequired(true)
            .setMaxLength(2000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, channel, options } = interaction;

        const Message = options.getString('message');
        const LogChannel = guild.channels.cache.get('946156222292299807');

        channel.send({ content: `${Message}`, allowedMentions: { parse: ['users'] } }).then(() => {
            interaction.reply({
                content: `${Success_Emoji} Message sent to ${channelMention(channel.id)}`
            });
        });

        LogChannel.send({ embeds: [LogEmbed] });
    },
};