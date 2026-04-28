// === commands/demote.js ===

module.exports = {
    demote: {
        pattern: "demote",
        alias: ["unadmin", "takeadmin"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { args, q, reply, from, isGroup, isAdmins, isCreator, sender }) => {
            try {
                // 1. Group Check
                if (!isGroup) return reply('❌ ɢʀᴏᴜᴘ ᴏɴʟʏ!');

                // 2. Permission Logic: Bot Owner ya Group Admin
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotOwner = (sender === botOwner);

                if (!isBotOwner && !isAdmins) {
                    return reply("❌ ᴏɴʟʏ ᴀᴅᴍɪɴs ᴏʀ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴅᴇᴍᴏᴛᴇ ᴍᴇᴍʙᴇʀs!");
                }

                // 3. User Identification
                let user;
                if (m.mentionedJid && m.mentionedJid.length > 0) {
                    user = m.mentionedJid[0];
                } else if (m.quoted && m.quoted.sender) {
                    user = m.quoted.sender;
                } else if (q) {
                    user = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                } else {
                    return reply("💡 *Usage:* .demote @user, or reply to an admin, or .demote 923123456789");
                }

                // 4. Protection Layers
                if (user === botNumber) return reply('❌ ɪ ᴄᴀɴɴᴏᴛ ᴅᴇᴍᴏᴛᴇ ᴍʏsᴇʟғ!');
                
                // Owner Protection: Koi aam admin bot ke owner ko demote nahi kar sakta
                if (user === botOwner && !isBotOwner) {
                    return reply("❌ ɪ ᴡɪʟʟ ɴᴏᴛ ᴅᴇᴍᴏᴛᴇ ᴍʏ ᴏᴡɴᴇʀ! 🛡️");
                }

                // 5. Bot Admin Check
                const groupMetadata = await conn.groupMetadata(from);
                const botIsAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
                
                if (!botIsAdmin) {
                    return reply("❌ ɪ ɴᴇᴇᴅ ᴀᴅᴍɪɴ ᴘᴏᴡᴇʀ ᴛᴏ ᴅᴇᴍᴏᴛᴇ someone!");
                }

                // 6. Execution
                await conn.groupParticipantsUpdate(from, [user], 'demote');
                
                await reply(`✅ @${user.split('@')[0]} has been demoted. No longer an admin.`, {
                    mentions: [user]
                });

            } catch (error) {
                console.error("Demote Error:", error);
                await reply("❌ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ. ᴍᴀʏʙᴇ ᴛʜᴇ ᴜsᴇʀ ɪs ɴᴏᴛ ᴀɴ ᴀᴅᴍɪɴ.");
            }
        }
    }
};
