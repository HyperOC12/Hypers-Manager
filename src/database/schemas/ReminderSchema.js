const { Schema, model } = require('mongoose');

module.exports = model(
    'ReminderDB',
    new Schema({
        GuildID: String,
        User: String,
        Time: String,
        Message: String
    })
)
