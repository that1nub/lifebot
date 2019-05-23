new Command({
  title: "Kick",
  shortDesc: "Kick someone off the guild.",
  longDesc: "Kick someone off of the guild for their behavior.",
  call: "kick",
  usage: "[@user|userID|tag] (reason)",
  example: "~kick @Nub#0002 Disobeying the rules.",
  function: function(message, args){
    if(message.guild){
      let user = message.member;
      if(config[message.guild.id].modroles.includes(message.author.id) || user.hasPermission("KICK_MEMBERS") || user.hasPermission("ADMINISTRATOR") || message.author.id === message.guild.ownerID){
        let targs = findPlayer(args.shift().toLowerCase(), message.guild.id);
        targs.length = Object.keys(targs).length;
        if(targs.length > 0){
          if(targs.length === 1){
            let targ = targs[Object.keys(targs)[0]].member;
            if(targ.kickable){
              if(user.highestRole.calculatedPosition > targ.highestRole.calculatedPosition){
                if(!(targ.hasPermission("ADMINISTRATOR") || targ.id === message.guild.ownerID)){
                  let reason = (args.length > 0) ? args.join(' ') : "No reason specified.";
                  targ.user.send(`You have been kicked from **${message.guild.name}**\nReason: ${reason}\nWhom: ${message.author.tag} (${message.author.id})`).catch(console.log);
                  targ.kick(reason).then(() => {
                    sendMessage(message, `${check}|**${targ.user.tag}** has been kicked.`);
                  }).catch(err => {
                    sendMessage(message, `${fail}|Something went wrong while attempting to kick: **${err}**`)
                  });
                } else sendMessage(message, `${fail}|You can't kick an administrator!`);
              } else sendMessage(message, `${fail}|This target has a higher (or equal to) role position than you!`);
            } else sendMessage(message, `${fail}|I don't have access to kicking this target, either you have to yourself or have my role moved higher than the person you're kicking.`);
          } else sendMessage(message, `${fail}|More than one targets found! Please be more specific or @ them/use their ID.`);
        } else sendMessage(message, `${fail}|I wasn't able to target anyone.`);
      } else sendMessage(message, `${fail}|You don't have permissions required to kick people!`);
    } else sendMessage(message, `${fail}|You must be on a guild to use this!`)
  }
}).register();
