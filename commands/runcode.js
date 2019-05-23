new Command({
  title: "Run",
  shortDesc: "Run code as a string without having to create a command wasting bot usage.",
  longDesc: "Run code as a string without having to create a command wasting bot usage, or having to restart the bot.",
  can: devs,
  call: "run",
  usage: "{code}",
  example: "~run 2 + 2",
  function: function(message, args){
    if(args.length > 0){
      try {
        let ret = eval(args.join(' ').replace("```js", "").replace(/```/g, "").replace(/THIS_GUILD/g, "\"" + message.guild.id + "\"").replace(/THIS_CHANNEL/g, "\"" + message.channel.id + "\"").replace(/THIS_MESSAGE/g, "\"" + message.id + "\"").replace(/ME/g, "\"" + message.author.id + "\""));
        if(ret !== undefined && String(ret).length < 1800) sendMessage(message, `${check}|Ran successfully! Here is what I got:\`\`\`js\n${(typeof ret === "object") ? JSON.stringify(ret, null, 2) : ret}\`\`\``);
        else sendMessage(message, `${check}|Ran successfully! No return value determined, or it was too large to display.`);
      } catch(err) {
        sendMessage(message, `${fail}|Something went wrong! \`\`\`\n${err.stack}\`\`\``);
      }
    } else sendMessage(message, `${fail}|You must put some code.`);
  }
}).register();
