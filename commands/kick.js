// === commands/kick.js ===

module.exports = {
    kick: {
        pattern: "kick",
        alias: ["remove", "nikal"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { args, q, reply, from, isGroup, isAdmins, isCreator, sender }) => {
            try {
                if (!isGroup) return reply("ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ᴡᴏʀᴋs ɪɴ ɢʀᴏᴜᴘs.");

                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net'; // Aapka number
                
                // 1. Check if sender is Owner or Admin
                const isBotOwner = (sender === botOwner);
                if (!isBotOwner && !isAdmins) {
                    return reply("❌ ᴏɴʟʏ ᴀᴅᴍɪɴs ᴏʀ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs!");
                }

                // 2. Identify target user
                let user;
                if (m.mentionedJid && m.mentionedJid.length > 0) {
                    user = m.mentionedJid[0];
                } else if (m.quoted && m.quoted.sender) {
                    user = m.quoted.sender;
                } else if (q) {
                    user = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                } else {
                    return reply("ᴛᴀɢ ᴏ r ǫᴜᴏᴛᴇ ᴀ ᴜsᴇʀ ᴛᴏ ᴋɪᴄᴋ!");
                }

                // 3. STRICT PROTECTION: Bot cannot kick itself
                if (user === botNumber) {
                    return reply("❌ ɪ ᴄᴀɴɴᴏᴛ ᴋɪᴄᴋ ᴍʏsᴇʟғ! ᴛʜᴀᴛ ᴡᴏᴜʟᴅ ʙᴇ sᴜɪᴄɪᴅᴇ. 😂");
                }

                // 4. OWNER PROTECTION: Admins cannot kick the bot owner
                if (user === botOwner && !isBotOwner) {
                    return reply("❌ ɪ ᴡɪʟʟ ɴᴇᴠᴇʀ ᴋɪᴄᴋ ᴍʏ ᴏᴡɴᴇʀ! ɴɪᴄᴇ ᴛʀʏ. 😎");
                }

                // 5. Bot Admin Power Check
                const groupMetadata = await conn.groupMetadata(from);
                const botIsAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
                
                if (!botIsAdmin) {
                    return reply("❌ ɪ ᴀᴍ ɴᴏᴛ ᴀᴅᴍɪɴ! ɢɪᴠᴇ ᴍᴇ ᴘᴏᴡᴇʀ ғɪʀsᴛ.");
                }

                // 6. Final Execution
                await conn.groupParticipantsUpdate(from, [user], 'remove');
                await reply(`✅ Removed successfully.`);

            } catch (error) {
                console.error("Kick Error:", error);
                await reply("❌ User already gone or error occurred.");
            }
        }
    }
};
