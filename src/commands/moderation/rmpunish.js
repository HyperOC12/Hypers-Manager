const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Success_Emoji, Error_Emoji } = require('../../config.json');

const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rmpunish')
    .setDescription('Remove a punishment.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addNumberOption(option => option
            .setName('id')
            .setDescription('Punishment ID.')
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guildId, options } = interaction;

        const PunishmentID = options.getString('id');

        const data = database.findOne({ GuildID: guildId, CaseID: PunishmentID });

        const NoCaseEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Error_Emoji} | No case found with ID \`${PunishmentID}\``)
        if (!data) return interaction.reply({ embeds: [NoCaseEmbed] });
        data.remove();

        const SuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Success_Emoji} | Case with ID \`${PunishmentID}\` has been removed.`)
        interaction.reply({ embeds: [SuccessEmbed] });
    },
};