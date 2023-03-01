const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Success_Emoji, Error_Emoji } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');

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
        const { guild, guildId, options, user, createdTimestamp } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const UnmuteReason = options.getString('reason') || 'No reason provided.';

        const UnmuteDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get('946156432057860103');
        const CaseId = createCaseId();
        
        if (!TargetMember.moderatable) {
            return interaction.reply({
                content: `${Error_Emoji} Unable to perform action.`
            });
        };
        
        if (!TargetMember.isCommunicationDisabled() == true) {
            return interaction.reply({
                content: `${Error_Emoji} Unable to perform action.`
            });
        };

        await TargetMember.timeout(null).then(async () => {
            interaction.reply({ 
                content: `${Success_Emoji} Unmuted **${TargetUser.tag}** (Case #${CaseId})`
             });

             const unmute = await database.create({
                Type: 'Unmute',
                CaseID: CaseId,
                GuildID: guildId,
                UserID: TargetUser.id,
                UserTag: TargetUser.tag,
                Content: [
                    {
                        Moderator: user.tag,
                        UnmuteDate: UnmuteDate,
                        Reason: UnmuteReason
                    }
                ],
             });

             unmute.save();
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
