const Event = require("../../structures/Event");

class MessageUpdateEvent extends Event {
  constructor(client) {
    super(client, { name: "messageUpdate", emitter: client });
  }

  async run(oldMsg, newMsg) {
    if (Date.now - newMsg.createdTimestamp > 30) return;
    if (!newMsg.content) return;
    const args = newMsg.content.slice(newMsg.guild ? newMsg.guild.prefix.length : newMsg.client.defaultPrefix.length).split(/ +/g);
    const commandName = args.shift().toLowerCase();
    let command = this.client.registry.commands.find(
      cmd => cmd.name == commandName || cmd.aliases.includes(commandName)
    );
    if (!command) return;
    newMsg.command = command;

    if (newMsg.member) {
      if (!command.authorPermissions.includes("SEND_MESSAGES"))
        command.authorPermissions.push("SEND_MESSAGES");
      if (!command.authorPermissions.includes("VIEW_CHANNEL"))
        command.authorPermissions.push("VIEW_CHANNEL");

      command.authorPermissions.each(p => {
        if (!newMsg.member.permissions.has(p)) return;
      });

      if (!command.clientPermissions.includes("SEND_MESSAGES"))
        command.clientPermissions.push("SEND_MESSAGES");
      if (!command.clientPermissions.includes("VIEW_CHANNEL"))
        command.clientPermissions.push("VIEW_CHANNEL");

      command.clientPermissions.each(p => {
        if (!newMsg.guild.me.permissions.has(p)) return;
      });
    }

    await command.run(newMsg, args);
  }
}

module.exports = MessageUpdateEvent;
