// === commands/linkgc.js ===

module.exports = {
    linkgc: {
        pattern: "linkgc",
        alias: ["grouplink", "glink"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { reply, from, isGroup, isAdmins, sender }) => {
            try {
                if (!isGroup) return reply("❌ ɢʀᴏᴜᴘ ᴏɴʟʏ!");

                // Security: Only Owner or Admins
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotOwner = (sender === botOwner);
                if (!isBotOwner && !isAdmins) {
                    return reply("❌ *Access Denied!* Only admins can get the group link.");
                }

                // Bot Admin Check
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const groupMetadata = await conn.groupMetadata(from);
                const botIsAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
                if (!botIsAdmin) return reply("❌ ɪ ɴᴇᴇᴅ ᴀᴅᴍɪɴ ᴘᴏᴡᴇʀ ᴛᴏ ɢᴇᴛ ᴛʜᴇ ʟɪɴᴋ!");

                // Fetch Link
                const code = await conn.groupInviteCode(from);
                const response = `https://chat.whatsapp.com/${code}`;

                let linkMsg = `*╭━━━〔 🔗 ɢʀᴏᴜᴘ ʟɪɴᴋ 〕━━━┈⊷*\n`;
                linkMsg += `┃\n`;
                linkMsg += `┃ 📌 *Name:* ${groupMetadata.subject}\n`;
                linkMsg += `┃ 🔗 *Link:* \n`;
                linkMsg += `┃ ${response}\n`;
                linkMsg += `┃\n`;
                linkMsg += `*╰━━━━━━━━━━━━━━━┈⊷*`;

                await reply(linkMsg);

            } catch (error) {
                console.error("LinkGC Error:", error);
                reply("❌ Failed to fetch group link.");
            }
        }
    }
};
