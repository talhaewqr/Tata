// === commands/resetlink.js ===

module.exports = {
    resetlink: {
        pattern: "resetlink",
        alias: ["revokelink", "resetglink"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { reply, from, isGroup, isAdmins, sender }) => {
            try {
                if (!isGroup) return reply("❌ ɢʀᴏᴜᴘ ᴏɴʟʏ!");

                // Security: Only Owner or Admins
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotOwner = (sender === botOwner);
                if (!isBotOwner && !isAdmins) {
                    return reply("❌ *Access Denied!* Only admins can reset the link.");
                }

                // Bot Admin Check
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const groupMetadata = await conn.groupMetadata(from);
                const botIsAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
                if (!botIsAdmin) return reply("❌ ɪ ɴᴇᴇᴅ ᴀᴅᴍɪɴ ᴘᴏᴡᴇʀ ᴛᴏ ʀᴇsᴇᴛ ᴛʜᴇ ʟɪɴᴋ!");

                // Resetting Link
                await conn.groupRevokeInvite(from);
                const newCode = await conn.groupInviteCode(from);
                const newLink = `https://chat.whatsapp.com/${newCode}`;

                let resetMsg = `*╭━━━〔 🔄 ʟɪɴᴋ ʀᴇsᴇᴛ 〕━━━┈⊷*\n`;
                resetMsg += `┃\n`;
                resetMsg += `┃ ✅ *Status:* Link Revoked & Reset\n`;
                resetMsg += `┃ 👮 *By:* @${sender.split('@')[0]}\n`;
                resetMsg += `┃ 🔗 *New Link:* \n`;
                resetMsg += `┃ ${newLink}\n`;
                resetMsg += `┃\n`;
                resetMsg += `*╰━━━━━━━━━━━━━━━┈⊷*`;

                await conn.sendMessage(from, { text: resetMsg, mentions: [sender] });

            } catch (error) {
                console.error("ResetLink Error:", error);
                reply("❌ Failed to reset group link.");
            }
        }
    }
};
