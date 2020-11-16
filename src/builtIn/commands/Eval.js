const Command = require("../../structures/Command");

class EvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      description: "Execute JavaScript code",
      ownerOnly: true,
      commandGroup: "Utility"
    });
  }
  async run(msg, args) {
    if (!args[0]) return msg.reply("Provide JavaScript code to run");
    let output = eval(args.join(" "));
    if (typeof output !== "string") output = require("util").inspect(output);
    msg.reply(output, { code: "js", split: "\n" });
  }
}

module.exports = EvalCommand;
