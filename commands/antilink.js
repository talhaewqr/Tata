module.exports = {
    antilink: {
        pattern: "antilink",
        alias: ["anti"],
        tags: ["admin", "group"],
        execute: async (conn, message, m, { q, reply, from, isGroup, isAdmins, sender }) => {
            if (!isGroup) return reply("❌ ɢʀᴏᴜᴘ ᴏɴʟʏ!");
            if (!isAdmins) return reply("❌ ᴀᴅᴍɪɴ ᴏɴʟʏ!");

            const input = q.toLowerCase().trim().split(/\s+/);
            const mode = input[0];   // delete, warn, kick
            const status = input[1]; // on, off

            // Initialize setting for this group if not exists
            if (!global.antilinkSettings[from]) {
                global.antilinkSettings[from] = { active: false, mode: 'delete' };
            }

            if (mode === "off") {
                global.antilinkSettings[from].active = false;
                return reply("🛡️ *Anti-Link has been disabled.*");
            }

            if (status === "on" && ["delete", "warn", "kick"].includes(mode)) {
                global.antilinkSettings[from].active = true;
                global.antilinkSettings[from].mode = mode;
                return reply(`✅ *Anti-Link* set to: *${mode.toUpperCase()}*`);
            }

            return reply(`*🛡️ ANTI-LINK CONTROL*\n\nUsage:\n.antilink delete on\n.antilink warn on\n.antilink kick on\n.antilink off`);
        }
    }
};
