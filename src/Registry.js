const Command = require("./structures/Command");
const Event = require("./structures/Event");
const Group = require("./structures/CommandGroup");
const { readdirSync } = require("fs");
const { Collection } = require("discord.js");

class Registry {
  constructor(client) {
    this.client = client;

    this.commands = new Collection();

    this.events = new Collection();

    this.groups = new Collection();

    let gr = readdirSync(`${__dirname}/builtIn/`);
    for (let i = 0; i < gr.length; i++) {
      let struct = readdirSync(`${__dirname}/builtIn/${gr[i]}/`);
      for (let j = 0; j < struct.length; j++) {
        this._registerStructure(struct[j]);
      }
    }
  }

  _registerStructure(structure) {
    if (typeof structure == "function") structure = new structure(this.client);
    if (structure instanceof Command) this.registerCommand(structure);
    else if (structure instanceof Event) this.registerEvent(structure);
    else if (structure instanceof Group) this.registerGroup(structure);
    else
      throw new TypeError(
        "Registry `_registerStructure` method parameter 'structure' must resolve to a Command, Event or CommandGroup"
      );
    return this;
  }

  registerGroup(group) {
    if (typeof group == "function") group = new group(this.client);
    if (group instanceof Array)
      group = new Group(this.client, { name: group[0] });
    if (!(group instanceof Group))
      throw new TypeError(
        "Registry `registerGroup` method parameter 'group' must resolve to a CommandGroup"
      );
    if (this.groups.find(grp => grp == group))
      throw new RangeError(
        "Registry `registerGroup` method, this Group already exists: " +
          group.name
      );
    this.groups.set(group.name, group);
    this.client.emit("groupRegistered", group);
    return this;
  }

  registerGroups(groups) {
    if (!(groups instanceof Array))
      throw new TypeError(
        "Registry `registerGroups` method parameter 'groups' must be an Array"
      );
    if (
      !groups.every(
        e => e instanceof Array && e.length == 1 && typeof e[0] == "string"
      )
    )
      throw new TypeError(
        "Registry `registerGroups` method parameter 'groups' must contain Arrays with only 1 string inside"
      );
    groups.each(grp => {
      this.registerGroup(grp);
    });
    return this;
  }

  registerCommand(command) {
    if (typeof command == "function") command = new command(this.client);
    if (!(command instanceof Command))
      throw new TypeError(
        `Registry \`registerCommand\` method parameter 'command' must resolve to a Command`
      );
    if (this.commands.find(cmd => cmd.name == command.name))
      throw new RangeError(
        "Registry `registerCommand` method, an Command with this name already exist: " +
          command.name
      );
    this.commands.set(command.name, command);
    this.client.emit("commandRegistered", command);
    return this;
  }

  registerCommands(commandDir) {
    let obj = require("require-all")(commandDir);
    for (let command of Object.values(obj)) {
      if (typeof command == "function") command = new command(this.client);
      this.registerCommand(command);
    }
    return this;
  }

  registerEvent(event) {
    if (typeof event == "function") event = new event(this.client);
    if (!(event instanceof Event))
      throw new TypeError(
        `Registry \`registerEvent\` method parameter 'event' must resolve to an Event`
      );
    if (this.events.find(ev => ev == event))
      throw new RangeError(
        "Registry `registerEvent` method, this Event already exists: " +
          event.name
      );
    this.events.set(event.name, event);
    this.client.emit("eventRegistered", event);
    event.emitter.on(event.name, (...args) => event.run(...args));
    return this;
  }

  registerEvents(eventDir) {
    let obj = require("require-all")(eventDir);
    for (let event of Object.values(obj)) {
      if (typeof event == "function") event = new event(this.client);
      this.registerEvent(event);
    }
    return this;
  }
}

module.exports = Registry;
