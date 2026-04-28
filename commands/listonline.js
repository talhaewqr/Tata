// === commands/listonline.js ===

module.exports = {
    listonline: {
        pattern: "listonline",
        alias: ["online", "active"],
        tags: ["group"],
        execute: async (conn, message, m, { reply, from, isGroup }) => {
            try {
                if (!isGroup) return reply("❌ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ᴡᴏʀᴋs ɪɴ ɢʀᴏᴜᴘs.");

                // Presence data fetch karna (Ye bot ke memory store par depend karta hai)
                const onlineParticipants = [];
                const groupMetadata = await conn.groupMetadata(from);
                const allMembers = groupMetadata.participants;

                // Hum check karte hain ke kis kis ka 'presence' update bot ke paas hai
                // Note: Ye tabhi behtar kaam karta hai jab members active hon
                for (let mem of allMembers) {
                    const status = conn.presence && conn.presence[mem.id] ? conn.presence[mem.id].lastKnownPresence : null;
                    if (status === 'available' || status === 'composing' || status === 'recording') {
                        onlineParticipants.push(mem.id);
                    }
                }

                if (onlineParticipants.length === 0) {
                    return reply("❌ ɴᴏ ᴏɴʟɪɴᴇ ᴍᴇᴍʙᴇʀs ᴅᴇᴛᴇᴄᴛᴇᴅ ʀɪɢʜᴛ ɴᴏᴡ.\n(Members must interact or have privacy open for bot to see)");
                }

                let listText = `*╭━━━〔 🟢 ᴏɴʟɪɴᴇ ᴍᴇᴍʙᴇʀs 〕━━━┈⊷*\n`;
                listText += `┃\n`;
                listText += `┃ ✨ *Status:* Currently Active\n`;
                listText += `┃ 👥 *Found:* ${onlineParticipants.length}\n`;
                listText += `┃\n`;
                listText += `┣━━━〔 ʟɪsᴛ 〕━━━┈⊷\n`;

                for (let jid of onlineParticipants) {
                    listText += `┃ ✮ @${jid.split('@')[0]}\n`;
                }

                listText += `┃\n`;
                listText += `*╰━━━━━━━━━━━━━━━┈⊷*`;

                await conn.sendMessage(from, { 
                    text: listText, 
                    mentions: onlineParticipants 
                }, { quoted: m });

            } catch (error) {
                console.error("ListOnline Error:", error);
                await reply("❌ Error checking online status.");
            }
        }
    }
};
