const { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    EmbedBuilder, 
    PermissionFlagsBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType,
    ChannelType,
    userMention,
    channelLink
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
        const { guild, user, options } = interaction;

        const FunctionName = options.getString('name');

        const TicketPanelChannel = guild.channels.cache.get(TicketChannelID);

        const Functions = ['setup_tickets'];
        if (!Functions.includes(FunctionName)) return interaction.reply({ content: `No function found with name \`${FunctionName}\``, ephemeral: true });

        switch (FunctionName) {
            case 'setup_tickets':
                const TicketChannel = guild.channels.cache.get(TicketChannelID);
                const TicketLogsChannel = guild.channels.cache.get('929388341936406538');
            
                const TicketPanelEmbed = new EmbedBuilder()
                .setColor('Yellow')
                .setAuthor({ name: `${guild.name} Tickets`, iconURL: `${guild.iconURL()}` })
                .setDescription('Open a ticket to get in contact with our staff members.\n\n> Note: **Opening useless/troll tickets will result in it being ignored and you being punished.**')

                const Buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('create-ticket').setLabel('Create Ticket').setStyle(ButtonStyle.Primary),
                )

                TicketPanelChannel.send({ embeds: [TicketPanelEmbed], components: [Buttons] });

                const collector = TicketPanelChannel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

                collector.on('collect', async (i) => {
                    if (i.customId === 'create-ticket') {
                        await TicketChannel.threads.create({ name: `ticket-${user.username}`, type: ChannelType.PrivateThread }).then(async (ticketThread) => {
                            await ticketThread.join();
                            await ticketThread.members.add(user.id);
                            await ticketThread.setInvitable(false);
        
                            const TicketEmbed = new EmbedBuilder()
                            .setColor('DarkGrey')
                            .setAuthor({ name: `${guild.name} Tickets`, iconURL: `${guild.iconURL()}` })
                            .setDescription('Whilst you wait for a staff member to respond please explain your issue in as much detail as possible.')
        
                            ticketThread.send({ embeds: [TicketEmbed] });
        
                            const LogEmbed = new EmbedBuilder()
                            .setColor('Green')
                            .setTitle('Ticket Opened')  
                            .setFields(
                                {
                                    name: '• Member',
                                    value: `${userMention(user.id) } | \`${user.id}\``
                                },
                                {
                                    name: '• Link',
                                    value: `${channelLink(ticketThread.id)}`
                                }
                            )
                            .setTimestamp()
                    
                            TicketLogsChannel.send({ embeds: [LogEmbed] });
                        });
                        interaction.reply({ content: 'Ticket opened.', ephemeral: true });
                    } else return;
                })
                break;
        }
    },
};