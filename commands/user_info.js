new Command({
  title: "User Information",
  shortDesc: "Get information on a user.",
  longDesc: "Get information on a user both relative to them and the guild. This includes when they joined the guild or when they joined Discord.",
  call: ['user', 'userinfo', 'userinformation'],
  example: '~user @Nub#0002',
  function: function(message, args){
    let user;
    let member;
    if(args.length === 0){
      user = message.author;
      member = message.member;
    } else {
      let targ = findPlayer(args.join(' ').toLowerCase(), message.guild.id);
      let keys = Object.keys(targ);
      if(keys.length > 0){
        if(keys.length === 1){
          user = targ[keys[0]].user;
          if(targ[keys[0]].member) member = targ[keys[0]].member;
        } else {
          sendMessage(message, `${fail}|More than one target found, please be more specific.`);
          return;
        }
      } else {
        sendMessage(message, `${fail}|You must mention a valid user/userid.`);
        return;
      }
    }
    if(user !== undefined){
      let embed = new Discord.RichEmbed()
        .setTimestamp()
        .setColor(0x0096ff)
        .setTitle('Information')
        .setAuthor(user.username, user.avatarURL, user.avatarURL)
        .setThumbnail(user.avatarURL);

      let str = '';

      let name = "**" + user.username + "#" + user.discriminator + "** (" + user.id + ")";
      let status = user.presence.status;
      let emote;
      switch(status){
        case "online": emote = online; break;
        case "available": emote = online; break;
        case "idle": emote = away; break;
        case "dnd": emote = dnd; break;
        default: emote = offline; break;
      }
      let stat = emote + " " + status;
      let created = user.createdAt + " (" + formatTime(message.createdTimestamp - user.createdTimestamp, '**$day**d **$hour**h **$min**m ago') + ")";
      str += "•Name: " + name + "\n";
      str += "•Status: " + stat + "\n";
      str += "•Profile created: " + created;
      if(message.guild && member){
        let nick = member.displayName;
        let joined = member.joinedAt + " (" + formatTime(message.createdTimestamp - member.joinedTimestamp, '**$day**d **$hour**h **$min**m ago') + ")";
        let roles = member.roles.array();

        let channels = config[message.guild.id].msgs[member.id];
        let userIDs = Object.keys(channels);
        let arrayToSort = [];
        for(let i = 0; i < userIDs.length; i++) {
          arrayToSort[i] = {count: channels[userIDs[i]], id: userIDs[i]};
        }
        arrayToSort.sort(
          (a, b) => {
            return b.count - a.count;
          }
        );

        let favChannel = arrayToSort[0];
        let channel = member.guild.channels.get(favChannel.id);

        str += "\n\n**--GUILD INFORMATION--**\n";
        str += "•Nickname: " + nick + "\n";
        str += "•Joined on: " + joined + "\n";
        str += "•Role count: " + (roles.length - 1) + "\n";
        str += "•Highest role: " + member.highestRole + "\n";
        str += "•Hoist role: " + member.hoistRole + "\n";
        str += "•Color: " + member.displayHexColor + "\n";
        if(channel){
          str += "•Favorite channel: " + channel + " with **" + favChannel.count + "** messages";
        }
        embed.setColor(member.displayHexColor);
      }
      embed.setDescription(str);
      embed.setFooter(bot.users.get(message.author.id).username);
      sendMessage(message, {embed});
    } else sendMessage(message, fail + "|You must mention a valid user/userid.");
  }
}).register();
