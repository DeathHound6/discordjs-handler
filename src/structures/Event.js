const Client = require("../Client");
const events = require("events");

class Event {
  constructor(client, { name, emitter }) {
    if (!client instanceof Client)
      throw new TypeError(
        "Event property `client` must be an instance of a HandlerClient"
      );
    this.client = client;

    if (typeof name != "string")
      throw new TypeError("Event property `name` must be a string");
    this.name = name;

    if (!emitter instanceof events)
      throw new TypeError(
        "Event property `emitter` must be an instance of an EventEmitter"
      );
  }
  run() {
    throw new ReferenceError("Base Event does not have a run method");
  }
}

module.exports = Event;
