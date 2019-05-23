new Command({
  title: "Reload Command",
  shortDesc: "Reload commands for updating them.",
  longDesc: "Reload commands for updating them. Keep in mind, you can't target by title or what you say to call it, you must say the file name in the bot's directory (without .js)",
  call: "reload",
  usage: "(file)",
  example: "~reload command_reload",
  can: devs,
  function: function(message, args){
    if(args[0]){
      try {
        delete require.cache[require.resolve('./' + args[0] + '.js')]
        require('./' + args[0] + '.js');
        sendMessage(message, check + "|Reloaded!");
      } catch(err) {
        sendMessage(message, fail + "|Error loading \"commands/" + args[0] + ".js\"```\n" + err.stack + "```");
      }
    } else {
      sendMessage(message, fail + "|You must specify the command file");
    }
  }
}).register();
