new Command({
  title: "Leaderboard",
  shortDesc: 'Check the highest level players in the guild.',
  longDesc: 'Check the highest level players in the guild.',
  call: ['leaderboard', 'lb', 'levels', 'ranks'],
  function: function(message, args){
    if(message.guild){
      // Get the levels
      let levels = config[message.guild.id].leveling.levels;
      // Create an array with the user ID's and scores
      let userIDs = Object.keys(levels);
      let arrayToSort = [];
      for(let i = 0; i < userIDs.length; i++) {
        arrayToSort[i] = {id: userIDs[i], xp: levels[userIDs[i]].totalxp, level: levels[userIDs[i]].level};
      }
      // Sort the array by totalxp
      arrayToSort.sort(
        (a, b) => {
          return b.xp - a.xp;
        }
      );

      let tbl = {}
      let localply;

      for(let i = 0; i < arrayToSort.length; i++){
        if(i < 25){
          tbl[(i + 1) + ". " + message.guild.members.get(arrayToSort[i].id).displayName] = "Level " + arrayToSort[i].level + " | " + arrayToSort[i].xp + " XP"
          if(!localply){
            if(message.author.id === arrayToSort[i].id){
              localply = {pos: i + 1, id: arrayToSort[i].id, xp: arrayToSort[i].xp, level: arrayToSort[i].level};
            }
          }
        } else {
          if(!localply){
            if(message.author.id === arrayToSort[i].id){
              localply = {pos: i + 1, id: arrayToSort[i].id, xp: arrayToSort[i].xp, level: arrayToSort[i].level};
            }
          } else break;
        }
      }

      if(!localply) localply = {level: 0, pos: -1, xp: 0, id: message.author.id}
      let output = spaceObject(tbl, '', '', ': ', ' ', '-', 3);
      sendMessage(message, info + '|Current guild leaderboard:```markdown\n > Guild Leaderboard <\n\n' + output + '\n\nYou: ' + localply.pos + '. ' + message.member.displayName + ': Level ' + localply.level + ' | ' + localply.xp + ' XP```');
    } else sendMessage(message, fail + "|You need to be in a guild to use this command.");
  }
}).register();
