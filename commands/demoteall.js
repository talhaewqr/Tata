// === commands/demoteall.js ===

module.exports = {
    demoteall: {
        pattern: "demoteall",
        alias: ["unadminall", "fullmember"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { reply, from, isGroup, sender }) => {
            try {
                // 1. Group Check
                if (!isGroup) return reply("ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ᴡᴏʀᴋs ɪɴ ɢʀᴏᴜᴘs.");

                // 2. OWNER ONLY (Strict Security)
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                
                if (sender !== botOwner) {
                    return reply("❌ ᴏɴʟʏ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴅᴇᴍᴏᴛᴇ ᴇᴠᴇʀʏᴏɴᴇ!");
                }

                // 3. Bot Admin Check
                const groupMetadata = await conn.groupMetadata(from);
                const botIsAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
                if (!botIsAdmin) return reply("❌ ɪ ɴᴇᴇᴅ ᴀᴅᴍɪɴ ᴘᴏᴡᴇʀ ᴛᴏ ᴅᴇᴍᴏᴛᴇ ᴏᴛʜᴇʀs!");

                // 4. Filter Admins (Bot, Owner, aur Group Creator ko skip karein)
                const groupCreator = groupMetadata.owner || from.split('-')[0] + '@s.whatsapp.net';
                
                const adminsToDemote = groupMetadata.participants
                    .filter(p => 
                        p.admin && 
                        p.id !== botNumber && 
                        p.id !== botOwner && 
                        p.id !== groupCreator
                    )
                    .map(p => p.id);

                if (adminsToDemote.length === 0) {
                    return reply("ɴᴏ ʀᴇᴍᴏᴠᴀʙʟᴇ ᴀᴅᴍɪɴs ʟᴇғᴛ.");
                }

                reply(`⚠️ ᴅᴇᴍᴏᴛɪɴɢ ${adminsToDemote.length} ᴀᴅᴍɪɴs... ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ.`);

                // 5. SUPER FAST BATCH PROCESSING
                // 20 admins per batch for maximum speed with safety
                for (let i = 0; i < adminsToDemote.length; i += 20) {
                    const batch = adminsToDemote.slice(i, i + 20);
                    await conn.groupParticipantsUpdate(from, batch, 'demote');
                    // Sirf 0.5 second ka delay
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                await reply(`✅ sᴜᴄᴄᴇssғᴜʟʟʏ ᴅᴇᴍᴏᴛᴇᴅ ${adminsToDemote.length} ᴀᴅᴍɪɴ(s).`);

            } catch (error) {
                console.error("DemoteAll Error:", error);
                await reply("❌ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ. ᴍᴀʏʙᴇ ɪ ᴀᴍ ɴᴏᴛ ᴀᴅᴍɪɴ ᴏʀ ʀᴀᴛᴇ ʟɪᴍɪᴛᴇᴅ.");
            }
        }
    }
};
