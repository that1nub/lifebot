/*
  This was a file where all the code was together. I redesigned the bot to where commands are stored in another file.
  This one is deprecated. It still works but will never be used.
*/
 //Start the bot-----------------------------------------------------------------
"use strict";
const Discord = require('discord.js');
const fs = require('fs');
const Jimp = require('jimp');
const math = require('mathjs');
const bot = new Discord.Client();
const {execFile} = require('child_process');
const customMath = require('./mathEval.js');
const extractEmoji = require('emoji-aware').onlyEmoji;
bot.login('Bite me');

//Booting Variables-------------------------------------------------------------
let maintenance = true;
let notice;

fs.readFile('./notice.txt', function(err, text){
  if(err) console.log(err);
  if(String(text) !== ""||String(text) !== "undefined") notice = String(text);
});


//Variables---------------------------------------------------------------------
let owners     = [
  '292447249672175618' //Nub
];
let developers = [
  '210559163648966657' //Slime
];
let testers    = [
  '487032695822745600', //Smoort Duude (Nub's alt)
  '469995931211661332', //Leighton
  '410032716587991041', //DEKU
  '471006220480675840'  //Donut Fairy
];
let command    = [];
let devCommand = [];

const bot_version    = 'BETA';
const bot_lines      = 'Over 4400 (Will become approximate upon becoming public)';
const bot_size       = '187 KB (190,574 bytes (1,524,592 bits))';
const bot_created    = 'Saturday, September 1st, 2018 @ ~12:30 PM CST';
const bot_public     = 'Not yet available';
const bot_support    = 'https://discord.gg/pjbemj4';
const bot_invite     = 'https://discordapp.com/api/oauth2/authorize?client_id=485260768258818048&permissions=2146958839&scope=bot';
const bot_repository = "https://github.com/that1nub/lifebot";
const bot_website    = "nub.nightcube.net";

let caution = "<:caution:498569105956274177>";
let fail    = "<:cancel:498537778200576000>";
let info    = "<:information:498332125305634826>";
let check   = "<:check_mark:498332138421092352>";
let prize   = ":gift:";
let card    = ":credit_card:";
let file    = ":scroll:";
let stone   = "<:stone:498309591709384704>";
let coal    = "<:coal:498309622659153920>";
let copper  = "<:copper:498309646025752576>";
let iron    = "<:iron:498309660772925440>";
let gold    = "<:gold:498309675805048852>";
let diamond = "<:diamond:498309691789541376>";
let online  = "<:online:501183987159662593>";
let away    = "<:away:501184009913630761>";
let dnd     = "<:dnd:501184020575551488>";
let offline = "<:offline:501184046131445801>";

const day = 8.64e+7;
const hour = 3.6e+6;
const min = 60000;
const sec = 1000;

let dataLoaded   = false;
let configLoaded = false;

let data = [];
let config = [];

fs.readdir('./data', function(err, da){
  if(err){console.log(err);}
  let files = String(da).split(',');
  for(let i = 0; i < files.length; i++){
    fs.readFile('./data/' + files[i], function(error, ind){
      if(error){console.log(error);}
      try {data[files[i].slice(0, files[i].length - 5)] = JSON.parse(ind); }
      catch(err){
        data[files[i].slice(0, files[i.length] - 5)] = {};
        console.log("Error loading data " + files[i].slice(0, files[i].length - 5) + "\n" + err.stack);
      }
      if(i === files.length - 1){dataLoaded = true; console.log('User data loaded.');}
    })
  }
});
fs.readdir('./config', function(err, da){
  if(err){console.log(err);}
  let files = String(da).split(',');
  for(let i = 0; i < files.length; i++){
    fs.readFile('./config/' + files[i], function(error, ind){
      if(error){console.log(error);}
      try {config[files[i].slice(0, files[i].length - 5)] = JSON.parse(ind);}
      catch(err){
        config[files[i].slice(0, files[i].length - 5)] = {};
        console.log("Error loading config " + files[i].slice(0, files[i].length - 5) + "\n" + err.stack)
      }
      if(i === files.length - 1){configLoaded = true; console.log('Server configuration loaded.');}
    })
  }
});

let akeys = {};
fs.readFile('./keys.json', function(err, json){
  if(err) console.log(err);
  try{akeys = setupCopy({}, JSON.parse(json));}
  catch(err){
    akeys = {};
    console.log("Failed to load keys");
  }
});
// akeys = {
//   key: { //(Looks like "AAAAABBBBBCCCCC", can be typed as "AAAAA-BBBBB-CCCCC")
//     expires: 0, //MS time when it expires (can't be used)
//     redeemed: {
//       is: true, //Is or is not used
//       by: "111111111111111111", //User ID
//       on: 0 //MS when activated
//     },
//     type: {
//       name: "bronze", //Can be "bronze", "silver", "gold", or "premium"
//       time: 0 //MS time (after activation) that the account would return to normal
//     }
//   }
// };

let commands = [];
fs.readFile('./commands_ran.json', function(err, json){
  if(err) console.log(err);
  try {commands = JSON.parse(json);}
  catch(err){
    commands = {ran: 0, earned: 0};
    console.log("Failed to load command data\n" + err.stack)
  }
});
function increaseCommandCount(){
  commands.ran += 1;
  fs.writeFile('./commands_ran.json', JSON.stringify(commands, null, 2), function(err){if(err) console.log(err);});
}
function increaseMoneyEarned(am){
  commands.earned += am;
  fs.writeFile('./commands_ran.json', JSON.stringify(commands, null, 2), function(err){if(err) console.log(err);});
}


//Load backgrounds/Badges--------------------------------------------------
let backgrounds = {};
fs.readdir('./backgrounds', function(err, da){
  if(err) console.log(err);
  let files = String(da).split(',');
  for(let i = 0; i < files.length; i++){
    Jimp.read('./backgrounds/' + files[i], function(err, img){
      if(err) console.log(err);
      backgrounds[files[i].slice(0, files[i].indexOf('.'))] = img;
      if(i === files.length - 1){console.log('Backgrounds loaded');}
    });
  }
});

let badges = {};
fs.readdir('./badges', function(err, da){
  if(err) console.log(err);
  let files = String(da).split(',');
  for(let i = 0; i < files.length; i++){
    Jimp.read('./badges/' + files[i], function(err, img){
      if(err) console.log(err);
      badges[files[i].slice(0, files[i].indexOf('.'))] = img;
      if(i === files.length - 1){console.log('Badges loaded');}
    });
  }
});

let blackBackround;
new Jimp(500, 250, 0x000000FF, (err, img) => {
  if(err) console.log(err);
  blackBackround = img;
});

let blackBadge;
new Jimp(79, 78, 0x000000FF, (err, img) => {
  if(err) console.log(err);
  blackBadge = img;
});

let cardImg = {};
fs.readdir('./img', function(err, da){
  if(err) console.log(err);
  let files = String(da).split(',');
  for(let i = 0; i < files.length; i++){
    Jimp.read('./img/' + files[i], function(err, img){
      if(err) console.log(err);
      cardImg[files[i].slice(0, files[i].indexOf('.'))] = img;
      if(i === files.length - 1){console.log('Card text loaded');}
    });
  }
});

let LetterOverlay;
Jimp.read('img/Letter_Overlay.png', (err, img) => {
  if(err) console.log(err);
  LetterOverlay = img;
  console.log('Loaded letter overlay');
});

let mine = {};
Jimp.read('img/stone.png', (err, img) => {
  if(err) console.log(err);
  mine.stone = img;
  console.log("Stone loaded");
});
Jimp.read('img/coal.png', (err, img) => {
  if(err) console.log(err);
  mine.coal = img;
  console.log("Coal loaded");
});
Jimp.read('img/copper.png', (err, img) => {
  if(err) console.log(err);
  mine.copper = img;
  console.log("Copper loaded");
});
Jimp.read('img/iron.png', (err, img) => {
  if(err) console.log(err);
  mine.iron = img;
  console.log("Iron loaded");
});
Jimp.read('img/gold.png', (err, img) => {
  if(err) console.log(err);
  mine.gold = img;
  console.log("Gold loaded");
});
Jimp.read('img/diamond.png', (err, img) => {
  if(err) console.log(err);
  mine.diamond = img;
  console.log("Diamond loaded");
});

let blackText;
Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(font => {
  blackText = font;
  console.log('Black font loaded.');
}).catch(console.log);
let whiteText;
Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(font => {
  whiteText = font;
  console.log('White font loaded.');
}).catch(console.log);
let whiteTextS;
Jimp.loadFont(Jimp.FONT_SANS_8_WHITE).then(font => {
  whiteTextS = font;
  console.log('White small font loaded.');
}).catch(console.log);


let reactListening = {};
fs.readFile('./reactListening.json', (err, data) => {
  if(err) console.log(err);
  try {
    reactListening = JSON.parse(data);
  } catch(err) {
    console.log('Error fetching reactListening.json');
  }
});



let dataTable = {
  "blacklisted": {
    "is": false,
    "reason": "",
    "on": 0,
    "till": 0,
    "history": []
  },
  "account": {
    "type": "regular",
    "till": -1
  },
  "money": 0,
  "occupation": "none",
  "time": {
    "fish": 0,
    "mine": 0,
    "daily": 0,
    "weekly": 0,
    "beg": 0,
    "work": 0,
    "used": 0,
    "reputation": 0
  },
  "streak": {
    "fish": 0,
    "mine": 0,
    "daily": 0,
    "weekly": 0,
    "beg": 0,
    "work": 0
  },
  "profile": {
    "sex": "undefined",
    "bio": "No biography set.",
    "reputation": 0,
    "badges": [],
    "badgeShowcase": {
      "0": "",
      "1": "",
      "2": "",
      "3": "",
      "4": "",
      "5": "",
      "6": "",
      "7": "",
      "8": "",
      "length": 9
    },
    "relstat": "Single",
    "background": Object.keys(backgrounds)[0],
    "color": 0x0096FFFF
  },
  "inventory": {
    "fish": {
      "trash": 0,
      "common": 0,
      "uncommon": 0,
      "rare": 0
    },
    "minerals": {
      "stone": 0,
      "coal": 0,
      "copper": 0,
      "iron": 0,
      "gold": 0,
      "diamond": 0
    },
    "pickaxe": 0,
    "fishingrod": 0,
    "gun": 0,
    "mask": 0
  },
  "mine": {
    "lastGenDate": 0
  },
  "level": {
    "level": 1,
    "experience": 0
  }
};

let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
for(let x = 0; x < 10; x++){
  for(let y = 0; y < 10; y++){
    dataTable.mine[letters[x] + letters[y]] = {type: "stone", visible: false, mined: false};
  }
}

let configTable = {
  "prefix": "~",
  "admins": [],
  "adminroles": [],
  "mods": [],
  "modroles": [],
  "err_invalid_cmd": {
    "enabled": true,
    "msg": "**$command** is not a valid command."
  },
  "welcome": {
    "enabled": false,
    "showNotice": false,
    "msg": "Please welcome **$@user** to our guild!",
    "channel": '0',
    "roles": []
  },
  "leave": {
    "enabled": false,
    "showNotice": false,
    "msg": "**$user#$discrim** ($id) has decided to leave our server :confused:\nWish them luck out there!",
    "channel": '0'
  },
  "selfassign": {
    "enabled": false,
    "msg": {
      "mode": "dm",
      "response": "You $mode the role **$role** on **$server**",
      "after": "delete",
    },
    "roles": [],
    "react": {
      "enabled": false,
      "groups": []
    }
  },
  "moderation": {
    "strikes": {},
    "automod": {
      "cussing": "",
      "links": "",
      "spam": "",
      "slowmode": 0
    },
    "strikes": []
  },
  "leveling": {
    "enabled": false,
    "levels": {},
    "levelRewards": {},
    "noXP": []
  },
  "msgs": [],
  "suggestions": {
    "channel": '0',
    "list": []
  },
  "logs": {
    "override": '0',
    "message": '0',
    "joins": '0',
    "leaves": '0',
    "roles": '0',
    "bans": '0'
  },
  "shouts": {}
};

let colors = {
	black: 0x000000ff,
	silver: 0xc0c0c0ff,
	gray: 0x808080ff,
	white: 0xffffffff,
	maroon: 0x800000ff,
	red: 0xff0000ff,
	purple: 0x800080ff,
	fuchsia: 0xff00ffff,
	green: 0x008000ff,
	lime: 0x00ff00ff,
	olive: 0x808000ff,
	yellow: 0xffff00ff,
	navy: 0x000080ff,
	blue: 0x0000ffff,
	teal: 0x008080ff,
	aqua: 0x00ffffff,
	orange: 0xffa500ff,
	aliceblue: 0xf0f8ffff,
	antiquewhite: 0xfaebd7ff,
	aquamarine: 0x7fffd4ff,
	azure: 0xf0ffffff,
	beige: 0xf5f5dcff,
	bisque: 0xffe4c4ff,
	blanchedalmond: 0xffebcdff,
	blueviolet: 0x8a2be2ff,
	brown: 0xa52a2aff,
	burlywood: 0xdeb887ff,
	cadetblue: 0x5f9ea0ff,
	chartreuse: 0x7fff00ff,
	chocolate: 0xd2691eff,
	coral: 0xff7f50ff,
	cornflowerblue: 0x6495edff,
	cornsilk: 0xfff8dcff,
	crimson: 0xdc143cff,
	cyan: 0x00ffffff,
	darkblue: 0x00008bff,
	darkcyan: 0x008b8bff,
	darkgoldenrod: 0xb8860bff,
	darkgray: 0xa9a9a9ff,
	darkgreen: 0x006400ff,
	darkgrey: 0xa9a9a9ff,
	darkkhaki: 0xbdb76bff,
	darkmagenta: 0x8b008bff,
	darkolivegreen: 0x556b2fff,
	darkorange: 0xff8c00ff,
	darkorchid: 0x9932ccff,
	darkred: 0x8b0000ff,
	darksalmon: 0xe9967aff,
	darkseagreen: 0x8fbc8fff,
	darkslateblue: 0x483d8bff,
	darkslategray: 0x2f4f4fff,
	darkslategrey: 0x2f4f4fff,
	darkturquoise: 0x00ced1ff,
	darkviolet: 0x9400d3ff,
	deeppink: 0xff1493ff,
	deepskyblue: 0x00bfffff,
	dimgray: 0x696969ff,
	dimgrey: 0x696969ff,
	dodgerblue: 0x1e90ffff,
	firebrick: 0xb22222ff,
	floralwhite: 0xfffaf0ff,
	forestgreen: 0x228b22ff,
	gainsboro: 0xdcdcdcff,
	ghostwhite: 0xf8f8ffff,
	gold: 0xffd700ff,
	goldenrod: 0xdaa520ff,
	greenyellow: 0xadff2fff,
	grey: 0x808080ff,
	honeydew: 0xf0fff0ff,
	hotpink: 0xff69b4ff,
	indianred: 0xcd5c5cff,
	indigo: 0x4b0082ff,
	ivory: 0xfffff0ff,
	khaki: 0xf0e68cff,
	lavender: 0xe6e6faff,
	lavenderblush: 0xfff0f5ff,
	lawngreen: 0x7cfc00ff,
	lemonchiffon: 0xfffacdff,
	lightblue: 0xadd8e6ff,
	lightcoral: 0xf08080ff,
	lightcyan: 0xe0ffffff,
	lightgoldenrodyellow: 0xfafad2ff,
	lightgray: 0xd3d3d3ff,
	lightgreen: 0x90ee90ff,
	lightgrey: 0xd3d3d3ff,
	lightpink: 0xffb6c1ff,
	lightsalmon: 0xffa07aff,
	lightseagreen: 0x20b2aaff,
	lightskyblue: 0x87cefaff,
	lightslategray: 0x778899ff,
	lightslategrey: 0x778899ff,
	lightsteelblue: 0xb0c4deff,
	lightyellow: 0xffffe0ff,
	limegreen: 0x32cd32ff,
	linen: 0xfaf0e6ff,
	magenta: 0xff00ffff,
	mediumaquamarine: 0x66cdaaff,
	mediumblue: 0x0000cdff,
	mediumorchid: 0xba55d3ff,
	mediumpurple: 0x9370dbff,
	mediumseagreen: 0x3cb371ff,
	mediumslateblue: 0x7b68eeff,
	mediumspringgreen: 0x00fa9aff,
	mediumturquoise: 0x48d1ccff,
	mediumvioletred: 0xc71585ff,
	midnightblue: 0x191970ff,
	mintcream: 0xf5fffaff,
	mistyrose: 0xffe4e1ff,
	moccasin: 0xffe4b5ff,
	navajowhite: 0xffdeadff,
	oldlace: 0xfdf5e6ff,
	olivedrab: 0x6b8e23ff,
	orangered: 0xff4500ff,
	orchid: 0xda70d6ff,
	palegoldenrod: 0xeee8aaff,
	palegreen: 0x98fb98ff,
	paleturquoise: 0xafeeeeff,
	palevioletred: 0xdb7093ff,
	papayawhip: 0xffefd5ff,
	peachpuff: 0xffdab9ff,
	peru: 0xcd853fff,
	pink: 0xffc0cbff,
	plum: 0xdda0ddff,
	powderblue: 0xb0e0e6ff,
	rosybrown: 0xbc8f8fff,
	royalblue: 0x4169e1ff,
	saddlebrown: 0x8b4513ff,
	salmon: 0xfa8072ff,
	sandybrown: 0xf4a460ff,
	seagreen: 0x2e8b57ff,
	seashell: 0xfff5eeff,
	sienna: 0xa0522dff,
	skyblue: 0x87ceebff,
	slateblue: 0x6a5acdff,
	slategray: 0x708090ff,
	slategrey: 0x708090ff,
	snow: 0xfffafaff,
	springgreen: 0x00ff7fff,
	steelblue: 0x4682b4ff,
	tan: 0xd2b48cff,
	thistle: 0xd8bfd8ff,
	tomato: 0xff6347ff,
	turquoise: 0x40e0d0ff,
	violet: 0xee82eeff,
	wheat: 0xf5deb3ff,
	whitesmoke: 0xf5f5f5ff,
	yellowgreen: 0x9acd32ff,
	rebeccapurple: 0x663399ff
}




//Functions---------------------------------------------------------------------
function setupCopy(obj, temp){
  if(!obj) return;
  let tempKeys = Object.keys(temp);
  for(let i = 0; i < tempKeys.length; i++){
    if(typeof temp[tempKeys[i]] === "object"){
      if(typeof obj[tempKeys[i]] !== "object"){
        obj[tempKeys[i]] = {};
      }
      Object.setPrototypeOf(obj[tempKeys[i]], temp[tempKeys[i]].__proto__);
      setupCopy(obj[tempKeys[i]], temp[tempKeys[i]]);
    } else {
      if(typeof obj[tempKeys[i]] != typeof temp[tempKeys[i]]){
        obj[tempKeys[i]] = temp[tempKeys[i]];
      }
    }
  }
  return obj;
}

function resetData(userid){
  if(typeof userid === "string"){
    data[userid] = setupCopy({}, dataTable);
    saveData(userid);
  }
}
function setupData(userid){
  if(typeof userid === "string"){
    if(!data[userid]){
      data[userid] = {};
    }
    setupCopy(data[userid], dataTable);

    for(let i = 0; i < owners.length; i++){
      if(owners[i] === userid){
        if(!data[userid].profile.badges.includes('badge_dev')) data[userid].profile.badges.push('badge_dev');
        if(!data[userid].profile.badges.includes('badge_tester')) data[userid].profile.badges.push('badge_tester');
      }
    }
    for(let i = 0; i < developers.length; i++){
      if(developers[i] === userid){
        if(!data[userid].profile.badges.includes('badge_dev')) data[userid].profile.badges.push('badge_dev');
        if(!data[userid].profile.badges.includes('badge_tester')) data[userid].profile.badges.push('badge_tester');
      }
    }
    for(let i = 0; i < testers.length; i++){
      if(userid === testers[i]){
        if(!data[userid].profile.badges.includes('badge_tester')) data[userid].profile.badges.push('badge_tester');
      }
    }
  }
}
function saveData(userid){
  if(typeof userid === "string"){
    setupData(userid);
    fs.writeFile('./data/' + userid + '.json', JSON.stringify(data[userid], null, 2), function(err){if(err){console.log(err);}});
  }
}

function setupConfig(guildid){
  if(typeof guildid === "string"){
    if(!config[guildid]){
      config[guildid] = {};
    }
    setupCopy(config[guildid], configTable);
  }
}
function resetConfig(guildid){
  if(typeof guildid === "string"){
    config[guildid] = setupCopy({}, configTable);
    saveConfig(guildid);
  }
}
function saveConfig(guildid){
  if(typeof guildid === "string"){
    setupConfig(guildid);
    fs.writeFile('./config/' + guildid + '.json', JSON.stringify(config[guildid], null, 2), function(err){if(err){console.log(err);}});
  }
}

