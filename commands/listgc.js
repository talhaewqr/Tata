// === commands/listgc.js ===

module.exports = {
    listgc: {
        pattern: "listgc",
        alias: ["listgroup", "allgc", "groups"],
        tags: ["owner"],
        execute: async (conn, message, m, { reply, sender }) => {
            try {
                // 1. STRICT SECURITY: Only Bot Owner can see all groups
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                if (sender !== botOwner) {
                    return reply("❌ ᴛʜɪs ɪs ᴀ ᴘʀɪᴠᴀᴛᴇ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ!");
                }

                // 2. Fetch all Group JIDs from bot's store
                const getGroups = await conn.groupFetchAllParticipating();
                const groups = Object.values(getGroups);

                if (groups.length === 0) {
                    return reply("Bot is not joined in any group yet.");
                }

                // 3. Design the list
                let listText = `*╭━━━〔 🏘️ ʙᴏᴛ ɢʀᴏᴜᴘ ʟɪsᴛ 〕━━━┈⊷*\n`;
                listText += `┃\n`;
                listText += `┃ 📊 *Total Groups:* ${groups.length}\n`;
                listText += `┃\n`;
                listText += `┣━━━〔 ᴅᴇᴛᴀɪʟs 〕━━━┈⊷\n`;

                groups.forEach((gc, i) => {
                    listText += `┃ ${i + 1}️⃣ *Name:* ${gc.subject}\n`;
                    listText += `┃ 🆔 *JID:* \`\`\`${gc.id}\`\`\`\n`;
                    listText += `┃ 👥 *Members:* ${gc.participants.length}\n`;
                    listText += `┃ ──────────────┈⊷\n`;
                });

                listText += `*╰━━━━━━━━━━━━━━━┈⊷*`;

                // 4. Send the list in Private or Current Chat
                await reply(listText);

            } catch (error) {
                console.error("ListGC Error:", error);
                await reply("❌ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪʟᴇ ғᴇᴛᴄʜɪɴɢ ɢʀᴏᴜᴘ ʟɪsᴛ.");
            }
        }
    }
};
