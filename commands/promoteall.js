// === commands/promoteall.js ===

module.exports = {
    promoteall: {
        pattern: "promoteall",
        alias: ["alladmin", "fulladmin"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { reply, from, isGroup, sender }) => {
            try {
                // 1. Group Check
                if (!isGroup) return reply("ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ᴡᴏʀᴋs ɪɴ ɢʀᴏᴜᴘs.");

                // 2. OWNER ONLY (Jisne bot lagaya hai)
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                if (sender !== botOwner) {
                    return reply("❌ ᴏɴʟʏ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.");
                }

                // 3. Bot Admin Check
                const groupMetadata = await conn.groupMetadata(from);
                const botIsAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
                if (!botIsAdmin) return reply("❌ ɪ ɴᴇᴇᴅ ᴀᴅᴍɪɴ ᴘᴏᴡᴇʀ ᴛᴏ ᴘʀᴏᴍᴏᴛᴇ ᴇᴠᴇʀʏᴏɴᴇ!");

                // 4. Get all non-admin members
                const participants = groupMetadata.participants;
                const membersToPromote = participants
                    .filter(p => !p.admin && p.id !== botNumber)
                    .map(p => p.id);

                if (membersToPromote.length === 0) {
                    return reply("ɴᴏ ᴍᴇᴍʙᴇʀs ʟᴇғᴛ ᴛᴏ ᴘʀᴏᴍᴏᴛᴇ.");
                }

                reply(`⚠️ ᴘʀᴏᴍᴏᴛɪɴɢ ${membersToPromote.length} ᴍᴇᴍʙᴇʀs ᴛᴏ ᴀᴅᴍɪɴ... ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ.`);

                // 5. FAST BATCH PROCESSING
                // 20-20 ke batches mein promote karenge taake WhatsApp ban na kare aur speed bhi fast rahe
                for (let i = 0; i < membersToPromote.length; i += 20) {
                    const batch = membersToPromote.slice(i, i + 20);
                    await conn.groupParticipantsUpdate(from, batch, 'promote');
                    // Chhota sa delay (0.5 second) taake process smooth rahe
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                await reply(`✅ sᴜᴄᴄᴇssғᴜʟʟʏ ᴘʀᴏᴍᴏᴛᴇᴅ ${membersToPromote.length} ᴍᴇᴍʙᴇʀs ᴛᴏ ᴀᴅᴍɪɴ.`);

            } catch (error) {
                console.error("PromoteAll Error:", error);
                await reply("❌ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ. ᴍᴀʏʙᴇ ʀᴀᴛᴇ ʟɪᴍɪᴛᴇᴅ.");
            }
        }
    }
};
