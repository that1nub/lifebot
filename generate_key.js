//This file is broken, I'll patch it later
new Command({
  title: "Generate Keys",
  shortDesc: "Generate a profile key.",
  longDesc: "Generate a profile key for people to use on their account.",
  call: ['genkey', 'generatekey'],
  usage: '(type)',
  can: devs,
  function: function(message, args){
    let keyChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let attemps = 0;
    function genKey(){
      if(attemps < 5){
        attemps++;
        let newKeyID = '';
        for(let i = 0; i < 15; i++){
          newKeyID += keyChars[Math.floor(Math.random() * keyChars.length)];
        }
        if(!akeys[newKeyID] && newKeyID.length === 15) return newKeyID;
        return genKey();
      }
      return false;
    }

    if(args[0]){
      if(args[0].toLowerCase() === "bronze" || args[0].toLowerCase() === "silver" || args[0].toLowerCase() === "gold" || args[0].toLowerCase() === "premium"){
        let newKeyID = genKey();
        if(newKeyID){
          let type;
          switch(args[0].toLowerCase()){
            case "silver": {type = 2} break;
            case "gold": {type = 3} break;
            case "premium": {type = 4} break;
            default: {type = 1} break;
          }
          akeys[newKeyID] = {
            type: type,
            redeemed: {
              is: false,
              by: '0',
              on: 0
            }
          };
          saveKeys();
          if(message.guild){
            sendMessage(message, `${check}|Success! Key has been DMed to you!`);
            message.author.send(`${check}|Here is that key you generated: \`${newKeyID}\``).catch(console.log);
          } else sendMessage(message, `${check}|Success! Here is your key: \`${newKeyID}\``);
        } else sendMessage(message, fail + "|Unable to generate a key after 5 attemps. Try cleaning keys with [undefined]");
      } else sendMessage(message, fail + "|Valid types are either Bronze, Silver, Gold, or Premium!");
    } else sendMessage(message, fail + "|You must provide a key type!");
  }
}).register();
