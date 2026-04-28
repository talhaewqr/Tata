// === commands/mute.js ===

module.exports = {
    mute: {
        pattern: "mute",
        alias: ["closegc", "close"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { reply, from, isGroup, isAdmins, sender }) => {
            try {
                if (!isGroup) return reply("❌ ɢʀᴏᴜᴘ ᴏɴʟʏ!");

                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotOwner = (sender === botOwner);

                if (!isBotOwner && !isAdmins) {
                    return reply("❌ *Access Denied!* Only admins can mute the group.");
                }

                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const groupMetadata = await conn.groupMetadata(from);
                const botIsAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
                
                if (!botIsAdmin) return reply("❌ ɪ ɴᴇᴇᴅ ᴀᴅᴍɪɴ ᴘᴏᴡᴇʀ ᴛᴏ ᴄʟᴏsᴇ ᴛʜɪs ɢʀᴏᴜᴘ!");

                await conn.groupSettingUpdate(from, 'announcement');
                
                let muteMsg = `*╭━━━〔 🤐 ɢʀᴏᴜᴘ ᴍᴜᴛᴇᴅ 〕━━━┈⊷*\n`;
                muteMsg += `┃\n`;
                muteMsg += `┃ 🤐 *Status:* Closed / Muted\n`;
                muteMsg += `┃ 👮 *By:* @${sender.split('@')[0]}\n`;
                muteMsg += `┃ 🚫 *Members:* Cannot send messages.\n`;
                muteMsg += `┃\n`;
                muteMsg += `*╰━━━━━━━━━━━━━━━┈⊷*`;

                await conn.sendMessage(from, { text: muteMsg, mentions: [sender] });

            } catch (error) {
                reply("❌ Error closing group.");
            }
        }
    }
};
