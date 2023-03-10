const { CommandInteraction, Client, EmbedBuilder, InteractionType, codeBlock } = require('discord.js');
const blacklistDB = require('../../database/schemas/BlacklistSchema.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.type == InteractionType.ApplicationCommand) {
            const { guildId, user } = interaction;

            const blacklisted = await blacklistDB.findOne({ GuildID: guildId, UserID: user.id });

            if (blacklisted) return interaction.reply({ 
                content: `You have been blacklisted from using any commands.\n> ${blacklisted.Reason}`, 
                ephemeral: true 
            });

            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                const ErrorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Error')
                .setDescription(`${codeBlock(error)}`)

                return interaction.reply({
                    embeds: [ErrorEmbed],
                    ephemeral: true
                });
            };
        };
    },
};
