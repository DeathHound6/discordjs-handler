const Client = require("../Client");

class SQLiteProvider {
  constructor(client, db) {
    if (!client instanceof Client)
      throw new TypeError(
        "SQLiteProvider property `client` must be an instance of a HandlerClient"
      );
    this.client = client;

    this.db = db;
  }
  run(sql) {
    return this.db.run(sql);
  }

  updateGuildPrefix(guild, prefix) {
    if (!guild)
      throw new ReferenceError(
        "SQLiteProvider `updateGuildPrefix` method requires ‘guild‘ parameter to be specified"
      );

    guild = this.client.guilds.resolve(guild);

    if (!guild)
      throw new TypeError(
        "SQLiteProvider `updateGuildPrefix` method failed to resolve specified ‘guild‘ parameter to a Guild object"
      );

    if (!prefix)
      throw new ReferenceError(
        "SQLiteProvided `updateGuildPrefix` method requires ‘prefix‘ parameter to be specified"
      );
    if (
      this.run(
        `UPDATE prefixes SET prefix = ${prefix} WHERE guild = ${guild.id}`
      )
    )
      return prefix;
  }

  getGuildPrefix(guild) {
    if (!guild)
      throw new ReferenceError(
        "SQLiteProvider `getGuildPrefix` method requires ‘guild‘ parameter to be specified"
      );

    guild = this.client.guilds.resolve(guild);

    if (!guild)
      throw new TypeError(
        "SQLiteProvider `getGuildPrefix` method failed to resolve specified ‘guild‘ parameter to a Guild object"
      );

    return this.run(`SELECT prefix FROM prefixes WHERE guild = ${guild.id}`);
  }

  init() {
    this.run(
      `CREATE TABLE IF NOT EXISTS prefixes(guild varchar(18), prefix varchar(MAX))`
    );
  }

  destory() {
    this.db = null;
    this.client = null;
    return;
  }
}

module.exports = SQLiteProvider;
