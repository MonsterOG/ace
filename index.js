
var randomizer = require('./randomizer.js');
// Load up the discord.js library
const Discord = require("discord.js");
var currencyFormatter = require('currency-formatter')
var ms = require('parse-ms');
const Enmap = require('enmap');

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();
// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
const translate = require('google-translate-api');
const yt = require('ytdl-core');
const randomPuppy = require('random-puppy');
const YouTube = require('simple-youtube-api');
const GOOGLE_API_KEY = ("AIzaSyDET-uS27nrQBxANRWEz_vbl_P6hX-cjRY");
var servers = {};
var prefix = '-';
const queue2 = new Map();
let queue = {};

// config.token contains the bot's token
// config.prefix contains the message prefix.


client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser
  client.user.setActivity(`${client.guilds.size} servers | ;help`);
});





client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`${client.guilds.size} servers | ;help`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`${client.guilds.size} servers | ;help`);
});

client.on("message", async (message, msg) => {
  // This event will run on every single message received, from any channel or DM.
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.

  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "say") {
    var perms = message.member.hasPermission("KICK_MEMBERS");
    if(!perms) return message.channel.send("You do not have permission to use this command.");
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);
  }

//FUN commands
//emojis
if(command === "emoji") {
    try {

        let emojis;
        if (message.guild.emojis.size === 0) emojis = 'There are no emojis on this server.';
        else emojis = `**Emojis for ${message.guild.name}**\n${message.guild.emojis.map(e => e).join(' ')}`;
        message.channel.send(emojis);

    } catch (err) {

        message.channel.send(`**${err.name}: ${err.message}**`)
    }

}




//FUN COMMANDS
//COINFLIP
if(command == "coinflip") {
  message.channel.send(`Result: **${Math.floor(Math.random() * 2) == 0 ? "Heads" : "Tails"}**!`);
}

if(command === "warn") {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, but you don't have permission to use this!")
  let target = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  let reports = message.guild.channels.find('name' , 'reports');
  let reason = args.slice(1).join(' ');

    if(!target) return message.channel.send('`Please mention a user to warn.`');
    if(!reports) return message.channel.send('`Please create a channel named "reports" to log the warns.`');
    if(!reason) reason = "No reason provided";


    let reportembed = new Discord.RichEmbed()
        .setThumbnail(target.user.avatarURL)
        .setAuthor('Warn', 'https://cdn.discordapp.com/emojis/465245981613621259.png?v=1')
        .setDescription(`New warn by ${message.author.username}`)
        .addField('⚠ - Warned Member', `${target.user.tag}\n(${target.user.id})`, true)
        .addField('⚠ - Warned by', `${message.author.tag}\n(${message.author.id})`, true)
        .addField('⚙ - Channel', `${message.channel}`)
        .addField('🔨 - Reason', `${reason}`)
        .setColor('0xfc4f35')
        .setTimestamp();
    reports.send(reportembed);


      message.delete().catch(O_o=>{});

    let warned = new Discord.RichEmbed()
    .setTitle(`Watch out ${target.user.tag} `)
    .setDescription(`**${message.author.username}** gives a warning about your behavior`)
    .setColor(`0xfc4f35`)
    .setTimestamp()
     message.channel.send(warned);

    let warnembed = new Discord.RichEmbed()
        .setThumbnail(target.user.avatarURL)
        .setTitle("⚠ Warn")
        .setDescription(`Hello, **${target.user.tag}** you were warned by: **${message.author.username}**`)
        .addField('⚙ **Server**:', `${message.guild.name}`)
        .addField('⚙ **Channel**:', `${message.channel}`)
        .addField('🔨 **Reason**:', `${reason}`)
        .setColor('0xfc4f35')
        .setFooter(`Learn from your mistakes!`, `${client.user.avatarURL}`)
        .setTimestamp();
    await target.send(warnembed);

  }


if(command === "report") {
        let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let reports = message.guild.channels.find('name' , 'reports');
        let reason =  args.slice(1).join(' ');

        if(!target) return message.channel.send('`Please specify a member to report.`');
        if(!reason) return message.channel.send('`Please specify a reason to report.`');
        if(!reports) return message.channel.send('`Please create a channel named "reports" to log the reports.`');

        let reportembed = new Discord.RichEmbed()
            .setThumbnail(target.user.avatarURL)
            .setAuthor('Report', 'https://cdn.discordapp.com/emojis/465245981613621259.png?v=1')
            .setDescription(`New report by ${message.author.username}`)
            .addField('⚠ - Reported Member', `${target.user.tag}\n(${target.user.id})`, true)
            .addField('⚠ - Reported by', `${message.author.tag}\n(${message.author.id})`, true)
            .addField('⚙ - Channel', `${message.channel}`)
            .addField('🔨 - Reason', `${reason}`)
            .setColor('0xfc4f35')
            .setTimestamp();
        reports.send(reportembed);

        message.channel.send(`**${target}** was reported by **${message.author}** ${reason}`).then(message => message.delete(5000));
}



  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
      let target = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    let user = message.mentions.users.first();
  let razon = message.content.split(" ").slice(2).join(" ");
  var perms = message.member.hasPermission("KICK_MEMBERS");

  let reports = message.guild.channels.find('name' , 'reports');

  if(!reports) return message.channel.send('`Please create a channel named "reports" to log the kicks.`');

  if(!perms) return message.channel.send("You do not have permission to use this command.");
  if (message.mentions.users.size < 1) return message.reply('`Please specify a member to kick.`').catch(console.error);

  if (!razon) return message.channel.send('`Please specify a reason to kick.`');
  if (!message.guild.member(user).kickable) return message.reply('You can not kick that user.');


