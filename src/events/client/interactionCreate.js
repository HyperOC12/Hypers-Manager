const { CommandInteraction, Client, InteractionType } = require('discord.js');
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
                interaction.reply({ 
                    content: 'An error occured whilst trying to run this command.', 
                    ephemeral: true 
                });
                console.log(error);
            };
        };
    },
};