function createCommand(title, shortDesc, longDesc, cmd, aliases, usage, func){
  let temp = {};
  if(typeof title === "string"){temp.title = title;}
  else{temp.title = "This command has no title. Strange";}

  if(typeof shortDesc === "string"){temp.shortDesc = shortDesc;}
  else{temp.shortDesc = "This command has no short description.";}

  if(typeof longDesc === "string"){temp.longDesc = longDesc;}
  else{temp.longDesc = "This command has no description.";}

  if(typeof cmd === "string"){temp.cmd = cmd;}
  else{temp.cmd = " oof.";}

  if(typeof aliases === "string" || typeof aliases === "object"){temp.aliases = aliases;}
  else{temp.aliases = undefined;}

  if(typeof usage === "string"){temp.usage = usage;}
  else{temp.usage = "none.";}

  if(typeof func === "function"){temp.func = func;}
  else{temp.func = function(message){sendMessage(message, "Command ran, but had nothing to execute!");}}

  command.push(temp);
  console.log("Registered command: " + temp.title);
}
function createDevCommand(title, shortDesc, longDesc, cmd, aliases, usage, func){
  let temp = {};
  if(typeof title === "string"){temp.title = title;}
  else{temp.title = "This command has no title. Strange";}

  if(typeof shortDesc === "string"){temp.shortDesc = shortDesc;}
  else{temp.shortDesc = "This command has no short description.";}

  if(typeof longDesc === "string"){temp.longDesc = longDesc;}
  else{temp.longDesc = "This command has no description.";}

  if(typeof cmd === "string"){temp.cmd = cmd;}
  else{temp.cmd = " oof.";}

  if(typeof aliases === "string" || typeof aliases === "object"){temp.aliases = aliases;}
  else{temp.aliases = undefined;}

  if(typeof usage === "string"){temp.usage = usage;}
  else{temp.usage = "none.";}

  if(typeof func === "function"){temp.func = func;}
  else{temp.func = function(message){sendMessage(message, "Command ran, but had nothing to execute!");}}

  devCommand.push(temp);
  console.log("Registered developer command: " + temp.title);
}

function clamp(int, min, max){
  if(typeof int === "number" && typeof min === "number" && typeof max === "number"){
    return Math.min(Math.max(min, int), max);
  }
  return int;
}
function dist(posX, posY, sizeX, sizeY){
  let a = posX - sizeX;
  let b = posY - sizeY;
  return Math.sqrt(a*a + b*b);
}
function formatTime(ms, str){
  if(typeof ms === "number" && typeof str === "string"){
    let t = Math.floor(ms/1000);
    let mil = ms % 1000;
    let sec = t % 60;
    let min = Math.floor((t / 60) % 60);
    let hour = Math.floor((t / 3600) % 24);
    let day = Math.floor((t / 3600) / 24);
    return str.replace('$day', day).replace('$days', day)
      .replace('$hour', hour).replace('$hours', hour).replace('$hr', hour)
      .replace('$minute', min).replace('$min', min).replace('$minutes', min)
      .replace('$second', sec).replace('$sec', sec).replace('$seconds', sec)
      .replace('$millisecond', mil).replace('$ms', mil).replace('$milliseconds', mil);
  }
  return undefined;
}

// The function itself //

function spaceObject( inObject, leftSide, rightSide, pairSpacer, normalSpacer, hrSpacer, align ) {
	'use strict';
	// Store the value names as 'keys'
	let keys = Object.keys( inObject );
	let output = [];

	// Go through, placing the variable and its stringified value in the output
	let maxLen = 0;
	for(let i = 0; i < keys.length; i++) {
		// Stringify the value
		let text;
		switch(typeof inObject[keys[i]]) {
			case 'number': {
				text = ''+inObject[keys[i]];
			} break;
			case 'string': {
				text = ''+inObject[keys[i]];
			} break;
			case 'default': {
				text = 'undefined';
			} break;
			default: {
				text = '???';
			} break;
		}
		// Place in output
		if(text !== '') {
			output[i] = text;
		} else {
			// If the string is empty, then a horizontal line is signified, and -1 is inserted as the text
			output[i] = -1;
		}
		// Measure greatest string length
		let thisLen = output[i].length + keys[i].length + pairSpacer.length;
		if(thisLen > maxLen)
			maxLen = thisLen;
	}

	// Loop through the output, adding the correct spacing
	for(let i = 0; i < output.length; i++) {

		let modify = output[i];
		let charsNeeded = maxLen - (modify.length + pairSpacer.length + keys[i].length);
		if(modify === -1) {
			// Add horizontal line
			charsNeeded = maxLen;
			modify = hrSpacer.repeat(Math.ceil( charsNeeded/(hrSpacer.length) )).substring(0, charsNeeded );
		} else {
			// Add line of text
			switch(align) {
				case 0: { // Left align
					modify = keys[i] + pairSpacer + normalSpacer.repeat( charsNeeded ) + modify;
				} break;
				case 1: { // Center align
					modify = normalSpacer.repeat( Math.floor( charsNeeded/2 ) ) + keys[i] + pairSpacer + modify + normalSpacer.repeat( Math.ceil( charsNeeded/2 ) );
				} break;
				case 2: { // Right align
					modify = normalSpacer.repeat( charsNeeded ) + keys[i] + pairSpacer + modify;
				} break;
				case 3: { // Center split
					modify = keys[i] + pairSpacer + normalSpacer.repeat( charsNeeded ) + modify;
				} break;
				default: { // Add no spacing
					modify = keys[i] + pairSpacer + modify;
				} break;
			}
		}
		output[i] = leftSide + modify + rightSide;

	}

	// Return and stitch together the output
	return output.join('\n');

}

function generateMine(userid, date){
  if(typeof userid !== "string"||!date) return;
  setupData(userid);
  for(let x = 0; x < 10; x++){
    for(let y = 0; y < 10; y++){
      let rng = Math.floor(Math.random() * 100) + 1;
      let newMine = {};
      if(rng <= 35){
        newMine.type = "stone";
      } else if(rng <= 60) {
        newMine.type = "coal";
      } else if(rng <= 80) {
        newMine.type = "copper";
      } else if(rng <= 90) {
        newMine.type = "iron";
      } else if(rng <= 97) {
        newMine.type = "gold";
      } else if(rng <= 100) {
        newMine.type = "diamond";
      }
      newMine.visible = false;
      newMine.mined = false;
      data[userid].mine[letters[x] + letters[y]] = newMine;
    }
  }
  data[userid].mine.lastGenDate = date;
}
function checkMine(userid, date){
  if(typeof userid !== "string"||typeof date !== "number") return;
  setupData(userid);
  //if(date - data[userid].mine.lastGenDate >= day) generateMine(userid, date);
  if(date - data[userid].mine.lastGenDate >= day) return true;
  return false;
  //saveData(userid);
}

function sendMessage(message, text, attachment){
  if(!(message && text)) return;
  let str = text;
  if(notice) str += '\n\nNotice from developers: ' + notice;
  if(attachment) return message.channel.send(str, attachment).catch(function(err){if(err) console.log(err);});
  else return message.channel.send(str).catch(function(err){if(err) console.log(err);});
}

function tblDif(oldT, newT){
  let addedVal = [];
  let removedVal = [];
  if(typeof oldT === "object" && typeof newT === "object"){
    let oldKey = Object.keys(oldT);
    let newKey = Object.keys(newT);
    for(let i = 0; i < oldKey.length; i++){
      if(!newKey.includes(oldKey[i])){
        removedVal.push(oldKey[i]);
      }
    }
    for(let i = 0; i < newKey.length; i++){
      if(!oldKey.includes(newKey[i])){
        addedVal.push(newKey[i]);
      }
    }
  }
  let tbl = {};
  if(addedVal.length > 0) tbl.added = addedVal;
  if(removedVal.length > 0) tbl.removed = removedVal;
  return tbl;
}

function setReactListener(message, can, onReact){
  if(message === undefined||can === undefined||onReact === undefined) return;
  if(message){
    // if(emotes.length > 0){
    //   for(let i = 0; i < emotes.length; i++){
    //     if(extractEmoji(emotes[i])){} //do nothing
    //     else if(!extractEmoji(emotes[i])[0]) emotes.splice(i, 1);
    //     else if(!bot.emojis.get(emotes[i])) emotes.splice(i, 1);
    //   }
    //   if(emotes.length > 0){
    //     // for(let i = 0; i < emotes.length; i++){
    //     //   message.react(emotes[i]).catch(console.log);
    //     // }
    //     reactListening[message.id] = {can: can, mode: onReact};
    //     fs.writeFile('./reactListening.json', JSON.stringify(reactListening, null, 2), (err) => {if(err) console.log(err);});
    //   }
    // }
    reactListening[message.id] = {can: can, mode: onReact};
    fs.writeFile('./reactListening.json', JSON.stringify(reactListening, null, 2), (err) => {if(err) console.log(err);});
  }
}
function removeReactListener(messageID){
  if(messageID === undefined) return;
  if(reactListening[messageID]){
    reactListening[messageID] = undefined;
    fs.writeFile('./reactListening.json', JSON.stringify(reactListening, null, 2), (err) => {if(err) console.log(err);});
  }
}





//Commands----------------------------------------------------------------------
createCommand(
  "Help",
  "Displays bot commands.",
  "Displays bot commands, either a page or a single command.",
  "help",
  [],
  "[command|page]",
  function(message, args){
    let embed = new Discord.RichEmbed()
      .setTitle('Commands')
      .setColor(0x0096FF)
      .setFooter(message.author.username)
      .setTimestamp();

    let cmds = command.length;
    let pageCount = Math.ceil(command.length/10);
    let pageSel = clamp(parseInt(args[0]) - 1, 0, pageCount);
    if(typeof pageSel !== "number" || !(pageSel > -Infinity && pageSel < Infinity) && args[0]){
      pageSel = args[0].toLowerCase();
    }
    if(!pageSel){
      pageSel = 0;
    }

    if(typeof pageSel === "number"){
      embed.setDescription('Displaying commands for page **' + clamp(pageSel + 1, 0, pageCount) + "**/" + pageCount + ". Total commands: " + cmds);
      let PrintAmount = 0;
      for(let i = clamp(pageSel*10, 0, cmds - (cmds % 10)); i < cmds; i++){
        if(command[i] === undefined) break;
        if(PrintAmount < 10){
          PrintAmount++;
          let alias;
          if(typeof command[i].aliases === "string") alias = command[i].aliases;
          else alias = command[i].aliases.join(', ');
          embed.addField(command[i].title, command[i].shortDesc + "\n**Usage**: `" + command[i].usage + "`\n**Command**: `" + command[i].cmd + "`, **Aliases**: `" + alias + "`");
        } else {break;}
      }
    } else if(typeof pageSel === "string"){
      let found = false;
      for(let y = 0; y < command.length; y++){
        if(!found && pageSel === command[y].title.toLowerCase()){
          found = true;
          embed.setTitle(command[y].title);
          let alias = [];
          let aliasStr = '';
          if(typeof command[y].aliases === "string") alias.push(command[y].aliases);
          else if(typeof command[y].aliases === "object"){
            for(let j = 0; j < command[y].aliases.length; j++){
              alias.push(command[y].aliases[j]);
            }
          }          if(alias.length > 0){
            aliasStr = '\n**Aliases**: ' + alias.join(', ');
          }
          embed.setDescription(command[y].longDesc +"\n\n**Command**: " + command[y].cmd + aliasStr);
          break;
        } else if(!found && pageSel === command[y].cmd.toLowerCase()){
          found = true;
          embed.setTitle(command[y].title);
          let alias = [];
          let aliasStr = '';
          if(typeof command[y].aliases === "string") alias.push(command[y].aliases);
          else if(typeof command[y].aliases === "object"){
            for(let j = 0; j < command[y].aliases.length; j++){
              alias.push(command[y].aliases[j]);
            }
          }          if(alias.length > 0){
            aliasStr = '\n**Aliases**: ' + alias.join(', ');
          }
          embed.setDescription(command[y].longDesc +"\n\n**Command**: " + command[y].cmd + aliasStr);
          break;
        } else if(!found){
          if(typeof command[y].aliases === "string"){
            if(!found && pageSel === command[y].aliases){
              found = true;
              embed.setTitle(command[y].title);
              let alias = [];
              let aliasStr = '';
              if(typeof command[y].aliases === "string") alias.push(command[y].aliases);
              else if(typeof command[y].aliases === "object"){
                for(let j = 0; j < command[y].aliases.length; j++){
                  alias.push(command[y].aliases[j]);
                }
              }
              if(alias.length > 0){
                aliasStr = '\n**Aliases**: ' + alias.join(', ');
              }
              embed.setDescription(command[y].longDesc +"\n\n**Command**: " + command[y].cmd + aliasStr);
              break;
            }
          } else {
            for(let x = 0; x < command[y].aliases.length; x++){
              if(!found && pageSel === command[y].aliases[x].toLowerCase()){
                found = true;
                embed.setTitle(command[y].title);
                let alias = [];
                let aliasStr = '';
                if(typeof command[y].aliases === "string") alias.push(command[y].aliases);
                else if(typeof command[y].aliases === "object"){
                  for(let j = 0; j < command[y].aliases.length; j++){
                    alias.push(command[y].aliases[j]);
                  }
                }
                if(alias.length > 0){
                  aliasStr = '\n**Aliases**: ' + alias.join(', ');
                }
                embed.setDescription(command[y].longDesc +"\n\n**Command**: " + command[y].cmd + aliasStr);
                break;
              }
            }
          }
        }
      }
      if(!found){
        embed.addField('Error', "**" + pageSel + "** is not a command.");
      }
    } else {
      embed.addField('Error', "**" + args[0] + "** is not a command.");
    }

    sendMessage(message, {embed});
  }
);
createCommand(
  "Ping",
  "Check if the bot is working.",
  "Check if the bot is working. It'll respond with the time it took to respond.",
  "ping",
  [],
  "none.",
  function(message, args){
    sendMessage(message, info + "|Pinging...").then(function(newMsg){
      if(notice) newMsg.edit(info + check + "|Pong! **" + Math.round(newMsg.createdTimestamp - message.createdTimestamp) + "**ms \n" + info + "|**" + Math.round(newMsg.createdTimestamp - message.createdTimestamp - bot.ping) + "**ms bot ping \n" + info + "|**" + Math.round(bot.ping) + "**ms websocket ping\n\nNotice from developers: " + notice).catch(console.log);
      else newMsg.edit(info + check + "|Pong! **" + Math.round(newMsg.createdTimestamp - message.createdTimestamp) + "**ms \n" + info + "|**" + Math.round(newMsg.createdTimestamp - message.createdTimestamp - bot.ping) + "**ms bot ping \n" + info + "|**" + Math.round(bot.ping) + "**ms websocket ping").catch(console.log);
    });
  }
);
createCommand(
  "Bot Information",
  "Displays bot information, like statistics that can be found on the website.",
  "Displays bot information, like statistics that can be found on the website.",
  'botinfo',
  ['bot', 'botinformation'],
  'none',
  function(message, args){
    let embed = new Discord.RichEmbed()
      .setTitle('LifeBot Information')
      .setColor(0x0096FF)
      .setFooter(bot.users.get(message.author.id).username)
      .setTimestamp()
      .addField('When was the bot first worked on?', bot_created)
      .addField('When did the bot become public?', bot_public)
      .addField('How many lines are in LifeBot\'s code?', bot_lines)
      .addField('How large is LifeBot\'s code?', bot_size)
      .addField('What version is LifeBot\'s current version?', bot_version)
      .addField('Have a bug? Have any questions? Need support?', bot_support)
      .addField('Want to invite the bot to your server?', bot_invite)
      .addField('Want to visit LifeBot\'s website?', 'http://' + bot_website + '/')
      .addField('Want to visit LifeBot\'s GitHub Repository?', bot_repository)
      .addField('How many commands have been used?', commands.ran)
      .addField('How many people have used the bot?', Object.keys(data).length - 1)
      .addField('How much money has been earned by players?', "$" + commands.earned.toFixed(2))
      .addField('How many guilds is LifeBot in?', bot.guilds.array().length)
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

    embed.addField('Who owns LifeBot?', ownerT.join(', '));
    embed.addField('Who helped develop LifeBot?', devT.join(', '));
    embed.addField('Who tested LifeBot?', testerT.join(', '));
    embed.addField('How long as LifeBot been online?', formatTime(bot.uptime, '**$day**d **$hour**h **$min**m **$sec**s'));

    sendMessage(message, {embed});
  }
);
createCommand(
  "Balance",
  "View a player's balance.",
  "View a player's balance.",
  "balance",
  ['bal', 'money'],
  '[@user|userid]',
  function(message, args){
    let ply;
    if(message.guild && message.mentions) ply = message.mentions.members.first();
    if(!ply) ply = bot.users.get(args[0]);
    if(!ply && !args[0]) ply = message.author;

    if(ply){
      setupData(ply.id);
      sendMessage(message, card + "|**" + bot.users.get(ply.id).username + "**'s balance: **$" + data[ply.id].money.toFixed(2) + "**");
    } else {
      sendMessage(message, fail + "|You must specify a valid player.");
    }
  }
);
createCommand(
  'Transfer',
  'Give someone some money.',
  'Give someone some money.',
  'transfer',
  ['tran'],
  '[@user|userid] [amount]',
  function(message, args){
    if(args.length >= 2){
      let ply;
      if(message.guild && message.mentions && message.mentions.members) ply = message.mentions.members.first();
      if(!ply) ply = bot.users.get(args[0]);
      if(ply){
        if(ply.id !== message.author.id){
          setupData(ply.id);
          let am;
          if(args[1].toLowerCase() === "all") am = data[message.author.id].money;
          else am = Number(Number(args[1]).toFixed(2));
          if(am > 0 && am < Infinity){
            if(data[message.author.id].money >= am){
              data[message.author.id].money -= am;
              data[ply.id].money += am;
              saveData(message.author.id);
              saveData(ply.id);
              sendMessage(message, check + "|You have transfered **$" + am.toFixed(2) + "** to **" + bot.users.get(ply.id).username + "**'s balance.");
              if(!message.mentions || !message.mentions.members || message.mentions.members.array().length === 0) bot.users.get(ply.id).send(info + "|**" + bot.users.get(message.author.id).username + "** has transfered **$" + am + "** to your balance.");
            } else sendMessage(message, fail + "|You must have the amount you're giving.");
          } else sendMessage(message, fail + "|You must specify a number greater than 0.");
        } else sendMessage(message, fail + "|You can't transfer money to yourself.");
      } else sendMessage(message, fail + "|You must specify a valid person.");
    } else sendMessage(message, fail + "|You must specify who and the amount.");
  }
);
createCommand(
  'Reputation',
  'Give someone a reputation point.',
  'Give someone a reputation point. Cooldown of one hour. Leave arguments blank to see when you can rep again.',
  'rep',
  'reputation',
  '[@user|userid]',
  function(message, args){
    if(args.length > 0){
      let ply;
      if(message.guild && message.mentions && message.mentions.members && message.mentions.members.size > 0) ply = message.mentions.members.first().user;
      if(!ply) ply = bot.users.get(args[0]);
      if(ply){
        if(ply.id !== message.author.id){
          if(message.createdTimestamp - data[message.author.id].time.reputation >= hour){
            setupData(ply.id)
            data[message.author.id].time.reputation = message.createdTimestamp;
            data[ply.id].profile.reputation += 1;
            saveData(message.author.id);
            saveData(ply.id);
            sendMessage(message, check + "|You have given **" + ply.displayName + "** a reputation point!\n" + info +"|They now have **" + data[ply.id].profile.reputation + "** reputation!");
          } else sendMessage(message, info + fail + "|You can give reputation again in " + formatTime((data[message.author.id].time.reputation + hour) - message.createdTimestamp, '**$min**m **$sec**s'));
        } else sendMessage(message, fail + "|You can't give yourself reputation.")
      } else sendMessage(message, fail + "|You must specify someone to give reputation to.");
    } else {
      setupData(message.author.id);
      if(message.createdTimestamp - data[message.author.id].time.reputation >= hour) sendMessage(message, info + check + "|You can give reputation now!");
      else sendMessage(message, info + fail + "|You can give reputation again in " + formatTime((data[message.author.id].time.reputation + hour) - message.createdTimestamp, '**$min**m **$sec**s'));
    }
  }
);

