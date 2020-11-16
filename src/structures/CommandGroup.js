const { Collection } = require("discord.js");

class CommandGroup {
  constructor(client, { name }) {
    this.commands = new Collection();

    if (typeof name != "string")
      throw new TypeError("CommandGroup property `name` must be a string");
    this.name = name;
  }
}

module.exports = CommandGroup;
