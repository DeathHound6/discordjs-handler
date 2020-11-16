const { Client, User } = require("discord.js");
const SQLiteProvider = require("./data/SQLiteProvider");
const Registry = require("./Registry");

class HandlerClient extends Client {
  constructor(baseOptions = {}, { defaultPrefix = "!", owners = [] }) {
    super(baseOptions);

    if (typeof defaultPrefix != "string")
      throw new TypeError("Client property `defaultPrefix` must be a string");
    this.defaultPrefix = defaultPrefix;

    if (!(owners instanceof Array) || !(owners instanceof Set))
      throw new TypeError(
        "Client property `owners` must be an instance of an Array or a Set"
      );
    this.owners = owners;

    this.registry = new Registry(this);
  }

  get registry() {
    return this.registry;
  }

  get provider() {
    return this.provider;
  }

  set provider(provider) {
    if (!provider instanceof SQLiteProvider)
      throw new TypeError(
        "Client property `provider` must be an instance of an SQLiteProvider"
      );

    if (this.provider) this.provider.destroy();
    this.provider = provider;
  }

  get owners() {
    return this.owners;
  }

  isOwner(author) {
    author = this.users.resolve(author);
    if (!(author instanceof User))
      throw new TypeError(
        "Client `isOwner` method parameter 'author' must resolve to a User"
      );
    return this.owners instanceof Array
      ? this.owners.includes(author.id)
      : this.owners.has(author.id);
  }

  async destroy() {
    this.provider ? await this.provider.destroy() : null;
    await super.destroy();
  }
}

module.exports = HandlerClient;
