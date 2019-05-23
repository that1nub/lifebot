//Start the bot
"use strict";
global.Discord = require('discord.js');
global.fs = require('fs');
global.Jimp = require('jimp');
global.math = require('mathjs');
global.bot = new global.Discord.Client();
//global.{execFile} = require('child_process');
global.customMath = require('./mathEval.js');
//global.extractEmoji = require('emoji-aware').onlyEmoji;
bot.login('Bite Me');


//Booting Variables
global.maintenance = true;
global.notice;

let startTime = Date.now();

fs.readFile('./notice.txt', (err, text) => {
  if(err) console.log(err);
  if(String(text) !== "" || String(text) !== "undefined") global.notice = String(text);
});

global.owners     = [
  '292447249672175618' //Nub
];
global.developers = [
  '210559163648966657' //Slime
];
global.devs = [];
for(let i = 0; i < global.owners.length; i++){
  global.devs.push(global.owners[i]);
}
for(let i = 0; i < global.developers.length; i++){
  global.devs.push(global.developers[i]);
}
global.testers    = [
  '487032695822745600', //Smoort Duude (Nub's alt)
  '469995931211661332', //Leighton
  '410032716587991041', //DEKU
  '471006220480675840', //Donut Fairy
  '185829131437604865'  //NightRaven
];

global.bot_version    = 'BETA';
global.bot_lines      = 'Over 4400 (Will become approximate upon becoming public)';
global.bot_size       = '187 KB (190,574 bytes (1,524,592 bits))';
global.bot_created    = 'Saturday, September 1st, 2018 @ ~12:30 PM CST';
global.bot_public     = 'Not yet available';
global.bot_support    = 'https://discord.gg/pjbemj4';
global.bot_invite     = 'https://discordapp.com/api/oauth2/authorize?client_id=485260768258818048&permissions=2146958839&scope=bot';
global.bot_repository = "https://github.com/that1nub/lifebot/projects/1";
global.bot_website    = "nub.nightcube.net";

global.caution = "<:caution:498569105956274177>";
global.fail    = "<:cancel:498537778200576000>";
global.info    = "<:information:498332125305634826>";
global.check   = "<:check_mark:498332138421092352>";
global.prize   = ":gift:";
global.card    = ":credit_card:";
global.file    = ":scroll:";
global.stone   = "<:stone:498309591709384704>";
global.coal    = "<:coal:498309622659153920>";
global.copper  = "<:copper:498309646025752576>";
global.iron    = "<:iron:498309660772925440>";
global.gold    = "<:gold:498309675805048852>";
global.diamond = "<:diamond:498309691789541376>";
global.online  = "<:online:501183987159662593>";
global.away    = "<:away:501184009913630761>";
global.dnd     = "<:dnd:501184020575551488>";
global.offline = "<:offline:501184046131445801>";

global.day = 8.64e+7;
global.hour = 3.6e+6;
global.min = 60000;
global.sec = 1000;

global.data = [];
global.config = [];

fs.readdir('./data', function(err, da){
  if(err){console.log(err);}
  let files = String(da).split(',');
  for(let i = 0; i < files.length; i++){
    fs.readFile('./data/' + files[i], function(error, ind){
      if(error){console.log(error);}
      try {global.data[files[i].slice(0, files[i].length - 5)] = JSON.parse(ind); }
      catch(err){
        global.data[files[i].slice(0, files[i.length] - 5)] = {};
        console.log("Error loading data " + files[i].slice(0, files[i].length - 5) + "\n" + err.stack);
      }
    })
  }
});
fs.readdir('./config', function(err, da){
  if(err){console.log(err);}
  let files = String(da).split(',');
  for(let i = 0; i < files.length; i++){
    fs.readFile('./config/' + files[i], function(error, ind){
      if(error){console.log(error);}
      try {global.config[files[i].slice(0, files[i].length - 5)] = JSON.parse(ind);}
      catch(err){
        global.config[files[i].slice(0, files[i].length - 5)] = {};
        console.log("Error loading config " + files[i].slice(0, files[i].length - 5) + "\n" + err.stack)
      }
    })
  }
});

global.akeys = {};
fs.readFile('./keys.json', function(err, json){
  if(err) console.log(err);
  try{global.akeys = JSON.parse(json);}
  catch(err){
    global.akeys = {};
    console.log("Failed to load keys");
  }
});

global.commands = [];
fs.readFile('./commands_ran.json', function(err, json){
  if(err) console.log(err);
  try {global.commands = JSON.parse(json);}
  catch(err){
    global.commands = {ran: 0, earned: 0};
    console.log("Failed to load command data\n" + err.stack)
  }
});
global.increaseCommandCount = function(){
  global.commands.ran += 1;
  fs.writeFile('./commands_ran.json', JSON.stringify(commands, null, 2), function(err){if(err) console.log(err);});
}
global.increaseMoneyEarned = function(am){
  global.commands.earned += am;
  fs.writeFile('./commands_ran.json', JSON.stringify(commands, null, 2), function(err){if(err) console.log(err);});
}

