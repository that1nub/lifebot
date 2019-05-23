new Command({
  title: "Help",
  shortDesc: "Get help on what the commands are, or a specific command.",
  longDesc: "Get help on what all the commands are, or a specific command.",
  call: "help",
  usage: "{command|page}",
  example: "~help config",
  function: function(message, args){
    let embed = new Discord.RichEmbed();
    embed.setColor(0x0096FF);
    embed.setFooter(message.author.username);
    embed.setTimestamp();

    let pageCount = Math.ceil(command.length/10);
    let pageSel = clamp(parseInt(args[0]) - 1, 0, pageCount);
    if(typeof pageSel !== "number" || !(pageSel > -Infinity && pageSel < Infinity) && args[0]){
      pageSel = args.join(' ').toLowerCase();
    }
    if(!pageSel){
      pageSel = 0;
    }

    pageSel = (typeof pageSel === "number") ? clamp(pageSel, 0, pageCount - 1) : pageSel;

    let worked = false;

    if(typeof pageSel === "number"){
      worked = true;
      embed.setTitle("Help: Page " + (pageSel + 1));
      embed.setDescription("Displaying commands page **" + (pageSel + 1) + "**. Page **" + (pageSel + 1) + "**/" + pageCount + "; **" + command.length + "** commands (Some may be hidden if you don't have access to them).");
      let printed = 0;
      for(let i = clamp(pageSel * 10, 0, command.length - (command.length % 10)); i < command.length; i++){
        let cmd = command[i];
        if(!cmd) break;
        let show = true;
        if(cmd.can.length > 0){
          show = false;
          for(let y = 0; y < cmd.can.length; y++){
            if(cmd.can[y] === message.author.id){show = true; break;}
          }
        }
        if(show){
          if(printed < 10){
            printed++;
            let calls = (typeof cmd.call === "string") ? cmd.call : cmd.call.join(', ');
            embed.addField(`> ${cmd.title}`, `${cmd.shortDesc}\n**Command**: ${calls}\n**Usage**: ${cmd.usage}${(cmd.example) ? "\n**Example**: `" + cmd.example + "`" : ""}`);
          } else break;
        }
      }
    } else if (typeof pageSel === "string"){
      let cmd;
      for(let i = 0; i < command.length; i++){
        if(pageSel === command[i].title.toLowerCase()){cmd = command[i]; break;}
        if(typeof command[i].call === "string"){
          if(pageSel === command[i].call){cmd = command[i]; break;}
        } else {
          for(let y = 0; y < command[i].call.length; y++){
            if(pageSel === command[i].call[y]){cmd = command[i]; break;}
          }
        }
      }
      if(cmd){
        let show = true;
        if(cmd.can.length > 0){
          show = false;
          for(let i = 0; i < cmd.can.length; i++){
            if(cmd.can[i] === message.author.id){show = true; break;}
          }
        }
        if(show){
          worked = true;
          embed.setTitle("Help: " + cmd.title);
          embed.setDescription("Showing help for command **" + cmd.title + "**:\n" +
          `${cmd.longDesc}\n**Command**: ${(typeof cmd.call === "string") ? cmd.call : cmd.call.join(', ')}\n**Usage**: ${cmd.usage}\n**Example**: \`${(cmd.example) ? cmd.example : "No example for this command."}\``);
        }
      }
    }

    if(!worked){
      embed.setTitle("Unknown command");
      embed.setDescription("Unabled to find command **" + pageSel + "**");
    }

    sendMessage(message, {embed});
  }
}).register();
