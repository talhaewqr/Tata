// === commands/join.js ===

module.exports = {
    join: {
        pattern: "join",
        alias: ["entercgc"],
        tags: ["owner"],
        execute: async (conn, message, m, { q, reply, sender }) => {
            try {
                // 1. STRICT SECURITY: Only Bot Owner can make the bot join groups
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                if (sender !== botOwner) {
                    return reply("❌ ᴛʜɪs ɪs ᴀ ᴘʀɪᴠᴀᴛᴇ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ!");
                }

                // 2. Identify Link (Direct Text or Reply)
                let link = q ? q : (m.quoted && m.quoted.text ? m.quoted.text : '');
                
                if (!link || !link.includes('chat.whatsapp.com/')) {
                    return reply("❌ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴡʜᴀᴛsᴀᴘᴘ ɢʀᴏᴜᴘ ʟɪɴᴋ!");
                }

                // 3. Extract Code from Link
                const code = link.split('chat.whatsapp.com/')[1].split(' ')[0];

                // 4. Execution: Join Group
                await conn.groupAcceptInvite(code)
                    .then(async (res) => {
                        await reply("✅ *Joined Successfully!*");
                    })
                    .catch((err) => {
                        console.error("Join Error:", err);
                        reply("❌ *Failed to join!* Maybe the link is expired or the bot is banned from that group.");
                    });

            } catch (error) {
                console.error("Join Plugin Error:", error);
                await reply("❌ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ.");
            }
        }
    }
};