global.backgrounds = {};
fs.readdir('./backgrounds', function(err, da){
  if(err) console.log(err);
  let files = String(da).split(',');
  for(let i = 0; i < files.length; i++){
    Jimp.read('./backgrounds/' + files[i], function(err, img){
      if(err) console.log(err);
      global.backgrounds[files[i].slice(0, files[i].indexOf('.'))] = img;
      if(i === files.length - 1){console.log('Backgrounds loaded');}
    });
  }
});

global.badges = {};
fs.readdir('./badges', function(err, da){
  if(err) console.log(err);
  let files = String(da).split(',');
  for(let i = 0; i < files.length; i++){
    Jimp.read('./badges/' + files[i], function(err, img){
      if(err) console.log(err);
      global.badges[files[i].slice(0, files[i].indexOf('.'))] = img;
      if(i === files.length - 1){console.log('Badges loaded');}
    });
  }
});

global.blackBackround;
new Jimp(500, 250, 0x000000FF, (err, img) => {
  if(err) console.log(err);
  global.blackBackround = img;
});

global.blackBadge;
new Jimp(79, 78, 0x000000FF, (err, img) => {
  if(err) console.log(err);
  global.blackBadge = img;
});

global.cardImg = {};
fs.readdir('./img', function(err, da){
  if(err) console.log(err);
  let files = String(da).split(',');
  for(let i = 0; i < files.length; i++){
    Jimp.read('./img/' + files[i], function(err, img){
      if(err) console.log(err);
      global.cardImg[files[i].slice(0, files[i].indexOf('.'))] = img;
      if(i === files.length - 1){console.log('Card text loaded');}
    });
  }
});

global.LetterOverlay;
Jimp.read('img/Letter_Overlay.png', (err, img) => {
  if(err) console.log(err);
  global.LetterOverlay = img;
  console.log('Loaded letter overlay');
});

global.mine = {};
Jimp.read('img/stone.png', (err, img) => {
  if(err) console.log(err);
  global.mine.stone = img;
  console.log("Stone loaded");
});
Jimp.read('img/coal.png', (err, img) => {
  if(err) console.log(err);
  global.mine.coal = img;
  console.log("Coal loaded");
});
Jimp.read('img/copper.png', (err, img) => {
  if(err) console.log(err);
  global.mine.copper = img;
  console.log("Copper loaded");
});
Jimp.read('img/iron.png', (err, img) => {
  if(err) console.log(err);
  global.mine.iron = img;
  console.log("Iron loaded");
});
Jimp.read('img/gold.png', (err, img) => {
  if(err) console.log(err);
  global.mine.gold = img;
  console.log("Gold loaded");
});
Jimp.read('img/diamond.png', (err, img) => {
  if(err) console.log(err);
  global.mine.diamond = img;
  console.log("Diamond loaded");
});

global.blackText;
Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(font => {
  global.blackText = font;
  console.log('Black font loaded.');
}).catch(console.log);
global.whiteText;
Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(font => {
  global.whiteText = font;
  console.log('White font loaded.');
}).catch(console.log);
global.whiteTextS;
Jimp.loadFont(Jimp.FONT_SANS_8_WHITE).then(font => {
  global.whiteTextS = font;
  console.log('White small font loaded.');
}).catch(console.log);


global.reactListening = {};
fs.readFile('./reactListening.json', (err, data) => {
  if(err) console.log(err);
  try {
    global.reactListening = JSON.parse(data);
  } catch(err) {
    console.log('Error fetching reactListening.json');
  }
});