createCommand(
  'List Roles',
  'List all the roles on the guild along with their IDs so you can add them to self assignable roles.',
  'List all the roles on the guild along with their IDs so you can add them to self assignable roles.',
  'listroles',
  ['listr', 'rlist', 'rl', 'lr'],
  'none.',
  function(message, args){
    if(message.guild){
      let rlist = message.guild.roles.array();
      let str = '';
      let list = [];
      for(let i = 0; i < rlist.length; i++){
        if(rlist[i].name !== "@everyone"){
          list.push({name: rlist[i].name, id: rlist[i].id});
        }
      }
      //console.log(list);
      let pageCount = Math.ceil(list.length/10);
      let pageSel = clamp(parseInt(args[0]) - 1, 0, pageCount);
      if(typeof pageSel !== "number" || Number.isNaN(pageSel)) pageSel = 0;

      if(typeof pageSel === "number"){
        str += 'Displaying roles for page **' + clamp(pageSel + 1, 0, pageCount) + "**/" + pageCount + ". Total roles: " + list.length;
        let PrintAmount = 0;
        for(let i = clamp(pageSel*10, 0, list.length - (list.length % 10)); i < list.length; i++){
          if(list[i] === undefined) break;
          if(PrintAmount < 10){
            PrintAmount++;
            str += "\nRole: **" + list[i].name + "** | ID: __" + list[i].id + "__"
          }
        }
      }
      sendMessage(message, info + "|" + str);
    } else sendMessage(message, fail + "|You must be on a guild to do this.");
  }
);
createCommand(
  'Math',
  'Calculate some math equations.',
  'Calculate some math equations.',
  'math',
  [],
  '<equation>',
  function(message, args){
    let expression = args.join(' ');
    expression = expression
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/√/g, 'sqrt')
      .replace(/×/g, '*')
      .replace(/•/g, '*')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/⁴/g, '^4')
      .replace(/¹/g, '^1')
      .replace(/°/g, '*(pi/180)');
    if(expression){
      try {
        sendMessage(message, check + info + "|Your expression returns```\n" + customMath.mathEval(expression) + "```");
      } catch(err){
      	 let errstr = String(err);
      	 if(errstr.length > 512){
      	 	 errstr = errstr.substring(0, 512) + "...";
      	 }
        let embed = new Discord.RichEmbed();
        embed.setTitle("Expression failed");
        embed.setColor(0xff3e3e);
        embed.setDescription("Your expression failed with an error:\n**" + errstr + "**");
        sendMessage(message, {embed});
        //sendMessage(message, fail + info + "|Your expression failed with an error: **" + err + "**");
      }
    } else {
      sendMessage(message, fail + "|You must provide an equation!")
    }
  }
);
createCommand(
  'Config',
  'Change settings for your server.',
  'Change settings for your server with the following properties:\n' +
    '`•Prefix` - Set the bot\'s prefix for the guild.\n\n' +
    '`•Toggle [selfassign|levels]` - Toggle selfassignable roles or leveling roles. Automatically toggled if you update something within them.\n\n' +
    '`•Set [join|leave|suggestion|logs] logs:[message|join|leave]` - Set something in the following properties:\n' +
    '`••Join` - Sets the join message channel, or provide arguments as the roles. You can provide the role id, or type it\'s name (can\'t contain spaces).\n' +
    '`••Leave` - Sets the leave message channel.\n' +
    '`••Suggestion` - Sets the suggestion channel.\n' +
    '`••Logs [message|join|leave]` - Set log channels.\n\n' +
    '`•Add [selfassign|levels]` - Add roles to the self assign list or level rewards. For selfassign, you can target by ID or with name (can\'t contain spaces). For levels, you can @ the role, specify ID, or name (instead of case sensitive, it matches the strings. If you type part of the role name, it\'ll target it). For leveling, the argument after the role is the level required.\n\n' +
    '`•Remove [selfassign|levels]` - Similar to adding, other than levels doesn\'t take the level.',
  'config',
  ['con', 'configuration'],
  "[property] [value]",
  function(message, args, StrArg){
    if(message.guild){
      setupConfig(message.guild.id);
      let guild = message.guild;
      let isAd = false;
      let isMod = false;
      if(message.author.id === guild.ownerID){isAd = true;}
      else if(message.member.roles.has(config[guild.id].adminrole)){isAd = true;}
      else if(message.member.permissions.has('ADMINISTRATOR')){isAd = true;}
      else {
        for(let i = 0; i < config[guild.id].admins.length; i++){
          if(message.author.id === config[guild.id].admins[i]){isAd = true; break;}
        }
      }
      if(message.member.roles.has(config[guild.id].modrole)) isMod = true;
      else if(message.member.permissions.has('MANAGE_MESSAGES')) isMod = true;
      else {
        for(let i = 0; i < config[guild.id].mods; i++){
          if(message.author.id === config[guild.id].mods[i]){isMod = true; break;}
        }
      }

      if(isAd) isMod = true;
      if(isAd){
        if(args.length >= 2){
          switch(args[0]){
            case "prefix":
              if(isAd){
                config[guild.id].prefix = args[1].toLowerCase();
                saveConfig(guild.id);
                sendMessage(message, check + "|You have successfully set the prefix to **" + args[1].toLowerCase() + "**.");
                guild.fetchMember(bot.user.id).then(function(ply){
                  ply.setNickname('[ ' + args[1].toLowerCase() + ' ] LifeBot');
                }).catch(function(err){
                  sendMessage(message, fail + "|Error setting nickname to `[ " + args[1].toLowerCase() + " ] LifeBot`");
                });
              } else {
                sendMessage(message, fail + "|You must be administrator to use this.");
              }
            break;

            case "set": {
              let channel = message.channel.id;
              switch(args[1].toLowerCase()){
                case "join":  {
                  if(args.length === 2){
                    config[message.guild.id].welcome.channel = channel;
                    if(!config[message.guild.id].welcome.enabled) config[message.guild.id].welcome.enabled = true;
                    saveConfig(message.guild.id);
                    sendMessage(message, check + "|This is now the join message channel");
                  } else if(args[2] === "role"){
                    let argu = args;
                    argu.shift();
                    argu.shift();
                    argu.shift();
                    let role = message.mentions.roles.array();
                    let roles = [];
                    if(role !== undefined && role.length > 0){
                      for(let i = 0; i < role.length; i++){
                        roles.push(role[i].id);
                      }
                    } else {
                      let rlist = message.guild.roles.array();
                      for(let i = 0; i < rlist.length; i++){
                        for(let x = 0; x < argu.length; x++){
                          if(rlist[i].name.toLowerCase() === argu[x]) roles.push(rlist[i].id);
                          if(rlist[i].id === argu[x]) roles.push(rlist[i].id);
                        }
                      }
                    }

                    if(roles !== undefined && roles.length > 0){
                      let conrole = config[message.guild.id].welcome.roles;
                      let added = [];
                      for(let i = 0; i < roles.length; i++){
                        let alreadyPlaced = false;
                        for(let x = 0; x < conrole.length; x++){
                          if(conrole[x] === roles[i]){
                            alreadyPlaced = true;
                            break;
                          }
                        }

                        if(!alreadyPlaced){
                          config[message.guild.id].welcome.roles.push(roles[i]);
                          added.push(message.guild.roles.get(roles[i]).name);
                        }
                      }
                      saveConfig(message.guild.id);
                      let newRoles = 'No new roles added.';
                      if(added.length > 0) newRoles = added.join('\n');
                      sendMessage(message, check + "|On join roles updated! Note: The bot's role must be higher on the list than the roles displayed below, or it won't work!\n" + info + "|New roles:```\n" + newRoles + "```");
                    } else {
                      sendMessage(message, fail + "|You haven't specified a valid list of role ids or @ roles");
                    }
                  } else {
                    let msg = StrArg.slice(StrArg.indexOf('join') + 5);
                    config[message.guild.id].welcome.msg = msg;
                    saveConfig(message.guild.id);
                    sendMessage(message, check + "|Join message set to `" + msg.replace('$@user', '<@userid>').replace('$server', message.guild.name).replace('$id', 'userid').replace('$user', 'username') + "`");
                  }
                }break;
                case "leave":  {
                  if(args.length === 2){
                    config[message.guild.id].leave.channel = channel;
                    if(!config[message.guild.id].leave.enabled) config[message.guild.id].leave.enabled = true;
                    saveConfig(message.guild.id);
                    sendMessage(message, check + "|This is now the leave message channel");
                  } else {
                    let msg = StrArg.slice(StrArg.indexOf('leave') + 6);
                    config[message.guild.id].leave.msg = msg;
                    saveConfig(message.guild.id);
                    sendMessage(message, check + "|Leave message set to `" + msg.replace('$user', 'username').replace('$discrim', 'userdiscrim').replace('$id', 'userid') + "`");
                  }
                }break;

                case "suggestion": {
                  config[message.guild.id].suggestions.channel = channel;
                  saveConfig(message.guild.id);
                  sendMessage(message, check + '|This is now the suggestion channel');
                }break;

                case "logs": {
                  switch(args[2].toLowerCase()){
                    case "message": {
                      let channel = message.guild.channels.get(args[3]);
                      if(!channel) channel = message.channel;
                      if(channel){
                        config[message.guild.id].logs.message = channel.id;
                        saveConfig(message.guild.id);
                        sendMessage(message, check + `|**#${channel.name}** is now the current log channel for messages.`);
                      } else sendMessage(message, fail + caution + "|You shouldn't have gotten this error.. Try again")
                    }break;
                    case "join": {
                      let channel = message.guild.channels.get(args[3]);
                      if(!channel) channel = message.channel;
                      if(channel){
                        config[message.guild.id].logs.joins = channel.id;
                        config[message.guild.id].logs.leaves = channel.id;
                        saveConfig(message.guild.id);
                        sendMessage(message, check + `|**#${channel.name}** is now the current log channel for leaves and joins.`);
                      } else sendMessage(message, fail + caution + "|You shouldn't have gotten this error.. Try again")
                    }break;
                    case "leave": {
                      let channel = message.guild.channels.get(args[3]);
                      if(!channel) channel = message.channel;
                      if(channel){
                        config[message.guild.id].logs.joins = channel.id;
                        config[message.guild.id].logs.leaves = channel.id;
                        saveConfig(message.guild.id);
                        sendMessage(message, check + `|**#${channel.name}** is now the current log channel for user leaves and joins.`);
                      } else sendMessage(message, fail + caution + "|You shouldn't have gotten this error.. Try again")
                    }break;
                    case "roles": {
                      let channel = message.guild.channels.get(args[3]);
                      if(!channel) channel = message.channel;
                      if(channel){
                        config[message.guild.id].logs.roles = channel.id;
                        saveConfig(message.guild.id);
                        sendMessage(message, check + `|**#${channel.name}** is now the current log channel for user role updates.`);
                      } else sendMessage(message, fail + caution + "|You shouldn't have gotten this error.. Try again")
                    }break;
                    default: {
                      let channel = message.guild.channels.get(args[2]);
                      if(!channel) channel = message.channel;
                      if(channel){
                        config[message.guild.id].logs.override = channel.id;
                        saveConfig(message.guild.id);
                        sendMessage(message, check + `|You have set **#${channel.name}** to be the location of all logs.`)
                      } else sendMessage(message, fail + caution + "|You shouldn't have gotten this error.. Try again");
                    }
                  }
                }break;

                case "shout": {
                  let msg = StrArg.slice(StrArg.indexOf('shout') + 6);
                  if(msg && msg.length > 0){
                    config[message.guild.id].shouts[message.channel.id] = msg;
                    saveConfig(message.guild.id);
                    sendMessage(message, check + info + "|The shout message for this channel (" + message.channel + ") has been set to:```\n" + msg + "```");
                  } else if(config[message.guild.id].shouts[message.channel.id]){
                    config[message.guild.id].shouts[message.channel.id] = undefined;
                    saveConfig(message.guild.id);
                    sendMessage(message, check + "|Shout was removed from this channel");
                  } else sendMessage(message, fail + "|There is no shout for this channel");
                }break;

                default: {
                  sendMessage(message, fail + "|Invalid message to set.");
                }break;
              }
            }break;

            case "add":
              if(args[1]){
                switch(args[1]){
                  case "selfassign": {
                      let argu = args;
                      argu.shift();
                      argu.shift();
                      let role = message.mentions.roles.array();
                      let roles = [];
                      if(role !== undefined && role.length > 0){
                        for(let i = 0; i < role.length; i++){
                          roles.push(role[i].id);
                        }
                      } else {
                        let rlist = message.guild.roles.array();
                        for(let i = 0; i < rlist.length; i++){
                          for(let x = 0; x < argu.length; x++){
                            if(rlist[i].name.toLowerCase() === argu[x]) roles.push(rlist[i].id);
                            if(rlist[i].id === argu[x]) roles.push(rlist[i].id);
                          }
                        }
                      }

                      if(roles !== undefined && roles.length > 0){
                        let conrole = config[message.guild.id].selfassign.roles;
                        let added = [];
                        for(let i = 0; i < roles.length; i++){
                          let alreadyPlaced = false;
                          for(let x = 0; x < conrole.length; x++){
                            if(conrole[x] === roles[i]){
                              alreadyPlaced = true;
                              break;
                            }
                          }

                          if(!alreadyPlaced){
                            config[message.guild.id].selfassign.roles.push(roles[i]);
                            added.push(message.guild.roles.get(roles[i]).name);
                          }
                        }
                        if(!config[message.guild.id].selfassign.enabled) config[message.guild.id].selfassign.enabled = true;
                        saveConfig(message.guild.id);
                        sendMessage(message, check + "|Self assignable roles updated!```\n" + added.join('\n') + "```");
                      } else {
                        sendMessage(message, fail + "You haven't specified a valid list of role ids or @ roles");
                      }
                    }
                  break;

                  case "noxp": {
                		let channels = [];
              			if(message.mentions && message.mentions.channels && message.mentions.channels.array()) channels = message.mentions.channels.array();
              			let channelList = Object.keys(channels);
              			if(channelList.length > 0){
                			let channelNames = [];
                			for(let i = 0; i < channelList.length; i++){
                        let has = false;
                        for(let [key, channel] of config[message.guild.id].leveling.noXP){
                          if(channels[channelList[i]].id === channel){
                            has = true;
                            break;
                          }
                        }
                        if(!has){
	                				config[message.guild.id].leveling.noXP[channels[channelList[i]].id] = channels[channelList[i]].id;
	                				channelNames.push("#" + channels[channelList[i]].name + "(" + channels[channelList[i]].id + ")");
                        } else {
	                				channelNames.push("ALREADY HAD - #" + channels[channelList[i]].name + "(" + channels[channelList[i]].id + ")");
                        }
                        saveConfig(message.guild.id);
                			}
                			sendMessage(message, check + "|Added to no XP channels\n" + "```\n" + channelNames.join("\n") + "```");
                		} else {
                			sendMessage(message, fail + "|No channels were mentioned");
                		}
                  }break;

                  case "levels": {
                    let role = args[2];
                    let ra = message.guild.roles.array();
                    let roles = Object.keys(ra);
                    let foundRole;
                    for(let i = 0; i < roles.length; i++){
                      let fr = ra[roles[i]];
                      if(fr.name.includes(role)){foundRole = fr.id; break;}
                      if(role === fr.id){foundRole = fr.id; break;}
                      if(role === `<&${fr.id}>`){foundRole = fr.id; break;}
                      //if(role === roles[i]){foundRole = fr.id; break;}
                    }
                    if(foundRole){
                      let lvl = Number(args[3]);
                      if(!Number.isNaN(lvl)){
                        if(lvl > 0){
                          config[message.guild.id].leveling.levelRewards[String(lvl)] = foundRole;
                          saveConfig(message.guild.id);
                          sendMessage(message, check + "|You have set a role to be given at level **" + lvl + "**: " + message.guild.roles.get(foundRole).name);
                        } else {
                          sendMessage(message, fail + "|You must specify a number greater than 0");
                        }
                      } else {
                        sendMessage(message, fail + "|You must specify a valid level number");
                      }
                    } else {
                      sendMessage(message, fail + "|Failed to retrieve the specified role");
                    }
                  }break;

                  default:
                    sendMessage(message, fail + "|That's not a valid option to add to");
                  break;
                }
              } else {
                sendMessage(message, fail + "|You must specify an option");
              }
            break;

            case "remove":
              if(args[1]){
                switch(args[1]){
                  case "selfassign":
                    if(args[2]){
                      let argu = args; argu.shift(); argu.shift();
                      let pos = [];
                      let roles = message.guild.roles.array();
                      for(let x = 0; x < argu.length; x++){
                        for(let i = 0; i < roles.length; i++){
                          if(argu[x] === roles[i].id){pos.push({pos: i, id: roles[i].id}); break;}
                          if(argu[x] === roles[i].name){pos.push({pos: i, id: roles[i].id}); break;}
                          if(argu[x].includes(roles[i].name)){pos.push({pos: i, id: roles[i].id}); break;}
                          if(argu[x] === "<@&" + roles[i].id + ">"){pos.push({pos: i, id: roles[i].id}); break;}
                        }
                      }

                      let removed = [];
                      for(let i = 0; i < pos.length; i++){
                        if(message.guild.roles.get(pos[i].id)){
                          config[message.guild.id].selfassign.roles.splice(pos[i].pos, 1);
                          removed.push(message.guild.roles.get(pos[i].id).name);
                        }
                      }
                      if(removed.length > 0){
                        sendMessage(message, check + "|You have removed the following roles:```\n" + removed.join('\n') + '```');
                      } else {
                        sendMessage(message, fail + "|No roles were removed!");
                      }
                    } else {
                      sendMessage(message, fail + "|You haven't specified a valid role id or @role");
                    }
                  break;

                  case "levels": {
                    let role = args[2];
                    let ra = message.guild.roles.array();
                    let roles = Object.keys(ra);
                    let foundRole;
                    let hasRole = '';
                    for(let i = 0; i < roles.length; i++){
                      let fr = ra[roles[i]];
                      if(fr.name.includes(role)){foundRole = fr.id; break;}
                      if(role === fr.id){foundRole = fr.id; break;}
                      if(role === `<&${fr.id}>`){foundRole = fr.id; break;}
                      //if(role === roles[i]){foundRole = fr.id; break;}
                    }
                    let cfg = config[message.guild.id].leveling.levelRewards;
                    let cfgKeys = Object.keys(cfg);
                    for(let i = 0; i < cfgKeys.length; i++){
                      if(foundRole === cfg[cfgKeys[i]]){hasRole = cfgKeys[i]; break;}
                    }
                    if(hasRole.length > 0){
                      config[message.guild.id].leveling.levelRewards[hasRole] = undefined;
                      saveConfig(message.guild.id);
                      sendMessage(message, check + '|Removed role for level **' + hasRole + '**');
                    } else {
                      sendMessage(message, fail + "|Role isn't on the list!");
                    }
                  }break;

                  case "noxp": {
                    let channels = [];
              			if(message.mentions && message.mentions.channels && message.mentions.channels.array()) channels = message.mentions.channels.array();
              			let channelList = Object.keys(channels);
              			if(channelList.length > 0){
                			let channelNames = [];
                			for(let i = 0; i < channelList.length; i++){
                        let has = false;
                        let pos;
                        let keys = Object.keys(config[message.guild.id].leveling.noXP);
                        for(let i = 0; i < keys.length; i++){
                          if(channels[channelList[i]].id === keys[i]){
                            has = true;
                            pos = i;
                            break;
                          }
                        }
                        if(has){
	                				config[message.guild.id].leveling.noXP.splice(pos, 1);
	                				channelNames.push("#" + channels[channelList[i]].name + "(" + channels[channelList[i]].id + ")");
                        } else {
	                				channelNames.push("WASN'T A NO-XP CHANNEL - #" + channels[channelList[i]].name + "(" + channels[channelList[i]].id + ")");
                        }
                        saveConfig(message.guild.id);
                			}
                			sendMessage(message, check + "|Removed from no XP channels\n" + "```\n" + channelNames.join("\n") + "```");
                		} else {
                			sendMessage(message, fail + "|No channels were mentioned");
                		}
                  }break;

                  default:
                    sendMessage(message, fail + "|That's not a valid option to remove from");
                  break;
                }
              } else {
                sendMessage(message, fail + "|You must specify an option");
              }
            break;

            case "toggle":
              switch(args[1].toLowerCase()){
                case "selfassign":
                  config[message.guild.id].selfassign.enabled = !config[message.guild.id].selfassign.enabled;
                  saveConfig(message.guild.id);
                  if(config[message.guild.id].selfassign.enabled){
                    sendMessage(message, check + "|Self assignable roles are now enabled");
                  } else {
                    sendMessage(message, check + "|Self assignable roles are now disabled");
                  }
                break;

                case "levels": {
                  config[message.guild.id].leveling.enabled = !config[message.guild.id].leveling.enabled;
                  saveConfig(message.guild.id);
                  if(config[message.guild.id].leveling.enabled) sendMessage(message, check + '|Leveling system now enabled.');
                  else sendMessage(message, check + '|Leveling system now disabled.')
                }break;

                case "react": {
                  config[message.guild.id].selfassign.react.enabled = !config[message.guild.id].selfassign.react.enabled;
                  saveConfig(message.guild.id);
                  if(config[message.guild.id].selfassign.react.enabled) sendMessage(message, check + "|React to self assign is now enabled");
                  else sendMessage(message, check + "|React to self assign is now disabled");
                }break;

                default: {
                  sendMessage(message, fail + info + "|That isn't a valid option to toggle.")
                }break;
              }
            break;

            case "selfassign": {
              switch(args[1].toLowerCase()){
                case "create": {
                  if(args[2]){
                    let argStr = StrArg.trim().split(/ +/g); argStr.shift(); argStr.shift(); argStr.shift();
                    let has = false;
                    for(let i = 0; i < config[message.guild.id].selfassign.react.groups.length; i++){
                      if(config[message.guild.id].selfassign.react.groups[i].name.toLowerCase() === argStr.join(' ').toLowerCase()){
                        has = true;
                        break;
                      }
                    }
                    if(!has){
                      config[message.guild.id].selfassign.react.groups.push({name: argStr.join(' '), roles: {}});
                      config[message.guild.id].selfassign.react.enabled = true;
                      //roles is stored as '{roleID: roleID, emoteID: emoteID}'
                      saveConfig(message.guild.id);
                      sendMessage(message, check + "|Created group self role reaction group **" + argStr.join(' ') + "**");
                    } else sendMessage(message, fail + "|A group already exists with that name")
                  } else {
                    sendMessage(message, fail + "|You must specify the group name");
                  }
                }break;
                case "delete": {
                  if(args[2]){
                    if(config[message.guild.id].selfassign.react.groups.length > 0){
                      let argStr = StrArg.trim().split(/ +/g); argStr.shift(); argStr.shift(); argStr.shift();
                      let removedGroup = '';
                      for(let i = 0; i < config[message.guild.id].selfassign.react.groups.length; i++){
                        if(config[message.guild.id].selfassign.react.groups[i].name.toLowerCase().includes(argStr.join(' ').toLowerCase())){
                          removedGroup = config[message.guild.id].selfassign.react.groups[i].name;
                          config[message.guild.id].selfassign.react.groups.splice(i, 1);
                          break;
                        }
                      }
                      saveConfig(message.guild.id);
                      if(removedGroup) sendMessage(message, check + "|Deleted react group **" + removedGroup + "**");
                      else sendMessage(message, fail + "|No react group found with \"**" + argStr + "**\" as the name");
                    } else {
                      sendMessage(message, fail + "|There are no groups to delete");
                    }
                  } else {
                    sendMessage(message, fail +"|You must specify which group to delete");
                  }
                }break;
                case "add": {
                  if(config[message.guild.id].selfassign.react.groups.length > 0){
                    if(args[4]){
                      let group = [];
                      let groupI;
                      for(let i = 0; i < config[message.guild.id].selfassign.react.groups.length; i++){
                        if(config[message.guild.id].selfassign.react.groups[i].name.toLowerCase().includes(args[2])){
                          group = config[message.guild.id].selfassign.react.groups[i];
                          groupI = i;
                          break;
                        }
                      }

                      if(group && groupI !== undefined){
                        if(Object.keys(group.roles).length < 20){
                          let argu = args;
                          argu.shift();
                          argu.shift();
                          argu.shift();
                          let role = message.mentions.roles.array();
                          let roles = [];
                          if(role !== undefined && role.length > 0){
                            for(let i = 0; i < role.length; i++){
                              roles.push(role[i].id);
                            }
                          } else {
                            let rlist = message.guild.roles.array();
                            for(let i = 0; i < rlist.length; i++){
                              for(let x = 0; x < argu.length; x++){
                                if(rlist[i].name.toLowerCase() === argu[x]) roles.push(rlist[i].id);
                                if(rlist[i].id === argu[x]) roles.push(rlist[i].id);
                              }
                            }
                          }

                          if(roles !== undefined && roles.length > 0){
                            let conrole = config[message.guild.id].selfassign.react.groups[groupI].roles;
                            let added = [];
                            for(let i = 0; i < roles.length; i++){
                              let alreadyPlaced = false;
                              for(let x = 0; x < conrole.length; x++){
                                if(conrole[x] === roles[i]){
                                  alreadyPlaced = true;
                                  break;
                                }
                              }

                              if(!alreadyPlaced){
                                config[message.guild.id].selfassign.react.groups[groupI].roles.push({roleID: roles[i], emoteID: ''});
                                added.push(message.guild.roles.get(roles[i]).name);
                              }
                            }
                            if(added.length > 0){
                              saveConfig(message.guild.id);
                              sendMessage(message, check + info + "|Group roles updated```\n" + added.join('\n') + "```");
                            } else sendMessage(message, fail + "|No roles were added, likely because those roles were already on this list");
                          } else sendMessage(message, fail + "|You must specify at least one role to add");
                        } else sendMessage(message, fail + "|There can only be 20 roles in a group");
                      } else sendMessage(message, fail + "|You must specify the group to add to");
                    } else sendMessage(message, fail + "|You must specify a group, role, and the emote ID");
                  } else sendMessage(message, fail + "|There are no groups to add roles to");
                }break;
                case "remove": {
                  if(args[3]){
                    let argStr = StrArg.trim().split(/ +/g); argStr.shift(); argStr.shift(); argStr.shift(); argStr.shift();
                    let group;
                    let groupI;
                    for(let i = 0; i < config[message.guild.id].selfassign.react.groups.length; i++){
                      if(config[message.guild.id].selfassign.react.groups[i].name.toLowerCase().includes(args[2].toLowerCase())){
                        group = config[message.guild.id].selfassign.react.groups[i];
                        groupI = i;
                        break;
                      }
                    }
                    if(group !== undefined){
                      let roles = Object.keys(group.roles);
                      if(roles.length > 0){
                        let role;
                        let roleI;
                        for(let i = 0; i < roles.length; i++){
                          if(roles[i]){
                            let crole = message.guild.roles.get(group.roles[roles[i]]);
                            if(crole){
                              if(crole.name.toLowerCase().includes(argStr.join(' ').toLowerCase())||crole.id === args[3]){
                                role = crole;
                                roleI = roles[i];
                                break;
                              }
                            } else {
                              config[message.guild.id].selfassign.react.groups[groupI].roles[roles[i]] = undefined;
                            }
                          }
                        }
                        if(role !== undefined){
                          config[message.guild.id].selfassign.react.groups[groupI].roles[roleI] = undefined;
                          saveConfig(message.guild.id);
                          sendMessage(message, check + "|Removed role **" + role.name + "** from group **" + group.name + "**");
                        } else sendMessage(message, fail + "|The role you're looking for doesn't exist");
                      } else sendMessage(message, fail + "|There are no roles to remove from **" + group.name + "**");
                    } else sendMessage(message, fail  + "|You must specify a valid group");
                  } else sendMessage(message, fail + "|You must specify the group and role");
                }break;
                default: {
                  sendMessage(message, fail + "|That's not a valid option with selfassign");
                }break;
              }
            }break;

            default:
              sendMessage(message, fail + "|That's not a config property");
            break;
          }
        } else if(args.length === 1) {
          switch(args[0]){
            case "prefix":
              sendMessage(message, info + "|The server's prefix is **" + config[guild.id].prefix + "** (You should have known this to call this command).");
            break;
          }
        }
      } else {
        sendMessage(message, fail + "|You must be administrator or moderator to use this.");
      }
    } else {
      sendMessage(message, fail + "|You must be on a server to use this!");
    }
  }
);

