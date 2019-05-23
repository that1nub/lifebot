new Command({
  title: "Guild Information",
  shortDesc: "Retrieve information about the guild.",
  longDesc: "Retrieve information about the guild such as when it was made or who owns it.",
  call: ['server', 'serverinfo', 'serverinformation', 'guild', 'guildinfo', 'guildinformation'],
  function: function(message, args){
    if(message.guild){
      let embed = new Discord.RichEmbed()
        .setTitle('Guild Information')
        .setColor(0x0096FF)
        .setFooter(bot.users.get(message.author.id).username)
        .setTimestamp();

      let serverOwner = bot.users.get(message.guild.ownerID).username + "#" + bot.users.get(message.guild.ownerID).discriminator;
      let createdAt = message.guild.createdAt + formatTime(message.createdTimestamp - message.guild.createdTimestamp, " (**$day**d **$hour**h **$min**m ago)");
      let roles = message.guild.roles.array().length;
      let channels = message.guild.channels.array();
      let members = message.guild.members.array();
      let emotes = message.guild.emojis.array().length;
      let region = message.guild.region;
      let name = message.guild.name + " (" + message.guild.id + ")";

      let text = 0;
      let voice = 0;
      let category = 0;
      let c = Object.keys(channels);

      for(let i = 0; i < channels.length; i++){
        switch(channels[c[i]].type){
          case "text": text++; break;
          case "voice": voice++; break;
          case "category": category++; break;
        }
      }

      let online = 0;
      let offline = 0;
      let bots = 0;
      let m = Object.keys(members);

      for(let i = 0; i < members.length; i++){
        if(!members[m[i]].user.bot){
          switch(members[m[i]].presence.status){
            case "offline": offline++; break;
            default: online++; break;
          }
        } else {
          bots++;
        }
      }

      let verification = "Somehow I didn't retrieve a verification level..";
      switch(message.guild.verificationLevel){
        case 0: verification = "No verification."; break;
        case 1: verification = "__Low__: *Verified email on account*"; break;
        case 2: verification = "__Medium__: *Verified email & member of Discord for more than 5 minutes*"; break;
        case 3: verification = "__High__: *Verified email & member of Discord 5+ min & on this guild more than 10 minutes*"; break;
        case 4: verification = "__Ultra__: *Verified email & member of Discord 5+ min & on this guild 10+ min & verified phone*"; break;
      }

      let explicit = "Somehow I didn't retrieve an explicit content filter level..";
      switch(message.guild.explicitContentFilter){
        case 0: explicit = 'Scan no one\'s messages'; break;
        case 1: explicit = 'Scan member\'s messages without a role'; break;
        case 2: explicit = 'Scan everyone\'s messages'; break;
      }

      embed.addField('Guild owner:', serverOwner);
      embed.addField('Guild name:', name);
      embed.addField('Guild created:', createdAt);
      embed.addField('Counting roles/channels/members', "***Roles***: __**" + roles + "**__\n***Channels***: *Text*: __**" + text + "**__, *Voice*: __**" + voice + "**__, *Category*: __**" + category + "**__, *Total*: __**" + (text + voice + category) + "**__\n***Members***: *Online*: __**" + online + "**__, *Offline*: __**" + offline + "**__, *Bots*: __**" + bots + "**__, *Total*: __**" + (online + offline + bots) + "**__\n***Emotes***: __**" + emotes + "**__");
      embed.addField('Verification level:', verification);
      embed.addField('Region:', region);
      embed.addField('Explicit Content Filter:', explicit);
      sendMessage(message, {embed});
    } else sendMessage(message, fail + "|You must be on a server to use this.");
  }
}).register();
