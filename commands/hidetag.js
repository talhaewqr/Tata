// === commands/tag.js ===

module.exports = {
    tag: {
        pattern: "tag",
        alias: ["hidetag", "htag", "everyone"],
        tags: ["group"],
        execute: async (conn, message, m, { q, reply, from, isGroup, isAdmins, sender, command }) => {
            try {
                if (!isGroup) return reply('❌ ɢʀᴏᴜᴘ ᴏɴʟʏ!');

                // 1. Security Logic (Owner or Admin)
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotOwner = (sender === botOwner);

                if (!isBotOwner && !isAdmins) {
                    return reply("❌ *Access Denied!*\n\nYou need to connect your own bot to use this command.");
                }

                // 2. Get Participants
                const groupMetadata = await conn.groupMetadata(from);
                const participants = groupMetadata.participants;
                const mentions = participants.map(a => a.id);
                
                // 3. Handle Text (Direct or Reply)
                let msgText = q ? q : (m.quoted && m.quoted.text ? m.quoted.text : '');

                // 4. Logic Switch (Hidetag vs Visible Tag)
                if (command === 'hidetag' || command === 'htag') {
                    // Hidetag: Sirf message bhejo, list mat dikhao
                    await conn.sendMessage(from, { 
                        text: msgText, 
                        mentions: mentions 
                    }, { quoted: m });
                } else {
                    // Tag/Everyone: Stylish list dikhao
                    let tagText = `*╭━━━〔 📢 ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛ 〕━━━┈⊷*\n`;
                    if (msgText) tagText += `┃ ✨ *Message:* ${msgText}\n┃\n`;
                    tagText += `┣━━━〔 ᴍᴇᴍʙᴇʀs 〕━━━┈⊷\n`;

                    for (let mem of participants) {
                        tagText += `┃ ✮ @${mem.id.split('@')[0]}\n`;
                    }

                    tagText += `*╰━━━━━━━━━━━━━━━┈⊷*`;

                    await conn.sendMessage(from, { 
                        text: tagText, 
                        mentions: mentions 
                    }, { quoted: m });
                }

            } catch (error) {
                console.error("Tag Command Error:", error);
                reply("❌ Error executing command.");
            }
        }
    }
};
