// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let profile = {sections: []}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === "ping") {
        console.log(interaction.channel.lastMessage)
    }
})

/*
* TODO: Cleanup this garbage
* TODO: Extend functionality to a database
* TODO: Store profile as an array of objects, in the format:
    * [ 
    *   userId: {
    *       sections: [
    *           section: {
    *               header: "",
    *               info: []
    *           }
    *       ]
    *   }
    * ]
* TODO: Delegate tasks to different functions
*/

client.on('messageCreate', message => {
    let saveProfileArgs = message.content.slice(12)
    let cmd = message.content.split(' ')
    cmd = cmd.shift()    
    if (cmd[0] == "!") cmd = cmd.slice(1)

    if (cmd.slice(0, 11) === "saveprofile") {
        saveProfileArgs.trim()
        let splitList = saveProfileArgs.split('\n ')

        for (let i = 0; i < splitList.length; i++) {
            splitList[i] = splitList[i].replace('\n', '')
            splitList[i] = splitList[i].split('\n')
            let profileHeader = splitList[i].shift()
            profile.sections.push({
                    ...profile.section,
                    header: profileHeader,
                    section: [
                        splitList[i]
                    ]
            })

            message.channel.send(profile.sections[i].header)
        }
    } 

    if (cmd == "getprofile") {
        let text = ""
        if (profile.sections) {
            for (let i = 0; i < profile.sections.length; i++) {
                text += '\n' + profile.sections[i].header + '\n';
                profile.sections[i].section.map(section => {
                    console.log(section)
                    text += section.join('\n')
                })

                text += '\n'
            }
        }

        message.channel.send(text)
    }
})

// Login to Discord with your client's token
client.login(token);
