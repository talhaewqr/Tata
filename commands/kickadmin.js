// === commands/kickadmin.js ===

module.exports = {
    kickadmin: {
        pattern: "kickadmin",
        alias: ["purgadmins", "removeadmins"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { reply, from, isGroup, sender }) => {
            try {
                // 1. Group Check
                if (!isGroup) return reply("ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ᴡᴏʀᴋs ɪɴ ɢʀᴏᴜᴘs.");

                // 2. OWNER ONLY CHECK (Jisne bot connect kiya hai)
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';

                if (sender !== botOwner) {
                    return reply("❌ ᴏɴʟʏ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴇxᴇᴄᴜᴛᴇ ᴛʜɪs ᴍᴀss ᴘᴜʀɢᴇ!");
                }

                // 3. Bot Admin Check
                const groupMetadata = await conn.groupMetadata(from);
                const botIsAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
                
                if (!botIsAdmin) {
                    return reply("❌ ɪ ɴᴇᴇᴅ ᴀᴅᴍɪɴ ᴘᴏᴡᴇʀ ᴛᴏ ᴅᴇᴍᴏᴛᴇ ᴏᴛʜᴇʀ ᴀᴅᴍɪɴs!");
                }

                // 4. Filter Admins (Bot, Owner, aur Group Creator ko safe rakhna hai)
                const groupCreator = groupMetadata.owner || from.split('-')[0] + '@s.whatsapp.net';
                
                const adminsToKill = groupMetadata.participants
                    .filter(p => 
                        p.admin === 'admin' && // Sirf normal admins (superadmin/creator nahi)
                        p.id !== botNumber && 
                        p.id !== botOwner && 
                        p.id !== groupCreator
                    )
                    .map(p => p.id);

                if (adminsToKill.length === 0) {
                    return reply("ɴᴏ ʀᴇᴍᴏᴠᴀʙʟᴇ ᴀᴅᴍɪɴs ғᴏᴜɴᴅ (ᴇxᴄʟᴜᴅɪɴɢ ᴄʀᴇᴀᴛᴏʀ & ᴏᴡɴᴇʀ).");
                }

                await reply(`⚠️ ᴘᴜʀɢɪɴɢ ${adminsToKill.length} ᴀᴅᴍɪɴs... ᴅᴇᴍᴏᴛɪɴɢ ᴀɴᴅ ʀᴇᴍᴏᴠɪɴɢ.`);

                // 5. IMPROVED EXECUTION (Batch Demote then Batch Kick)
                // Pehle sab ko aik sath demote karo (Fast)
                await conn.groupParticipantsUpdate(from, adminsToKill, 'demote');
                
                // Chhota sa delay taake WhatsApp server update ho jaye
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Ab sab ko aik sath kick karo
                await conn.groupParticipantsUpdate(from, adminsToKill, 'remove');

                await reply(`✅ sᴜᴄᴄᴇssғᴜʟʟʏ ᴘᴜʀɢᴇᴅ ${adminsToKill.length} ᴀᴅᴍɪɴ(s).`);

            } catch (error) {
                console.error("KickAdmin Error:", error);
                await reply("❌ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ. ᴍᴀʏʙᴇ ʀᴀᴛᴇ ʟɪᴍɪᴛᴇᴅ ʙʏ ᴡʜᴀᴛsᴀᴘᴘ.");
            }
        }
    }
};
