const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, codeBlock, spoiler } = require('discord.js');
const { Default_Embed_Colour, Error_Emoji } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Recieve information about a automod rule.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(option => option
            .setName('rule')
            .setDescription('Rule ID.')
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const RuleId = options.getString('rule');
        const Rule = await guild.autoModerationRules.fetch(RuleId).catch(() => null);

        const NoRuleFound = new EmbedBuilder().setColor('Red').setDescription(`${Error_Emoji} | No rule found.`)
        if (!Rule) return interaction.reply({ embeds: [NoRuleFound] });

        const RuleEmbed = new EmbedBuilder()
        .setColor(Default_Embed_Colour)
        .setFields(
            {
                name: '• Name',
                value: codeBlock(Rule.name),
                inline: true
            },
            {
                name: '• ID',
                value: codeBlock(Rule.id),
                inline: true
            },
            {
                name: '• Enabled',
                value: codeBlock(Rule.enabled ? 'Yes' : 'No'),
                inline: true
            },
            {
                name: '• Trigger Type',
                value: codeBlock(Rule.triggerType),
                inline: true
            },
            {
                name: '• Event Type',
                value: codeBlock(Rule.eventType),
                inline: true
            },
            {
                name: '• Creator',
                value: codeBlock(Rule.creatorId),
                inline: true
            },
            {
                name: '• Keywords',
                value: spoiler(Rule.triggerMetadata.keywordFilter.join(', ') || 'No words found.')
            },
        )

        interaction.reply({ embeds: [RuleEmbed] });
    },
};