createCommand(
  'Shout',
  "Give a shoutout on the server.",
  "Give a shoutout on the server. With this, you don't have to copy and paste a message. You can't do roles though, bummer.",
  'shout',
  's',
  'none.',
  function(message, args){
    let shout = config[message.guild.id].shouts[message.channel.id];
    if(shout){
      message.delete();
      sendMessage(message, shout);
    } else {
      sendMessage(message, fail + "|There is no shout set for this channel!");
    }
  }
);

createCommand(
  'Self Assign',
  'Give yourself a role that the server gives you.',
  'Give yourself a role that the server gives you.',
  'role',
  ['roles', 'assign', 'selfassign', 'sa'],
  '[list|add|remove] [add|remove:role name,role id]',
  function(message, args){
    if(message.guild){
      if(config[message.guild.id].selfassign.enabled){
        switch(args[0]){
          case "add": {
            let arg = args; arg.shift();
            let role = arg.join(' ').toLowerCase();
            if(arg.length > 0 && role){
              let roles = config[message.guild.id].selfassign.roles;
              if(roles.length > 0){
                let rlist = message.guild.roles.array();
                let list = [];
                for(let i = 0; i < rlist.length; i++){
                  for(let x = 0; x < roles.length; x++){
                    if(rlist[i].id === roles[x]) list.push([rlist[i].id, rlist[i].name]);
                  }
                }

                if(list.length > 0){
                  let newRole;
                  let roleName;
                  for(let i = 0; i < list.length; i++){
                    if(role === list[i][0]){newRole = list[i][0]; roleName = list[i][1]; break;}
                    if(role === list[i][1].toLowerCase()){newRole = list[i][0]; roleName = list[i][1]; break;}
                    if(role === "<@&" + list[i][0] + ">"){newRole = list[i][0]; roleName = list[i][1]; break;}
                  }
                  if(newRole){
                    message.member.addRole(newRole).then(function(){
                      switch(config[message.guild.id].selfassign.msg.mode.toLowerCase()){
                        case "dm":
                          bot.users.get(message.author.id).send(check + "|" + config[message.guild.id].selfassign.msg.response.replace('$role', roleName).replace('$server', message.guild.name).replace('$mode', 'now have'));
                        break;
                      }
                      switch(config[message.guild.id].selfassign.msg.after.toLowerCase()){
                        case "delete":
                          message.delete();
                        break;
                      }
                    }).catch(function(err){
                      sendMessage(message, fail + "|Unable to assign role. Likely due to LifeBot's role not being above the role assigned, or no access");
                    });
                  } else {
                    sendMessage(message, fail + "|This role is not on the list");
                  }
                } else {
                  sendMessage(message, fail + "|This role is not on the list");
                }
              } else {
                sendMessage(message, fail + "|This server doesn't have any self assignable roles");
              }
            } else {
              sendMessage(message, fail + "|You must specify a role id or role name");
            }
          }break;

          case "remove": {
            let arg = args; arg.shift();
            let role = arg.join(' ').toLowerCase();
            if(arg.length > 0 && role){
              let roles = config[message.guild.id].selfassign.roles;
              if(roles.length > 0){
                let rlist = message.guild.roles.array();
                let list = [];
                for(let i = 0; i < rlist.length; i++){
                  for(let x = 0; x < roles.length; x++){
                    if(rlist[i].id === roles[x]) list.push([rlist[i].id, rlist[i].name]);
                  }
                }

                if(list.length > 0){
                  let newRole;
                  let roleName;
                  for(let i = 0; i < list.length; i++){
                    if(role === list[i][0]){newRole = list[i][0]; roleName = list[i][1]; break;}
                    if(role === list[i][1].toLowerCase()){newRole = list[i][0]; roleName = list[i][1]; break;}
                    if(role === "<@&" + list[i][0] + ">"){newRole = list[i][0]; roleName = list[i][1]; break;}
                  }
                  if(newRole){
                    message.member.removeRole(newRole).then(function(){
                      switch(config[message.guild.id].selfassign.msg.mode.toLowerCase()){
                        case "dm":
                          bot.users.get(message.author.id).send(check + "|" + config[message.guild.id].selfassign.msg.response.replace('$role', roleName).replace('$server', message.guild.name).replace('$mode', 'no longer have'));
                        break;
                      }
                      switch(config[message.guild.id].selfassign.msg.after.toLowerCase()){
                        case "delete":
                          message.delete();
                        break;
                      }
                    }).catch(function(err){
                      sendMessage(message, fail + "|Unable to remove role. Likely due to LifeBot's role not being above the role assigned, or no access");
                    });
                  } else {
                    sendMessage(message, fail + "|This role is not on the list");
                  }
                } else {
                  sendMessage(message, fail + "|This role is not on the list");
                }
              } else {
                sendMessage(message, fail + "|This server doesn't have any self assignable roles");
              }
            } else {
              sendMessage(message, fail + "|You must specify a role id or role name");
            }
          }break;

          default:
            let roles = config[message.guild.id].selfassign.roles;
            let list = [];
            let rlist = message.guild.roles.array();
            for(let i = 0; i < rlist.length; i++){
              for(let x = 0; x < roles.length; x++){
                if(rlist[i].id === roles[x]) list.push(rlist[i].name + " | ID: " + rlist[i].id);
              }
            }
            if(list.length > 0){
              list = list.sort();
              sendMessage(message, info + "|This server's self assignable roles:```\n" + list.join('\n') + "```");
            } else {
              sendMessage(message, fail + "|This guild doesn't have any self assignable roles");
            }
          break;
        }
      } else {
        sendMessage(message, fail + "|Self assign plugin is not enabled on this guild");
      }
    } else {
      sendMessage(message, fail + "|You must be on a guild to use this");
    }
  }
);
createCommand(
  "Daily",
  "Get a daily amout of money that increases with more streaks.",
  "Get a daily amout of money that increases with more streaks.\nA streak is $5 each day you do a daily. It get's reset after two days of not doing a daily.\nThere is a 5% tax on the money before you get it.",
  "daily",
  'dailies',
  "none | [@user|userid]",
  function(message, args){
    let ply;
    if(message.guild && message.mentions) ply = message.mentions.members.first();
    if(!ply) ply = bot.users.get(args[0]);
    if(!ply && !args[0]) ply = message.author;

    if(ply){
      setupData(ply.id);
      let can = false;
      let cStreak = true;
      if(message.createdTimestamp - data[message.author.id].time.daily >= day){can = true;}
      if(can){
        if(message.createdTimestamp - data[message.author.id].time.daily <= day*2){cStreak = false;}

        if(cStreak) data[message.author.id].streak.daily = 0;
        data[message.author.id].time.daily = message.createdTimestamp;
        data[message.author.id].streak.daily += 1;

        let mon = 100;
        let bonus = data[message.author.id].streak.daily * 5;
        mon += bonus;
        let inc = mon;
        let tax = Number((mon*0.05).toFixed(2));
        mon -= tax;

        data[ply.id].money += mon;
        increaseMoneyEarned(mon);
        saveData(ply.id);
        //Receipt------------------------------------------------------------
        let output = spaceObject( {
            Income: (inc - bonus).toFixed(2),
            Bonus: bonus.toFixed(2),
            Tax: -tax.toFixed(2),
            SPACER: '',
            Total: mon.toFixed(2),
            Balance: data[ply.id].money.toFixed(2)
        }, '| ', ' |', ': ', ' ', '-', 3 );
        let txt = prize + "|Daily claimed to **" + bot.users.get(ply.id).username + "**```\n" + output + "```";
        sendMessage(message, txt);
      } else {
        sendMessage(message, fail + "|You can claim a daily again in " + formatTime(data[ply.id].time.daily + day - message.createdTimestamp, "**$hour**h **$min**m **$sec**s"));
      }
    } else {
      sendMessage(message, fail + "|You must give a valid userid or @ someone");
    }
  }
);
createCommand(
  'Suggest',
  'Suggest features for the guild you\'re in.',
  'Suggest features for the guild you\'re in.',
  'suggest',
  ['suggestion'],
  '[suggestion | ID] [ID:implement,approve,consider,accept,deny] [ID:reason]',
  function(message, args, argStr){
    if(message.guild){
      setupConfig(message.guild.id);
      let user = bot.users.get(message.author.id);
      //Is guild-----------------------------------------------------------
      let cfg = setupCopy({}, config[message.guild.id].suggestions);
      if(message.guild.channels.get(cfg.channel) !== undefined){
        //If config channel exists
        let keys = Object.keys(cfg.list);
        if(keys.includes(args[0])){
          //Consider,Denying,etc-------------------------------------------
          if(message.member.permissions.has('ADMINISTRATOR')){
            switch(args[1].toLowerCase()){
              case "implement": {
                //Implementing---------------------------------------------
                let reason = argStr.trim().replace('```', '').slice(argStr.trim().toLowerCase().indexOf('implement') + 10).substring(0, 900);
                if(argStr.length > 0){
                  message.guild.channels.get(cfg.channel).fetchMessage(args[0]).then(msg => {
                    let user = bot.users.get(message.author.id);
                    config[message.guild.id].suggestions.list[args[0]].status = {
                      is: 'Implemented',
                      reason: reason,
                      by: message.author.id
                    };
                    saveConfig(message.guild.id)
                    msg.edit(cfg.list[args[0]].str + `\n\nImplemented by **${user.username}#${user.discriminator}** (${user.id})\n${reason}`);
                    message.delete();
                  }).catch(console.log);
                } else sendMessage(message, fail + "|You must provide a reason");
              }break;
              case "approve": {
                //Approving------------------------------------------------
                let reason = argStr.trim().replace('```', '').slice(argStr.trim().toLowerCase().indexOf('approve') + 8).substring(0, 900);
                if(argStr.length > 0){
                  message.guild.channels.get(cfg.channel).fetchMessage(args[0]).then(msg => {
                    let user = bot.users.get(message.author.id);
                    config[message.guild.id].suggestions.list[args[0]].status = {
                      is: 'Approved',
                      reason: reason,
                      by: message.author.id
                    };
                    saveConfig(message.guild.id)
                    msg.edit(cfg.list[args[0]].str + `\n\nApproved by **${user.username}#${user.discriminator}** (${user.id})\n${reason}`);
                    message.delete();
                  }).catch(console.log);
                } else sendMessage(message, fail + "|You must provide a reason");
              }break;
              case "consider": {
                //Considering---------------------------------------------
                let reason = argStr.trim().replace('```', '').slice(argStr.trim().toLowerCase().indexOf('consider') + 9).substring(0, 900);
                if(argStr.length > 0){
                  message.guild.channels.get(cfg.channel).fetchMessage(args[0]).then(msg => {
                    let user = bot.users.get(message.author.id);
                    config[message.guild.id].suggestions.list[args[0]].status = {
                      is: 'Considered',
                      reason: reason,
                      by: message.author.id
                    };
                    saveConfig(message.guild.id)
                    msg.edit(cfg.list[args[0]].str + `\n\nConsidered by **${user.username}#${user.discriminator}** (${user.id})\n${reason}`);
                    message.delete();
                  }).catch(console.log);
                } else sendMessage(message, fail + "|You must provide a reason");
              }break;
              case "accept": {
                //Accepting------------------------------------------------
                let reason = argStr.trim().replace('```', '').slice(argStr.trim().toLowerCase().indexOf('accept') + 7).substring(0, 900);
                if(argStr.length > 0){
                  message.guild.channels.get(cfg.channel).fetchMessage(args[0]).then(msg => {
                    let user = bot.users.get(message.author.id);
                    config[message.guild.id].suggestions.list[args[0]].status = {
                      is: 'Accepted',
                      reason: reason,
                      by: message.author.id
                    };
                    saveConfig(message.guild.id)
                    msg.edit(cfg.list[args[0]].str + `\n\nAccepted by **${user.username}#${user.discriminator}** (${user.id})\n${reason}`);
                    message.delete();
                  }).catch(console.log);
                } else sendMessage(message, fail + "|You must provide a reason");
              }break;
              case "deny": {
                //denying--------------------------------------------------
                let reason = argStr.trim().replace('```', '').slice(argStr.trim().toLowerCase().indexOf('deny') + 5).substring(0, 900);
                if(argStr.length > 0){
                  message.guild.channels.get(cfg.channel).fetchMessage(args[0]).then(msg => {
                    let user = bot.users.get(message.author.id);
                    config[message.guild.id].suggestions.list[args[0]].status = {
                      is: 'Denied',
                      reason: reason,
                      by: message.author.id
                    };
                    saveConfig(message.guild.id)
                    msg.edit(cfg.list[args[0]].str + `\n\nDenied by **${user.username}#${user.discriminator}** (${user.id})\n${reason}`);
                    message.delete();
                  }).catch(console.log);
                } else sendMessage(message, fail + "|You must provide a reason");
              }break;

              default: sendMessage(message, fail + "|That's not a valid operation on a suggestion"); break;
            }
          } else sendMessage(message, fail + "|You don't have access to changing suggestions")
        } else {
          let tempTbl = argStr.trim().split(/ +/g);
          tempTbl.shift();
          let tempStr = tempTbl.join(" ").substring(0, 900);

          let str = `New suggestion by **${user.username}#${user.discriminator}** (${user.id})\n${tempStr}`;
          if(tempStr.length > 0){
            //Base of table------------------------------------------------
            let tbl = {
              status: {
                is: '',
                reason: '',
                by: '',
              },
              by: message.author.id,
              suggesting: argStr,
            };
            message.guild.channels.get(cfg.channel).send(str).then(newMsg => {
              let string = `New suggestion by **${user.username}#${user.discriminator}** (${user.id})\nID: ${newMsg.id}\n${tempStr}`;
              newMsg.edit(string).catch(console.log);
              //React with :check_mark: and :cancel:-----------------------
              newMsg.react('498332138421092352').then(() => {
                newMsg.react('498537778200576000').catch(console.log);
              }).catch(console.log);
              tbl.msg = newMsg.id;
              tbl.str = string;
              config[message.guild.id].suggestions.list[newMsg.id] = tbl;
              saveConfig(message.guild.id);
              message.delete();
            }).catch(console.log);
          } else sendMessage(message, fail + "|You need to suggest something");
        }
      } else sendMessage(message, fail + "|The current guild doesn't have a suggestion channel");
    } else sendMessage(message, fail + "|You must be on a guild to use this command");
  }
);
createCommand(
  'Weekly',
  'Earn a set amount of money each week + streak.',
  'Earn $1750 a week with a command. You get an extra $100 for streak.',
  'weekly',
  [],
  '[@user|userid]',
  function(message, args){
    let ply;
    if(message.guild && message.mentions.members.array().length > 0) ply = message.mentions.members.first();
    if(!ply) ply = bot.users.get(args[0]);
    if(!ply) ply = message.author;

    if(ply){
      setupData(ply.id);
      if(message.createdTimestamp - data[message.author.id].time.weekly >= day*7){
        if(message.createdTimestamp - data[message.author.id].time.weekly >= day*8) data[message.author.id].streak.weekly = 0;
        data[message.author.id].time.weekly = message.createdTimestamp;
        data[message.author.id].streak.weekly++;

        let mon = 1750;
        let bonus = data[message.author.id].streak.weekly * 100;
        mon += bonus;
        let inc = mon;
        let tax = Number((mon*0.05).toFixed(2));
        mon -= tax;

        data[ply.id].money += mon;
        increaseMoneyEarned(mon);
        saveData(ply.id);
        //Receipt------------------------------------------------------------
        let output = spaceObject( {
            Income: (inc - bonus).toFixed(2),
            Bonus: bonus.toFixed(2),
            Tax: -tax.toFixed(2),
            SPACER: '',
            Total: mon.toFixed(2),
            Balance: data[ply.id].money.toFixed(2)
        }, '| ', ' |', ': ', ' ', '-', 3 );
        let txt = prize + "|Weekly claimed to **" + bot.users.get(ply.id).username + "**```\n" + output + "```";
        sendMessage(message, txt);
      } else {
        sendMessage(message, fail + "|You can claim a weekly again in " + formatTime(data[message.author.id].time.weekly + (day*7) - message.createdTimestamp, "**$day**d **$hour**h **$min**m **$sec**s"))
      }
    } else {
      sendMessage(message, fail + "|You must mention a valid person or userid.");
    }
  }
);
createCommand(
  'Clean',
  "Clean the chat of messages.",
  "Clean the chat of messages. No argument deletes 10. Due to Discord's API, you can only delete 100 messages at a time, and they can't be older than 2 weeks.",
  'clean',
  'cl',
  '[amount]',
  function(message, args){
    if(message.guild){
      setupConfig(message.guild.id);
      let guild = message.guild;
      let can = false;
      if(message.author.id === guild.ownerID){can = true;}
      else if(message.member.roles.has(config[guild.id].adminrole)){can = true;}
      else if(message.member.permissions.has('ADMINISTRATOR')||message.member.permissions.has('MANAGE_MESSAGES')){can = true;}
      else {
        for(let i = 0; i < config[guild.id].admins.length; i++){
          if(message.author.id === config[guild.id].admins[i]){can = true; break;}
        }
      }
      if(can){
        let am = 11;
        if(args[0]){
          am = clamp(Math.round(Number(args[0])), 1, 100) + 1;
        }
        if(typeof am !== "number" || Number.isNaN(am)) am = 11;
        message.delete();
        async function dl(){
          let msgs = await message.channel.fetchMessages({limit: am});
          message.channel.bulkDelete(msgs).then(function(){
            sendMessage(message, check + "|Cleaned **" + (am - 1) + "** messages.").then(function(newmsg){newmsg.delete(3000);});
          });
        }
        dl();
      } else {
        sendMessage(message, fail + "|You do not have moderation access, more specifically, managing messages access.");
      }
    } else {
      sendMessage(message, fail + "|You must be on a server to use this.");
    }
  }
);
createCommand(
  "Server Information",
  'Get information about the server.',
  'Get information about the server, such as who owns it, when was it made, etc.',
  'sinfo',
  ['server', 'sinformation', 'serverinfo', 'serverinformation', 'guild', 'guildinformation', 'guildinfo', 'ginfo', 'ginformation'],
  'none',
  function(message, args){
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
    } else {
      sendMessage(message, fail + "|You must be on a server to use this.");
    }
  }
);
createCommand(
  'User Information',
  'Get information from the guild or from the bot',
  'Get information from the guild or from the bot',
  'info',
  ['information', 'userinfo', 'user', 'userinformation'],
  '[@user|userid] [bot|guild]',
  function(message, args, argStr){
    let user;
    let member;
    if(args.length === 0){
      user = bot.users.get(message.author.id);
      member = message.member;
    } else {
      if(message.mentions && message.mentions.members) user = bot.users.get(message.mentions.members.first().id);
      if(user === undefined) user = bot.users.get(args[0]);
      if(user !== undefined && message.guild) member = message.guild.members.get(user.id);
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
      //embed.setImage(user.avatarURL);
      sendMessage(message, {embed});
    } else {
      sendMessage(message, fail + "|You must mention a valid user/userid")
    }
  }
);
createCommand(
  'Avatar',
  'Get someone\'s avatar.',
  'Get someone\'s avatar.',
  'avatar',
  [],
  '[@user|userid]',
  function(message, args){
    let ply;
    if(message.guild && message.mentions && message.mentions.members && message.mentions.members.first()) ply = bot.users.get(message.mentions.members.first().id);
    if(!ply) ply = bot.users.get(args[0]);
    if(!ply) ply = message.author;
    let embed = new Discord.RichEmbed().setImage(ply.avatarURL);
    sendMessage(message, file + "|**" + ply.username + "**'s avatar:", {embed});
  }
);
createCommand(
  'Profile',
  'Check your profile card.',
  'Check your profile card. All usages:\n•`profile [@user|userid]` - displays a user\'s profile card\n•`profile badges [@user|userid]` - displays a user\'s badges\n•`profile badges equip [badgeID] [pos]` - equips badge in a position\n•`profile badges equip` - shows index of empty badge positions\n•`profile badges unequip [badgeID|pos]` - Removes a badge.\n•`profile color list` - Displays a list of colors\n•`profile color [color]` - Set the color of your profile',
  'profile',
  [],
  'please do "help profile" for usage',
  function(message, args){
    function makeImage(ply){
      let user = bot.users.get(ply);
      message.channel.startTyping(10);
      new Jimp(512, 512, 0x00000000, (err, img) => {
        if(err) sendMessage(message, caution + "|Error: " + err);

        function box(posX, posY, sizeX, sizeY, color){
          for(let x = posX; x < posX + sizeX; x++){
            for(let y = posY; y < posY + sizeY; y++){
              img.setPixelColor(color, x, y);
            }
          }
        }
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

        Jimp.read(bot.users.get(ply).avatarURL + "?size=128", (err, avatar) => {
          if(err) console.log(err);

          let backImg = backgrounds[data[ply].profile.background];
          if(!backImg) backImg = backgrounds[Object.keys(backgrounds)[0]];
          if(!backImg) backImg = blackBackround;
          let backColor = data[ply].profile.color;

          avatar.resize(116, 116);
          box(0, 0, 512, 512, backColor);
          box(6, 6, 500, 500, 0x646464FF);
          box(6, 6, 500, 250, 0x000000FF);
          img.blit(backImg, 6, 6);
          box(256-128/2, 256-128, 128, 128, backColor);
          box(256-116/2, 250-116, 116, 116, 0x000000FF);
          img.blit(avatar, 256-116/2, 250-116);
          box(0, 250, 512, 6, backColor);
          box(253, 256, 6, 256, backColor);
          box(12, 262, 235, 236, 0x858585FF);

          let isOwner = false;
          let isDev = false;
          let isTest = false;
          for(let i = 0; i < owners.length; i++){
            if(ply === owners[i]){isOwner = true; break;}
          }
          if(!isOwner){
            for(let i = 0; i < developers.length; i++){
              if(ply === developers[i]){isDev = true; break;}
            }
            if(!isDev){
              for(let i = 0; i < testers.length; i++){
                if(ply === testers[i]){isTest = true; break;}
              }
            }
          }
          box(265, 262, 235, 236, 0x858585ff);
          if(isOwner||isDev||isTest){
            let txt;
            if(isTest) txt = 'Tester';
            if(isDev) txt = 'Devloper';
            if(isOwner) txt = 'Owner';
            box(269, 268, 226, 20, backColor);
            text(txt, 269, 268, 235, 20);
            text(user.username, 269, 262+(236/4-6)-24, 227, 16);
          } else {
            text(user.username, 269, 268, 227, 32);
          }
          box(269, 256 + (236/4), 227, 236/4/2, 0x646464ff);
          text('Rep |', 275, 256 + (236/4), 40, 236/4/1.25);
          text(String(data[user.id].profile.reputation), 275 + 40, 256 + (236/4), 227 - 46, 236/4/2);

          // box(265, 262, 235, 236/4-6, 0x858585FF);
          // box(271, 268, 53, 236/4-18, 0xaaaaaaFF);
          // box(265+56, 268, 235-62, 236/4-18, 0x646464FF);
          // img.blit(cardImg.bal, 277, 274);
          // text(data[ply].money.toFixed(2), 265+62, 274, 235-62, 32);

          for(let i = 0; i < 9; i++){
            let pos = (i % 3) * 78;
            let y  = 0;
            if(i > 2 && i < 5) y = 1;
            else if(i > 5) y = 2;
            let posy = y * 78;

            if(data[ply].profile.badgeShowcase[i] !== ""){
              img.blit(badges[data[ply].profile.badgeShowcase[i]], 12 + pos, 262 + posy);
            }
          }

          //img.write('profiles/' + ply + ".png");
          img.getBufferAsync(Jimp.MIME_JPEG).then(imgData => {
            sendMessage(message, file + "|**" + bot.users.get(ply).username + "**'s profile card:", {files: [imgData]});
            message.channel.stopTyping(true);
          }).catch(err => {
            sendMessage(message, fail + caution + "|Error uploading image, please try again. ```\n" + err + '```');
            message.channel.stopTyping(true);
          });
          // setTimeout(() => {
          //   sendMessage(message, file + "|**" + bot.users.get(ply).username + "**'s profile card:", {files: ['./profiles/' + ply + ".png"]}).then(function(){sendMessage(message, 'Message sent: ' + (Date.now() - startTime));}).catch(function(err){
          //     if(err) console.log(err);
          //     makeImage(ply);
          //   });
          //   message.channel.stopTyping(true);
          // }, 100);
        });
      });
    }
    if(args.length === 0){
      makeImage(message.author.id);
    } else if(args.length === 1){
      if(args[0] === "badges"){
        if(data[message.author.id].profile.badges.length > 0){
          sendMessage(message, info + "|Your current badges:```\n" + data[message.author.id].profile.badges.join('\n') + "```");
        } else {
          sendMessage(message, info + "|You have no badges!");
        }
      } else {
        let ply;
        if(message.guild && message.mentions.members) ply = message.mentions.members.first();
        if(!ply) ply = bot.users.get(args[0]);
        if(ply){
          setupData(ply.id);
          makeImage(ply.id);
        } else {
          sendMessage(message, fail + "|You must specify a valid person.");
        }
      }
    } else {
      switch(args[0]){
        case "color":
          if(args[1] === "list"){
            sendMessage(message, info + "|You may use any named color in CSS. https://developer.mozilla.org/en-US/docs/Web/CSS/color_value | You can also do `default` for the default blue color." );
          } else {
            if(colors[args[1].toLowerCase()] && typeof colors[args[1].toLowerCase()] === "number"){
              data[message.author.id].profile.color = colors[args[1].toLowerCase()];
              saveData(message.author.id);
              sendMessage(message, check + "|You have set your profile card color to **" + args[1].toLowerCase() + "**.");
            } else if(args[1] === "default"){
              data[message.author.id].profile.color = 0x0096FFFF;
              saveData(message.author.id);
              sendMessage(message, check + "|You have set your profile card color to **default blue**.");
            } else {
              sendMessage(message, fail + "|Invalid color. Any color you can use can be found in CSS. https://developer.mozilla.org/en-US/docs/Web/CSS/color_value | You can also do `default` for the default blue color");
            }
          }
        break;
        case "badges":
          switch(args[1]){
            case "show":
              if(data[message.author.id].profile.badges.length > 0){
                sendMessage(message, info + "|Your current badges:```" + data[message.author.id].profile.badges.join('\n') + "```");
              } else {
                sendMessage(message, info + "|You have no badges!");
              }
            break;

            case "equip":
              if(args.length === 2){
                let pos = "|-------------|\n" +
                          "| [0] [1] [2] |\n" +
                          "|             |\n" +
                          "| [3] [4] [5] |\n" +
                          "|             |\n" +
                          "| [6] [7] [8] |\n" +
                          "|-------------|";

                for(let i = 0; i < data[message.author.id].profile.badgeShowcase.length; i++){
                  if(data[message.author.id].profile.badgeShowcase[i] !== "") pos = pos.replace('[' + i + "]", '   ');
                }
                sendMessage(message, info + "|Where you can equip badges:```\n" + pos + "```How to equip: profile badges equip [badge] [pos]");
              } else if(args.length === 3){sendMessage(message, fail + "|You must also specify a position!");}
              else if(args.length === 4){
                if(badges[args[2]] && Object.keys(badges).includes(args[2])){
                  let badge = data[message.author.id].profile.badges;
                  let badgeS = data[message.author.id].profile.badgeShowcase;
                  let has = false;
                  for(let i = 0; i < badge.length; i++){
                    if(badge[i].toLowerCase() === args[2].toLowerCase()){has = true; break;}
                  }
                  let placed = false;
                  let placedPos;
                  for(let i = 0; i < badgeS.length; i++){
                    if(badgeS[i] !== "" && badgeS[i].toLowerCase() === args[2].toLowerCase()){placed = true; placedPos = i; break;}
                  }

                  if(has){
                    if(placed) data[message.author.id].profile.badgeShowcase[placedPos] = "";
                    let pos = clamp(parseInt(args[3]), 0, 8);
                    if(typeof pos === "number" && (pos < Infinity && pos > -Infinity)){
                      data[message.author.id].profile.badgeShowcase[clamp(Number(pos), 0, 8)] = args[2].toLowerCase();
                      sendMessage(message, check + "|You have set badge **" + args[2].toLowerCase() + "** to display at position **" + clamp(Number(pos), 0, 8) + "**.");
                      saveData(message.author.id);
                    } else {
                      sendMessage(message, fail + "|You must specify a valid position");
                    }
                  } else {
                    sendMessage(message, fail + "|You don't have this badge!");
                  }
                } else {
                  sendMessage(message, fail + "|**" + args[2] + "** is not a badge!");
                }
              }
            break;
            case "unequip":
              let show = data[message.author.id].profile.badgeShowcase;
              let placed = false;
              let placedPos;
              for(let i = 0; i < show.length; i++){
                if(show[i] === args[2].toLowerCase()){placed = true; placedPos = i; break;}
              }

              if(placed){
                data[message.author.id].profile.badgeShowcase[placedPos] = "";
                saveData(message.author.id);
                sendMessage(message, check + "|You have removed badge **" + args[2].toLowerCase() + "** from your profile card");
              } else {
                if(show[Number(args[2])] && show[Number(args[2])] !== "" && Object.keys(show).includes(args[2].toLowerCase())){
                  let b = data[message.author.id].profile.badgeShowcase[Number(args[2])];
                  data[message.author.id].profile.badgeShowcase[Number(args[2])] = "";
                  saveData(message.author.id);
                  sendMessage(message, check + "|You have removed badge **" + b + "** from your profile card");
                } else {
                  sendMessage(message, fail + "|You must specify the badge or position of the badge");
                }
              }
            break;

            default:
            let ply;
            if(message.guild && message.mentions) ply = message.mentions.members.first();
            if(!ply) ply = bot.users.get(args[1]);
            if(ply){
              setupData(ply.id);
              if(data[ply.id].profile.badges.length > 0){
                sendMessage(message, info + "|**" + bot.users.get(ply.id).username + "**'s current badges:```" + data[ply.id].profile.badges.join('\n') + "```");
              } else {
                sendMessage(message, info + "|**" + bot.users.get(ply.id).username + "** has no badges!");
              }
            } else {
              sendMessage(message, fail + "|You must specify a valid person.");
            }
            break;
          }
        break;
      }
    }
  }
);

