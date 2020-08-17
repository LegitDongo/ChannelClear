let discord = require('discord.js');
let fs = require('fs');
let client = new discord.Client();
let folderRoot = __dirname + '/';
let config = JSON.parse(fs.readFileSync(folderRoot + 'config.ini', 'utf8'));
let { DateTime } = require('luxon');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    for(let i in config.channels) {
        let id = typeof config.channels[i] === 'object' ? config.channels[i].id : config.channels[i];
        let timezone = typeof config.channels[i] === 'object' ? config.channels[i].timezone : null;
        client.setTimeout(clean_channel, get_midnight_tonight(timezone), id, timezone);
    }
});

let delete_messages = async (channel) => {
    let messages = await channel.messages.fetch({'limit': 100}).catch(e => console.log(e));
    if (messages.size <= 0) {
        return;
    }
    await channel.bulkDelete(messages);
};

let get_midnight_tonight = (timezone = null) => {
    let now = DateTime.local().setZone(timezone).toMillis();
    let millisTillMidnight = DateTime.fromObject({hour: 24, zone: timezone}).toMillis() - now;
    if (millisTillMidnight < 0) {
        millisTillMidnight += 86400000; // it's after 24:00, try 24:00 tomorrow.
    }
    return millisTillMidnight;
};

let clean_channel = (channel_id, timezone) => {
    client.channels.fetch(channel_id)
    .then(channel => delete_messages(channel))
    .catch(console.error);
    client.setTimeout(clean_channel, get_midnight_tonight(timezone), channel_id, timezone);
};
  
client.login(config.token);