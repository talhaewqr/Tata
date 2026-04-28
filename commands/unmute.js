// === commands/unmute.js ===

module.exports = {
    unmute: {
        pattern: "unmute",
        alias: ["opengc", "open"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { reply, from, isGroup, isAdmins, sender }) => {
            try {
                if (!isGroup) return reply("❌ ɢʀᴏᴜᴘ ᴏɴʟʏ!");

                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotOwner = (sender === botOwner);

                if (!isBotOwner && !isAdmins) {
                    return reply("❌ *Access Denied!* Only admins can unmute the group.");
                }

                await conn.groupSettingUpdate(from, 'not_announcement');
                
                let unmuteMsg = `*╭━━━〔 🔊 ɢʀᴏᴜᴘ ᴜɴᴍᴜᴛᴇᴅ 〕━━━┈⊷*\n`;
                unmuteMsg += `┃\n`;
                unmuteMsg += `┃ 🔊 *Status:* Open / Unmuted\n`;
                unmuteMsg += `┃ 👮 *By:* @${sender.split('@')[0]}\n`;
                unmuteMsg += `┃ ✅ *Members:* Can send messages now.\n`;
                unmuteMsg += `┃\n`;
                unmuteMsg += `*╰━━━━━━━━━━━━━━━┈⊷*`;

                await conn.sendMessage(from, { text: unmuteMsg, mentions: [sender] });

            } catch (error) {
                reply("❌ Error opening group.");
            }
        }
    }
};
