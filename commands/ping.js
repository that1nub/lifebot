new Command({
  title: "Ping",
  shortDesc: "The bot will respond if it's running.",
  longDesc: "The bot will respond with how long it takes to respond.",
  call: "ping",
  function: function(message, args){
    sendMessage(message, info + "|Pinging...").then(function(newMsg){
      if(notice) newMsg.edit(info + check + "|Pong! **" + Math.round(newMsg.createdTimestamp - message.createdTimestamp) + "**ms \n" + info + "|**" + Math.round(newMsg.createdTimestamp - message.createdTimestamp - bot.ping) + "**ms bot ping \n" + info + "|**" + Math.round(bot.ping) + "**ms websocket ping\n\nNotice from developers: " + notice).catch(console.log);
      else newMsg.edit(info + check + "|Pong! **" + Math.round(newMsg.createdTimestamp - message.createdTimestamp) + "**ms \n" + info + "|**" + Math.round(newMsg.createdTimestamp - message.createdTimestamp - bot.ping) + "**ms bot ping \n" + info + "|**" + Math.round(bot.ping) + "**ms websocket ping").catch(console.log);
    });
  }
}).register();
