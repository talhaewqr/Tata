// === commands/add.js ===

module.exports = {
    add: {
        pattern: "add",
        alias: ["invite"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { args, q, reply, from, isGroup, isAdmins, isCreator, sender }) => {
            try {
                // 1. Group Check
                if (!isGroup) return reply('❌ ɢʀᴏᴜᴘ ᴏɴʟʏ!');

                // 2. ONLY BOT OWNER/CREATOR CAN USE (Security Layer)
                // Ye check karega ke jisne bot lagaya hai sirf wahi command use kare
                const botOwner = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                if (sender !== botOwner) {
                    return reply('❌ Only the person who installed this bot can use this command!');
                }

                // 3. Number extraction logic
                let text = q;
                if (!text && !m.quoted) return reply(`ᴇxᴀᴍᴘʟᴇ: .add 971543398755`);

                const numbersOnly = text ? text.replace(/[^0-9]/g, '') : m.quoted?.sender.replace(/[^0-9]/g, '');
                if (!numbersOnly || numbersOnly.length < 10) return reply('❌ ɪɴᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ');

                const userJid = numbersOnly + '@s.whatsapp.net';

                // 4. Execution (Admin check bypass for bot logic)
                // Hum seedha try karenge, agar bot admin hua to add ho jayega
                await conn.groupParticipantsUpdate(from, [userJid], 'add');
                
                await reply(`✅ sᴜᴄᴄᴇssғᴜʟʟʏ ᴀᴅᴅᴇᴅ @${numbersOnly}`, {
                    mentions: [userJid]
                });

            } catch (error) {
                console.error("Add Command Error:", error);
                // Agar bot admin nahi hai ya koi aur masla hai
                await reply('❌ Failed to add. Make sure the bot is Admin or check user privacy settings.');
            }
        }
    }
};
