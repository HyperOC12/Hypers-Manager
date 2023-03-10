function addBadges(badgeNames) {
    const badgeMap = {
        'ActiveDeveloper': '<:activedeveloper:1083850030143774820>',
        'BugHunterLevel1': '<:discordbughunter1:1083850037769023529>',
        'BugHunterLevel2': '<:discordbughunter2:1083850039929085952>',
        'PremiumEarlySupporter': '<:discordearlysupporter:1083850043108372520>',
        'Partner': '<:discordpartner:1083850049194307756>',
        'Staff': '<:discordstaff:1083850051790585867>',
        'HypeSquadOnlineHouse1': '<:hypesquadbravery:1083849969326370866>', // bravery
        'HypeSquadOnlineHouse2': '<:hypesquadbrilliance:1083849971167678484>', // brilliance
        'HypeSquadOnlineHouse3': '<:hypesquadbalance:1083849966436491324>', // balance
        'Hypesquad': '<:hypesquadevents:1083849973180940359>',
        'CertifiedModerator': '<:discordmod:1083850044588957867>',
        'VerifiedDeveloper': '<:discordbotdev:1083850034552000512>',
    };
  
    return badgeNames.map(badgeName => badgeMap[badgeName] || '❔');
}

module.exports = {
    addBadges
};
