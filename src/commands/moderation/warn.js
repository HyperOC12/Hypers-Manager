const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Success_Emoji, Error_Emoji } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warns a user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to warn.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The warn reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user, createdTimestamp } = interaction;

        const TargetUser = options.getUser('target');
        const WarnReason = options.getString('reason') || 'No reason provided.';

        const WarnDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get('946156432057860103');
        const CaseId = createCaseId();

        if (TargetUser.id === user.id) return interaction.reply({ 
            content: `${Error_Emoji} Cannot warn yourself.`
        });
        
        await TargetUser.send({ 
            content: `You have been warned in **${guild.name}** for the reason: ${WarnReason}`
        }).catch(console.error);
        
        database.findOne({ Type: 'Warn', CaseID: CaseId, GuildID: guildId, UserID: TargetUser.id, UserTag: TargetUser.tag }, async (err, res) => {
            if (err) throw err;
            if (!res) {
                data = new database({
                    Type: 'Warn',
                    CaseID: CaseId,
                    GuildID: guildId,
                    UserID: TargetUser.id,
                    UserTag: TargetUser.tag,
                    Content: [
                        {
                            Moderator: user.tag,
                            WarnDate: WarnDate,
                            Reason: WarnReason   
                        }
                    ],
                });
            } else {
                const obj = {
                    Moderator: user.tag,
                    WarnDate: WarnDate,
                    Reason: WarnReason
                };
                data.Content.push(obj);
            };
            data.save();
        });

        interaction.reply({ 
            content: `${Success_Emoji} Warned **${TargetUser.tag}** (Case #${CaseId})`
         });

        const LogEmbed = new EmbedBuilder()
        .setColor('Orange')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Warn\n**Reason**: ${WarnReason}`)
        .setFooter({ text: `Case: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};
