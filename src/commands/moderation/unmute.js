const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { DirectMessage_Embed_Colour, Success_Emoji, Error_Emoji } = require('../../config.json');
const randomstring = require('randomstring');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmutes a user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to unmute.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The unmute reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options, user } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const UnmuteReason = options.getString('reason') || 'No reason provided.';

        const LogChannel = guild.channels.cache.get('946156432057860103');
        const CaseId = randomstring.generate({ length: 18, charset: 'numeric' });

        const CannotUnmuteEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Error_Emoji} | Unable to unmute this user.`)
        if (!TargetMember.moderatable) return interaction.reply({ embeds: [CannotUnmuteEmbed] });

        const NotMutedEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Error_Emoji} | This user is not muted.`)
        if (TargetMember.isCommunicationDisabled() === false) return interaction.reply({ embeds: [NotMutedEmbed] });

        await TargetMember.timeout(null).then(() => {
            const UnmuteSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Success_Emoji} | <@${TargetUser.id}> has been unmuted | \`${CaseId}\``)
            interaction.reply({ embeds: [UnmuteSuccessEmbed] });
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Unmute\n**Reason**: ${UnmuteReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};
