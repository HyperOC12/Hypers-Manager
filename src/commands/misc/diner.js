const { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { Default_Embed_Colour } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('diner')
    .setDescription('JayCord Diner (very cool yes yes).'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const Modal = new ModalBuilder().setCustomId('food-modal').setTitle('JayCord Diner')

        const OrderInput = new TextInputBuilder()
        .setCustomId('order-input')
        .setLabel('Order')
        .setPlaceholder('(SEPARATE BY COMMAS)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

        const row1 = new ActionRowBuilder().addComponents(OrderInput);
        Modal.addComponents(row1);

        await interaction.showModal(Modal);
    },
};