createCommand(
  'Mine',
  'Mine for money.',
  'Mine for money on a 10x10 grid. There is a cooldown of one minute. All ores, rarities, and sell values:\n•Stone: 35%, $5\n•Coal: 25%, $7.50\n•Copper: 20%, $12.50\n•Iron: 10%, $20\n•Gold: 7%, $40\n•Diamond: 3%, $75\n\n' +
  'Instead of selling each type individually, you can sell all by selling the type `all`. You can also check your inventory with ~inventory. You can @ someone or give their userid to view their mine, or their inventory.',
  'mine',
  [],
  '[pos|sell|inv] sell:[type]',
  function(message, args){
    function makeImg(ply){
      new Jimp(300, 300, 0x00000000, (err, img) => {
        message.channel.startTyping(10);
        if(err) sendMessage(message, caution + "|Error: " + err);

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
              if(dist(x, y, posX, posY) <= rad){
                img.setPixelColor(color, x, y);
              }
            }
          }
        }
        if(checkMine(ply, message.createdTimestamp)){
          generateMine(ply, message.createdTimestamp);
        }
        for(let y = 0; y < 10; y++){
          for(let x = 0; x < 10; x++){
            let space = data[ply].mine[letters[y] + letters[x]];
            img.blit(mine.stone, x*30, y*30);
            if(space.visible){
              switch(space.type){
                case "stone":
                  //img.blit(mine.stone, x*30, y*30);
                  if(space.mined){
                    box(x*30, y*30, 30, 30, 0x00000000);
                  }
                break;
                case "coal":
                  //box(x*30, y*30, 30, 30, 0x383838ff);
                  if(space.mined){
                    box(x*30, y*30, 30, 30, 0x00000000);
                  }
                  img.blit(mine.coal, x*30, y*30);
                break;
                case "copper":
                  //box(x*30, y*30, 30, 30, 0xb76e79ff);
                  if(space.mined){
                    box(x*30, y*30, 30, 30, 0x00000000);
                  }
                  img.blit(mine.copper, x*30, y*30);
                break;
                case "iron":
                  //box(x*30, y*30, 30, 30, 0xbbbbbbff);
                  if(space.mined){
                    box(x*30, y*30, 30, 30, 0x00000000);
                  }
                  img.blit(mine.iron, x*30, y*30);
                break;
                case "gold":
                  //box(x*30, y*30, 30, 30, 0xffb500ff);
                  if(space.mined){
                    box(x*30, y*30, 30, 30, 0x00000000);
                  }
                  img.blit(mine.gold, x*30, y*30);
                break;
                case "diamond":
                  //box(x*30, y*30, 30, 30, 0x9ac5dbff);
                  if(space.mined){
                    box(x*30, y*30, 30, 30, 0x00000000);
                  }
                  img.blit(mine.diamond, x*30, y*30);
                break;
                default:
                  box(x*30, y*30, 30, 30, 0x00000000);
                break;
              }
            } else {
              box(x*30, y*30, 30, 30, 0x666666ff);
            }
          }
        }

        img.blit(LetterOverlay, 0, 0);

        img.getBufferAsync(Jimp.MIME_PNG).then(imgData => {
          sendMessage(message, file + "|**" + bot.users.get(ply).username + "**'s mine (Reset in " + formatTime(data[ply].mine.lastGenDate + day - message.createdTimestamp, '**$hour**h **$min**m **$sec**s') + "):", {files: [imgData]});
          message.channel.stopTyping(true);
        }).catch(err => {
          sendMessage(message, fail + caution + "|Error uploading image, please try again. ```\n" + err + '```');
          message.channel.stopTyping(true);
        });
      });
    }
    if(args.length === 0){
      makeImg(message.author.id);
    } else if(args.length === 1){
      if(args[0].toLowerCase() === "all"){
        let can = false;
        for(let i = 0; i < owners.length; i++){
          if(message.author.id === owners[i]){can = true; break;}
        }
        if(!can){
          for(let i = 0; i < developers.length; i++){
            if(message.author.id === developers[i]){can = true; break;}
          }
        }
        if(can){
          setupData(message.author.id);
          if(checkMine(message.author.id, message.createdTimestamp)){
            generateMine(message.author.id, message.createdTimestamp);
          }
          let keys = Object.keys(data[message.author.id].mine);
          let mined = 0;
          for(let i = 0; i < keys.length; i++){
            if(!data[message.author.id].mine[keys[i]].mined && typeof data[message.author.id].mine[keys[i]] === "object"){
              mined++;
              data[message.author.id].inventory.minerals[data[message.author.id].mine[keys[i]].type] += 1;
              data[message.author.id].mine[keys[i]].visible = true;
              data[message.author.id].mine[keys[i]].mined = true;
            }
          }
          sendMessage(message, info + "|You have mined **" + mined + "** ores in your mine!")
        } else {
          sendMessage(message, fail + info + "|You have found a secret hidden developer command");
        }
      } else if(args[0].toLowerCase() === "reset"){
        let can = false;
        for(let i = 0; i < owners.length; i++){
          if(message.author.id === owners[i]){can = true; break;}
        }
        if(!can){
          for(let i = 0; i < developers.length; i++){
            if(message.author.id === developers[i]){can = true; break;}
          }
        }
        if(can){
          let ply;
          if(message.guild && message.mentions.members.size > 0) ply = bot.users.get(message.mentions.members.first().id);
          if(!ply) ply = bot.users.get(args[1]);
          if(!ply) ply = bot.users.get(message.author.id);
          if(ply){
            setupData(ply.id);
            generateMine(ply.id, message.createdTimestamp);
            saveData(ply.id);
            sendMessage(message, check + "|You have reset **" + ply.username + "**'s mine.");
          } else sendMessage(message, fail + caution + "|You somehow got an internal error where you didn't define anyone and you weren't targeted");
        } else sendMessage(message, fail + "|You have found a secret hidden developer command.");
      } else if(Object.keys(data[message.author.id].mine).includes(args[0].toLowerCase())){
        if(checkMine(message.author.id, message.createdTimestamp)){
          generateMine(message.author.id, message.createdTimestamp);
        }
        if(message.createdTimestamp - data[message.author.id].time.mine >= min){
          if(!data[message.author.id].mine[args[0].toLowerCase()].mined){
            if(Object.keys(data[message.author.id].inventory.minerals).includes(data[message.author.id].mine[args[0].toLowerCase()].type)){
              if(data[message.author.id].money >= 7){
                let mined = data[message.author.id].mine[args[0].toLowerCase()].type;
                data[message.author.id].mine[args[0].toLowerCase()].visible = true;
                data[message.author.id].mine[args[0].toLowerCase()].mined = true;
                data[message.author.id].inventory.minerals[mined] += 1;
                data[message.author.id].time.mine = message.createdTimestamp;
                data[message.author.id].money -= 7;
                let xPos = args[0].toLowerCase().split('')[0];
                let yPos = args[0].toLowerCase().split('')[1];
                for(let i = 0; i < 10; i++){
                  if(xPos === letters[i]) xPos = i;
                  if(yPos === letters[i]) yPos = i;
                }

                let left  = letters[xPos - 1] + letters[yPos];
                let right = letters[xPos + 1] + letters[yPos];
                let up    = letters[xPos] + letters[yPos - 1];
                let down  = letters[xPos] + letters[yPos + 1];

                // let leftup = letters[xPos - 1] + letters[yPos - 1];
                // let hasLeftUp = false;
                // let rightup = letters[xPos + 1] + letters[yPos - 1];
                // let hasRightUp = false;
                // let leftdown = letters[xPos - 1] + letters[yPos + 1];
                // let hasLeftDown = false;
                // let rightdown = letters[xPos + 1] + letters[yPos + 1];
                // let hasRightDown = false;

              let mineKeys = Object.keys(data[message.author.id].mine);

              if(left && mineKeys.includes(left)) data[message.author.id].mine[left].visible = true;
              if(right && mineKeys.includes(right)) data[message.author.id].mine[right].visible = true;
              if(up && mineKeys.includes(up)) data[message.author.id].mine[up].visible = true;
              if(down && mineKeys.includes(down)) data[message.author.id].mine[down].visible = true;

                // if(leftup && mineKeys.includes(leftup)) hasLeftUp = true;
                // if(leftdown && mineKeys.includes(leftdown)) hasLeftDown = true;
                // if(rightup && mineKeys.includes(rightup)) hasRightUp = true;
                // if(rightdown && mineKeys.includes(rightdown)) hasRightDown = true;

                saveData(message.author.id);
                let emote = stone;
                if(mined === "coal") emote = coal;
                else if(mined === "copper") emote = copper;
                else if(mined === "iron") emote = iron;
                else if(mined === "gold") emote = gold;
                else if(mined === "diamond") emote = diamond;
                sendMessage(message, check + "|You spent **$7** to mine position **" + args[0] + "**. You received a(n) " + emote + " **" + mined + "** ore.");
              } else {
                sendMessage(message, fail + "|You need at least $7 to mine");
              }
            } else {
              sendMessage(message, fail + caution + "|You have gotten an internal error: Unregistered mineral type");
            }
          } else {
            sendMessage(message, fail + "|You've already mined this position!")
          }
        } else {
          let t = ((data[message.author.id].time.mine + min) - message.createdTimestamp) / 1000;
          let sec = Math.round(t) % 60;
          let minute = Math.floor(t / 60) % 60;
          sendMessage(message, fail + "|You can mine again in **" + minute + "**m **" + sec + "**s");
        }
      } else if(args[0].toLowerCase() === "inv" || args[0].toLowerCase() === "inventory"){
          sendMessage(message, info + "|Displaying **" + bot.users.get(message.author.id).username + "**'s mine inventory\n" +
            stone + "|" + data[message.author.id].inventory.minerals.stone + "\n" +
            coal + "|" + data[message.author.id].inventory.minerals.coal + "\n" +
            copper + "|" + data[message.author.id].inventory.minerals.copper + "\n" +
            iron + "|" + data[message.author.id].inventory.minerals.iron + "\n" +
            gold + "|" + data[message.author.id].inventory.minerals.gold + "\n" +
            diamond + "|" + data[message.author.id].inventory.minerals.diamond);
      } else {
        let ply = message.mentions.members.first();
        if(!ply) ply = bot.users.get(args[0]);

        if(ply){
          makeImg(ply.id);
        } else {
          sendMessage(message, fail + "|That's not a valid person/position/operation");
        }
      }
    } else if(args.length === 2){
      switch(args[0].toLowerCase()){
        case "sell": {
          switch(args[1].toLowerCase()){
            case "stone": {
              if(data[message.author.id].inventory.minerals.stone > 0){
                let am = data[message.author.id].inventory.minerals.stone * 5;
                let am2 = am;
                let tax = Number((am*0.05).toFixed(2));
                am -= tax;
                data[message.author.id].inventory.minerals.stone = 0;
                data[message.author.id].money += am;
                increaseMoneyEarned(am);
                saveData(message.author.id);
                let output = spaceObject( {
                    "Stone value": am2.toFixed(2),
                    Tax: -tax.toFixed(2),
                    SPACER: '',
                    Total: am.toFixed(2),
                    Balance: data[message.author.id].money.toFixed(2)
                }, '| ', ' |', ': ', ' ', '-', 3 );
                sendMessage(message, check + "|You have sold all your " + stone + " stone, here's your receipt```\n" + output + "```");
              } else sendMessage(message, fail + "|You need at least one stone to sell");
            }break;
            case "coal": {
              if(data[message.author.id].inventory.minerals.coal > 0){
                let am = data[message.author.id].inventory.minerals.coal * 7.5;
                let am2 = am;
                let tax = Number((am*0.05).toFixed(2));
                am -= tax;
                data[message.author.id].inventory.minerals.coal = 0;
                data[message.author.id].money += am;
                increaseMoneyEarned(am);
                saveData(message.author.id);
                let output = spaceObject( {
                    "Coal value": am2.toFixed(2),
                    Tax: -tax.toFixed(2),
                    SPACER: '',
                    Total: am.toFixed(2),
                    Balance: data[message.author.id].money.toFixed(2)
                }, '| ', ' |', ': ', ' ', '-', 3 );
                sendMessage(message, check + "|You have sold all your " + coal + " coal, here's your receipt```\n" + output + "```");
              } else sendMessage(message, fail + "|You need at least one coal to sell");
            }break;
            case "copper": {
              if(data[message.author.id].inventory.minerals.copper > 0){
                let am = data[message.author.id].inventory.minerals.copper * 12.5;
                let am2 = am;
                let tax = Number((am*0.05).toFixed(2));
                am -= tax;
                data[message.author.id].inventory.minerals.copper = 0;
                data[message.author.id].money += am;
                increaseMoneyEarned(am);
                saveData(message.author.id);
                let output = spaceObject( {
                    "Copper value": am2.toFixed(2),
                    Tax: -tax.toFixed(2),
                    SPACER: '',
                    Total: am.toFixed(2),
                    Balance: data[message.author.id].money.toFixed(2)
                }, '| ', ' |', ': ', ' ', '-', 3 );
                sendMessage(message, check + "|You have sold all your " + copper + " copper, here's your receipt```\n" + output + "```");
              } else sendMessage(message, fail + "|You need at least one coal to sell");
            }break;
            case "iron": {
              if(data[message.author.id].inventory.minerals.iron > 0){
                let am = data[message.author.id].inventory.minerals.iron * 20;
                let am2 = am;
                let tax = Number((am*0.05).toFixed(2));
                am -= tax;
                data[message.author.id].inventory.minerals.iron = 0;
                data[message.author.id].money += am;
                increaseMoneyEarned(am);
                saveData(message.author.id);
                let output = spaceObject( {
                    "Iron value": am2.toFixed(2),
                    Tax: -tax.toFixed(2),
                    SPACER: '',
                    Total: am.toFixed(2),
                    Balance: data[message.author.id].money.toFixed(2)
                }, '| ', ' |', ': ', ' ', '-', 3 );
                sendMessage(message, check + "|You have sold all your " + iron + " iron, here's your receipt```\n" + output + "```");
              } else sendMessage(message, fail + "|You need at least one iron to sell");
            }break;
            case "gold": {
              if(data[message.author.id].inventory.minerals.gold > 0){
                let am = data[message.author.id].inventory.minerals.gold * 40;
                let am2 = am;
                let tax = Number((am*0.05).toFixed(2));
                am -= tax;
                data[message.author.id].inventory.minerals.gold = 0;
                data[message.author.id].money += am;
                increaseMoneyEarned(am);
                saveData(message.author.id);
                let output = spaceObject( {
                    "Gold value": am2.toFixed(2),
                    Tax: -tax.toFixed(2),
                    SPACER: '',
                    Total: am.toFixed(2),
                    Balance: data[message.author.id].money.toFixed(2)
                }, '| ', ' |', ': ', ' ', '-', 3 );
                sendMessage(message, check + "|You have sold all your " + gold + " gold, here's your receipt```\n" + output + "```");
              } else sendMessage(message, fail + "|You need at least one gold to sell");
            }break;
            case "diamond": {
              if(data[message.author.id].inventory.minerals.diamond > 0){
                let am = data[message.author.id].inventory.minerals.diamond * 75;
                let am2 = am;
                let tax = Number((am*0.05).toFixed(2));
                am -= tax;
                data[message.author.id].inventory.minerals.diamond = 0;
                data[message.author.id].money += am;
                increaseMoneyEarned(am);
                saveData(message.author.id);
                let output = spaceObject( {
                    "Diamond value": am2.toFixed(2),
                    Tax: -tax.toFixed(2),
                    SPACER: '',
                    Total: am.toFixed(2),
                    Balance: data[message.author.id].money.toFixed(2)
                }, '| ', ' |', ': ', ' ', '-', 3 );
                sendMessage(message, check + "|You have sold all your " + diamond + " diamond, here's your receipt```\n" + output + "```");
              } else sendMessage(message, fail + "|You need at least one diamond to sell");
            }break;
            case "all": {
              let mstone   = data[message.author.id].inventory.minerals.stone * 5;
              let mcoal    = data[message.author.id].inventory.minerals.coal * 7.5;
              let mcopper  = data[message.author.id].inventory.minerals.copper * 12.5;
              let miron    = data[message.author.id].inventory.minerals.iron * 20;
              let mgold    = data[message.author.id].inventory.minerals.gold * 40;
              let mdiamond = data[message.author.id].inventory.minerals.diamond * 75;

              if(mstone > 0||mcoal > 0||mcopper > 0||miron > 0||mgold > 0||mdiamond > 0){
                let am = mstone + mcoal + mcopper + miron + mgold + mdiamond;
                let tax = Number((am*0.05).toFixed(2));
                let am2 = am;
                am -= tax;
                data[message.author.id].inventory.minerals.stone = 0;
                data[message.author.id].inventory.minerals.coal = 0;
                data[message.author.id].inventory.minerals.copper = 0;
                data[message.author.id].inventory.minerals.iron = 0;
                data[message.author.id].inventory.minerals.gold = 0;
                data[message.author.id].inventory.minerals.diamond = 0;
                data[message.author.id].money += am;
                increaseMoneyEarned(am);
                saveData(message.author.id);
                let output = spaceObject( {
                    "Stone value": mstone.toFixed(2),
                    "Coal value": mcoal.toFixed(2),
                    "Copper value": mcopper.toFixed(2),
                    "Iron value": miron.toFixed(2),
                    "Gold value": mgold.toFixed(2),
                    "Diamond value": mdiamond.toFixed(2),
                    SPACER: '',
                    "Total value": am2.toFixed(2),
                    Tax: -tax.toFixed(2),
                    SPACER2: '',
                    Total: am.toFixed(2),
                    Balance: data[message.author.id].money.toFixed(2)
                }, '| ', ' |', ': ', ' ', '-', 3 );
                sendMessage(message, check + "|You have sold all your ores. Here's your receipt```\n" + output + "```")
              } else sendMessage(message, fail + "|You need at least one ore to sell");
            }break;
            default: {
              sendMessage(message, fail + "|That's not a valid mineral type. All valid mineral types:```\nStone\nCoal\nCopper\nIron\nGold\nDiamond\nAll```");
            }break;
          }
        }break;
        case "inv": {
          let ply = message.mentions.members.first();
          if(!ply) ply = bot.users.get(args[1]);
          if(ply){
            setupData(ply.id);
            sendMessage(message, info + "|Displaying **" + bot.users.get(ply.id).username + "**'s mine inventory\n" +
              stone + "|" + data[ply.id].inventory.minerals.stone + "\n" +
              coal + "|" + data[ply.id].inventory.minerals.coal + "\n" +
              copper + "|" + data[ply.id].inventory.minerals.copper + "\n" +
              iron + "|" + data[ply.id].inventory.minerals.iron + "\n" +
              gold + "|" + data[ply.id].inventory.minerals.gold + "\n" +
              diamond + "|" + data[ply.id].inventory.minerals.diamond);
          } else {
            sendMessage(message, fail + "|You must specify a valid person");
          }
        }break;
        case "inventory": {
          let ply;
          if(message.guild && message.mentions) ply = message.mentions.members.first();
          if(!ply) ply = bot.users.get(args[1]);
          if(ply){
            setupData(ply.id);
            sendMessage(message, info + "|Displaying **" + bot.users.get(ply.id).username + "**'s mine inventory\n" +
              stone + "|" + data[ply.id].inventory.minerals.stone + "\n" +
              coal + "|" + data[ply.id].inventory.minerals.coal + "\n" +
              copper + "|" + data[ply.id].inventory.minerals.copper + "\n" +
              iron + "|" + data[ply.id].inventory.minerals.iron + "\n" +
              gold + "|" + data[ply.id].inventory.minerals.gold + "\n" +
              diamond + "|" + data[ply.id].inventory.minerals.diamond);
          } else {
            sendMessage(message, fail + "|You must specify a valid person");
          }
        }break;

        default: {
          sendMessage(message, fail + "|That is not a valid mining operation");
        }break;
      }
    }
  }
);

