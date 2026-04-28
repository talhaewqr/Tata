// === commands/groupjid.js ===

module.exports = {
    groupjid: {
        pattern: "groupjid",
        alias: ["jid", "getjid", "gjid"],
        tags: ["admin", "owner"],
        execute: async (conn, message, m, { reply, from, isGroup, isAdmins, sender }) => {
            try {
                // 1. Check if it's a group
                if (!isGroup) return reply("❌ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ᴡᴏʀᴋs ɪɴ ɢʀᴏᴜᴘs.");

                // 2. Security: Only Owner or Admins
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotOwner = (sender === botOwner);

                if (!isBotOwner && !isAdmins) {
                    return reply("❌ *Access Denied!* Only admins or bot owner can see technical IDs.");
                }

                // 3. Design and Output
                let jidText = `*╭━━━〔 🆔 ɢʀᴏᴜᴘ ᴊɪᴅ 〕━━━┈⊷*\n`;
                jidText += `┃\n`;
                jidText += `┃ 📌 *Name:* ${m.pushName || 'Group'}\n`;
                jidText += `┃ 📂 *JID:* \n`;
                jidText += `┃ \`\`\`${from}\`\`\`\n`;
                jidText += `┃\n`;
                jidText += `┃ 💡 *Tip:* Use this ID for bot config.\n`;
                jidText += `*╰━━━━━━━━━━━━━━━┈⊷*`;

                await reply(jidText);

            } catch (error) {
                console.error("GroupJID Error:", error);
                await reply("❌ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪʟᴇ ғᴇᴛᴄʜɪɴɢ ᴊɪᴅ.");
            }
        }
    }
};
