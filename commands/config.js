new Command({
  title: "Configuration",
  shortDesc: "Configurate me for your server!",
  longDesc: "With this command, you can configure me for your server, such as my prefix, who moderators are, auto-moderation, etc. If you do not specify a value for the option, I will tell you the value (if you have access).",
  call: ["con", "config"],
  usage: "(option) {value(s)}",
  example: "~config prefix !",
  function: function(message, args){
    if(message.guild){
      setupConfig(message.guild.id);
      if(args[0]){
        switch(args[0].toLowerCase()){
          case "prefix": {
            if(args[1]){
              if(message.guild.members.get(message.author.id).hasPermission("ADMINISTRATOR") || message.guild.ownerID === message.author.id){
                if(!(message.mentions.members.size > 0||message.mentions.channels.size > 0||message.mentions.everyone.size > 0 ||message.mentions.roles.size > 0||message.mentions.users.size > 0)){
                  if(args[1].length <= 10){
                    config[message.guild.id].prefix = args[1].toLowerCase();
                    message.guild.members.get(bot.user.id).setNickname(`[ ${config[message.guild.id].prefix} ] LifeBot`).catch(err => {bot.users.get(message.guild.ownerID).send(`${caution}|Oh no! My prefix was changed on **${message.guild.name}**, but I was unable to set my own nickname! Here was the error I got:\`\`\`\n${err}\`\`\``).catch(console.log);});
                    saveConfig(message.guild.id);
                    sendMessage(message, `${check}|You have changed the prefix to **${args[1].toLowerCase()}**`);
                  } else sendMessage(message, `${fail}|Your prefix doesn't need to be longer than 10 characters.`);
                } else sendMessage(message, `${fail}|You cannot have a mention as the prefix!`);
              } else sendMessage(message, `${fail}|You must be an administrator to use this!`);
            } else sendMessage(message, `${info}|The prefix for this server is **${config[message.guild.id].prefix}**`);
          } break;
          case "level": {
            if(args[1]){
              if(message.guild.members.get(message.author.id).hasPermission("ADMINISTRATOR") || message.guild.ownerID === message.author.id){
                switch(args[1].toLowerCase()){
                  case "enable": {
                    config[message.guild.id].leveling.enabled = true;
                    sendMessage(message, `${check}|Leveling now **enabled**!`);
                    saveConfig(message.guild.id);
                  } break;
                  case "disable": {
                    config[message.guild.id].leveling.enabled = false;
                    sendMessage(message, `${check}|Leveling now **disabled**!`);
                    saveConfig(message.guild.id);
                  } break;
                  case "toggle": {
                    config[message.guild.id].leveling.enabled = !config[message.guild.id].leveling.enabled;
                    sendMessage(message, `${check}|Leveling now **${config[message.guild.id].leveling.enabled ? "enabled" : "disabled"}**`);
                    saveConfig(message.guild.id);
                  } break;

                  case "reward": {
                    if(args[2]){
                      if(args[3]){
                        let lvl = Math.floor(Number(args[2]));
                        if(typeof lvl === "number"){
                          if(args[3].toLowerCase() === "remove"){
                            if(config[message.guild.id].leveling.levelRewards[lvl.toString()]){
                              delete config[message.guild.id].leveling.levelRewards[lvl.toString()];
                              sendMessage(message, `${check}|Removed level reward for level **${lvl}**`);
                              saveConfig(message.guild.id);
                            } else sendMessage(message, `${fail}|No level set for level **${lvl}**`);
                          } else {
                            args.shift(); args.shift(); args.shift();
                            let rank;
                            let str = args.join(' ');
                            let found = false;
                            if(message.guild.roles.get(str)){
                              config[message.guild.id].leveling.levelRewards[lvl.toString()] = message.guild.roles.get(str).id;
                              saveConfig(message.guild.id);
                              sendMessage(message, `${check}|Role **${message.guild.roles.get(str).name}** will be given at level **${lvl}**.`);
                              found = true;
                            } else {
                              message.guild.roles.forEach((role, id, map) => {
                                if(role.name.toLowerCase().includes(str.toLowerCase())){
                                  found = true;
                                  config[message.guild.id].leveling.levelRewards[lvl.toString()] = role.id;
                                  saveConfig(message.guild.id);
                                  sendMessage(message, `${check}|Role **${role.name}** will be given at level **${lvl}**.`);
                                  return;
                                } else if(str === `<@&${role.id}>`){
                                  found = true;
                                  config[message.guild.id].leveling.levelRewards[lvl.toString()] = role.id;
                                  saveConfig(message.guild.id);
                                  sendMessage(message, `${check}|Role **${role.name}** will be given at level **${lvl}**.`);
                                  return;
                                }
                              });
                            }
                            if(!found) sendMessage(message, `${fail}|Invalid role.`);
                          }
                        } else sendMessage(message, `${fail}|Invalid level.`);
                      } else sendMessage(message, `${fail}|You must provide the role to target.`);
                    } else sendMessage(message, `${fail}|You must provide a level.`);
                  } break;

                  case "xp": {
                    if(args[2]){
                      let noxp = config[message.guild.id].leveling.noXP;
                      let keys = Object.keys(noxp);
                      switch(args[2].toLowerCase()){
                        case "enable": {
                          args.shift(); args.shift(); args.shift();
                          let arg = args.join(' ').replace(/#+/g, '').replace(/<+/g, '').replace(/>+/g, '').split(/ +/g);
                          for(let i = 0; i < keys.length; i++){
                            for(let x = 0; x < args.length; x++){
                              if(arg[x] === keys[i]){
                                delete config[message.guild.id].leveling.noXP[keys[i]];
                                sendMessage(message, `${check}|XP enabled in **${message.guild.channels.get(keys[i]) ? message.guild.channels.get(keys[i]) : "Channel not located"}**.`);
                                saveConfig(message.guild.id);
                              }
                            }
                          }
                        } break;
                        case "disable": {
                          args.shift(); args.shift(); args.shift();
                          if(args[0]){
                            for(let i = 0; i < args.length; i++){
                              if(message.guild.channels.get(args[i])){
                                config[message.guild.id].leveling.noXP[message.guild.channels.get(args[i]).id] = message.guild.channels.get(args[i]).id;
                                saveConfig(message.guild.id);
                                sendMessage(message, `${check}|XP disabled in **${message.guild.channels.get(args[i])}**.`)
                              } else {
                                message.guild.channels.forEach((channel, id, map) => {
                                  if(args[i] === `<#${channel.id}>`){
                                    config[message.guild.id].leveling.noXP[channel.id] = channel.id;
                                    saveConfig(message.guild.id);
                                    sendMessage(message, `${check}|Xp disabled in **${channel}**`);
                                  }
                                });
                              }
                            }
                          } else sendMessage(message, `${fail}|You must specify a channel to remove.`);
                        } break;
                        default: {
                          sendMessage(message, `${fail}|You must specify whether to enable or disable for the channels.`);
                        } break;
                      }
                    }
                  } break;

                  default: {
                    sendMessage(message, `${fail}|Invalid level option.`);
                  } break;
                }
              } else sendMessage(message, `${fail}|You lack Administration privilege.`);
            } else{
              let embed = new Discord.RichEmbed()
                .setTitle("Leveling Settings")
                .setDescription("Change with ~con level [reward|xp] \nreward:(level) {role}\nxp:[enable|disable] {channel}")
                .setColor(0x0096ff)
                .setAuthor(message.author.tag, message.author.avatarURL)
                .addField("> Enabled ", config[message.guild.id].leveling.enabled);

              let rewards = [];
              let keys = Object.keys(config[message.guild.id].leveling.levelRewards);
              for(let i = 0; i < keys.length; i++){
                rewards.push(`Level ${keys[i]}: ${message.guild.roles.get(config[message.guild.id].leveling.levelRewards[keys[i]]) || "Unable to get role"}`);
              }
              if(rewards.length === 0) rewards.push("None");
              embed.addField("> Level Rewards", rewards.join('\n'));

              let channels = [];
              let key = Object.keys(config[message.guild.id].leveling.noXP);
              for(let i = 0; i < key.length; i++){
                channels.push(`<#${config[message.guild.id].leveling.noXP[key[i]]}>`);
              }
              if(channels.length === 0) channels.push("None");
              embed.addField("> No XP Channels", channels.join(', '));

              sendMessage(message, {embed});
            }
          } break;

          default: {
            sendMessage(message, `${fail}|**${args[0].substring(0, 49)}** is not a valid config property!`);
          } break;
        }
      } else sendMessage(message, `${fail}|You must provide an option to edit/view!`);
    } else sendMessage(message, `${fail}|You must be in a guild to use this!`);
  }
}).register();
