const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Success_Emoji, Error_Emoji } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const ms = require('ms');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutes a user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to mute.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('duration')
            .setDescription('The mute duration (1d, 10m, 6h).')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The mute reason.')
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
        const MuteDuration = options.getString('duration');
        const MuteReason = options.getString('reason') || 'No reason provided.';

        const MuteDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get('946156432057860103');
        const CaseId = createCaseId();
        const MuteExpiry = ms(ms(MuteDuration), { long: true });
        
        if (!TargetMember.moderatable) {
            return interaction.reply({
                content: `${Error_Emoji} Unable to perform action.`
            });
        };
        
        if (!TargetMember.isCommunicationDisabled() == false) {
            return interaction.reply({
                content: `${Error_Emoji} Unable to perform action.`
            });
        };
        
        await TargetUser.send({ 
            content: `You have been muted in **${guild.name}** for the reason: ${MuteReason}\nExpiry: **${MuteExpiry}**\nIf you wish to appeal follow this link: <https://dyno.gg/form/b72ba489>`
        }).catch(console.error);

        await TargetMember.timeout(ms(MuteDuration)).then(async () => {
            interaction.reply({ 
                content: `${Success_Emoji} Muted **${TargetUser.tag}** for **${MuteExpiry}** (Case #${CaseId})`
             });

             const mute = await database.create({
                Type: 'Mute',
                CaseID: CaseId,
                GuildID: guildId,
                UserID: TargetUser.id,
                UserTag: TargetUser.tag,
                Content: [
                    {
                        Moderator: user.tag,
                        MuteDate: MuteDate,
                        Reason: MuteReason,
                        Duration: MuteDuration
                    }
                ],
             });

             mute.save();
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Yellow')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Mute\n**Expires**: ${MuteExpiry}\n**Reason**: ${MuteReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};
