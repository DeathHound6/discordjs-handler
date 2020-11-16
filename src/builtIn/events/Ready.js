const Event = require("../../structures/Event");

class ReadyEvent extends Event {
  constructor(client) {
    super(client, { name: "ready", emitter: client });
  }
  async run() {
    this.client.guilds.cache.each(
      g =>
        (g.prefix = this.provider
          ? this.provider.getGuildPrefix(g.id)
          : this.client.defaultPrefix)
    );
  }
}

module.exports = ReadyEvent;
