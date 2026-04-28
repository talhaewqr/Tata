// === commands/promote.js ===

module.exports = {
    promote: {
        pattern: "promote",
        alias: ["admin", "makeadmin"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { args, q, reply, from, isGroup, isAdmins, isCreator, sender }) => {
            try {
                // 1. Group Check
                if (!isGroup) return reply('❌ ɢʀᴏᴜᴘ ᴏɴʟʏ!');

                // 2. Permission Logic: Bot Owner ya Group Admin hi use kar sakein
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotOwner = (sender === botOwner);

                if (!isBotOwner && !isAdmins) {
                    return reply("❌ ᴏɴʟʏ ᴀᴅᴍɪɴs ᴏʀ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴘʀᴏᴍᴏᴛᴇ ᴍᴇᴍʙᴇʀs!");
                }

                // 3. User Identification (Mention, Reply, or Number)
                let user;
                if (m.mentionedJid && m.mentionedJid.length > 0) {
                    user = m.mentionedJid[0];
                } else if (m.quoted && m.quoted.sender) {
                    user = m.quoted.sender;
                } else if (q) {
                    user = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                } else {
                    return reply("💡 *Usage:* .promote @user, or reply to a message, or .promote 923123456789");
                }

                // 4. Bot Admin Check
                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const groupMetadata = await conn.groupMetadata(from);
                const botIsAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
                
                if (!botIsAdmin) {
                    return reply("❌ ɪ ɴᴇᴇᴅ ᴀᴅᴍɪɴ ᴘᴏᴡᴇʀ ᴛᴏ ᴘʀᴏᴍᴏᴛᴇ someone!");
                }

                // 5. Execution
                await conn.groupParticipantsUpdate(from, [user], 'promote');
                
                await reply(`✅ @${user.split('@')[0]} ɪs ɴᴏᴡ ᴀɴ ᴀᴅᴍɪɴ!`, {
                    mentions: [user]
                });

            } catch (error) {
                console.error("Promote Error:", error);
                await reply("❌ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ. ᴍᴀʏʙᴇ ᴜsᴇʀ ɪs ᴀʟʀᴇᴀᴅʏ ᴀᴅᴍɪɴ.");
            }
        }
    }
};
