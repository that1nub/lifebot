//This file is bugged, I will patch it later
new Command({
  title: "Register Key",
  shortDesc: "Use a key to change your account type.",
  longDesc: "If you're given a key, you can use it with this command to change your account type to get more bennefits.",
  call: ['usekey', 'key'],
  usage: '{key}',
  function: function(message, args){
    if(args[0]){
      let key = args[0].toLowerCase().replace(/-/g, '');
      sendMessage(message, `${Object.keys(akeys).includes(key)}`);
      if(Object.keys(akeys).includes(key)){
        if(!akeys[key].redeemed.is){
          if(akeys[key].type < data[message.author.id].account){
            akeys[key].redeemed.is = true;
            akeys[key].redeemed.on = message.createdTimestamp;
            akeys[key].redeemed.by = message.author.id;
            setupData(message.author.id);
            data[message.author.id].account = akeys[key].type;
            saveData(message.author.id);
            saveKeys();
            sendMessage(message, `${check}|Success! Your new account type is **${akeys[key].type}**`);
          } else{
            let yourAccountType = "BUG: INVALID TYPE";
            let keyAccountType = "BUG: INVALID TYPE";
            switch(data[message.author.id].account){
              case 0: {yourAccountType = "standard";} break;
              case 1: {yourAccountType = "bronze";} break;
              case 2: {yourAccountType = "silver";} break;
              case 3: {yourAccountType = "gold";} break;
              case 4: {yourAccountType = "premium";} break;
            }
            switch(akeys[key].type){
              case 0: {keyAccountType = "standard";} break;
              case 1: {keyAccountType = "bronze";} break;
              case 2: {keyAccountType = "silver";} break;
              case 3: {keyAccountType = "gold";} break;
              case 4: {keyAccountType = "premium";} break;
            }
            sendMessage(message, `${fail}|This key is useless to you! Your account is **${yourAccountType}** while the key is **${keyAccountType}**`);
          }
        } else sendMessage(message, fail + "|That key has already been taken");
      } else sendMessage(message, fail + "|That is not a valid key");
    } else sendMessage(message, fail + "|You must provide a key");
  }
}).register();
