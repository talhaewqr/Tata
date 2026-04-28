// === commands/delete.js ===

module.exports = {
    delete: {
        pattern: "del",
        alias: ["delete", "remove"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { reply, from, isGroup, isAdmins, sender }) => {
            try {
                // 1. Reply Check
                if (!m.quoted) return reply("❌ ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇssᴀɢᴇ ᴛᴏ ᴅᴇʟᴇᴛᴇ ɪᴛ.");

                // 2. Security: Only Owner or Admins
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotOwner = (sender === botOwner);

                if (!isBotOwner && !isAdmins) {
                    return reply("❌ *Access Denied!* Only admins or bot owner can delete messages.");
                }

                // 3. Execution (Silently Delete)
                // key me chat, fromMe, id aur participant (agar group hai) hona chahiye
                const key = {
                    remoteJid: from,
                    fromMe: m.quoted.fromMe,
                    id: m.quoted.id,
                    participant: m.quoted.sender
                };

                await conn.sendMessage(from, { delete: key });

            } catch (error) {
                console.error("Delete Error:", error);
                // Agar bot admin nahi hoga toh delete fail ho sakta hai kisi aur ka message
                reply("❌ Failed to delete message. Make sure I am an admin.");
            }
        }
    }
};
