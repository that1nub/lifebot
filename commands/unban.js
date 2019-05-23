new Command({
  title: "Unban",
  shortDesc: "Unban someone from the guild.",
  longDesc: "Unban someone from the guild.",
  call: "unban",
  usage: "[@user|userID|tag] (reason)",
  example: "~unban @Nub#0002 Approved ban appeal.",
  function: function(message, args){
    if(message.guild){
      let user = message.member;
      if(config[message.guild.id].modroles.includes(message.author.id) || user.hasPermission("BAN_MEMBERS") || user.hasPermission("ADMINISTRATOR") || message.author.id === message.guild.ownerID){
        if(args.length > 0){
          let targ = args.shift();
          message.guild.unban(targ, (args.length > 0) ? args.join(" ") : "No reason specified").then(() => {
            sendMessage(message, `${check}|**${config[message.guild.id].bans[targ].tag}** is now unbanned.`);
            config[message.guild.id].bans[targ] = undefined;
            saveConfig(message.guild.id);
          }).catch(err => {
            sendMessage(message, `${fail}|Something went wrong while trying to unban: **${err}**`);
          });
        } else sendMessage(message, `${fail}|You must specify an argument.`)
      } else sendMessage(message, `${fail}|You don't have permissions required to unban people!`);
    } else sendMessage(message, `${fail}|You must be on a guild to use this!`)
  }
}).register();
