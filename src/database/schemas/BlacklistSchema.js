const { Schema, model } = require('mongoose');

module.exports = model(
    'BlacklistDB',
    new Schema({
        GuildID: String,
        UserID: String,
        UserTag: String,
        Reason: String,
    })
)
