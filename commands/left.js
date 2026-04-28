// === commands/leave.js ===

module.exports = {
    leave: {
        pattern: "leave",
        alias: ["left", "exitgc"],
        tags: ["owner"],
        execute: async (conn, message, m, { reply, from, isGroup, sender }) => {
            try {
                // 1. Group Check
                if (!isGroup) return reply("❌ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴsɪᴅᴇ ᴀ ɢʀᴏᴜᴘ.");

                // 2. STRICT SECURITY: Only Bot Owner (Jisne scan kiya)
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                if (sender !== botOwner) {
                    return reply("❌ ᴏɴʟʏ ᴍʏ ᴏᴡɴᴇʀ ᴄᴀɴ ᴍᴀᴋᴇ ᴍᴇ ʟᴇᴀᴠᴇ!");
                }

                // 3. Goodbye Message
                await reply("👋 *Goodbye Everyone!* Reaper Bot is leaving the chat... 💨");

                // 4. Execution: Leave Group
                // Thoda sa delay taake message chala jaye phir leave kare
                setTimeout(async () => {
                    await conn.groupLeave(from);
                }, 1000);

            } catch (error) {
                console.error("Leave Error:", error);
                await reply("❌ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪʟᴇ ʟᴇᴀᴠɪɴɢ.");
            }
        }
    }
};
