const { ButtonInteraction, EmbedBuilder, ChannelType, userMention, channelLink } = require('discord.js');
const { TicketChannelID } = require('../../config.json');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {
        if (!interaction.isButton() || !interaction.customId === 'create-ticket') return;
        
        const { guild, user } = interaction;

        const TicketChannel = guild.channels.cache.get(TicketChannelID);
        const TicketLogsChannel = guild.channels.cache.get('929388341936406538');

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
    },
};
