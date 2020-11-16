const { Structures } = require("discord.js");

module.exports = Structures.extend("Guild", Guild => {
  class HandlerGuild extends Guild {
    constructor(...data) {
      super(...data);
      
      this.prefix;
    }
    
    get prefix() {
      this.prefix = this.client.provider.getGuildPrefix(this.id);
      if (!this.prefix) this.prefix = this.client.defaultHandler;
      return this.prefix;
    }
    
    set prefix(prefix) {
      if (!prefix)
        throw new ReferenceError(
          "Guild property `prefix` must be specified when being set"
        );
      return this.client.provider.updateGuildPrefix(this, prefix);
    }
  }
  return HandlerGuild;
});
