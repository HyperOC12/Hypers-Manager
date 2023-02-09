const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Success_Emoji, Error_Emoji } = require('../../config.json');
const database = require('../../database/schemas/BlacklistSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Blacklist a user from using the bot.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to blacklist.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The blacklist reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const BlacklistReason = options.getString('reason') || 'No reason provided.';

        const CannotBlacklistEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Error_Emoji} | Cannot blacklist this user.`)
        if (!TargetMember.manageable) return interaction.reply({ embeds: [CannotBlacklistEmbed] });

        const blacklist = await database.create({
            GuildID: guildId,
            UserID: TargetUser.id,
            UserTag: TargetUser.tag,
            Reason: BlacklistReason
        });
        blacklist.save();

        const BlacklistedEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Success_Emoji} | <@${TargetUser.id}> has been blacklisted | \`${BlacklistReason}\``)
        interaction.reply({ embeds: [BlacklistedEmbed] });
    },
};