createCommand(
  'Rank',
  'Shows your rank card for the current server.',
  'Shows your rank card for the current server. How it works: You get 5 XP for a message. You can only get XP once a minute.',
  'rank',
  ['level', 'xp', 'roonk'],
  '[@user|usreid]',
  function(message, args){
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
      } else {
        sendMessage(message, fail + info + '|The leveling plugin is disabled on this guild.');
      }
    } else {
      sendMessage(message, fail + "|You must be in a guild to use this command.")
    }
  }
);
createCommand(
  'Leaderboard',
  'Check the leaderboard of levels for the current guild.',
  'Check the leaderboard of levels for the current guild.',
  'leaderboard',
  ['lb', 'levels', 'ranks'],
  "none.",
  function(message, args){
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
    } else {
      sendMessage(message, fail + "|You need to be in a guild to use this command.");
    }
  }
);

createCommand(
  'React to Selfassign',
  'Bot will send a message with reactions for people to add reactions to. Doing so will add/remove roles.',
  'Bot will send a message with reactions for people to add reactions to. Doing so will add/remove roles.',
  'reactlist',
  ['grouplist', 'reactgroup'],
  '[group name]',
  function(message, args){
    if(message.guild){
      if(args[1]){
        let str = args.join(' ').toLowerCase();
        let group;
        for(let i = 0; i < config[message.guild.id].selfassign.react.groups.length; i++){
          if(config[message.guild.id].selfassign.react.groups[i].name.toLowerCase().includes(str)){
            group = config[message.guild.id].selfassign.react.groups[i];
            break;
          }
        }
        if(group !== undefined){
          if(group.roles.length > 0){

          } else sendMessage(message, fail  + "|The group **" + group.name + "** doesn't have any roles");
        } else sendMessage(message, fail + "|The group you specified doesn't exist");
      } else sendMessage(message, fail + "|You must specify the group to place");
    } else sendMessage(message, fail + "|You must be on a guild to use this");
  }
);


// createCommand(
//   'test',
//   '',
//   '',
//   'test',
//   [],
//   '',
//   function(message, args){
//     setReactListener(message, [message.author.id], ['👌', '498332138421092352'], 'testing');
//   }
// );