global.dataTable = {
  blacklisted: {
    is: false,
    reason: "",
    on: 0,
    till: 0,
    history: []
  },
  account: 0,
  money: 0,
  occupation: "none",
  time: {
    fish: 0,
    mine: 0,
    daily: 0,
    weekly: 0,
    beg: 0,
    work: 0,
    used: 0,
    reputation: 0
  },
  streak: {
    fish: 0,
    mine: 0,
    daily: 0,
    weekly: 0,
    beg: 0,
    work: 0
  },
  profile: {
    sex: "undefined",
    biography: "No recorded biography.",
    reputation: 0,
    badges: [],
    badgeShowcase: {
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
    relationshipStatus: "Single",
    background: Object.keys(backgrounds)[0],
    color: 0x0096FF
  },
  inventory: {
    fish: {
      trash: 0,
      common: 0,
      uncommon: 0,
      rare: 0
    },
    minerals: {
      stone: 0,
      coal: 0,
      copper: 0,
      iron: 0,
      gold: 0,
      diamond: 0
    }
  },
  mine: {
    lastGenDate: 0
  }
};
global.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
for(let x = 0; x < 10; x++){
  for(let y = 0; y < 10; y++){
    global.dataTable.mine[letters[x] + letters[y]] = {type: "stone", visible: false, mined: false};
  }
}

global.configTable = {
  prefix: "~",
  modroles: [],
  anyCanSeeConfig: true,
  autoDetermineAccess: true,
  bans: {},
  err_invalid_cmd: {
    enabled: true,
    msg: "**$command** is not a valid command."
  },
  welcome: {
    enabled: false,
    showNotice: false,
    msg: "Please welcome **$@user** to our guild!",
    channel: '0',
    roles: []
  },
  leave: {
    enabled: false,
    showNotice: false,
    msg: "**$user#$discrim** ($id) has decided to leave our server.",
    channel: '0'
  },
  selfassign: {
    enabled: false,
    msg: {
      mode: "dm",
      response: "You $mode the role **$role** on **$server**",
      after: "delete"
    },
    roles: [],
    react: {
      enabled: false,
      groups: []
    }
  },
  msgs: {},
  moderation: {
    strikes: {},
    automod: {
      cussing: "",
      links: "",
      spam: "",
      massMention: "",
      discordLinks: ""
    }
  },
  leveling: {
    enabled: false,
    levels: {},
    levelRewards: {},
    noXP: []
  },
  suggestions: {
    channel: 0,
    list: []
  },
  logs: {
    override: '0',
    message: '0',
    joins: '0',
    leaves: '0',
    roles: '0',
    bans: '0'
  },
  shouts: {}
};

global.colors = {
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
};

//Functions
global.setupCopy = function(obj, temp){
  if(!obj) return;
  let tempKeys = Object.keys(temp);
  for(let i = 0; i < tempKeys.length; i++){
    if(typeof temp[tempKeys[i]] === "object"){
      if(!(typeof obj[tempKeys[i]] === "object")) obj[tempKeys[i]] = {};
      Object.setPrototypeOf(obj[tempKeys[i]], temp[tempKeys[i]].__proto__);
      setupCopy(obj[tempKeys[i]], temp[tempKeys[i]]);
    } else {
      if(typeof obj[tempKeys[i]] !== typeof temp[tempKeys[i]]) obj[tempKeys[i]] = temp[tempKeys[i]];
    }
  }
  return obj;
}

global.saveKeys = function(){
  fs.writeFile('./keys.json', JSON.stringify(akeys, null, 2), err => {if(err) console.log(err.stack);});
}

global.resetData = function(userid){
  if(global.data[userid]){
    let blackListed = setupCopy({}, data[userid].blacklisted);
    global.data[userid] = setupCopy({blacklisted: blackListed}, global.dataTable);
    saveData(userid);
  }
}
global.setupData = function(userid){
  if(!(typeof userid === "string")) return;
  if(!global.data[userid]) global.data[userid] = {};
  setupCopy(global.data[userid], global.dataTable);

  for(let i = 0; i < owners.length; i++){
    if(global.owners[i] === userid){
      if(!global.data[userid].profile.badges.includes('badge_dev')) global.data[userid].profile.badges.push('badge_dev');
      if(!global.data[userid].profile.badges.includes('badge_tester')) global.data[userid].profile.badges.push('badge_tester');
    }
  }
  for(let i = 0; i < developers.length; i++){
    if(global.developers[i] === userid){
      if(!global.data[userid].profile.badges.includes('badge_dev')) global.data[userid].profile.badges.push('badge_dev');
      if(!global.data[userid].profile.badges.includes('badge_tester')) global.data[userid].profile.badges.push('badge_tester');
    }
  }
  for(let i = 0; i < testers.length; i++){
    if(userid === global.testers[i]){
      if(!global.data[userid].profile.badges.includes('badge_tester')) global.data[userid].profile.badges.push('badge_tester');
    }
  }
}
global.saveData = function(userid){
  if(global.data[userid]) fs.writeFile('./data/' + userid + ".json", JSON.stringify(global.data[userid], null, 2), err => {if(err) console.log(err);});
}

global.setupConfig = function(guildid){
  if(!(typeof guildid === "string")) return;
  if(!global.config[guildid]) global.config[guildid] = {};
  setupCopy(global.config[guildid], global.configTable);
}
global.resetConfig = function(guildid){
  if(global.config[guildid]){
    global.config[guildid] = setupCopy({}, global.configTable);
    saveConfig(guildid);
  }
}
global.saveConfig = function(guildid){
  if(global.config[guildid]) fs.writeFile('./config/' + guildid + ".json", JSON.stringify(global.config[guildid], null, 2), err => {if(err) console.log(err);});
}

//Command stuff
global.command = [];
global.Command = function(tbl){
  this.title = (typeof tbl.title === "string") ? tbl.title : "No specified title";
  this.shortDesc = (typeof tbl.shortDesc === "string") ? tbl.shortDesc : "No description set.";
  this.longDesc = (typeof tbl.longDesc === "string") ? tbl.longDesc : "No description set.";
  this.call = (typeof tbl.call === "object"|| typeof tbl.call === "string") ? tbl.call : " ooooof";
  this.usage = (typeof tbl.usage === "string") ? tbl.usage : "none";
  this.example = (typeof tbl.example === "string") ? tbl.example : "";
  this.function = (typeof tbl.function === "function") ? tbl.function : function(message){global.sendMessage(message, "Command ran, but had nothing to execute!")};
  this.can = (typeof tbl.can === "object") ? tbl.can : [];
  this.id = global.command.length;
}
global.Command.prototype.register = function(){
  if(global.command.length > 0){
    for(let i = 0; i < global.command.length; i++){
      if(global.command[i].title === this.title){
        this.id = i;
      }
    }
  }
  global.command[this.id] = this;
  console.log("Command registered: " + this.title);
}
global.Command.prototype.setTitle = function(title){
  if(typeof title === "string") this.title = title;
}
global.Command.prototype.setShortDesc = function(desc){
  if(typeof desc === "string") this.shortDesc = desc;
}
global.Command.prototype.setLongDesc = function(desc){
  if(typeof desc === "string") this.longDesc = desc;
}
global.Command.prototype.setCall = function(call){
  if(typeof call === "string" || typeof call === "object") this.call = call;
}
global.Command.prototype.setUsage = function(usage){
  if(typeof usage === "string") this.usage = usage;
}
global.Command.prototype.setFunction = function(func){
  if(typeof func === "function") this.function = func;
}

global.sendMessage = function(message, msg, attachments){
  if(!(message && msg)) return;
  if(global.notice) msg += "\n\nNotice from developers: " + notice;
  return message.channel.send(msg, attachments).catch(err => {if(err) console.log(err)});
}

global.clamp = function(int, min, max){
  return Math.min(Math.max(min, int), max);
}

global.dist = function(posX, posY, sizeX, sizeY){
  let a = posX - sizeX;
  let b = posY - sizeY;
  return Math.sqrt(a*a + b*b);
}

global.formatTime = function(ms, str){
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
  return ms;
}

global.spaceObject = function(inObject, leftSide, rightSide, pairSpacer, normalSpacer, hrSpacer, align){
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

global.generateMine = function(userid, date){
  if(typeof userid === "string"||!date) return;
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
      global.data[userid].mine[letters[x] + letters[y]] = newMine;
    }
  }
  global.data[userid].mine.lastGenDate = date;
}