//DM MESSAGE
  let warnembed = new Discord.RichEmbed()
            .setThumbnail(target.user.avatarURL)
      .setTitle("⚠ Kick")
      .setDescription(`Hello, **${user.tag}** you were kicked by: **${message.author.username}**`)
      .addField('⚙ **Server**:', `${message.guild.name}`)
      .addField('⚙ **Channel**:', `${message.channel}`)
      .addField('🔨 **Reason**:', `${razon}`)
      .setColor('0xfc4f35')
      .setFooter(`Learn from your mistakes!`, `${client.user.avatarURL}`)
      .setTimestamp();
  await target.send(warnembed);

  let kickEmbed = new Discord.RichEmbed()
     .setDescription("~KICK: Sorry, your behavior is inadequate~")
     .setColor("#e56b00")
     .addField("Kicked User", `${user.username}`)
     .addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
     .addField("Kicked In", message.channel)
     .addField("Time", message.createdAt)
     .setImage(randomizer("expell"))
     .addField("Reason", razon)

     message.channel.send(kickEmbed)

  let reportembed = new Discord.RichEmbed()
            .setThumbnail(target.user.avatarURL)
         .setAuthor('Kick', 'https://cdn.discordapp.com/emojis/465245981613621259.png?v=1')
         .setDescription(`New kick by ${message.author.username}`)
         .addField('⚠ - Kicked Member', `${user.tag}\n(${user.id})`, true)
         .addField('⚠ - Kicked by', `${message.author.tag}\n(${message.author.id})`, true)
         .addField('⚙ - Channel', `${message.channel}`)
         .addField('🔨 - Reason', `${razon}`)
         .setColor('0xfc4f35')
         .setTimestamp();
     reports.send(reportembed);

  message.guild.member(user).kick(razon);


  }

  if(command === "ban") {
      let target = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    let user = message.mentions.users.first();
  let reason = message.content.split(" ").slice(2).join(" ");


    let reports = message.guild.channels.find('name' , 'reports');

    if(!reports) return message.channel.send('`Please create a channel named "reports" to log the kicks.`');

    var perms = message.member.hasPermission("BAN_MEMBERS");
    if(!perms) return message.channel.send("You do not have permission to use this command.");

    if (message.mentions.users.size < 1) return message.reply('`Please specify a member to ban.`').catch(console.error);
    if(!reason) return message.channel.send('`Please specify a reason to ban.`');
    if (!message.guild.member(user).bannable) return message.reply('You can not ban that user.');



    let warnembed = new Discord.RichEmbed()
            .setThumbnail(target.user.avatarURL)
        .setTitle("⚠ Ban")
        .setDescription(`Hello, **${user.tag}** you were banned by: **${message.author.username}**`)
        .addField('⚙ **Server**:', `${message.guild.name}`)
        .addField('⚙ **Channel**:', `${message.channel}`)
        .addField('🔨 **Reason**:', `${reason}`)
        .setColor('0xfc4f35')
        .setFooter(`Learn from your mistakes!`, `${client.user.avatarURL}`)
        .setTimestamp();
    await target.send(warnembed);


      let banEmbed = new Discord.RichEmbed()
      .setDescription("~BAN: Sorry, your behavior is inadequate~")
      .setColor("#bc0000")
      .addField("Banned User", `${user.username}`)
      .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
      .addField("Banned In", message.channel)
      .addField("Time", message.createdAt)
      .setImage(randomizer("ban"))
      .addField("Reason", reason);

    message.channel.send(banEmbed)

    let reportembed = new Discord.RichEmbed()
            .setThumbnail(target.user.avatarURL)
           .setAuthor('Ban', 'https://cdn.discordapp.com/emojis/465245981613621259.png?v=1')
           .setDescription(`New ban by ${message.author.username}`)
           .addField('⚠ - Banned Member', `${user.tag}\n(${user.id})`, true)
           .addField('⚠ - Banned by', `${message.author.tag}\n(${message.author.id})`, true)
           .addField('⚙ - Channel', `${message.channel}`)
           .addField('🔨 - Reason', `${reason}`)
           .setColor('0xfc4f35')
           .setTimestamp();
       reports.send(reportembed);

           message.guild.member(user).ban(reason);

}

  if(command === "purge") {
    var perms = message.member.hasPermission("KICK_MEMBERS");
    if(!perms) return message.channel.send("You do not have permission to use this command.");
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

// FUN COMMANDS
//KISS
if (command ===`kiss`) {
    let hugresult = Math.floor((Math.random() * randomizer("kiss").length));
    if (!args[0]) {
        const ghembed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setTitle(`${message.author.username} kissed themself...`)
            .setImage('https://cdn.discordapp.com/attachments/452115003659780096/460369555823525898/kiss.gif')
        message.channel.send({
            embed: ghembed
        })
        return;
    }
    if (!message.mentions.members.first().user.username === message.isMentioned(message.author)) {
        const hembed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setTitle(`${message.author.username} gave ${message.mentions.members.first().user.username} a kiss!`)
            .setImage(randomizer("kiss"))
        message.channel.send({
            embed: hembed
        })
        return;
    }
    const ghembed = new Discord.RichEmbed()
        .setColor(`RANDOM`)
        .setTitle(`${message.author.username} kissed themself...!`)
        .setImage('https://cdn.discordapp.com/attachments/452115003659780096/460369555823525898/kiss.gif')
    message.channel.send({
        embed: ghembed
    })
}

// FUN COMMANDS
// TAUNT
if(command === "taunt") {
  let userm = message.mentions.users.first()
    if(!userm) return message.channel.send("You must tag a person to use this command");
    const embed = new Discord.RichEmbed()
    .setTitle(`${message.author.username} makes fun of ${userm.username} <(*ΦωΦ*)>`)
    .setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
    .setImage(randomizer("taunt"))
    .setTimestamp()
     message.channel.send({embed});
   }

   // FUN COMMANDS
   // CUDDLE
   if(command === "cuddle") {
     let userm = message.mentions.users.first()
if(!userm) return message.channel.send("You must tag a person to use this command");
const embed = new Discord.RichEmbed()
.setTitle(`${message.author.username} cuddles with ${userm.username}' *:･ﾟ✧(=✪ ᆺ ✪=)*:･ﾟ✧`)
.setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
.setImage(randomizer("cuddle"))
.setTimestamp()
 message.channel.send({embed});
}

// FUN COMMANDS
// HUG
if(command === "hug") {
let userm = message.mentions.users.first()
if(!userm) return message.channel.send("You must tag a person to use this command");
const embed = new Discord.RichEmbed()
.setTitle(`${message.author.username} hugs ${userm.username}' *:･ﾟ✧(=✪ ᆺ ✪=)*:･ﾟ✧`)
.setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
.setImage(randomizer("hug"))
.setTimestamp()
 message.channel.send({embed});
}

// FUN COMMANDS
// KARATE
if(command === "karate") {
let userm = message.mentions.users.first()
if(!userm) return message.channel.send("You must tag a person to use this command");
const embed = new Discord.RichEmbed()
.setTitle(`${message.author.username} kicks ${userm.username}'s butt (=ㅇᆽㅇ=)`)
.setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
.setImage(randomizer("kick"))
.setTimestamp()
 message.channel.send({embed});
}

// FUN COMMANDS
// BITE
if(command === "bite") {
  let userm = message.mentions.users.first()
  if(!userm) return message.channel.send("You must tag a person to use this command");
  const embed = new Discord.RichEmbed()
  .setTitle(`${message.author.username} is angry and bites ${userm.username} (ﾐዕᆽዕﾐ)`)
  .setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
  .setImage(randomizer("bite"))
  .setTimestamp()
   message.channel.send({embed});
  }

  // FUN COMMANDS
  // HEART REACTION
  if(command === "react") {
    message.channel.send("What heart do you like the most?")
            .then(async function (message) {
            await message.react("❤")
            await message.react("💛")
            await message.react("💙")
            await message.react("💜")
            await message.react("🖤")
            }).catch(function(error) {
             console.log(error)
             });
           }


// FUN COMMANDS
// POKE
if(command === "poke") {
  let userm = message.mentions.users.first()
  if(!userm) return message.channel.send("You must tag a person to use this command");
  const embed = new Discord.RichEmbed()
  .setTitle(`${message.author.username} noticed ${userm.username} (=^･ｪ･^=))ﾉ彡☆`)
  .setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
  .setImage(randomizer("poke"))
  .setTimestamp()
   message.channel.send({embed});
  }

  // FUN COMMANDS
  // RANDOMPUPPY
if(command === "randompuppy") {
  randomPuppy().then(url =>{

        message.channel.send(url);


  }).catch(err => message.channel.send("Error, please try again."));
}


// FUN COMMANDS
// DEREDERE
 if(command === "deredere") {
   const embed = new Discord.RichEmbed()
 .setTitle(`**I'm in LoOoOooOoove!**`)
 .setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
 .setImage(randomizer("deredere"))
 .setTimestamp()
  message.channel.send({embed});

   }

  // FUN COMMANDS
  // AVATAR
if(command === "avatar") {
  let img = message.mentions.users.first()

  if (!img) {

      const embed = new Discord.RichEmbed()
      .setImage(`${message.author.avatarURL}`)
      .setColor(0x66b3ff)
      .setFooter(`${message.author.username}#${message.author.discriminator}`);
      message.channel.send({ embed });

  } else if (img.avatarURL === null) {
      //if the user does not have an avatar

      const embed = new Discord.RichEmbed()
      .setImage(`${message.author.defaultAvatarURL}`)
      .setColor(0x66b3ff)
      .setFooter(`${message.author.username}#${message.author.discriminator}`);
      message.channel.send({ embed });

  } else {

      const embed = new Discord.RichEmbed()
      .setImage(`${img.avatarURL}`)
      .setColor(0x66b3ff)
      .setFooter(`${img.username}#${img.discriminator}'s Avatar'`);
      message.channel.send({ embed });

  };
  }

// NSFW COMMANDS
// LEWD
 if(command === "lewd") {
         if (!message.channel.nsfw) return message.channel.send(":underage: NSFW Command. Please switch to NSFW channel in order to use this command.")
   const embed = new Discord.RichEmbed()
 .setTitle(`${message.author.username} is L-Lewd... :tongue: :eggplant: :sweat_drops: `)
 .setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
 .setImage(randomizer("lewd"))
 .setTimestamp()
  message.channel.send({embed});

   }

   // NSFW COMMANDS
   // BOOBS
    if(command === "boobs") {
            if (!message.channel.nsfw) return message.channel.send(":underage: NSFW Command. Please switch to NSFW channel in order to use this command.")
      const embed = new Discord.RichEmbed()
    .setTitle(`${message.author.username} wants some BOOOOOOOBS `)
    .setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
    .setImage(randomizer("boobs"))
    .setTimestamp()
     message.channel.send({embed});

      }

      // NSFW COMMANDS
      // LEWD
       if(command === "hentai") {
               if (!message.channel.nsfw) return message.channel.send(":underage: NSFW Command. Please switch to NSFW channel in order to use this command.")
         const embed = new Discord.RichEmbed()
       .setTitle(`${message.author.username} Here is your meal`)
       .setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
       .setImage(randomizer("hentai"))
       .setTimestamp()
        message.channel.send({embed});

         }


// MUSIC
// PLAY
if(command === "play") {
if (queue[message.guild.id] === undefined) return message.channel.sendMessage(`Add some songs to the queue first with ${config.prefix}add`);
        if (queue[message.guild.id].playing) return message.channel.sendMessage('Already Playing');
        if (!message.member.voiceChannel) return message.channel.send(' Nesecitas conectarte a un canal de voz para usar este comando').then(m => {    m.delete(2000);  });

  	let dispatcher;
		queue[message.guild.id].playing = true;

		console.log(queue);
		(function play(song) {
			console.log(song);
			if (song === undefined) return message.channel.sendMessage('Queue is empty').then(() => {
				queue[message.guild.id].playing = false;
				message.member.voiceChannel.leave();
			});

      message.delete().catch(O_o=>{});

          const embed = new Discord.RichEmbed()
          .setTitle(`**The party has begun!** 🎶🎵`)
          .setDescription(`Now Playing: **${song.title} 😈🔥** \nRequested by: **${song.requester}** ✋S‍`)
          .setColor(`RANDOM`)
          .setFooter(`Just enjoy!`, `${client.user.avatarURL}`)
          .setTimestamp()
           message.channel.send({embed});

			dispatcher = message.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }));
			let collector = message.channel.createCollector(m => m);
			collector.on('message', m => {
				if (m.content.startsWith(config.prefix + 'pause')) {
					message.channel.sendMessage('Paused').then(() => {dispatcher.pause();});
				} else if (m.content.startsWith(config.prefix + 'resume')){
					message.channel.sendMessage('Starting music again').then(() => {dispatcher.resume();});
				} else if (m.content.startsWith(config.prefix + 'skip')){
					message.channel.sendMessage('Skipped').then(() => {dispatcher.end();});
				} else if (m.content.startsWith(config.prefix + 'volume+')){
                    if (!message.member.voiceChannel) return message.channel.send(' You need to connect to a voice channel to use this command').then(m => {    m.delete(2000);  });
					if (Math.round(dispatcher.volume*50) >= 100) return message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
					message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(config.prefix + 'volume-')){
                    if (!message.member.voiceChannel) return message.channel.send(' You need to connect to a voice channel to use this command').then(m => {    m.delete(2000);  });
					if (Math.round(dispatcher.volume*50) <= 0) return message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
					message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(config.prefix + 'time')){
					message.channel.sendMessage(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
				}
			});
			dispatcher.on('end', () => {
				collector.stop();
				play(queue[message.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return message.channel.sendMessage('error: ' + err).then(() => {
					collector.stop();
					play(queue[message.guild.id].songs.shift());
				});
			});
        })(queue[message.guild.id].songs.shift());
    }

// MUSIC
// ADD
if(command === "add") {
const yt = require('ytdl-core');
let url = message.content.split(' ')[1];
if (url == '' || url === undefined) return message.channel.sendMessage(`You must add a YouTube video url`);

yt.getInfo(url, (err, info) => {
    if(err) return message.channel.sendMessage('Invalid YouTube Link: ' + err);
    if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
    queue[message.guild.id].songs.push({url: url, title: info.title, requester: message.author.username});

message.delete().catch(O_o=>{});

    const embed = new Discord.RichEmbed()
    .setTitle(`**Song requested** 🔥`)
    .setDescription(`**${message.author.username}** added **${info.title}** to the queue\nThis song will be played once the queued songs are played 🎵`)
    .setColor(`RANDOM`)
    .setThumbnail(`https://i.ytimg.com/vi/${info.video_id}/default.jpg?width=80&height=60`)
    .setFooter(`That is a good song!`, `${client.user.avatarURL}`)
    .setTimestamp()
     message.channel.send({embed});

});
return new Promise((resolve, reject) => {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
    voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
});
}

// MUSIC
// JOIN
if(command === "join") {
    return new Promise((resolve, reject) => {
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
        voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
        const embed = new Discord.RichEmbed()
      .setTitle(`**I am here!** 🤟`)
      .setDescription(`**${message.author.username}** asked me to join`)
      .setColor(`RANDOM`)
      .setFooter(`Heyya!`)
      .setTimestamp()
       message.channel.send({embed});
    });
}

// MUSIC
// QUEUE
if(command === "queue") {
if (queue[message.guild.id] === undefined) return message.channel.sendMessage(`Add some songs to the queue first with ${config.prefix}add`);
        let tosend = [];
        queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
        message.channel.sendMessage(`__**${message.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
}

// MUSIC
// LEAVE
let Canalvoz = message.member.voiceChannel;
if(command === "leave") {
  if(!Canalvoz) {
    message.channel.send('You need to be connected to a voice channel to use that command.');

} else {

  const embed = new Discord.RichEmbed()
  .setTitle(`**The party is over** 😭 `)
  .setDescription(`**${message.author.username}** asked me to leave`)
  .setColor(`RANDOM`)
  .setFooter(`See you soon!`)
  .setTimestamp()
   message.channel.send({embed});
        Canalvoz.leave();
}
}


// MANAGEMENT
// REBOOT
 if(command === "reload") {
   var perms = message.author.id === ("430766435388882964")
   if(!perms) return message.channel.send("You can not do that!");
message.channel.send("Complete :white_check_mark:").then(() => {
    client.destroy().then(() => {
        process.exit();
    });
});
}

// MANAGEMENT
// REBOOT
if(command === "reboot") {
   var perms = message.author.id === ("394919129020235776")
   if(!perms) return message.channel.send("You can not do that!");
message.channel.send("Complete :white_check_mark:").then(() => {
    client.destroy().then(() => {
        process.exit();
    });
});
}

// MANAGEMENT
// EVAL
if(command === "eval") {
  var perms = message.member.hasPermission("KICK_MEMBERS");
  if(!perms) return message.channel.send("You do not have permission to use this command.");
const content = message.content.split(' ').slice(1);
        const args = content.join(' ');
      let limit = 1950;
    try {
      let code = args;
      let evalued = eval(code);
      if (typeof evalued !== "string")
        evalued = require("util").inspect(evalued);
      let txt = "" + evalued;
      if (txt.length > limit) {
        message.channel.send(`\`\`\`js\n ${txt.slice(0, limit)}\n\`\`\``);
      }
      else
        message.channel.send(`\`\`\`js\n ${txt}\n\`\`\``);
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`js\n${err}\n\`\`\``);
    }
}

