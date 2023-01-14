const { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    EmbedBuilder, 
    PermissionFlagsBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');
const { TicketChannelID } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('runfunction')
    .setDescription('Run a function.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(option => option
            .setName('name')
            .setDescription('Function name.')
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const FunctionName = options.getString('name');

        const TicketPanelChannel = guild.channels.cache.get(TicketChannelID);

        const Functions = ['send_ticket_panel'];
        if (!Functions.includes(FunctionName)) return interaction.reply({ content: `No function found with name \`${FunctionName}\``, ephemeral: true });

        switch (FunctionName) {
            case 'send_ticket_panel':
                const TicketPanelEmbed = new EmbedBuilder()
                .setColor('Yellow')
                .setAuthor({ name: `${guild.name} Tickets`, iconURL: `${guild.iconURL()}` })
                .setDescription('Open a ticket to get in contact with our staff members.\n\n> Note: **Opening useless/troll tickets will result in it being ignored and you being punished.**')

                const Buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('create-ticket').setLabel('Create Ticket').setStyle(ButtonStyle.Primary),
                )

                TicketPanelChannel.send({ embeds: [TicketPanelEmbed], components: [Buttons] });

                interaction.reply({ content: 'Function ran.', ephemeral: true });
                break;
        }
    },
};