const { Events, userMention, roleMention } = require('discord.js');

module.exports = (client) => {
    client.on(Events.GuildMemberAdd, (member) => {
        if (member.user.bot) return;
        
        const WelcomeChannel = member.guild.channels.cache.get('929378716902117471');

        WelcomeChannel.send({ 
            content: `Welcome to **${member.guild.name}** ${userMention(member.user.id)}, make sure to say hi to our ${roleMention('959451229501677649')} have a good stay!`
        });
    });
};