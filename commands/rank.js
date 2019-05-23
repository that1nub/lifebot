new Command({
  title: "Rank",
  shortDesc: 'Shows your rank card for the current server.',
  longDesc: 'Shows your rank card for the current server. How it works: You get 5 XP for a message. You can only get XP once a minute.',
  call: ['rank', 'level'],
  usage: '[progress] | [@user|id|tag]',
  example: '~rank @Nub#0002',
  function: function(message, args){
    function makeImg(ply){
      setupConfig(message.guild.id);
      message.channel.startTyping(10);
      new Jimp(300, 100, 0x00000000, (err, img) => {
        if(err) sendMessage(message, caution + "|Error: " + err);

        function text(t, x, y, width, height){
          img.print(whiteText, x, y, {
            text: t,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
          }, width, height);
        }
        function textNC(t, x, y){
          img.print(whiteText, x, y, {text: t});
        }
        function btext(t, x, y, width, height){
          img.print(blackText, x, y, {
            text: t,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
          }, width, height);
        }

        function box(posX, posY, sizeX, sizeY, color){
          for(let x = posX; x < posX + sizeX; x++){
            for(let y = posY; y < posY + sizeY; y++){
              img.setPixelColor(color, x, y);
            }
          }
        }

        function circle(posX, posY, rad, color){
          for(let x = posX - rad; x < posX + rad; x++){
            for(let y = posY - rad; y < posY + rad; y++){
              if(dist(x, y, posX, posY) < rad){
                img.setPixelColor(color, x, y);
              }
            }
          }
        }

        Jimp.read(bot.users.get(ply).avatarURL + "?size=64", (err, avatar) => {
          let backColor = data[ply].profile.color;

          box(0, 0, 300, 100, backColor);
          box(6, 6, 288, 88, 0x646464ff);

          box(12, 12, 76, 76, backColor);
          avatar.resize(64, 64);
          img.blit(avatar, 18, 18);

          box(94, 12, 194, 76, backColor);
          box(100, 18, 182, 64, 0x323232ff);
          box(106, 50, 170, 26, 0x646464ff);

          if(!config[message.guild.id].leveling.levels[ply]){
            config[message.guild.id].leveling.levels[ply] = {level: 1, xp: 0, totalxp: 0, lastGained: 0};
            saveConfig(message.guild.id);
          }

          let lvl = config[message.guild.id].leveling.levels[ply].level;
          let xp = config[message.guild.id].leveling.levels[ply].xp;
          let xptolvl = (5 * lvl) + 30;

          box(106, 50, 170 * (xp/xptolvl), 26, backColor);

          text(`Level: ${lvl} | XP: ${xp}/${xptolvl}`, 100, 18, 182, 32);

          img.getBufferAsync(Jimp.MIME_PNG).then(imgData => {
            sendMessage(message, file + "|**" + bot.users.get(ply).username + "**'s rank card", {files: [imgData]});
            message.channel.stopTyping(true);
          }).catch(err => {
            sendMessage(message, fail + caution + "|Error uploading image, please try again. ```\n" + err + '```');
            message.channel.stopTyping(true);
          });
        });
      });
    }
    if(message.guild){
      if(config[message.guild.id].leveling.enabled){
        if(args[0] && args[0] === "progress"){
          let ply;
          if(message.mentions && message.mentions.members) ply = message.mentions.members.first();
          if(!ply) ply = message.guild.members.get(args[1]);
          if(!ply) ply = message.member;

          let member = config[message.guild.id].leveling.levels[ply.id];
          if(!member) member = {level: 1, xp: 0};
          let xp = member.xp;
          let lvl = member.level;
          let xptolvl = (5 * lvl) + 30;
          let neededxp = xptolvl - xp;
          let neededmsgs = Math.ceil(neededxp / 5);
          let completion = (100 * (xp / xptolvl)).toFixed(1);
          sendMessage(message, info + "|**" + ply.displayName + `**'s level progress:\n•Current level: **${lvl}**\n•Messages to level: **${neededmsgs}**\n•XP to level: **${neededxp}**\n•Percentage of completion: **${completion}%**`);
        } else {
          let ply;
          if(message.mentions && message.mentions.members) ply = message.mentions.members.first();
          if(!ply) ply = message.guild.members.get(args[0]);
          if(!ply) ply = message.member;
          makeImg(ply.id);
        }
      } else sendMessage(message, fail + info + '|The leveling plugin is disabled on this guild.');
    } else sendMessage(message, fail + "|You must be in a guild to use this command.");
  }
}).register();
