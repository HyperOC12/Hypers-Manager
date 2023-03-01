const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Success_Emoji, Error_Emoji } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to kick.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The kick reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user, createdTimestamp } = interaction;

        const TargetUser = options.getUser('target') || user;
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const KickReason = options.getString('reason') || 'No reason provided.';

        const KickDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get('946156432057860103');
        const CaseId = createCaseId();

        if (!TargetMember.kickable) return interaction.reply({ 
            content: `${Error_Emoji} Unable to kick this user.`
        });
        
       	await TargetUser.send({ 
            content: `You have been kicked from **${guild.name}** for the reason: ${KickReason}`
        }).catch(console.error);

        await TargetMember.kick(KickReason).then(async () => {
            interaction.reply({ 
                content: `${Success_Emoji} Kicked **${TargetUser.tag}** (Case #${CaseId})`
             });

             const kick = await database.create({
                Type: 'Kick',
                CaseID: CaseId,
                GuildID: guildId,
                UserID: TargetUser.id,
                UserTag: TargetUser.tag,
                Content: [
                    {
                        Moderator: user.tag,
                        PunishmentDate: KickDate,
                        Reason: KickReason
                    }
                ],
             });

             kick.save();
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Kick\n**Reason**: ${KickReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};