global.canMine = function(userid, date){
  if(!(typeof userid === "string" || typeof date === "number")) return;
  setupData(userid);
  if(date - global.data[userid].mine.lastGenDate >= day) return true;
  return false;
}

global.setReactListener = function(message, can, onReact){
  if(message === undefined || can === undefined || onReact === undefined) return;
  global.reactListening[message.id] = {can: can, onReact: onReact};
  fs.writeFile('./reactListening.json', JSON.stringify(global.reactListening, null, 2), err => {if(err) console.log(err);});
}

global.removeReactListener = function(messageID){
  if(global.reactListening[messageID]){
    global.reactListening[messageID] = undefined;
    fs.writeFile('./reactListening.json', JSON.stringify(global.reactListening, null, 2), err => {if(err) console.log(err);});
  }
}

global.messageDevelopers = function(message){
  for(let i = 0; i < owners.length; i++){
    global.bot.users.get(global.owners[i]).send(message);
  }
  for(let i = 0; i < developers.length; i++){
    global.bot.users.get(global.developers[i]).send(message);
  }
}

global.findPlayer = function(str, guild){
  let found = {};
  if(str){
    if(global.bot.users.get(str)){
      let tbl = {user: global.bot.users.get(str)};
      if(guild){
        let guildM = global.bot.guilds.get(guild);
        if(guildM) tbl.member = guildM.members.get(str);
      }
      found[str] = tbl;
    } else if(str.match(/<@!?[0-9]+>/g)){
      let id = str.match(/[0-9]+/g)[0];
      let tbl = {user: global.bot.users.get(id)};
      if(guild){
        let guildM = global.bot.guilds.get(guild);
        if(guildM) tbl.member = guildM.members.get(id);
      }
      found[id] = tbl;
    } else {
      let users = global.bot.users.array();
      let keys = Object.keys(users);
      for(let i = 0; i < keys.length; i++){
        let user = users[keys[i]];
        if(user.tag.toLowerCase().includes(str)){
          let tbl = {user: user};
          if(guild){
            let guildM = global.bot.guilds.get(guild);
            if(guildM) tbl.member = guildM.members.get(user.id);
          }
          found[user.id] = tbl;
        }
      }
    }
  }

  return found;
}

global.timeTable = {
    's':1000,
    'm':60*1000,
    'h':60*60*1000,
    'd':24*60*60*1000,
    'w':7*24*60*60*1000,
    'y':365*24*60*60*1000
};
global.parseTime = function(input){
    let keys = Object.keys(timeTable);
    let re = new RegExp('[('+keys.join(')(?:')+')]', 'g');
    let slicePos = 0;
    let val = 0;

    //Return Infinity
    if(input.includes("forever")) return Infinity;

    // Maximum of 32 time fields, so it doesn't lag if someone spams
    let matchesLeft = 32;
    while(--matchesLeft) {
        let res = re.exec(input);
        if(res == null) break;
        let timeType = input.charAt(res.index);
        if(keys.includes(timeType)) {
            let thisVal = Number(input.substring(slicePos, res.index));
            if(Number.isFinite(thisVal) && !Number.isNaN(thisVal)) {
                val += thisVal * timeTable[timeType];
            }
        }
        slicePos = res.index + 1;
    }

    return val;
}

