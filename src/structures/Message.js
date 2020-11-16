const { Structures } = require("discord.js");

module.exports = Structures.extend("Message", Message => {
  class HandlerMessage extends Message {
    constructor(...data) {
      super(...data);
      
      this.command = null;
    }
  }
  return HandlerMessage;
});
