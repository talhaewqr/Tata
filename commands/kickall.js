// === commands/kickall.js ===

module.exports = {
    kickall: {
        pattern: "kickall",
        alias: ["removeall", "cleanhouse"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { reply, from, isGroup, sender }) => {
            try {
                // 1. Group Check
                if (!isGroup) return reply("ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ᴡᴏʀᴋs ɪɴ ɢʀᴏᴜᴘs.");

                // 2. STRICT SECURITY: Sirf Bot Owner (jisne bot lagaya hai) hi use kar sake
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                
                if (sender !== botOwner) {
                    return reply("❌ ᴛʜɪs ᴅᴀɴɢᴇʀᴏᴜs ᴄᴏᴍᴍᴀɴᴅ ɪs ʀᴇsᴛʀɪᴄᴛᴇᴅ ᴛᴏ ʙᴏᴛ ᴏᴡɴᴇʀ ᴏɴʟʏ!");
                }

                // 3. Bot Admin Check
                const groupMetadata = await conn.groupMetadata(from);
                const botIsAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
                
                if (!botIsAdmin) {
                    return reply("❌ ɪ ɴᴇᴇᴅ ᴀᴅᴍɪɴ ᴘᴏᴡᴇʀ ᴛᴏ ᴋɪᴄᴋ ᴇᴠᴇʀʏᴏɴᴇ!");
                }

                // 4. Filter members (Admins aur Bot ko chhor kar)
                const participants = groupMetadata.participants;
                const membersToKick = participants
                    .filter(p => !p.admin && p.id !== botNumber && p.id !== botOwner)
                    .map(p => p.id);

                if (membersToKick.length === 0) {
                    return reply("ɴᴏ ɴᴏɴ-ᴀᴅᴍɪɴ ᴍᴇᴍʙᴇʀs ʟᴇғᴛ ᴛᴏ ᴋɪᴄᴋ.");
                }

                await reply(`⚠️ ᴋɪᴄᴋɪɴɢ ${membersToKick.length} ᴍᴇᴍʙᴇʀs ᴀs ғᴀsᴛ ᴀs ᴘᴏssɪʙʟᴇ...`);

                // 5. FAST EXECUTION: Bada batch aur kam delay
                // WhatsApp usually allows up to 100 per request, but 50 is safer
                for (let i = 0; i < membersToKick.length; i += 50) {
                    const batch = membersToKick.slice(i, i + 50);
                    await conn.groupParticipantsUpdate(from, batch, 'remove');
                    // Very short delay to keep it fast but avoid instant ban
                    await new Promise(resolve => setTimeout(resolve, 500)); 
                }

                await reply(`✅ sᴜᴄᴄᴇssғᴜʟʟʏ ᴘᴜʀɢᴇᴅ ${membersToKick.length} ᴍᴇᴍʙᴇʀs.`);

            } catch (error) {
                console.error("Kickall Error:", error);
                await reply("❌ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ. ᴍᴀʏʙᴇ ɪ ᴡᴀs ʀᴇᴍᴏᴠᴇᴅ ᴏʀ ʀᴀᴛᴇ ʟɪᴍɪᴛᴇᴅ.");
            }
        }
    }
};
