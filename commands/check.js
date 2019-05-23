new Command({
  title: "Check",
  shortDesc: "Check someone's punishment history, if they are in the server, if they are banned, general moderation stuff.",
  longDesc: "Check someone's moderation history. This includes punishments and current strikes. It will tell you if they are in the server, are muted, or are banned.",
  call: "check",
  usage: "[@user|userID|tag]",
  example: "~check Nub#0002",
  function: function(message, args){
    if(message.guild){
      if(args.length > 0){
        if(config[message.guild.id].modroles.includes(message.author.id) || message.member.hasPermission("ADMINISTRATOR") || message.author.id === message.guild.ownerID){
          message.channel.startTyping();
          if(config[message.guild.id].bans[args[0]]){
            let user = config[message.guild.id].bans[args[0]];
            let embed = new Discord.RichEmbed();
            embed.setAuthor(user.tag);
            embed.setColor(0x0096FF);
            embed.setDescription("__***> Banned User <***__");
            embed.addField("> Strikes", config[message.guild.id].moderation.strikes[args[0]] ? config[message.guild.id].moderation.strikes[args[0]] : 0);
            embed.addField("> Reason", user.reason);
            embed.addField("> Until", new Date().setTime(user.until));
            embed.addField("> On", user.banned);
            let banner = bot.users.get(user.by);
            if(banner) embed.addField("> By", banner.tag);
            sendMessage(message, `${check}|Here is information on **${args[0]}**`, {embed});
          } else {
            let targs = findPlayer(args.shift(), message.guild.id);
            targKeys = Object.keys(targs);
            if(targKeys.length > 0){
              if(targKeys.length === 1){
                let targ = targs[targKeys[0]];
                let embed = new Discord.RichEmbed();
                embed.setAuthor(targ.user.tag, targ.user.avatarURL);
                embed.setColor(0x0096FF);
                embed.setThumbnail(targ.user.avatarURL);
                embed.addField("> Is on Guild", targ.member ? "Yes" : "No");
                embed.addField("> Strikes", config[message.guild.id].moderation.strikes[targ.user.id] ? config[message.guild.id].moderation.strikes[targ.user.id] : 0);
                sendMessage(message, `${check}|Here is information on **${targ.user.tag}**`, {embed});
              } else sendMessage(message, `${fail}|More than one target found, please be more specific.`);
            } else sendMessage(message, `${fail}|No targets found.`);
          }
          message.channel.stopTyping(true);
        } else sendMessage(message, `${fail}|You must have the moderator role or be an administrator to use this.`);
      } else sendMessage(message, `${fail}|You must specify an argument.`);
    } else sendMessage(message, `${fail}|You must be in a guild to use this.`)
  }
}).register();