//Developer commands------------------------------------------------------------
createDevCommand(
  "Help",
  "Displays bot commands.",
  "Displays bot commands, either a page or a single command.",
  "devhelp",
  ['dhelp'],
  "[command|page]",
  function(message, args){
    let embed = new Discord.RichEmbed()
      .setTitle('Commands')
      .setColor(0x0096FF)
      .setFooter(message.author.username)
      .setTimestamp();

    let cmds = command.length;
    let pageCount = Math.ceil(command.length/10);
    let pageSel = clamp(parseInt(args[0]) - 1, 0, pageCount);
    if(typeof pageSel !== "number" || !(pageSel > -Infinity && pageSel < Infinity) && args[0]){
      pageSel = args[0].toLowerCase();
    }
    if(!pageSel){
      pageSel = 0;
    }

    if(typeof pageSel === "number"){
      embed.setDescription('Displaying commands for page **' + clamp(pageSel + 1, 0, pageCount) + "**");
      for(let i = clamp(pageSel*10, 0, cmds - (cmds % 10)); i < cmds; i++){
        if(devCommand[i] === undefined) break;
        let PrintAmount = 0;
        if(PrintAmount < 10){
          PrintAmount++;
          if(typeof devCommand[i].aliases === "string") alias = devCommand[i].aliases;
          else alias = devCommand[i].aliases.join(', ');
          embed.addField(devCommand[i].title, devCommand[i].shortDesc + "\n**Usage**: `" + devCommand[i].usage + "`\n**Command**: `" + devCommand[i].cmd + "`, **Aliases**: `" + alias + "`");
        } else {break;}
      }
    } else if(typeof pageSel === "string"){
      let found = false;
      for(let y = 0; y < command.length; y++){
        if(!found && pageSel === devCommand[y].title.toLowerCase()){
          found = true;
          embed.setTitle(devCommand[y].title);
          embed.setDescription(devCommand[y].longDesc);
          break;
        } else if(!found && pageSel === devCommand[y].cmd.toLowerCase()){
          found = true;
          embed.setTitle(devCommand[y].title);
          embed.setDescription(devCommand[y].longDesc);
          break;
        } else if(!found){
          if(typeof devCommand[y].aliases === "string"){
            if(!found && pageSel === devCommand[y].aliases){
              found = true;
              embed.setTitle(devCommand[y].title);
              embed.setDescription(devCommand[y].longDesc);
              break;
            }
          } else {
            for(let x = 0; x < devCommand[y].aliases.length; x++){
              if(!found && pageSel === devCommand[y].aliases[x].toLowerCase()){
                found = true;
                embed.setTitle(devCommand[y].title);
                embed.setDescription(devCommand[y].longDesc);
                break;
              }
            }
          }
        }
      }
      if(!found){
        embed.addField('Error', "**" + pageSel + "** is not a command.");
      }
    } else {
      embed.addField('Error', "**" + args[0] + "** is not a command.");
    }

    sendMessage(message, {embed});
  }
);
createDevCommand(
  'Start Beta Bot',
  'Starts the beta version of LifeBot.',
  'Starts the beta version of LifeBot.',
  'beta',
  ['startbeta'],
  '[start|stop]',
  function(message, args){
    if(args[0]){
      let betaBot;
      if(args[0].toLowerCase() === "start" && !betaBot) betaBot = execFile('./app_beta.js', [], (error, stdout, stderr) => {
        if (error) {
          console.log(error);
        }
        console.log(stdout);
      });
      else if(args[0].toLowerCase() === "stop" && betaBot){betaBot.kill(); betaBot = undefined;}
      else if(betaBot){betaBot.kill(); betaBot = undefined;}
    } else sendMessage(message, fail + "|You must say start or stop.");
  }
);
createDevCommand(
  'Blacklist',
  'Blacklist a user from the bot.',
  'Blacklist a user from the bot.',
  'blacklist',
  [],
  '[@user|userid] {reason}',
  function(message, args, argStr){
    if(args[0]){
      let ply;
      if(message.mentions.members.array().length > 0) ply = bot.users.get(message.mentions.members.first().id);
      if(!ply) ply = bot.users.get(args[0]);
      if(!ply){sendMessage(message, fail + "|You must provide a valid user!"); return;}
      setupData(ply.id);

      if(args.length === 1){
        if(data[ply.id].blacklisted.is){
          let msg = info + `|**${ply.username}** ***is*** currently blacklisted for **${data[ply.id].blacklisted.reason}**.`;
          if(data[ply.id].blacklisted.history.length > 0){
            let history = data[ply.id].blacklisted.history;
            let hlist = [];
            for(let i = 0; i < history.length; i++){
              let on = new Date(history[i].on);
              let till = new Date(history[i].till);
              let onZone = /\((.*)\)/.exec(on.toString())[1];
              let onZoneString = "";
              let tempOn = onZone.split(/ +/g);
              for(let i = 0; i < tempOn.length; i++){
                onZoneString += tempOn[i].substring(0, 1);
              }
              let onDate = `${on.getMonth() + 1}/${on.getDate()}/${on.getFullYear()} @ ${on.getHours()}:${("0" + on.getMinutes()).substr(-2)}:${("0" + on.getSeconds()).substr(-2)} ${onZoneString}`;
              let tillDate = "Forever";
              if(history[i].till !== 0){
                let tillZone = /\((.*)\)/.exec(till.toString())[1];
                let tillZoneString = "";
                let temptill = tillZone.split(/ +/g);
                for(let i = 0; i < temptill.length; i++){
                  tillZoneString += temptill[i].substring(0, 1);
                }
                tillDate = `${till.getMonth() + 1}/${till.getDate()}/${till.getFullYear()} @ ${till.getHours()}:${("0" + till.getMinutes()).substr(-2)}:${("0" + till.getSeconds()).substr(-2)} ${tillZoneString}`;
              }
              hlist.push(`[${onDate} through ${tillDate}] ${history[i].reason}`);
            }
            msg += `\`\`\`\n > History <\n${hlist.join('\n')}\`\`\``;
          }
          sendMessage(message, msg);
        } else {
          let msg = info + `|**${ply.username}** __***isn't***__ currently blacklisted.`;
          if(data[ply.id].blacklisted.history.length > 0){
            let history = data[ply.id].blacklisted.history;
            let hlist = [];
            for(let i = 0; i < history.length; i++){
              let on = new Date(history[i].on);
              let till = new Date(history[i].till);
              let onZone = /\((.*)\)/.exec(on.toString())[1];
              let onZoneString = "";
              let tempOn = onZone.split(/ +/g);
              for(let i = 0; i < tempOn.length; i++){
                onZoneString += tempOn[i].substring(0, 1);
              }
              let onDate = `${on.getMonth() + 1}/${on.getDate()}/${on.getFullYear()} @ ${on.getHours()}:${("0" + on.getMinutes()).substr(-2)}:${("0" + on.getSeconds()).substr(-2)} ${onZoneString}`;
              let tillDate = "Forever";
              if(history[i].till !== 0){
                let tillZone = /\((.*)\)/.exec(till.toString())[1];
                let tillZoneString = "";
                let temptill = tillZone.split(/ +/g);
                for(let i = 0; i < temptill.length; i++){
                  tillZoneString += temptill[i].substring(0, 1);
                }
                tillDate = `${till.getMonth() + 1}/${till.getDate()}/${till.getFullYear()} @ ${till.getHours()}:${("0" + till.getMinutes()).substr(-2)}:${("0" + till.getSeconds()).substr(-2)} ${tillZoneString}`;
              }
              hlist.push(`[${onDate} through ${tillDate}] ${history[i].reason}`);
            }
            msg += `\`\`\`\n > History <\n${hlist.join('\n')}\`\`\``;
          }
          sendMessage(message, msg);
        }
      } else if(args.length > 1){
        if(args[1] === "true"){
          let reason = argStr.trim().split(/ +/g);
          reason.shift();
          reason.shift();
          reason.shift();
          reason = reason.join(" ");

          if(!data[ply.id].blacklisted.is){
            data[ply.id].blacklisted.is = true;
            data[ply.id].blacklisted.reason = reason;
            data[ply.id].blacklisted.on = message.createdTimestamp;
            data[ply.id].blacklisted.history.push({
              reason: reason,
              on: message.createdTimestamp,
              till: 0
            });
          } else {
            data[ply.id].blacklisted.reason = reason;
            let history = data[ply.id].blacklisted.history;
            for(let i = 0; i < history.length; i++){
              if(history[i].on === data[ply.id].blacklisted.on){
                data[ply.id].blacklisted.history[i].reason = reason;
              }
            }
          }
          sendMessage(message, check + info + `|**${ply.username}** is now ***blacklisted*** from using LifeBot for the following reason: **${reason}**`);
        } else if(args[1] === "false"){
          data[ply.id].blacklisted.is = false;
          data[ply.id].blacklisted.reason = "";
          let history = data[ply.id].blacklisted.history;

          for(let i = 0; i < history.length; i++){
            if(history[i].on === data[ply.id].blacklisted.on){
              data[ply.id].blacklisted.history[i].till = message.createdTimestamp;
            }
          }
          data[ply.id].blacklisted.on = 0;
          sendMessage(message, check + info + `|**${ply.username}** is no longer blacklisted.`);
        } else {
          sendMessage(message, fail + "|Must be true or false");
        }
      }
      saveData(ply.id);
    } else {
      sendMessage(message, fail + "|You must provide at least one argument.");
    }
  }
);
createDevCommand(
  "Restart",
  "Restart the bot.",
  "Restart the bot with any updated code, or if something is broken.",
  "restart",
  ['kill'],
  "none.",
  function(message, args){
    sendMessage(message, info + "|Restarting...").then(function(){process.exit(1);});
  }
);
createDevCommand(
  "Maintenance",
  "Toggle maintenance.",
  "Toggle maintenance.",
  "maintenance",
  [],
  "none.",
  function(message, args){
    maintenance = !maintenance;
    sendMessage(message, info + "|Maintenance: **" + maintenance + "**");
  }
);
createDevCommand(
  "Set Money",
  "Set the money of a player.",
  "Set the money of a player.",
  "setmoney",
  'sm',
  "[@user|userid] [amount]",
  function(message, args){
    let ply;
    if(message.guild && message.mentions) ply = message.mentions.members.first();
    if(!ply) ply = bot.users.get(args[0]);
    if(!ply && !args[0]) ply = message.author;

    if(ply){
      setupData(ply.id);
      let num = Number(Number(args[0]).toFixed(2));
      if(num < Infinity && num >= 0){
        data[ply.id].money = num;
        saveData(ply.id);
        sendMessage(message, info + "|**" + bot.users.get(ply.id).username + "**'s new balance is **$" + data[ply.id].money + "**")
      } else {
        sendMessage(message, fail + "Number can't be infinity. It must be a valid number as well, and be at least 0.");
      }
    } else {
      sendMessage(message, fail + "|You need to specify a valid player ID.");
    }
  }
);
createDevCommand(
  "Daily",
  "Get a daily amout of money that increases with more streaks.",
  "Get a daily amout of money that increases with more streaks.\nA streak is $5 each day you do a daily. It get's reset after two days of not doing a daily.\nThere is a 5% tax on the money before you get it.",
  "devdaily",
  ['ddailies', 'ddaily'],
  "none | [@user|userid]",
  function(message, args){
    let ply;
    if(message.guild && message.mentions) ply = message.mentions.members.first();
    if(!ply) ply = bot.users.get(args[0]);
    if(!ply && !args[0]) ply = message.author;

    if(ply){
      let can = true;
      if(can){
        data[ply.id].streak.daily += 1;

        let mon = 100;
        let bonus = data[ply.id].streak.daily * 5;
        mon += bonus;
        let inc = mon;
        let tax = Number((mon*0.05).toFixed(2));
        mon -= tax;

        data[ply.id].money += mon;
        increaseMoneyEarned(mon);
        saveData(ply.id);
        //Receipt------------------------------------------------------------
        let output = spaceObject( {
            Income: (inc - bonus).toFixed(2),
            Bonus: bonus.toFixed(2),
            Tax: tax.toFixed(2),
            SPACER: '',
            Total: mon.toFixed(2),
            Balance: data[ply.id].money.toFixed(2)
        }, '| ', ' |', ': ', ' ', '-', 3 );
        let txt = prize + "|Daily claimed to **" + bot.users.get(ply.id).username + "**```" + output + "```";
        sendMessage(message, txt);
      } else {
        sendMessage(message, fail + "|You can claim a daily again in " + formatTime(data[ply.id].time.daily + day - message.createdTimestamp, "**$hour**h, **$min**m"));
      }
    } else {
      sendMessage(message, fail + "|You must give a valid userid or @ someone");
    }
  }
);
createDevCommand(
  'Mine',
  'Reveal someone\'s mine.',
  'Reveal someone\'s mine.',
  'dmine',
  [],
  '[@user|userid]',
  function(message, args){
    function makeImg(ply){
      new Jimp(300, 300, 0x00000000, (err, img) => {
        if(err) sendMessage(message, caution + "|Error: " + err);

        function box(posX, posY, sizeX, sizeY, color){
          for(let x = posX; x < posX + sizeX; x++){
            for(let y = posY; y < posY + sizeY; y++){
              img.setPixelColor(color, x, y);
            }
          }
        }

        if(checkMine(ply, message.createdTimestamp)){
          generateMine(ply, message.createdTimestamp);
        }
        for(let y = 0; y < 10; y++){
          for(let x = 0; x < 10; x++){
            let space = data[ply].mine[letters[y] + letters[x]];
            img.blit(mine.stone, x*30, y*30);
            switch(space.type){
              case "stone":
                //img.blit(mine.stone, x*30, y*30);
                if(space.mined){
                  box(x*30, y*30, 30, 30, 0x333333ff);
                }
              break;
              case "coal":
                //box(x*30, y*30, 30, 30, 0x383838ff);
                if(space.mined){
                  box(x*30, y*30, 30, 30, 0x333333ff);
                }
                img.blit(mine.coal, x*30, y*30);
              break;
              case "copper":
                //box(x*30, y*30, 30, 30, 0xb76e79ff);
                if(space.mined){
                  box(x*30, y*30, 30, 30, 0x333333ff);
                }
                img.blit(mine.copper, x*30, y*30);
              break;
              case "iron":
                //box(x*30, y*30, 30, 30, 0xbbbbbbff);
                if(space.mined){
                  box(x*30, y*30, 30, 30, 0x333333ff);
                }
                img.blit(mine.iron, x*30, y*30);
              break;
              case "gold":
                //box(x*30, y*30, 30, 30, 0xffb500ff);
                if(space.mined){
                  box(x*30, y*30, 30, 30, 0x333333ff);
                }
                img.blit(mine.gold, x*30, y*30);
              break;
              case "diamond":
                //box(x*30, y*30, 30, 30, 0x9ac5dbff);
                if(space.mined){
                  box(x*30, y*30, 30, 30, 0x333333ff);
                }
                img.blit(mine.diamond, x*30, y*30);
              break;
              default:
                box(x*30, y*30, 30, 30, 0x333333ff);
              break;
            }
          }
        }

        img.blit(LetterOverlay, 0, 0);

        img.write('mines/' + ply + ".png");
        setTimeout(() => {
          let t = (data[ply].mine.lastGenDate + day - message.createdTimestamp) / 1000;
          let sc = Math.round(t) % 60;
          let mn = Math.floor(t / 60) % 60;
          let hr = Math.floor(t / 3600);
          sendMessage(message, info + "|**" + bot.users.get(ply).username + "**'s mine (Reset in **" + hr + "**h **" + mn + "**m **" + sc + "**s):", {files: ['./mines/' + ply + ".png"]}).catch(function(err){
            if(err) console.log(err);
            makeImage(ply);
          });
        }, 100);
      });
    }
    if(args.length === 0){
      makeImg(message.author.id);
    } else {
      let ply;
      if(message.guild && message.mentions) ply = message.mentions.members.first();
      if(!ply) ply = bot.users.get(args[0])
      if(ply) makeImg(ply.id);
      else sendMessage(message, fail + "|You must mention a valid user or userid");
    }
  }
);
createDevCommand(
  'Reset',
  'Reset someone\'s data.',
  'Reset someone\'s data.',
  'reset',
  ['oof'],
  '[@user|userid]',
  function(message, args){
    let ply;
    if(message.guild && message.mentions) ply = message.mentions.members.first();
    if(!ply) ply = bot.users.get(args[0]);
    if(!ply) ply = message.author;
    if(ply){
      resetData(ply.id);
      sendMessage(message, check + "|You have reset **" + bot.users.get(ply.id).username + "**'s data.");
    } else sendMessage(message, fail + "|You must mention a valid user or userid.");
  }
);
createDevCommand(
  'Notice',
  'Give every message sent a notice message.',
  'Give every message sent a notice message.',
  'notice',
  ['notify', 'msg'],
  '[disable|message]',
  function(message, args){
    if(args.length > 0){
      if(args[0].toLowerCase() === "disable") notice = undefined;
      else notice = args.join(' ');
      if(notice) fs.writeFile('./notice.txt', notice, function(err){if(err) console.log(err)});
      else fs.writeFile('./notice.txt', '', function(err){if(err) console.log(err)});
      sendMessage(message, check);
    } else {
      sendMessage(message, info);
    }
  }
);




//Chat command handler----------------------------------------------------------
bot.on('message', message => {
  let prefix = "~";
  if(message.guild){
    setupConfig(message.guild.id);
    prefix = config[message.guild.id].prefix;
  }
  if(message.content.startsWith('<@' + bot.user.id + '>')) prefix = '<@' + bot.user.id + '>';
  else if(message.content.startsWith('<@!' + bot.user.id + '>')) prefix = '<@!' + bot.user.id + '>';
  else if(message.content.startsWith('\\<@' + bot.user.id + '>')) prefix = '\\<@' + bot.user.id + '>';
  else if(message.content.startsWith('\\<@!' + bot.user.id + '>')) prefix = '\\<@!' + bot.user.id + '>';

  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase();
  let StrArg = message.content.slice(prefix.length).trim();

  //Leveling---------------------------------------------------------------
  if(message.guild){
    if(!message.author.bot){
      //Channels
      if(!config[message.guild.id].msgs[message.author.id]) config[message.guild.id].msgs[message.author.id] = {};
      if(!config[message.guild.id].msgs[message.author.id][message.channel.id]) config[message.guild.id].msgs[message.author.id][message.channel.id] = 0;
      config[message.guild.id].msgs[message.author.id][message.channel.id]++;

      if(config[message.guild.id].leveling.noXP[message.channel.id] === undefined){
        if(config[message.guild.id].leveling.enabled){
          if(!config[message.guild.id].leveling.levels[message.author.id]){
            config[message.guild.id].leveling.levels[message.author.id] = {level: 1, xp: 0, totalxp: 0, lastGained: 0};
          }
          if(message.createdTimestamp - config[message.guild.id].leveling.levels[message.author.id].lastGained >= 60000){
            let xptolvl = (5 * config[message.guild.id].leveling.levels[message.author.id].level) + 30;
            let gainxp = 5;
            config[message.guild.id].leveling.levels[message.author.id].totalxp += gainxp;
            config[message.guild.id].leveling.levels[message.author.id].xp += gainxp;
            if(config[message.guild.id].leveling.levels[message.author.id].xp >= xptolvl){
              config[message.guild.id].leveling.levels[message.author.id].level++;
              config[message.guild.id].leveling.levels[message.author.id].xp -= xptolvl;
              sendMessage(message, `:up:|Congratulations **${message.author.username}**, you have leveled up to level **${config[message.guild.id].leveling.levels[message.author.id].level}**!`)

              let lvl = config[message.guild.id].leveling.levels[message.author.id].level;

              if(config[message.guild.id].leveling.levelRewards[String(lvl)]){
                message.member.addRole(config[message.guild.id].leveling.levelRewards[String(lvl)]).then(function(){
                  sendMessage(message, check + '|You have also received the role ' + message.guild.roles.get(config[message.guild.id].leveling.levelRewards[String(lvl)]).name);
                }).catch(function(err){
                  console.log(err);
                  sendMessage(message, fail + info + '|You were supposed to receive a role, but I was unable to give it.');
                });
              }
            }
            config[message.guild.id].leveling.levels[message.author.id].lastGained = message.createdTimestamp;
          }
        }
      }
      saveConfig(message.guild.id);
    }
  }

  if(message.content.trim().startsWith(prefix) && message.content.trim().length > prefix.length){
    setupData(message.author.id);
    //If the bot is no longer starting-------------------------------------
    if(dataLoaded && configLoaded){
      //Check if they a dev------------------------------------------------
      let isDev = false;
      let isTester = false;
      for(let i = 0; i < owners.length; i++){
        if(message.author.id === owners[i]){
          isDev = true;
        }
      }
      if(!isDev){
        for(let i = 0; i < developers.length; i++){
          if(message.author.id === developers[i]){
            isDev = true;
          }
        }
        //If not a developer, check if tester------------------------------
        if(!isDev){
          for(let i = 0; i < testers.length; i++){
            if(message.author.id === testers[i]){
              isTester = true;
            }
          }
        }
      }

      //Create a variable for if it's down for maintenance and make it false if they no admin
      let can = !maintenance;
      if(isDev||isTester){can = true;}
      if(can){
        //If not blacklisted----------------------------------------------
        if(!data[message.author.id].blacklisted.is){
          //Antispam---------------------------------------------------------
          let antispam = false;
          if(message.createdTimestamp - data[message.author.id].time.used < 750){antispam = true;}
          data[message.author.id].time.used = message.createdTimestamp;

          if(!antispam){
            //Variable for ran so it knows not to run more---------------------
            let ran = false;
            for(let i = 0; i < command.length; i++){
              if(!ran && cmd === command[i].cmd.toLowerCase()){
                ran = true;
                try {
                  command[i].func(message, args, StrArg);
                  increaseCommandCount();
                } catch(err){
                  sendMessage(message, caution + "|You have encountered a bug! Developers have been DMed so you don't have to do anything!");
                  for(let i = 0; i < owners.length; i++){
                    bot.users.get(owners[i]).send("**" + bot.users.get(message.author.id).username + "#" + bot.users.get(message.author.id).discriminator + "** (**" + message.author.id + "**) has found a bug!```\n" + err.stack + "```");
                  }
                  for(let i = 0; i < developers.length; i++){
                    bot.users.get(developers[i]).send("**" + bot.users.get(message.author.id).username + "#" + bot.users.get(message.author.id).discriminator + "** (**" + message.author.id + "**) has found a bug!```\n" + err.stack + "```");
                  }
                }
                break;
              } else {
                //Aliases
                let alias = command[i].aliases
                if(typeof alias === "string"){
                  if(!ran && cmd === alias.toLowerCase()){
                    ran = true;
                    try {
                      command[i].func(message, args, StrArg);
                      increaseCommandCount();
                    } catch(err){
                      sendMessage(message, caution + "|You have encountered a bug! Developers have been DMed so you don't have to do anything!");
                      for(let i = 0; i < owners.length; i++){
                        bot.users.get(owners[i]).send("**" + bot.users.get(message.author.id).username + "#" + bot.users.get(message.author.id).discriminator + "** (**" + message.author.id + "**) has found a bug!```\n" + err.stack + "```");
                      }
                      for(let i = 0; i < developers.length; i++){
                        bot.users.get(developers[i]).send("**" + bot.users.get(message.author.id).username + "#" + bot.users.get(message.author.id).discriminator + "** (**" + message.author.id + "**) has found a bug!```\n" + err.stack + "```");
                      }
                    }
                    break;
                  }
                } else if(typeof alias === "object"){
                  for(let x = 0; x < alias.length; x++){
                    if(!ran && cmd === alias[x].toLowerCase()){
                      ran = true;
                      try {
                        command[i].func(message, args, StrArg);
                        increaseCommandCount();
                      } catch(err){
                        sendMessage(message, caution + "|You have encountered a bug! Developers have been DMed so you don't have to do anything!");
                        for(let i = 0; i < owners.length; i++){
                          bot.users.get(owners[i]).send("**" + bot.users.get(message.author.id).username + "#" + bot.users.get(message.author.id).discriminator + "** (**" + message.author.id + "**) has found a bug!```\n" + err.stack + "```");
                        }
                        for(let i = 0; i < developers.length; i++){
                          bot.users.get(developers[i]).send("**" + bot.users.get(message.author.id).username + "#" + bot.users.get(message.author.id).discriminator + "** (**" + message.author.id + "**) has found a bug!```\n" + err.stack + "```");
                        }
                      }
                      break;
                    }
                  }
                }
              }
            }
            //Dev commands-----------------------------------------------------
            if(!ran && isDev){
              for(let i = 0; i < devCommand.length; i++){
                if(!ran && cmd === devCommand[i].cmd.toLowerCase()){
                  ran = true;
                  try {
                    devCommand[i].func(message, args, StrArg);
                    increaseCommandCount();
                  } catch(err){
                    sendMessage(message, caution + "|You have encountered a bug! Developers have been DMed so you don't have to do anything!");
                    for(let i = 0; i < owners.length; i++){
                      bot.users.get(owners[i]).send("**" + bot.users.get(message.author.id).username + "#" + bot.users.get(message.author.id).discriminator + "** (**" + message.author.id + "**) has found a bug!```\n" + err.stack + "```");
                    }
                    for(let i = 0; i < developers.length; i++){
                      bot.users.get(developers[i]).send("**" + bot.users.get(message.author.id).username + "#" + bot.users.get(message.author.id).discriminator + "** (**" + message.author.id + "**) has found a bug!```\n" + err.stack + "```");
                    }
                  }
                  break;
                } else {
                  //Aliases
                  let alias = devCommand[i].aliases;
                  if(typeof alias === "string"){
                    if(!ran && cmd === alias.toLowerCase()){
                      ran = true;
                      try {
                        devCommand[i].func(message, args, StrArg);
                        increaseCommandCount();
                      } catch(err){
                        sendMessage(message, caution + "|You have encountered a bug! Developers have been DMed so you don't have to do anything!");
                        for(let i = 0; i < owners.length; i++){
                          bot.users.get(owners[i]).send("**" + bot.users.get(message.author.id).username + "#" + bot.users.get(message.author.id).discriminator + "** (**" + message.author.id + "**) has found a bug!```\n" + err.stack + "```");
                        }
                        for(let i = 0; i < developers.length; i++){
                          bot.users.get(developers[i]).send("**" + bot.users.get(message.author.id).username + "#" + bot.users.get(message.author.id).discriminator + "** (**" + message.author.id + "**) has found a bug!```\n" + err.stack + "```");
                        }
                      }
                      break;
                    }
                  } else if(typeof alias === "object"){
                    for(let x = 0; x < alias.length; x++){
                      if(!ran && cmd === alias[x].toLowerCase()){
                        ran = true;
                        try {
                          devCommand[i].func(message, args, StrArg);
                          increaseCommandCount();
                        } catch(err){
                          sendMessage(message, caution + "|You have encountered a bug! Developers have been DMed so you don't have to do anything!");
                          for(let i = 0; i < owners.length; i++){
                            bot.users.get(owners[i]).send("**" + bot.users.get(message.author.id).username + "#" + bot.users.get(message.author.id).discriminator + "** (**" + message.author.id + "**) has found a bug!```\n" + err.stack + "```");
                          }
                          for(let i = 0; i < developers.length; i++){
                            bot.users.get(developers[i]).send("**" + bot.users.get(message.author.id).username + "#" + bot.users.get(message.author.id).discriminator + "** (**" + message.author.id + "**) has found a bug!```\n" + err.stack + "```");
                          }
                        }
                        break;
                      }
                    }
                  }
                }
              }
            } else {
              //if(!ran) sendMessage(message, fail + "|You must be a developer to use this command.");
            }
            if(!ran && message.guild && config[message.guild.id].err_invalid_cmd.enabled){
              sendMessage(message, fail + "|" + config[message.guild.id].err_invalid_cmd.msg.replace('$command', cmd).replace('$cmd', cmd));
            }
          } else {
            sendMessage(message, fail + "|You are on a cooldown! You must wait 0.75 seconds between each time using a command.");
          }
        } else {
          sendMessage(message, fail + "|You are blacklisted from using LifeBot :(");
        }
      } else {
        sendMessage(message, fail + "|Bot is down for maintenance and can only be used by testers.");
      }
    } else {
      sendMessage(message, fail + "|Bot has recently crashed/restarted and is starting up.\nPlease wait a few moments.");
    }
  } else if(message.content.trim().startsWith(prefix)){
    if(message.guild) sendMessage(message, info + "|The prefix on this guild is **" + config[message.guild.id].prefix + "**");
    else sendMessage(message, info + "|The default prefix is **~**");
  }
});


