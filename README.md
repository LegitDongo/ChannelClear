# Discord Channel Clear Bot

Clears specified channels nightly (24:00)

Note: This will not clear any messages that are older than 14 days via Discord API limitations

This only clears 100 messages per channel (I was too lazy to add anything extra)

## Getting started
1. npm i
2. Copy `config.ini.example` to `config.ini`
2. [Get a bot token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) and fill out the `config.ini`
3. node channel_clear.js

I recommend a process manager such as [pm2](https://pm2.keymetrics.io/) so that you can auto-restart this app if there's ever any problems.