//Commands
fs.readdir('./commands', (err, data) => {
  if(err) console.log(err);
  let files = String(data).split(',');
  if(files.length > 0){
    for(let i = 0; i < files.length; i++){
      try {
        require("./commands/" + files[i]);
      } catch(err) {
        console.log("Error loading ./commands/" + files[i] + "\n" + err);
      }
    }
  }
});

//Command handler
global.bot.on("message", message => {
  let prefix = "~";
  if(message.guild){
    setupConfig(message.guild.id);
    prefix = global.config[message.guild.id].prefix;
  }
  if(message.content.startsWith('<@' + bot.user.id + '>')) prefix = '<@' + bot.user.id + '>';
  else if(message.content.startsWith('<@!' + bot.user.id + '>')) prefix = '<@!' + bot.user.id + '>';
  else if(message.content.startsWith('\\<@' + bot.user.id + '>')) prefix = '\\<@' + bot.user.id + '>';
  else if(message.content.startsWith('\\<@!' + bot.user.id + '>')) prefix = '\\<@!' + bot.user.id + '>';

  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase().replace(/`+/g, '').replace(/\|+/g, '').replace(/\*+/g).replace(/_+/g, '').replace(/~+/g, '');

  //Leveling handler
  if(message.guild){
    if(!message.author.bot){
      if(!global.config[message.guild.id].msgs[message.author.id]) global.config[message.guild.id].msgs[message.author.id] = {};
      if(!global.config[message.guild.id].msgs[message.author.id][message.channel.id]) global.config[message.guild.id].msgs[message.author.id][message.channel.id] = 0;
      global.config[message.guild.id].msgs[message.author.id][message.channel.id]++;

      if(global.config[message.guild.id].leveling.enabled){
        if(global.config[message.guild.id].leveling.noXP[message.channel.id] === undefined){
          if(!global.config[message.guild.id].leveling.levels[message.author.id]) global.config[message.guild.id].leveling.levels[message.author.id] = {level: 1, xp: 0, totalxp: 0, lastGained: 0};
          if(message.createdTimestamp - global.config[message.guild.id].leveling.levels[message.author.id].lastGained >= min){
            let xptolvl = (5 * global.config[message.guild.id].leveling.levels[message.author.id].level) + 30;
            let gainxp = 5;
            global.config[message.guild.id].leveling.levels[message.author.id].totalxp += gainxp;
            global.config[message.guild.id].leveling.levels[message.author.id].xp += gainxp;
            global.config[message.guild.id].leveling.levels[message.author.id].lastGained = message.createdTimestamp;
            if(global.config[message.guild.id].leveling.levels[message.author.id].xp >= xptolvl){
              global.config[message.guild.id].leveling.levels[message.author.id].level++;
              global.config[message.guild.id].leveling.levels[message.author.id].xp -= xptolvl;
              global.sendMessage(message, `:up:|Congratulations **${message.author.username}**, you have leveled up to level **${config[message.guild.id].leveling.levels[message.author.id].level}**!`)

              let lvl = global.config[message.guild.id].leveling.levels[message.author.id].level;

              if(global.config[message.guild.id].leveling.levelRewards[String(lvl)]){
                message.member.addRole(config[message.guild.id].leveling.levelRewards[String(lvl)]).then(function(){
                  global.sendMessage(message, check + '|You have also received the role ' + message.guild.roles.get(config[message.guild.id].leveling.levelRewards[String(lvl)]).name);
                }).catch(function(err){
                  console.log(err);
                  global.sendMessage(message, fail + info + '|You were supposed to receive a role, but I was unable to give it.');
                });
              }
            }
          }
        }
      }
      global.saveConfig(message.guild.id);
    }
  }

  //Tell them the prefix
  if(message.content.trim() === prefix && (message.guild && prefix !== config[message.guild.id].prefix)) global.sendMessage(message, `${global.info}|My prefix for here is **${message.guild ? config[message.guild.id].prefix : "~"}**`);
  else if(message.content.trim() === prefix && message.guild) global.sendMessage(message, `${global.info}|You already know my prefix here, please specify a command!`);
  else if(!message.guild && message.content.trim() === prefix) global.sendMessage(message, `${info}|By default, my prefix is **~**, but it may vary depending on the guild you're on.`);

  //Command handler continued
  if(message.content.trim().startsWith(prefix) && message.content.trim().length > prefix.length){
    global.setupData(message.author.id);
    let isDev = false;
    let isTester = false;
    for(let i = 0; i < owners.length; i++){
      if(message.author.id === global.owners[i]){
        isDev = true;
      }
    }
    if(!isDev){
      for(let i = 0; i < developers.length; i++){
        if(message.author.id === global.developers[i]){
          isDev = true;
        }
      }
      if(!isDev){
        for(let i = 0; i < testers.length; i++){
          if(message.author.id === global.testers[i]){
            isTester = true;
          }
        }
      }
    }
    if(!isReseting){
      let can = !global.maintenance;
      if(isDev||isTester) can = true;
      if(can){
        if(!global.data[message.author.id].blacklisted.is){
          let antispam = false;
          if(message.createdTimestamp - global.data[message.author.id].time.used < 750) antispam = true;
          global.data[message.author.id].time.used = message.createdTimestamp;
          if(!antispam){
            let ran = false;
            for(let i = 0; i < global.command.length; i++){
              let commandCall = global.command[i].call;
              let canRun = true;
              if(global.command[i].can.length > 0){
                canRun = false;
                for(let x = 0; x < global.command[i].can.length; x++){
                  if(message.author.id === global.command[i].can[x]){
                    canRun = true;
                    break;
                  }
                }
              }
              if(canRun){
                if(typeof commandCall === "string"){
                  if(!ran && commandCall.toLowerCase() === cmd){
                    ran = true;
                    try {
                      global.command[i].function(message, args);
                      global.increaseCommandCount();
                    } catch(err) {
                      global.sendMessage(message, caution + "|You have encountered an error! The developers ***have been DMed*** so you don't have to do anything!");
                      let user = bot.users.get(message.author.id);
                      global.messageDevelopers(`***${user.username}#${user.discriminator}*** (*${user.id}*) has found a bug in __***${global.command[i].title}***__:\`\`\`\n${err.stack}\`\`\`They said: *${message.content.substring(0, 999)}*`);
                    }
                  }
                } else if(typeof commandCall === "object"){
                  for(let x = 0; x < commandCall.length; x++){
                    if(!ran && commandCall[x].toLowerCase() === cmd){
                      ran = true;
                      try {
                        global.command[i].function(message, args);
                        global.increaseCommandCount();
                      } catch(err) {
                        global.sendMessage(message, caution + "|You have encountered an error! The developers ***have been DMed*** so you don't have to do anything!");
                        let user = global.bot.users.get(message.author.id);
                        global.messageDevelopers(`***${user.username}#${user.discriminator}*** (*${user.id}*) has found a bug in __***${global.command[i].title}***__:\`\`\`\n${err.stack}\`\`\`They said: *${message.content.substring(0, 999)}*`);
                      }
                    }
                  }
                }
              }
            }
            if(!ran && message.guild && global.config[message.guild.id].err_invalid_cmd.enabled) global.sendMessage(message, fail + "|" + config[message.guild.id].err_invalid_cmd.msg.replace('$command', cmd.substring(0, 99)).replace('$cmd', cmd.substring(0, 99)));
          } else global.sendMessage(message, fail + "|You must wait 750 milliseconds to use a command!");
        } else global.sendMessage(message, fail + "|You are currently blacklisted from LifeBot");
      } else global.sendMessage(message, fail + "|Bot is currently down for maintenance!");
    } else global.sendMessage(message, fail + `|Commands are temporarily shut-down; bot is auto restarting in ${Math.round(((isResetingTime + 30000) - Date.now()) / 1000)} seconds.`);
  }
});

//ReactListener-----------------------------------------------------------------
let reactFuncs = {
  'testing': function(guild, channel, message, user, emote, isAdded){
    if(isAdded){
      global.sendMessage(message, emote.name + "|" + emote.id);
    } else {
      global.sendMessage(message, emote.name + "|" + emote.id);
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
        if(global.reactListening[data.message_id] !== undefined){
          let react = global.reactListening[data.message_id];
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
                global.reactFuncs[react.mode](guild, channel, message, user, data.emoji, true);
              });
            } catch(err) {
              let user = data.user_id;
              for(let i = 0; i < owners.length; i++){
                global.bot.users.get(owners[i]).send("**" + bot.users.get(user.id).username + "#" + bot.users.get(user.id).discriminator + "** (**" + user.id + "**) has found a bug (***REACT LISTENER***)!```\n" + err.stack + "```");
              }
              for(let i = 0; i < developers.length; i++){
                global.bot.users.get(developers[i]).send("**" + bot.users.get(user.id).username + "#" + bot.users.get(user.id).discriminator + "** (**" + user.id + "**) has found a bug (***REACT LISTENER***)!```\n" + err.stack + "```");
              }
            }
          }
        }
      } break;

      case 'MESSAGE_REACTION_REMOVE': {
        if(global.reactListening[data.message_id] !== undefined){
          let react = global.reactListening[data.message_id];
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
                global.reactFuncs[react.mode](guild, channel, message, user, data.emoji, false);
              });
            } catch(err) {
              let user = data.user_id;
              for(let i = 0; i < owners.length; i++){
                global.bot.users.get(owners[i]).send("**" + bot.users.get(user.id).username + "#" + bot.users.get(user.id).discriminator + "** (**" + user.id + "**) has found a bug (***REACT LISTENER***)!```\n" + err.stack + "```");
              }
              for(let i = 0; i < developers.length; i++){
                global.bot.users.get(developers[i]).send("**" + bot.users.get(user.id).username + "#" + bot.users.get(user.id).discriminator + "** (**" + user.id + "**) has found a bug (***REACT LISTENER***)!```\n" + err.stack + "```");
              }
            }
          }
        }
      } break;
    }
  }
}
global.bot.on('ready', () => {
  global.bot.user.setStatus('available');
  global.bot.user.setPresence({
    game: {
      name: global.bot_website,
      type: 'WATCHING',
      url: 'http://' + global.bot_website + '/'
    }
  });

  global.bot.ws.connection.ws.addEventListener('message', handleRawMessage);

  console.log("Bot ready to go!");
});

