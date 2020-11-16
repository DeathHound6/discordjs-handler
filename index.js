module.exports = {
  Client: require("./src/Client"),
  Command: require("./src/structures/Command"),
  CommandGroup: require("./src/structures/CommandGroup"),
  Event: require("./src/structures/Event"),
  Guild: require("./src/structures/Guild"),
  Message: require("./src/structures/Message"),
  
  SQLiteProvider: require("./src/data/SQLiteProvider"),
  
  Version: require("./package").version
}