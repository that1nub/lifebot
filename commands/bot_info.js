let getSize = require('get-folder-size');
new Command({
  title: "Bot Information",
  shortDesc: "Get some information about the bot.",
  longDesc: "Get some information about LifeBot, such as when it was originally created, when it was made public, how large it is, things like that (for the nerds really :^) )",
  call: ['bot', 'botinfo', 'botinformation'],
  function: function(message, args){
    getSize('./', (err, size) => {
      let gottenSize = (err) ? "Unable to recieve size" : `${(size / 1024 / 1024).toFixed(2)} MB (${(size / 1024).toFixed(2)} KB (${size} Bytes (${size * 8} Bits)))`;
      let embed = new Discord.RichEmbed()
        .setTitle("Bot Information")
        .setDescription("Displaying information about LifeBot")
        .setColor(0x0096FF)
        .setFooter(message.author.username)
        .setTimestamp()
        .addField('> When was LifeBot created?', bot_created)
        .addField('> When did LifeBot become public?', bot_public)
        .addField('> How large is LifeBot?', gottenSize)
        .addField('> What version is LifeBot on?', bot_version)
        .addField('> I have a problem with LifeBot/want to give feedback!', bot_support)
        .addField('> I want to invite LifeBot to my server, how can I do that?', bot_invite)
        .addField('> I want to visit LifeBot\'s website, what\'s the link?', 'http://' + bot_website + '/')
        .addField('> I want to help test LifeBot as a beta tester, how do I do that?', "https://goo.gl/forms/PUQFOvKPlzH1geZD2 (You have to be on LifeBot's official Discord)")
        .addField('> I want to keep up to date with features and what is going on, where\'s that?', bot_repository)
        .addField('> How many commands have been ran?', commands.ran)
        .addField('> How many people have used LifeBot?', Object.keys(data).length - 1)
        .addField('> How much money has been earned by players?', "$" + commands.earned.toFixed(2))
        .addField('> How many guilds is LifeBot in?', bot.guilds.array().length)
        .setURL('http://' + bot_website + '/');

      let ownerT = [];
      for(let i = 0; i < owners.length; i++){
        if(bot.users.get(owners[i]) !== undefined){
          ownerT.push(bot.users.get(owners[i]).username + "#" + bot.users.get(owners[i]).discriminator);
        }
      }
      let devT = [];
      for(let i = 0; i < developers.length; i++){
        if(bot.users.get(developers[i]) !== undefined){
          devT.push(bot.users.get(developers[i]).username + "#" + bot.users.get(developers[i]).discriminator);
        }
      }
      let testerT = [];
      for(let i = 0; i < testers.length; i++){
        if(bot.users.get(testers[i]) !== undefined){
          testerT.push(bot.users.get(testers[i]).username + "#" + bot.users.get(testers[i]).discriminator);
        }
      }

      embed.addField("> Who owns LifeBot?", ownerT.join(', '));
      embed.addField("> Who helped develop LifeBot?", devT.join(', '));
      embed.addField("> Who are the current beta testers of LifeBot?", testerT.join(', '));

      sendMessage(message, {embed});
    });
  }
}).register();
