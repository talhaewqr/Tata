// === commands/antilink.js ===

module.exports = {
    antilink: {
        pattern: "antilink",
        alias: ["anti"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { q, reply, from, isGroup, isAdmins, sender }) => {
            try {
                if (!isGroup) return reply("❌ ɢʀᴏᴜᴘ ᴏɴʟʏ!");

                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotOwner = (sender === botOwner);
                if (!isBotOwner && !isAdmins) return reply("❌ ᴀᴅᴍɪɴ ᴏɴʟʏ!");

                // Input splitting: e.g., "kick on" -> ["kick", "on"]
                const input = q.toLowerCase().trim().split(/\s+/);
                const mode = input[0];   // delete, warn, kick
                const status = input[1]; // on, off

                // Database check
                if (!global.db.data.chats[from]) global.db.data.chats[from] = {};
                let chat = global.db.data.chats[from];

                // Simple Help Menu agar galat command likhi ho
                let helpMsg = `*╭━━━〔 🛡️ ᴀɴᴛɪ-ʟɪɴᴋ ᴄᴏɴᴛʀᴏʟ 〕━━━┈⊷*\n`;
                helpMsg += `┃\n`;
                helpMsg += `┃ ✅ *To Enable Mode:*\n`;
                helpMsg += `┃ 🔹 .antilink delete on\n`;
                helpMsg += `┃ 🔹 .antilink warn on\n`;
                helpMsg += `┃ 🔹 .antilink kick on\n`;
                helpMsg += `┃\n`;
                helpMsg += `┃ ❌ *To Disable All:*\n`;
                helpMsg += `┃ 🔸 .antilink off\n`;
                helpMsg += `┃\n`;
                helpMsg += `┃ 📢 *Current Mode:* ${chat.antilink ? chat.antilinkMode.toUpperCase() : 'OFF'}\n`;
                helpMsg += `*╰━━━━━━━━━━━━━━━┈⊷*`;

                if (!mode || (mode !== "off" && !status)) return reply(helpMsg);

                // Disable Logic
                if (mode === "off") {
                    chat.antilink = false;
                    chat.antilinkMode = null;
                    return reply("🛡️ *Anti-Link has been completely disabled.*");
                }

                // Enable Logic based on User Choice
                if (status === "on") {
                    if (["delete", "warn", "kick"].includes(mode)) {
                        chat.antilink = true;
                        chat.antilinkMode = mode; // Sirf wahi mode save hoga jo aapne likha
                        return reply(`✅ *Anti-Link* has been set to: *${mode.toUpperCase()}*`);
                    } else {
                        return reply("❌ Invalid mode! Use: delete, warn, or kick.");
                    }
                } else if (status === "off") {
                    // Agar specific mode off karna ho
                    if (chat.antilinkMode === mode) {
                        chat.antilink = false;
                        chat.antilinkMode = null;
                        return reply(`🛡️ *Anti-Link ${mode}* is now OFF.`);
                    } else {
                        return reply(`💡 Mode *${mode}* was not active.`);
                    }
                }

            } catch (error) {
                console.error(error);
                reply("❌ Error setting antilink.");
            }
        }
    }
};
