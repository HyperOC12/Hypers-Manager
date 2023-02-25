const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, channelMention } = require('discord.js');
const { Success_Emoji, Error_Emoji } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Sets a channel\'s slowmode.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option => option
            .setName('duration')
            .setDescription('Slowmode duration.')
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { channel, options } = interaction;
        
        const SlowmodeDuration = options.getString('duration');
                
        let SplitDuration = SlowmodeDuration.split(' ');
        let Total = 0;
        let error = false;

        SplitDuration.forEach(e => {
            const magnitude = parseInt(e.slice(0, -1));
            const unit = e.charAt(e.length - 1);

            switch(unit) {
                case 'h':
                    Total += (magnitude * 60 * 60);
                    break;
                case 'm':
                    Total += (magnitude * 60);
                    break;
                case 's':
                    Total += magnitude;
                    break;
                default:
                    error = true;
            }
        });

        if(!error) {
            channel.setRateLimitPerUser(Total);
            await interaction.reply(`${Success_Emoji} Slowmode set to **${SlowmodeDuration}**`);
        } else {
            await interaction.reply(`${Error_Emoji} Unable to set slowmode.`);
        }
    },
};