//ReactListener-----------------------------------------------------------------
let reactFuncs = {
  'testing': function(guild, channel, message, user, emote, isAdded){
    if(isAdded){
      sendMessage(message, emote.name + "|" + emote.id);
    } else {
      sendMessage(message, emote.name + "|" + emote.id);
    }
  },
  'reactToSelfassignDeprecated': function(guild, channel, message, user, emote, isAdded){
    let group;
    let roleID;
    let emoji = emote.id;
    if(extractEmoji(emote.name)||emote.id === null){
      emoji = extractEmoji(emote.name);
    }
    for(let i = 0; i < config[guild.id].selfassign.react.groups.length; i++){
      if(config[guild.id].selfassign.react.groups[i].roles[emoji]){
        group = config[guild.id].selfassign.react.groups[i];
        roleID = group.roles[emoji];
      }
    }
    if(group !== undefined && roleID !== undefined){
      let role = guild.roles.get(roleID);
      if(role){
        let member = guild.members.get(user.id);
        if(member !== undefined){
          if(isAdded){
            member.addRole(roleID).then(() => {
              user.send(check + "|You were given the role **" + role.name + "** in ***" + guild.name + "***").catch(console.log);
            }).catch(err => {
              user.send(fail + "|I tried to give you a role on ***" + guild.name + "***, but have failed in doing so. This is likely due to the server, contact an administrator there.");
            });
          } else {
            member.removeRole(roleID).then(() => {
              user.send(check + "|You were removed from the role **" + role.name + "** in ***" + guild.name + "***").catch(console.log);
            }).catch(err => {
              user.send(fail + "|I tried to a role from you on ***" + guild.name + "***, but have failed in doing so. This is likely due to the server, contact an administrator there.");
            });
          }
        }
      }
    }
  },
  'addReactions': function(guild, channel, message, user, emote, isAdded){

  }
};

function handleRawMessage(buffer) {
  let msgObj = JSON.parse(buffer.data);
  let data = msgObj.d;

  // Check to see if this message is something that we need to handle
  // Discord.js does everything with opcodes 1-11, which we never have to worry about
  // We only care about opcode 0, which is for messages, reactions and stuff
  if(msgObj.op == 0) {

    // Add custom event handlers for each event that discord.js doesn't provide
    switch(msgObj.t) {

      // This one handles reactions
      // It works on all messages, even ones not in the cache, unlike the default discord.js 'messageReactionAdd'
      // A list of events can be found here: https://discordapp.com/developers/docs/topics/gateway#commands-and-events-gateway-events
      case 'MESSAGE_REACTION_ADD': {
        if(reactListening[data.message_id] !== undefined){
          let react = reactListening[data.message_id];
          let can = false;
          if(react.can.length === 0){
            can = true;
          } else {
            for(let i = 0; i < react.can.length; i++){
              if(react.can[i] === data.user_id){
                can = true;
                break;
              }
            }
          }
          if(can){
            try {
              let guild = bot.guilds.get(data.guild_id);
              let channel = guild.channels.get(data.channel_id);
              let user = bot.users.get(data.user_id);
              channel.fetchMessage(data.message_id).then(message => {
                reactFuncs[react.mode](guild, channel, message, user, data.emoji, true);
              });
            } catch(err) {
              let user = data.user_id;
              for(let i = 0; i < owners.length; i++){
                bot.users.get(owners[i]).send("**" + bot.users.get(user.id).username + "#" + bot.users.get(user.id).discriminator + "** (**" + user.id + "**) has found a bug (***REACT LISTENER***)!```\n" + err.stack + "```");
              }
              for(let i = 0; i < developers.length; i++){
                bot.users.get(developers[i]).send("**" + bot.users.get(user.id).username + "#" + bot.users.get(user.id).discriminator + "** (**" + user.id + "**) has found a bug (***REACT LISTENER***)!```\n" + err.stack + "```");
              }
            }
          }
        }
      } break;

      case 'MESSAGE_REACTION_REMOVE': {
        if(reactListening[data.message_id] !== undefined){
          let react = reactListening[data.message_id];
          let can = false;
          if(react.can.length === 0){
            can = true;
          } else {
            for(let i = 0; i < react.can.length; i++){
              if(react.can[i] === data.user_id){
                can = true;
                break;
              }
            }
          }
          if(can){
            try {
              let guild = bot.guilds.get(data.guild_id);
              let channel = guild.channels.get(data.channel_id);
              let user = bot.users.get(data.user_id);
              channel.fetchMessage(data.message_id).then(message => {
                reactFuncs[react.mode](guild, channel, message, user, data.emoji, false);
              });
            } catch(err) {
              let user = data.user_id;
              for(let i = 0; i < owners.length; i++){
                bot.users.get(owners[i]).send("**" + bot.users.get(user.id).username + "#" + bot.users.get(user.id).discriminator + "** (**" + user.id + "**) has found a bug (***REACT LISTENER***)!```\n" + err.stack + "```");
              }
              for(let i = 0; i < developers.length; i++){
                bot.users.get(developers[i]).send("**" + bot.users.get(user.id).username + "#" + bot.users.get(user.id).discriminator + "** (**" + user.id + "**) has found a bug (***REACT LISTENER***)!```\n" + err.stack + "```");
              }
            }
          }
        }
      } break;
    }
  }
}


//Join messages-----------------------------------------------------------------
bot.on('guildMemberAdd', user => {
  setupConfig(user.guild.id);
  if(config[user.guild.id].welcome.enabled){
    if(config[user.guild.id].welcome.channel !== undefined){
      if(user.guild.channels.get(config[user.guild.id].welcome.channel) !== undefined){
        user.guild.channels.get(config[user.guild.id].welcome.channel).send(config[user.guild.id].welcome.msg.replace('$@user', '<@' + user.id + ">").replace('$user', bot.users.get(user.id).username).replace('$server', user.guild.name).replace('$id', user.id).replace('$discrim', bot.users.get(user.id).discriminator)).catch(
          function(err){
            if(err) console.log(err);
          });

        let roles = config[user.guild.id].welcome.roles;
        let error;
        let eroles = [];
        for(let i = 0; i < roles.length; i++){
          user.addRole(roles[i]).catch(function(err){
            if(err){
              error = err.stack;
              erole.push(roles[i])
              console.log(err);
            }
          });
        }
        if(error){
          if(!(eroles && eroles.length > 0)) eroles = ['No roles were listed :thinking:'];
          bot.users.get(user.guild.ownerID).send(fail + info + "|I hate to inform you this, but I have had some issues adding the following roles to user **" + user.id + "**:```\n" + eroles.join('\n') + "```This is likely due to my role being below the roles added. Here is the full error report that you may take a look at:```\n" + error + "```").catch(function(err){
            bot.users.get(user.guild.ownerID).send(fail + info + "|I hate to inform you that I've had issues adding roles to **" + user.id + "** with the following error report:```\n" + error + "```").catch(function(err){
              bot.users.get(user.guild.ownerID).send(fail + info + "|I hate to inform you that I've had troubles adding roles to **" + user.id + "**").catch(function(err){
                console.log(err);
              });
            });
          });
        }
        let channel = user.guild.channels.get(config[user.guild.id].logs.joins);
        if(user.guild.channels.get(config[user.guild.id].logs.override)) channel = user.guild.channels.get(config[user.guild.id].logs.override);
        if(channel){
          let use = bot.users.get(user.id);
          let embed = new Discord.RichEmbed();

          embed.setTitle('User Join');
          embed.setColor(0x3eff3e);
          embed.addField('User Who Joined:', "**" + use.username + '#' + use.discriminator + "** (" + use.id + ")");
          embed.setImage(use.avatarURL + "?size=64");
          embed.setFooter(use.username + '#' + use.discriminator + " (" + use.id + ")");
          embed.setTimestamp();

          channel.send({embed}).catch(console.log);
        }
      } else {
        config[user.guild.id].welcome.channel = '0';
        saveConfig(user.guild.id);
      }
    }
  }
});
//Leave messages----------------------------------------------------------------
bot.on('guildMemberRemove', user => {
  setupConfig(user.guild.id);
  if(config[user.guild.id].leave.enabled){
    if(config[user.guild.id].leave.channel !== undefined){
      if(user.guild.channels.get(config[user.guild.id].leave.channel) !== undefined){
        user.guild.channels.get(config[user.guild.id].leave.channel).send(config[user.guild.id].leave.msg.replace('$@user', '<@' + user.id + ">").replace('$user', bot.users.get(user.id).username).replace('$server', user.guild.name).replace('$id', user.id).replace('$discrim', bot.users.get(user.id).discriminator)).catch(
          function(err){
            if(err) console.log(err);
          });

        let channel = user.guild.channels.get(config[user.guild.id].logs.leaves);
        if(user.guild.channels.get(config[user.guild.id].logs.override)) channel = user.guild.channels.get(config[user.guild.id].logs.override);
        if(channel){
          let use = bot.users.get(user.id);
          let embed = new Discord.RichEmbed();

          let roleTbl = [];
          if(user.roles.size > 0){
            let roles = user.roles.array();
            for(let i = 0; i < roles.length; i++){
              if(roles[i] && roles[i].name !== "@everyone"){
                roleTbl.push(roles[i].name);
              }
            }
          }

          embed.setTitle('User Leave');
          embed.setColor(0xff3e3e);
          embed.addField('User Who Left:', "**" + use.username + '#' + use.discriminator + "** (" + use.id + ")");
          if(roleTbl.length > 0){
            embed.addField('Roles:', `\`\`\`\n${roleTbl.join(', ')}\`\`\``);
          }
          embed.addField('Joined:', user.joinedAt + ` (${formatTime(Date.now() - user.joinedTimestamp, '**$day**d **$hr**h **$min**m ago')})`)
          embed.setImage(use.avatarURL + "?size=64");
          embed.setFooter(use.username + '#' + use.discriminator + " (" + use.id + ")");
          embed.setTimestamp();

          channel.send({embed}).catch(console.log);
        }
      } else {
        config[user.guild.id].leave.channel = '0';
        saveConfig(user.guild.id);
      }
    }
  }
});

//Logging: message edits--------------------------------------------------------
bot.on('messageUpdate', (oldMsg, newMsg) => {
  if(newMsg.guild && !newMsg.author.bot){
    setupConfig(newMsg.guild.id);
    let channel = newMsg.guild.channels.get(config[newMsg.guild.id].logs.message);
    if(newMsg.guild.channels.get(config[newMsg.guild.id].logs.override)) channel = newMsg.guild.channels.get(config[newMsg.guild.id].logs.override);
    if(channel){
      let embed = new Discord.RichEmbed();
      let member = newMsg.guild.members.get(newMsg.author.id);
      let user = bot.users.get(newMsg.author.id);
      let name;
      if(member.displayName === user.username) name = `${user.username}#${user.discriminator} (${user.id})`;
      else name = `${member.displayName} (${user.username}#${user.discriminator} (${user.id}))`;
      let old = oldMsg.content.slice(0, 399);
      if(old.length === 0) old = caution + '|Message not cached.';
      let newM = newMsg.content.slice(0, 399);
      if(newM.length === 0) newM = caution + '|Message not cached due to being a message before last restart.';

      if(newM != old){
        embed.setTitle('Message edited');
        embed.setDescription(`In **#${newMsg.channel.name}**`);
        embed.setColor(0xffff3e);
        embed.addField('Before:', old);
        embed.addField('After:', newM);
        embed.setFooter(`${name}`);
        embed.setTimestamp();

        channel.send({embed}).catch(err => {console.log(err);});
      }
    }
  }
});
//Deleted message logging-------------------------------------------------------
bot.on('messageDelete', msg => {
  if(msg.guild && !msg.author.bot){
    setupConfig(msg.guild.id);
    let channel = msg.guild.channels.get(config[msg.guild.id].logs.message);
    if(msg.guild.channels.get(config[msg.guild.id].logs.override)) channel = msg.guild.channels.get(config[msg.guild.id].logs.override);
    if(channel){
      let embed = new Discord.RichEmbed();
      let member = msg.guild.members.get(msg.author.id);
      let user = bot.users.get(msg.author.id);
      let name;
      if(member.displayName === user.username) name = `${user.username}#${user.discriminator} (${user.id})`;
      else name = `${member.displayName} (${user.username}#${user.discriminator} (${user.id}))`;
      let message = msg.content.slice(0, 899);
      if(message.length === 0) message = caution + "|Message not cached.";

      embed.setTitle('Message deleted');
      embed.setDescription(`In **#${msg.channel.name}**`);
      embed.setColor(0xff3e3e);
      embed.addField('Content:', message);
      embed.setFooter(`${name}`);
      embed.setTimestamp();

      channel.send({embed}).catch(err => {console.log(err);});
    }
  }
});

//Logging: user updates---------------------------------------------------------
bot.on('guildMemberUpdate', (oldMember, newMember) => {
  let user = newMember.user;
  let name;
  if(newMember.displayName === user.username) name = `${user.username}#${user.discriminator} (${user.id})`;
  else name = `${newMember.displayName} (${user.username}#${user.discriminator} (${user.id}))`;
  //Logging: roles---------------------------------------------------------
  if(newMember.roles.size > 0 || oldMember.roles.size > 0){
    let oldRoles = {};
    let newRoles = {};
    if(oldMember.roles.size > 0) oldRoles = oldMember.roles.array();
    if(newMember.roles.size > 0) newRoles = newMember.roles.array();
    let role = tblDif(oldRoles, newRoles);
    if(role){
      let channel = newMember.guild.channels.get(config[newMember.guild.id].logs.roles);
      if(newMember.guild.channels.get(config[newMember.guild.id].logs.override)) channel = newMember.guild.channels.get(config[newMember.guild.id].logs.override);
      if(channel){
        //Added Roles
        if(role.added){
          let txt = '';
          for(let i = 0; i < role.added.length; i++){
            if(newMember.roles.get(role.added[i])){
              txt += "\n" + newMember.roles.get(role.added[i]).name;
            }
          }
          if(txt.length > 0){
            let embed = new Discord.RichEmbed();
            embed.setTitle('Role Added');
            embed.setDescription('Role: ' + txt.trim())
            embed.setColor(0x3eff3e);
            embed.setFooter(newMember.user.username + "#" + newMember.user.discriminator);
            embed.setTimestamp();
            channel.send({embed}).catch(console.log);
          }
        }
        //Removed Roles
        if(role.removed){
          let txt = '';
          for(let i = 0; i < role.removed.length; i++){
            if(oldMember.roles.get(role.removed[i])){
              txt += "\n" + oldMember.roles.get(role.removed[i]).name;
            }
          }
          if(txt.length > 0){
            let embed = new Discord.RichEmbed();
            embed.setTitle('Role Removed');
            embed.setDescription('Role: ' + txt.trim())
            embed.setColor(0xff3e3e);
            embed.setFooter(newMember.user.username + "#" + newMember.user.discriminator);
            embed.setTimestamp();
            channel.send({embed}).catch(console.log);
          }
        }
      }
    }
  }
});


//Presence----------------------------------------------------------------------
bot.on('ready', () => {
  bot.user.setStatus('available');
  bot.user.setPresence({
    game: {
      name: bot_website,
      type: 'WATCHING',
      url: 'http://' + bot_website + '/'
    }
  });

  bot.ws.connection.ws.addEventListener('message', handleRawMessage);
});
//Set nick on join--------------------------------------------------------------
bot.on('guildCreate', guild => {
  guild.fetchMember(bot.user.id).then(function(member){
    member.setNickname('[ ~ ] LifeBot');
  }).catch(console.log);
  setupConfig(message.guild.id);
  saveConfig(message.guild.id);
});

//Tell me that the bot is ready-------------------------------------------------
bot.on('ready', () => {
  console.log('-----------------');
});
//When there is an unkown websocket error, hopefully stops crashes--------------
bot.on('error', err => {
  console.log('Websocket error occured: ' + err);
});
