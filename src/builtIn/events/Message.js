const Event = require("../../structures/Event");

class MessageEvent extends Event {
  constructor(client) {
    super(client, { name: "message", emitter: client });
  }
  async run(msg) {
    if (!msg.content) return;
    const args = msg.content
      .slice(msg.guild ? msg.guild.prefix.length : msg.client.defaultPrefix.length)
      .split(/ +/g);
    const commandName = args.shift().toLowerCase();

    let command = this.client.registry.commands.find(
      cmd => cmd.name == commandName || cmd.aliases.includes(commandName)
    );
    if (!command) return;
    msg.command = command;

    if (command.ownerOnly && !msg.client.isOwner(msg.author))
      return msg.reply("Only the bot's owner can use this command");
    if (command.guildOnly && msg.channel.type == "dm")
      return msg.reply("This command can only be used in a guild");
    if (command.dmOnly && msg.channel.type != "dm")
      return msg.reply("This command can only be used in a DM");

    if (msg.member) {
      if (!command.authorPermissions.includes("SEND_MESSAGES"))
        command.authorPermissions.push("SEND_MESSAGES");
      if (!command.authorPermissions.includes("VIEW_CHANNEL"))
        command.authorPermissions.push("VIEW_CHANNEL");

      command.authorPermissions.each(p => {
        if (!msg.member.permissions.has(p)) return;
      });

      if (!command.clientPermissions.includes("SEND_MESSAGES"))
        command.clientPermissions.push("SEND_MESSAGES");
      if (!command.clientPermissions.includes("VIEW_CHANNEL"))
        command.clientPermissions.push("VIEW_CHANNEL");

      command.clientPermissions.each(p => {
        if (!msg.guild.me.permissions.has(p)) return;
      });
    }

    await command.run(msg, args);
  }
}

module.exports = MessageEvent;
