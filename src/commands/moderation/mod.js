const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Success_Emoji, Error_Emoji } = require('../../config.json');
const randomstring = require('randomstring');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('moderate')
    .setDescription('Moderate a user\'s name.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to moderate.')
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const TargetUser = options.getUser('target') || user;
        const TargetMember = await guild.members.fetch(TargetUser.id);

        if (!TargetMember.moderatable) return interaction.reply({ 
            content: `${Error_Emoji} Unable to perform action.`
        });

        const ModeratedNickname_ID = randomstring.generate({ length: 5, charset: 'alphanumeric' });
        await TargetMember.setNickname(`Moderated Nickname - ${ModeratedNickname_ID}`);

        interaction.reply({ 
            content: `${Success_Emoji} Moderated nickname to **Moderated Nickname - ${ModeratedNickname_ID}` 
        });
    },
};