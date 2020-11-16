const Client = require("../Client");

class Command {
  constructor(
    client,
    {
      name,
      description = "Unknown Command Description",
      commandGroup,
      authorPermissions = [],
      clientPermissions = [],
      aliases = [],
      guildOnly = false,
      dmOnly = false,
      ownerOnly = false
    }
  ) {
    if (!client instanceof Client)
      throw new TypeError(
        "Command property `client` must be an instance of a HandlerClient"
      );
    this.client = client;

    if (typeof name != "string")
      throw new TypeError("Command property `name` must be a string");
    this.name = name;

    if (typeof description != "string")
      throw new TypeError("Command property `description` must be a string");
    this.description = description;

    if (typeof commandGroup != "string")
      throw new TypeError("Command property `commandGroup` must be a string");
    this.commandGroup = this.client.groups.get(commandGroup);
    if (!this.commandGroup)
      throw new ReferenceError(
        "Command property `commandGroup` must resolve to a CommandGroup"
      );
    this.commandGroup.commands.set(this.name, this);

    if (!(authorPermissions instanceof Array))
      throw new TypeError(
        "Command property `authorPermissions` must be an Array"
      );
    this.authorPermissions = authorPermissions;

    if (!(clientPermissions instanceof Array))
      throw new TypeError(
        "Command property `clientPermissions` must be an Array"
      );
    this.clientPermissions = clientPermissions;

    if (!(aliases instanceof Array))
      throw new TypeError("Command property `aliases` must be an Array");
    this.aliases = aliases;

    if (typeof guildOnly != "boolean")
      throw new TypeError("Command property `guildOnly` must be a Boolean");
    this.guildOnly = guildOnly;
    
    if (typeof dmOnly != "boolean")
      throw new TypeError("Command property `dmOnly` must be a Boolean");
    this.dmOnly = dmOnly;
    if (guildOnly) this.dmOnly = false;
      
    if (typeof ownerOnly != "boolean")
      throw new TypeError("Command property `ownerOnly` must be a Boolean");
    this.ownerOnly = ownerOnly;
  }
  run() {
    throw new ReferenceError("Base Command does not have a run method");
  }
}

module.exports = Command;
