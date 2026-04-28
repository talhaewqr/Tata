// === commands/creategc.js ===

module.exports = {
    creategc: {
        pattern: "creategc",
        alias: ["creategroup", "newgc"],
        tags: ["owner"],
        execute: async (conn, message, m, { args, q, reply, sender }) => {
            try {
                // 1. STRICT SECURITY: Only Bot Owner
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                if (sender !== botOwner) {
                    return reply("❌ ᴏɴʟʏ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴄʀᴇᴀᴛᴇ ɢʀᴏᴜᴘs!");
                }

                // 2. Group Name Check
                const groupName = q || args.join(" ");
                if (!groupName) return reply(`💡 *Usage:* .creategc Name_of_Group`);

                // 3. Execution: Create Group
                // Note: Hum khali list [] bhej rahe hain taake bot akela group banaye
                const group = await conn.groupCreate(groupName, []);
                
                // 4. Generate Invite Link
                const code = await conn.groupInviteCode(group.id);
                const link = `https://chat.whatsapp.com/${code}`;

                // 5. Stylish Output
                let teks = `*╭━━━〔 🏗️ ɢʀᴏᴜᴘ ᴄʀᴇᴀᴛᴇᴅ 〕━━━┈⊷*\n`;
                teks += `┃\n`;
                teks += `┃ 🏷️ *Name:* ${group.subject}\n`;
                teks += `┃ 🆔 *JID:* \`\`\`${group.id}\`\`\`\n`;
                teks += `┃ 👮 *Owner:* @${sender.split("@")[0]}\n`;
                teks += `┃ 🔗 *Invite Link:* \n`;
                teks += `┃ ${link}\n`;
                teks += `┃\n`;
                teks += `┃ 💡 *Tip:* You can now add members to this group.\n`;
                teks += `*╰━━━━━━━━━━━━━━━┈⊷*`;

                await conn.sendMessage(m.chat, {
                    text: teks,
                    mentions: [sender]
                }, { quoted: m });

            } catch (error) {
                console.error("CreateGC Error:", error);
                reply("❌ ғᴀɪʟᴇᴅ ᴛᴏ ᴄʀᴇᴀᴛᴇ ɢʀᴏᴜᴘ. Check if the bot has permissions.");
            }
        }
    }
};
