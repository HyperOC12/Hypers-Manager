const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Success_Emoji, Error_Emoji } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
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
        const CaseId = createCaseId();

        if (!TargetMember.moderatable || TargetMember.isCommunicationDisabled === false) {
            interaction.reply({
                content: `${Error_Emoji} Unable to perform action.`
            });
        };

        await TargetMember.timeout(null).then(() => {
            interaction.reply({ 
                content: `${Success_Emoji} Unmuted **${TargetUser.tag}** (Case #${CaseId})`
             });
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
