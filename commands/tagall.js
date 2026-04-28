// === commands/tagall.js ===

module.exports = {
    tagall: {
        pattern: "tagall",
        alias: ["everyone", "all"],
        tags: ["group"],
        execute: async (conn, message, m, { q, reply, from, isGroup, isAdmins, sender }) => {
            try {
                if (!isGroup) return reply('❌ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs!');

                // 1. Security Logic
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotOwner = (sender === botOwner);

                // Agar chalane wala Owner nahi hai aur Admin bhi nahi hai
                if (!isBotOwner && !isAdmins) {
                    return reply("❌ *Access Denied!*\n\nYou need to connect your own bot to use this command or ask an admin.");
                }

                // 2. Get Participants
                const groupMetadata = await conn.groupMetadata(from);
                const participants = groupMetadata.participants;
                const mentions = participants.map(p => p.id);
                
                const customMessage = q || 'ωнαтƨ ʋρ Яɛαρɛяƨ';

                // 3. Stylish Design
                let tagText = `*╭━━━〔 📢 ᴛᴀɢ ᴀʟʟ 〕━━━┈⊷*\n`;
                tagText += `┃\n`;
                tagText += `┃ ✨ *Message:* ${customMessage}\n`;
                tagText += `┃ 👥 *Total:* ${mentions.length}\n`;
                tagText += `┃\n`;
                tagText += `┣━━━〔 ᴍᴇᴍʙᴇʀs 〕━━━┈⊷\n`;

                for (let mem of participants) {
                    tagText += `┃ ✮ @${mem.id.split('@')[0]}\n`;
                }

                tagText += `┃\n`;
                tagText += `*╰━━━━━━━━━━━━━━━┈⊷*`;

                // 4. Send Message
                await conn.sendMessage(from, {
                    text: tagText,
                    mentions: mentions
                }, { quoted: m });

            } catch (error) {
                console.error('Tagall error:', error);
                reply('❌ ᴇʀʀᴏʀ: Could not execute tagall.');
            }
        }
    }
};
