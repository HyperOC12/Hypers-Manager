const { 
    VoiceState, 
    Client, 
    EmbedBuilder, 
    ActionRowBuilder, 
    UserSelectMenuBuilder, 
    ChannelType, 
    ComponentType, 
    userMention 
} = require('discord.js');

module.exports = {
    name: 'voiceStateUpdate',
    /**
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     * @param {Client} client 
     */
    async execute(oldState, newState, client) {
        const { member, guild } = newState;

        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        const joinToCreateChannel = '1076802271846875146';

        if (oldChannel !== newChannel && newChannel && newChannel.id === joinToCreateChannel) {
            const voiceChannel = await guild.channels.create({
                name: member.user.tag,
                type: ChannelType.GuildVoice,
                parent: newChannel.parent,
                permissionOverwrites: [
                    { id: member.id, allow: ['Connect', 'MuteMembers'] },
                    { id: guild.id, deny: ['Connect'] }
                ]
            });

            const addUserMenu = new ActionRowBuilder().addComponents(
                new UserSelectMenuBuilder().setCustomId('jtc-user-add').setPlaceholder('Add User').setMaxValues(1).setMinValues(1)
            )

            const WelcomeEmbed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`> Welcome to your very own voice channel ${userMention(member.id)}!`)

            voiceChannel.send({ content: `${userMention(member.id)}`, embeds: [WelcomeEmbed], components: [addUserMenu] }).then(() => {
                const collector = voiceChannel.createMessageComponentCollector({ componentType: ComponentType.UserSelect });

                collector.on('collect', (i) => {
                    if (!i.customId === 'jtc-user-add') return;

                    let chosenMember;
                    i.values.forEach(value => { chosenMember = value });

                    voiceChannel.permissionOverwrites.edit(chosenMember, { Connect: true });
                    i.reply({ content: `Added user: ${chosenMember}` });
                });
            });

            client.joinToCreate.set(member.id, voiceChannel.id);
            await newChannel.permissionOverwrites.edit(member, { Connect: false });
            setTimeout(() => newChannel.permissionOverwrites.delete(member), 30 * 1000);

            return setTimeout(() => member.voice.setChannel(voiceChannel), 500);
        };

        const ownedChannel = client.joinToCreate.get(member.id);

        if (ownedChannel && oldChannel.id == ownedChannel && (!newChannel || newChannel.id !== ownedChannel)) {
            client.joinToCreate.set(member.id, null);
            oldChannel.delete().catch(() => {});
        };
    },
};
