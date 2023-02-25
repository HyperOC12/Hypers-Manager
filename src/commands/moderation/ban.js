const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Success_Emoji, Error_Emoji } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to ban.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The ban reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options, user } = interaction;

        const TargetUser = options.getUser('target') || user;
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const BanReason = options.getString('reason') || 'No reason provided.';

        const LogChannel = guild.channels.cache.get('946156432057860103');
        const CaseId = createCaseId();

        if (!TargetMember.bannable) return interaction.reply({ 
            content: `${Error_Emoji} Unable to perform action.`
        });

       	await TargetUser.send({ 
            content: `You have been banned from **${guild.name}** for the reason ${BanReason}\nIf you wish to appeal follow this link: <https://dyno.gg/form/b72ba489>`
        }).catch(console.error);
        
        await TargetMember.ban({ deleteMessageSeconds: 86400, reason: BanReason }).then(() => {
            interaction.reply({ 
                content: `${Success_Emoji} Banned **${TargetUser.tag}** (Case #${CaseId})`
             });
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Ban\n**Reason**: ${BanReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};
