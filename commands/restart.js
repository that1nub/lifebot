new Command({
  title: "Restart",
  shortDesc: "Restart the bot.",
  longDesc: "Restart the bot.",
  call: ['restart', 'kill'],
  can: devs,
  function: function(message){
    sendMessage(message, check + "|Restarting...").then(() => {process.exit(1);});
  }
}).register();
