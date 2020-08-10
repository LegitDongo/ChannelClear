let discord = require('discord.js');
let fs = require('fs');
let client = new discord.Client();
let folderRoot = __dirname + '/';
let config = JSON.parse(fs.readFileSync(folderRoot + 'config.ini', 'utf8'));

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.setTimeout(clean_channel, get_midnight_tonight());
});

let delete_messages = async (channel) => {
    let messages = await channel.messages.fetch({'limit': 100}).catch(e => console.log(e));
    if (messages.size <= 0) {
        return;
    }
    await channel.bulkDelete(messages);
};

let get_midnight_tonight = () => {
    var now = new Date();
    var millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 0, 0, 0) - now;
    if (millisTillMidnight < 0) {
        millisTillMidnight += 86400000; // it's after 24:00, try 24:00 tomorrow.
    }
    return millisTillMidnight;
};

let clean_channel = () => {
    for(let i = 0; i < config.channels.length; i++) {
        client.channels.fetch(config.channels[i])
        .then(channel => delete_messages(channel))
        .catch(console.error);
    }
    client.setTimeout(clean_channel, get_midnight_tonight());
};
  
client.login(config.token);