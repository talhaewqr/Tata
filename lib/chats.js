const { DATABASE } = require('./database');
const { DataTypes } = require('sequelize');

const ChatDB = DATABASE.define('Chat', {
    jid: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    antilink: {
        type: DataTypes.STRING,
        defaultValue: 'off' // By default band rahega, aap command se 'on' karenge
    }
});

module.exports = { ChatDB };