global.bot.on('error', err => {
  console.log('An error occured: ' + err);
});

//Setup server and set nickname
global.bot.on('guildCreate', guild => {
  guild.fetchMember(global.bot.user.id).then(function(member){
    member.setNickname('[ ~ ] LifeBot');
  }).catch(console.log);
  setupConfig(message.guild.id);
  saveConfig(message.guild.id);
});

//Member joins
global.bot.on('guildMemberAdd', user => {
  global.setupConfig(user.guild.id);
  if(global.config[user.guild.id].welcome.enabled){
    if(global.config[user.guild.id].welcome.channel !== undefined){
      if(user.guild.channels.get(global.config[user.guild.id].welcome.channel) !== undefined){
        user.guild.channels.get(global.config[user.guild.id].welcome.channel).send(global.config[user.guild.id].welcome.msg.replace('$@user', '<@' + user.id + ">").replace('$user', bot.users.get(user.id).username).replace('$server', user.guild.name).replace('$id', user.id).replace('$discrim', bot.users.get(user.id).discriminator)).catch(
          function(err){
            if(err) console.log(err);
          });

        let roles = global.config[user.guild.id].welcome.roles;
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
          global.bot.users.get(user.guild.ownerID).send(fail + info + "|I hate to inform you this, but I have had some issues adding the following roles to user **" + user.id + "**:```\n" + eroles.join('\n') + "```This is likely due to my role being below the roles added. Here is the full error report that you may take a look at:```\n" + error + "```").catch(function(err){
            global.bot.users.get(user.guild.ownerID).send(fail + info + "|I hate to inform you that I've had issues adding roles to **" + user.id + "** with the following error report:```\n" + error + "```").catch(function(err){
              global.bot.users.get(user.guild.ownerID).send(fail + info + "|I hate to inform you that I've had troubles adding roles to **" + user.id + "**").catch(function(err){
                console.log(err);
              });
            });
          });
        }
        let channel = user.guild.channels.get(global.config[user.guild.id].logs.joins);
        if(user.guild.channels.get(global.config[user.guild.id].logs.override)) channel = user.guild.channels.get(global.config[user.guild.id].logs.override);
        if(channel){
          let use = global.bot.users.get(user.id);
          let embed = new global.Discord.RichEmbed();

          embed.setTitle('User Join');
          embed.setColor(0x3eff3e);
          embed.addField('User Who Joined:', "**" + use.username + '#' + use.discriminator + "** (" + use.id + ")");
          embed.setImage(use.avatarURL + "?size=64");
          embed.setFooter(use.username + '#' + use.discriminator + " (" + use.id + ")");
          embed.setTimestamp();

          channel.send({embed}).catch(console.log);
        }
      } else {
        global.config[user.guild.id].welcome.channel = '0';
        global.saveConfig(user.guild.id);
      }
    }
  }
});
//Member leave
global.bot.on('guildMemberRemove', user => {
  global.setupConfig(user.guild.id);
  if(global.config[user.guild.id].leave.enabled){
    if(global.config[user.guild.id].leave.channel !== undefined){
      if(user.guild.channels.get(global.config[user.guild.id].leave.channel) !== undefined){
        user.guild.channels.get(global.config[user.guild.id].leave.channel).send(global.config[user.guild.id].leave.msg.replace('$@user', '<@' + user.id + ">").replace('$user', bot.users.get(user.id).username).replace('$server', user.guild.name).replace('$id', user.id).replace('$discrim', bot.users.get(user.id).discriminator)).catch(
          function(err){
            if(err) console.log(err);
          });

        let channel = user.guild.channels.get(global.config[user.guild.id].logs.leaves);
        if(user.guild.channels.get(global.config[user.guild.id].logs.override)) channel = user.guild.channels.get(global.config[user.guild.id].logs.override);
        if(channel){
          let use = global.bot.users.get(user.id);
          let embed = new global.Discord.RichEmbed();

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
          embed.addField('Joined:', user.joinedAt + ` (${global.formatTime(Date.now() - user.joinedTimestamp, '**$day**d **$hr**h **$min**m ago')})`)
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

//Message edit
global.bot.on('messageUpdate', (oldMsg, newMsg) => {
  if(newMsg.guild && !newMsg.author.bot){
    global.setupConfig(newMsg.guild.id);
    let channel = newMsg.guild.channels.get(global.config[newMsg.guild.id].logs.message);
    if(newMsg.guild.channels.get(global.config[newMsg.guild.id].logs.override)) channel = newMsg.guild.channels.get(global.config[newMsg.guild.id].logs.override);
    if(channel){
      let embed = new global.Discord.RichEmbed();
      let member = newMsg.guild.members.get(newMsg.author.id);
      let user = global.bot.users.get(newMsg.author.id);
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
//Message delete
global.bot.on('messageDelete', msg => {
  if(msg.guild && !msg.author.bot){
    global.setupConfig(msg.guild.id);
    let channel = msg.guild.channels.get(global.config[msg.guild.id].logs.message);
    if(msg.guild.channels.get(global.config[msg.guild.id].logs.override)) channel = msg.guild.channels.get(global.config[msg.guild.id].logs.override);
    if(channel){
      let embed = new global.Discord.RichEmbed();
      let member = msg.guild.members.get(msg.author.id);
      let user = global.bot.users.get(msg.author.id);
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

// //Logging member changes (broken atm)
// global.bot.on('guildMemberUpdate', (oldMember, newMember) => {
//   let user = newMember.user;
//   let name;
//   if(newMember.displayName === user.username) name = `${user.username}#${user.discriminator} (${user.id})`;
//   else name = `${newMember.displayName} (${user.username}#${user.discriminator} (${user.id}))`;
//   //Logging: roles---------------------------------------------------------
//   if(newMember.roles.size > 0 || oldMember.roles.size > 0){
//     let oldRoles = {};
//     let newRoles = {};
//     if(oldMember.roles.size > 0) oldRoles = oldMember.roles.array();
//     if(newMember.roles.size > 0) newRoles = newMember.roles.array();
//     //let role = global.tblDif(oldRoles, newRoles);
//     if(role){
//       let channel = newMember.guild.channels.get(global.config[newMember.guild.id].logs.roles);
//       if(newMember.guild.channels.get(global.config[newMember.guild.id].logs.override)) channel = newMember.guild.channels.get(config[newMember.guild.id].logs.override);
//       if(channel){
//         //Added Roles
//         if(role.added){
//           let txt = '';
//           for(let i = 0; i < role.added.length; i++){
//             if(newMember.roles.get(role.added[i])){
//               txt += "\n" + newMember.roles.get(role.added[i]).name;
//             }
//           }
//           if(txt.length > 0){
//             let embed = new global.Discord.RichEmbed();
//             embed.setTitle('Role Added');
//             embed.setDescription('Role: ' + txt.trim())
//             embed.setColor(0x3eff3e);
//             embed.setFooter(newMember.user.username + "#" + newMember.user.discriminator);
//             embed.setTimestamp();
//             channel.send({embed}).catch(console.log);
//           }
//         }
//         //Removed Roles
//         if(role.removed){
//           let txt = '';
//           for(let i = 0; i < role.removed.length; i++){
//             if(oldMember.roles.get(role.removed[i])){
//               txt += "\n" + oldMember.roles.get(role.removed[i]).name;
//             }
//           }
//           if(txt.length > 0){
//             let embed = new global.Discord.RichEmbed();
//             embed.setTitle('Role Removed');
//             embed.setDescription('Role: ' + txt.trim())
//             embed.setColor(0xff3e3e);
//             embed.setFooter(newMember.user.username + "#" + newMember.user.discriminator);
//             embed.setTimestamp();
//             channel.send({embed}).catch(console.log);
//           }
//         }
//       }
//     }
//   }
// });

//Auto restart
let isReseting = false;
let isResetingTime = 0;
let restartTime = new Date();
restartTime.setHours(0);
restartTime.setMinutes(0);
restartTime.setSeconds(0);
restartTime.setMilliseconds(0);
restartTime.setDate(restartTime.getDate() + 1);
setInterval(() => {
  if(isReseting) return;
  let currentTime = new Date();
  if(currentTime >= restartTime){
    isReseting = true;
    isResetingTime = Date.now();
    console.log("Initiating restart sequence........");
    setTimeout(() => {
      process.exit();
    }, 30000);
  }
}, 1000);

//Log statistics on start
bot.on('ready', () => {
  let msg = info + "|Bot restarted. Here is some data:\n";
  let memUse = process.memoryUsage();
  msg += `Memory: ${memUse.heapUsed}/${memUse.heapTotal}\n`;
  msg += `Startup time: ${Date.now() - startTime} milliseconds`;
  global.bot.guilds.get('474287860090929152').channels.get('555616392007778304').send(msg).catch(console.log);

  //Check bans
  setInterval(() => {
    bot.guilds.forEach((guild, key, map) => {
      setupConfig(guild.id);
      let bans = config[guild.id].bans;
      if(bans){
        let keys = Object.keys(bans);
        for(let i = 0; i < keys.length; i++){
          if(bans[keys[i]]){
            if(Date.now() >= bans[keys[i]].until){
              guild.unban(keys[i], "Ban time complete.").catch(console.log);
              config[guild.id].bans[keys[i]] = undefined;
              saveConfig(guild.id);
            }
          }
        }
      }
    });
  }, 1000);
});
