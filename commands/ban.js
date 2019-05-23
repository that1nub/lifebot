new Command({
  title: "Ban",
  shortDesc: "Ban someone on the guild.",
  longDesc: "Ban someone who misbehaves on the guild.",
  call: "ban",
  usage: "[@user|userID|tag] {time} (reason)",
  example: "~ban @Nub#0002 1d Disobeying the rules.",
  function: function(message, args){
    if(message.guild){
      let user = message.member;
      if(config[message.guild.id].modroles.includes(message.author.id) || user.hasPermission("BAN_MEMBERS") || user.hasPermission("ADMINISTRATOR") || message.author.id === message.guild.ownerID){
        if(args.length > 0){
          let targs = findPlayer(args.shift().toLowerCase(), message.guild.id);
          targs.length = Object.keys(targs).length;
          if(targs.length > 0){
            if(targs.length === 1){
              let targ = targs[Object.keys(targs)[0]].member;
              if(targ.bannable){
                if(user.highestRole.calculatedPosition > targ.highestRole.calculatedPosition){
                  if(!(targ.hasPermission("ADMINISTRATOR") || targ.id === message.guild.ownerID)){
                    if(args.length > 0){
                      let time = parseTime(args.shift());
                      if(time){
                        let reason = (args.length > 0) ? args.join(' ') : "No reason specified.";
                        config[message.guild.id].bans[targ.id] = {
                          tag: targ.user.tag,
                          id: targ.id,
                          banned: Date.now(),
                          until: Date.now() + time,
                          length: time,
                          reason: reason,
                          by: message.author.id
                        };
                        saveConfig(message.guild.id);
                        targ.user.send(`You have been banned from **${message.guild.name}**\nReason: ${reason}\nWhom: ${message.author.tag} (${message.author.id})\nFor: ${formatTime(config[message.guild.id].bans[targ.id].length, "**$day**d **$hr**h **$min**m **$sec**s")}`).catch(console.log);
                        targ.ban(7, reason).then(() => {
                          sendMessage(message, `${check}|**${targ.user.tag}** has been banned.`);
                        }).catch((err) => {
                          sendMessage(message, `${fail}|Something went wrong while attempting to ban: **${err}**`);
                        });
                      } else sendMessage(message, `${fail}|You must provide a valid time.`);
                    } else sendMessage(message, `${fail}|You must provide the length of the ban!`)
                  } else sendMessage(message, `${fail}|You can't ban an administrator!`);
                } else sendMessage(message, `${fail}|This target has a higher (or equal to) role position than you!`);
              } else sendMessage(message, `${fail}|I don't have access to banning this target, either you have to yourself or have my role moved higher than the person you're kicking.`);
            } else sendMessage(message, `${fail}|More than one targets found! Please be more specific or @ them/use their ID.`);
          } else sendMessage(message, `${fail}|I wasn't able to target anyone.`);
        } else sendMessage(message, `${fail}|You must specify a target.`)
      } else sendMessage(message, `${fail}|You don't have permissions required to ban people!`);
    } else sendMessage(message, `${fail}|You must be on a guild to use this!`)
  }
}).register();
