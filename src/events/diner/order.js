const { ModalSubmitInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, codeBlock, userMention } = require('discord.js');
const randomstring = require('randomstring');
const { Success_Emoji } = require('../../config.json');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction, client) {
        if (!interaction.customId === 'food-modal' || !interaction.isModalSubmit()) return;

        const { guild, user, fields } = interaction;

        const order = fields.getTextInputValue('order-input').split(',')
        const orderId = randomstring.generate({ length: 8, charset: 'numeric' });

        interaction.reply({ content: `Your order of \`${order}\` is being prepared please be patient.\n> Order ID: \`${orderId}\`` });

        // Internal stuff
        const chefChannel = guild.channels.cache.get('929388341936406538');

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('finish-order').setLabel('Complete').setStyle(ButtonStyle.Success)
        )
        
        const ChefEmbed = new EmbedBuilder()
        .setColor('DarkGrey')
        .setTitle('New Order')
        .setFields(
            {
                name: '• Customer',
                value: codeBlock(user.tag),
                inline: true
            },
            {
                name: '• Order ID',
                value: codeBlock(orderId),
                inline: true
            },
            {
                name: '• Ordered',
                value: codeBlock(order),
            }
        )
        .setFooter({ text: `${user.id}` })

        const sentMessage = await chefChannel.send({ embeds: [ChefEmbed], components: [Buttons] });

        const collector = chefChannel.createMessageComponentCollector({ componentType: ComponentType.Button });

        collector.on('collect', i => {
            if (!i.customId === 'finish-order' || !i.member.permissions.has('ManageMessages')) return;
            sentMessage.delete();
            i.reply({ content: 'Order completed.' });

            interaction.editReply({ content: `${Success_Emoji} | ${userMention(user.id)} Your order has been completed and you will recieve it shortly, enjoy!` });
        });
    },
};