// MANAGEMENT
// HELP
if(command === "help") {
const embed = new Discord.RichEmbed()
.setColor(`RANDOM`)
 .addField("═══════════════════════════════════════", "󠀡")
.setFooter("Developer: MonsterOG#0001!", client.user.avatarURL)
.setImage("")
.setTimestamp()
.addField(":crossed_swords:  [FUN COMMANDS]", "CUDDLE | TAUNT | HUG | DEREDERE | CI | KISS | REACT | BITE | KARATE | AVATAR  | COOKIE | EMOJIS | RANDOMPUPPY | TRANSLATE ")
.addBlankField()
.addField(":necktie:  [MODERATION]", "KICK | BAN | WARN | MUTE | REPORT | REMOVEROLE |")
.addBlankField()
.addField(":warning:  [NSFW]", "LEWD | BOOBS | HENTAI | BLOWJOB | LEWDNEKO ")
.addBlankField()
.addField(":joystick:   [GAMES]", "SLOTS | ROLL | FISH | COINFLIP")
.addBlankField()
.addField(":musical_note:  [MUSIC]", "JOIN | ADD | PLAY | QUEUE | VOLUME+ | VOLUME- | LEAVE")
.addBlankField()
.addField(":tools:  [MANAGEMENT]", "INFO | HELP | STATUS | INVITE | CHANNELS | SERVER | USERINFO | ROLESMAP | SAY ")
.addBlankField()
.addField(":thumbsup:  [SUPPORT US]", "VOTE HERE:", true)
.addBlankField()
 .addField("═══════════════════════════════════════ ", "󠀡")

message.channel.send({embed});
  }


  // MANAGEMENT
  // HELP
  if(command === "info") {
String.prototype.HorasMinutosSegundos = function () {
  var sec_num = parseInt(this, 10);
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      var time    = hours+':'+minutes+':'+seconds;
      return time;
    }

    var time = process.uptime();
    var tiempo_conformato = (time + "").HorasMinutosSegundos()

var actividad = process.uptime();
const embed = new Discord.RichEmbed()
.setColor(0x66ff66)

.setAuthor(`Bot info`, client.user.avatarURL)
.addField(`Owner`, `Daii#7022 and Nate#7325`, true)
.addField(`Version`, `1.0.0`, true)
.addField(`Libreria`, `Discord ^11.2.1 (Js)`, true)

.addField(`Memory`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
.addField(`Uptime`, `${actividad}`, true)
.addField(`Servers`, `${client.guilds.size.toLocaleString()}`, true)

.addField(`Users`, `${client.users.size.toLocaleString()}`, true)
.addField(`Channels`, `${client.channels.size.toLocaleString()}`, true)
.addField(`Voice connections`, `${client.voiceConnections.size}`, true)

message.channel.send({embed});
}

//88BALL
//fun
if(command === "8ball") {
  if (!args[2]) return message.reply("Please ask a full question!");
let replies = ["Yes, Certainly :8ball:", "No, Never :8ball:", "Please ask again :8ball:"]
let result = Math.floor((Math.random() * replies.length));

let question = args.slice().join(" ");

let embedz = new Discord.RichEmbed()
    .setAuthor(message.author.username + " asks: " + question)
    .setColor(`RANDOM`)
    .addField("Answer", "Asked by " + message.author.tag + "\nAnswer: " + replies[result] + "")

message.channel.send(embedz)
}




//TRANSLATe
if (command === "translate") {
  let prefix = ("-");
    if (args[0]) {
        let from_language = "auto" // default languages
        let to_language = "en" // default languages
        let tobe_translated = message.content.slice(prefix.length + command.length + 1) // Getting the text
        if (args[0].startsWith("from:")) { // Checking if there is a from:language & to:language, this part is not optimized
            from_language = args[0].slice(5)
            tobe_translated = tobe_translated.slice(args[0].length + 1)
            if (args[1].startsWith("to:")) {
                to_language = args[1].slice(3)
                tobe_translated = tobe_translated.slice(args[1].length + 1) // cutting the from & to from the text
            }
        } else if (args[0].startsWith("to:")) { // Checking if there is a to:language & from:language, Yes I check 2 times :/
            to_language = args[0].slice(3)
            tobe_translated = tobe_translated.slice(args[0].length + 1)
            if (args[1].startsWith("from:")) {
                from_language = args[1].slice(5)
                tobe_translated = tobe_translated.slice(args[1].length + 1) // cutting the from & to from the text
            }
        }
        translate(tobe_translated, {
            from: from_language,
            to: to_language
        }).then(res => { // We translate the text
            from_language = res.from.language.iso
            if (res.from.text.value) tobe_translated = res.from.text.value
            final_text = res.text
            let translateembed = new Discord.RichEmbed()
                .setTitle("Translate") // Optionnal stuff
                .setColor(`0x3980b3`) // Optionnal stuff
                .setDescription("Bip Bip Boop\nThe internet magic is here") // Optionnal stuff
                .addField("`from: " + from_language + "`", "```" + tobe_translated + "```")
                .addField("`to: " + to_language + "`", "```" + final_text + "```")
                .setThumbnail("https://cdn.dribbble.com/users/1341307/screenshots/3641494/google_translate.gif") // Optionnal stuff
            message.channel.send(translateembed)
        }).catch(err => {
            message.channel.send(":x: Usage: `" + config.prefix + "translate [from:iso] [to:iso] <some text>` \nThe from: and to: are optional, you can check out <http://bit.ly/ISO_codesWiki> for the iso codes\nExample: ```" + config.prefix + "translate from:ro to:fr Salut, ce mai faci?```") // Yes, I used Romanian for my example. Do you have any problem?
        });
    } else {
        message.channel.send(":x: Usage: `" + config.prefix + "translate [from:iso] [to:iso] <some text>` \nThe from: and to: are optional, you can check out <http://bit.ly/ISO_codesWiki> for the iso codes\nExample: ```" + config.prefix + "translate from:ro to:fr Salut, ce mai faci?```")
    }
}



        // MANAGEMENT
        // TOTAL MEMBERS
        if (command === "members") {

          let miembrosTotales = 0;
                      client.guilds.some(serv => { miembrosTotales = miembrosTotales+serv.memberCount });

          let membersembed = new Discord.RichEmbed()
          .setTitle("Nexus's member, guild, and channel count")
          .addField(":handshake: Member Count", "     " + miembrosTotales)
          .addField(":shield: Guild Count", "     " + client.guilds.size)
          .addField(":tools: Channel Count", "     " + client.channels.size)
          .setImage("")
          .setColor(`RANDOM`)



        message.channel.send(membersembed)
        }


if(command === "mute"){

    if (!message.member.hasPermissions ('KICK_MEMBERS')) return message.channel.send("Sorry, but you don't have permission to use this!")
    const modlog = message.guild.channels.find(channel => channel.name === 'reports');
    const mod = message.author;
    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!user) return message.channel.send("Please specify a user to mute.")
    let reason = message.content.split(" ").slice(2).join(" ");
    if (!reason) return message.channel.send('`Please specify a reason to mute.`')
    let muterole = message.guild.roles.find(`name`, "Muted");
    if(args[0] == "help"){
      message.reply("Usage: k!mute <user> <reason>");
      return;
    }
  let muteChannel = message.guild.channels.find(`name`, "reports");
  if (!muteChannel) return message.channel.send('`Please create a channel named "reports" to log the warns.`')
  if (!muterole) {
        try {
            muterole = await message.guild.createRole({
                name: "Muted",
                color: "#000000",
                permissions: []
            })
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }

    let mutetime = args[1];

    await (user.addRole(muterole.id));
    const muteembed = new Discord.RichEmbed()
    .setThumbnail(user.user.avatarURL)
    .setAuthor('Mute', 'https://cdn.discordapp.com/emojis/465245981613621259.png?v=1')
    .setDescription(`New mute by ${message.author.username}`)
    .addField('⚠ - Muted Member', `${user.user.tag}\n(${user.user.id})`, true)
    .addField('⚠ - Muted by', `${message.author.tag}\n(${message.author.id})`, true)
    .addField('⚙ - Channel', `${message.channel}`)
    .addField('🔨 - Reason', `${reason}`)
    .setColor('0xfc4f35')
    .setTimestamp();
        modlog.send(muteembed)


}

//MANAGEMENT
//USER INFO
if(command === "userinfo"){
let userm = message.mentions.users.first()

if(!userm){
  var user = message.author;

  const embed = new Discord.RichEmbed()
    .setThumbnail(user.avatarURL)
    .setAuthor(user.username+'#'+user.discriminator, user.avatarURL)
    .addField('Playing', user.presence.game != null ? user.presence.game.name : "Nada", true)
    .addField('ID', user.id, true)
    .addField('Status', user.presence.status, true)
    .addField('Nick', message.member.nickname, true)
    .addField('Account Made', user.createdAt.toDateString(), true)
    .addField('Date of admission', message.member.joinedAt.toDateString())
    .addField('Roles', message.member.roles.map(roles => `\`${roles.name}\``).join(', '))
    .setColor(0x66b3ff)

  message.channel.send({ embed });

}else{
  const embed = new Discord.RichEmbed()
    .setThumbnail(userm.avatarURL)
    .setAuthor(userm.username+'#'+userm.discriminator, userm.avatarURL)
    .addField('Playing', userm.presence.game != null ? userm.presence.game.name : "Nada", true)
    .addField('ID', userm.id, true)
    .addField('Status', userm.presence.status, true)
    .addField('Acount Made', userm.createdAt.toDateString(), true)
    .setColor(0x66b3ff)

  message.channel.send({ embed });

}
}


//MANAGEMENT
//SERVERINFO
if(command === "server"){
var server = message.guild;

const embed = new Discord.RichEmbed()
.setThumbnail(server.iconURL)
.setAuthor(server.name, server.iconURL)
.addField('ID', server.id, true)
.addField('Region', server.region, true)
.addField('Creation date', server.joinedAt.toDateString())
.addField('Owner', server.owner.user.username+'#'+server.owner.user.discriminator+' ('+server.owner.user.id +')', true)
.addField('Members', server.memberCount, true)
.addField('Roles', server.roles.size, true)
.setColor(0x66b3ff)

message.channel.send({ embed });
}


//MANAGEMENT
//STATUS
if(command === "status"){
let color = {
      "online": "#00c903",
      "idle": "#ff9a00",
      "dnd": "#ff0000",
      "offline": "#d8d8d8"
};
let estados = {
      "online": "Online",
      "idle": "Away",
      "dnd": "Do not disturb",
      "offline": "Offline/Invisible"
};

let user = message.mentions.users.first();
if(!user) return message.reply(`You must tag someone!`);

const embed = new Discord.RichEmbed()
    .setColor(color[user.presence.status])
    .addField(`${user.username}`, `${estados[user.presence.status]}`)

message.channel.send({embed});
}



//FUN COMMANDS
//COOKIE
if(command === "cookie"){
let user = message.mentions.users.first();
let razon = args.slice(1).join(' ');

if(!user) return message.channel.send('You must tag someone.');

if(!razon){
  razon ='Just wanted to give you a cookie';

}
message.channel.send('**'+ user.username +',** you have received a :cookie: from **'+message.author.username+'**\n\n**Reason:** '+razon+'\n(づ｡◕‿‿◕｡)づ:･ﾟ✧ :cookie:');
}

//FUN COMMANDS
//FISH
if(command === "fish"){
let rollfish = Math.floor(Math.random() * 7) +1;
if(rollfish === 1){
    message.channel.send('Congratulations, ' + message.author.username + '! You caught: :tropical_fish:');

}else if(rollfish === 2){
    message.channel.send('Congratulations, ' + message.author.username + '! You caught: :fish:');

}else {

    message.channel.send('Congratulations, ' + message.author.username + '! You caught: :shopping_cart:');
}
}


//FUN COMMANDS
//ROLL 1-100
if(command === "roll"){
let roll = message.content.split(' ').slice(1);
if(roll < 0) return message.reply(`Write a number between 1 and 100!`);
if(roll > 100) return message.reply(`Write a number between 1 and 100!`);

let randomroll  = Math.floor(Math.random() * roll) + 1;
let random = Math.floor(Math.random() * 100) + 1;

if(!roll[0]){
    message.channel.send('From 1 to 100 you got: '+random)

}else{
    message.channel.send('From 1 to '+roll+' you got: '+randomroll)

}
}

//FUN COMMANDS
//LOVE RANDOM
if(command === "love"){
let users = message.mentions.users.map(m => m.username).join(' and ');
if(!users) return message.channel.send('You must tag two users to calculate the love');

const random = Math.floor(Math.random() * 100);
let heard = "";

    if(random < 50){
        heard=':broken_heart:';

    }else if(random < 80){
        heard=':sparkling_heart: ';

    }else if(random < 101){
        heard=':heart:';

    }

const embed = new Discord.RichEmbed()
    .setAuthor('The love between '+users+' is:')
    .setDescription(heard+' **'+random+' %**'+' '+heard)
    .setColor(0xff4d4d)

message.channel.send({embed});
}

//MANAGEMENT
//ROLES
if(command === "rolesmap"){
  let roles = message.guild.roles.map(rol => rol).join(', ')
let embed = new Discord.RichEmbed()
.setAuthor("Roles")
.addField("Nombres", `${roles}`)
message.channel.send(embed)
}


//MANAGEMENT
//REMOVE ROLE
if(command === "removerole"){
let miembro = message.mentions.members.first();
let nombrerol = args.slice(1).join(' ');

let role = message.guild.roles.find("name", nombrerol);
let perms = message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS");

if(!perms) return message.channel.send("`Error` `|` You can not do that.");

if(message.mentions.users.size < 1) return message.reply('You must tag someone.').catch(console.error);
if(!nombrerol) return message.channel.send('Write the role name you want to remove, `-removerole @member [role]`');
if(!role) return message.channel.send('Can not find that role.');

miembro.removeRole(role).catch(console.error);
message.channel.send(`**${role.name}** role was removed from **${miembro.user.username}**.`);
}


//MANAGEMENT
//CHANNEL MAP
if(command === "channels"){
  let id = message.guild.id;
const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setDescription(`${client.guilds.get(id).channels.map(r => r.name).join(", ")}`)
    .setFooter('Channels information: '+ message.guild.name);

message.channel.send({embed});
}


//MANAGEMENT
//CREATE INVITE
if(command === "invite"){
client.generateInvite(["ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_ROLES",
                      "MANAGE_MESSAGES","SEND_MESSAGES","CONNECT","BAN_MEMBERS"])
.then(link =>{
  let inviteembed = new Discord.RichEmbed()
  .addField("Invite Nexus below.", `[Click on this link to invite Nexus!](${link})`)
  .setImage("")
  .setFooter(`I will take care of your server!`, `${client.user.avatarURL}`)
  message.channel.send(inviteembed)

});
}




if(command === "vote") {
  let voteEmbed = new Discord.RichEmbed()
  .addField("Vote for Nexus below.", `[Click here to vote for Nexus!](Coming Soon)`)
  .setImage("")
  .setFooter("Thanku men! I appreciate it~ ^-^")
  message.channel.send(voteEmbed)
}

//NSFW COMMANDS
//BJ
if(command === "blowjob") {
        if (!message.channel.nsfw) return message.channel.send(":underage: NSFW Command. Please switch to NSFW channel in order to use this command.")
  const embed = new Discord.RichEmbed()
.setTitle(`${message.author.username} It's your dream, isn't it?`)
.setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
.setImage(randomizer("blowjob"))
.setTimestamp()
 message.channel.send({embed});

  }

  //NSFW COMMANDS
//LEWDNEKO
if(command === "lewdneko") {
        if (!message.channel.nsfw) return message.channel.send(":underage: NSFW Command. Please switch to NSFW channel in order to use this command.")
  const embed = new Discord.RichEmbed()
.setTitle(`${message.author.username} It's your dream, isn't it?`)
.setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
.setImage(randomizer("lewdneko"))
.setTimestamp()
 message.channel.send({embed});

  }

  if(command === "slots") {
    var replys1 = [
         ":gem: : :gem: : :gem: ",
         ":lemon: : :lemon: : :lemon: ",
         ":seven: : :seven: : :seven: ",
         ":bell: : :bell: : :bell:",
         ":cherries: : :cherries: : :cherries: ",
         ":star: : :star: : :star: ",
         ":gem: : :star: : :seven: ",
         ":star: : :bell: : :bell:",
         ":star: : :star: : :cherries: ",
         ":gem: : :gem: : :cherries:",
         ":gem: : :seven: : :seven: ",
         ":star: : :bell: : :lemon: ",
         ":star: : :star: : :cherries: ",
         ":seven: : :star: : :star: ",
         ":star: : :star: : :seven: ",
         ":gem: : :gem: : :seven: "
     ];
     let reponse = (replys1[Math.floor(Math.random() * replys1.length)])

     var replys2 = [
         ":gem: : :gem: : :gem: ",
         ":lemon: : :lemon: : :lemon: ",
         ":seven: : :seven: : :seven: ",
         ":bell: : :bell: : :bell:",
         ":cherries: : :cherries: : :cherries: ",
         ":gem: : :star: : :seven: ",
         ":star: : :bell: : :bell:",
         ":star: : :star: : :cherries: ",
         ":gem: : :gem: : :cherries:",
         ":gem: : :seven: : :seven: ",
         ":star: : :bell: : :lemon: ",
         ":star: : :star: : :cherries: ",
         ":seven: : :star: : :star: ",
         ":star: : :star: : :seven: ",
         ":gem: : :gem: : :seven: ",
         ":gem: : :cherries: : :cherries:",
         ":gem: : :bell: : :star:"
     ];
     let reponse2 = (replys2[Math.floor(Math.random() * replys2.length)])
     var replys3 = [
         ":lemon: : :lemon: : :lemon: ",
         ":bell: : :bell: : :bell:",
         ":cherries: : :cherries: : :cherries: ",
         ":star: : :star: : :star: ",
         ":gem: : :star: : :seven: ",
         ":star: : :bell: : :bell:",
         ":star: : :star: : :cherries: ",
         ":gem: : :gem: : :cherries:",
         ":gem: : :seven: : :seven: ",
         ":star: : :bell: : :lemon: ",
         ":star: : :star: : :cherries: ",
         ":seven: : :star: : :star: ",
         ":star: : :star: : :seven: ",
         ":gem: : :gem: : :seven: "
     ];
     let reponse3 = (replys3[Math.floor(Math.random() * replys3.length)])

     const embed = new Discord.RichEmbed()
         .setColor("#FE0101")
         .setTitle(`**[ :slot_machine: @${message.author.tag} launched the slot machine! :slot_machine: ]**`)
         .addField("**-------------------**", "** **")
         .addField(`${reponse} \n \n${reponse2}**<** \n \n${reponse3}`, `** **`)
         .addField("**-------------------**", "** **")
         .setDescription("** **")
     message.channel.send(embed)
  }

if(command === "ci") {
  const cleverbot = require("cleverbot.io");
const clever = new cleverbot("zCiZ6imd0kIpN5wp", "Wyf9sEJNJqrO2EhMeJvYbo9iPIpWeIm8");
clever.setNick("Source code");
clever.create(function(err, session) {
    clever.ask(args.join(' '), function(err, res) {
        message.channel.send(res);
    });
});
}


if(command === "support"){
  let voteEmbed = new Discord.RichEmbed()
  .addField("Need Support?", `[Join Here](https://discord.gg/eD9aDmj)`)
  message.channel.send(voteEmbed)
}




//.setThumbnail(target.user.avatarURL)
//.setAuthor('Mute', 'https://cdn.discordapp.com/emojis/465245981613621259.png?v=1')
//.setDescription(`New mute by ${message.author.username}`)
//.addField('⚠ - Muted Member', `${target.user.tag}\n(${target.user.id})`, true)
//.addField('⚠ - Muted by', `${message.author.tag}\n(${message.author.id})`, true)
//.addField('⚙ - Channel', `${message.channel}`)
//.addField('🔨 - Reason', `${reason}`)
//.setColor('0xfc4f35')
//.setTimestamp();





});

client.login(config.token);
