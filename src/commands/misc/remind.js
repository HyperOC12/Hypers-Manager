const { ChatInputCommandInteraction, SlashCommandBuilder, time, codeBlock } = require('discord.js');
const { Success_Emoji } = require('../../config.json');
const database = require('../../database/schemas/ReminderSchema.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Set a reminder.')
    .addStringOption(option => option
            .setName('message')
            .setDescription('Reminder message.')
            .setRequired(true)
            .setMaxLength(2000)
            .setMinLength(1)
    )
    .addStringOption(option => option
            .setName('time')
            .setDescription('Time until you are reminded.')
            .setRequired(true)
),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guildId, channel, options, user, createdAt } = interaction;

        const ReminderMessage = options.getString('message');
        const ReminderTime = options.getString('time');

        const Reminder = await database.create({
            GuildID: guildId,
            User: user.tag,
            Time: ReminderTime,
            Message: ReminderMessage
        });
        Reminder.save();

        interaction.reply({
            content: `${Success_Emoji} Your reminder has been set: ${ReminderMessage}`
        });

        setTimeout(async () => {
            channel.send({
                content: `Reminder for <@${user.id}>:\n${codeBlock(ReminderMessage)}\nSet on **${createdAt}**`
            });

            await Reminder.remove()
        }, ms(ReminderTime));
    },
};
