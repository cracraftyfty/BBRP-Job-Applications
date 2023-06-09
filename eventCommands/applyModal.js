//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const settings = require('../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs')
const moment = require('moment-timezone');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if (interaction.type !== 'MODAL_SUBMIT') return;
    if([`apply+${member.id}`].includes(customId)){
        let cityName = interaction.fields.getTextInputValue('cityname');
        let cityNumber = interaction.fields.getTextInputValue('citynumber');
        let steamName = interaction.fields.getTextInputValue('steamname')

        let userTemplate = JSON.parse(fs.readFileSync('./database/userTemplate.json'))
        if(!fs.existsSync(`./database/users/${member.id}.json`)){
            userTemplate.details.discordID = member.id
            userTemplate.details.discordTag = member.user.tag
            userTemplate.user_is_staff = true
            fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userTemplate, null, 4))
        }
        let userfile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))

        userfile.details.cityName = cityName
        userfile.details.cityNumber = cityNumber
        userfile.details.steamName = steamName

        await fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userfile, null, 4))

        userfile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))

       //CREATE APP CHANNEL
       let everyoneRole = guild.roles.cache.find(r => r.name === '@everyone');
       let category = guild.channels.cache.find(r => r.name === 'applications')

       let appChannel
       await guild.channels.create(`LA_APP_-${settings.applications.counter}`, {
        type: 'text',
        parent: category,
        permissionOverwrites: [
            {
                id: everyoneRole.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: member.id,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: '1067676029545623572',
                allow: ['VIEW_CHANNEL'],
            }
        ],
    }).then(c => appChannel = c )

    
    fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userfile, null, 4))

    appChannel.send({
        content: `${member}`,
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setTitle(`BBRP - Job Application`)
            .setThumbnail(guild.iconURL())
            .setURL(ee.footericon)
            .setDescription(`Please fill out the forms by pressing the buttons below, once all the forms are filled, please press "Submit Application" button.\n\nPress the **SUBMIT** button ONLY when ur ready and happy with the answers. Once pressed, cannot be undone\n\nYou can Redo the questions if you want, just press the buttons for questions again and refil the app.\n**NOTE:** Submit button will NOT appear till all the questions are answered`)
            .setTimestamp()
            .setFooter(ee.footertext, ee.footericon)
        ],
        components: [
            new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`appForm-1-${member.id}`)
                        .setLabel('Part 1')
                        .setEmoji('🔖')
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId(`appForm-2-${member.id}`)
                        .setLabel('Part 2')
                        .setEmoji('🔖')
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId(`appForm-submit-${member.id}`)
                        .setLabel('Submit Form')
                        .setEmoji(settings.emotes.loading)
                        .setStyle('SECONDARY')
                        .setDisabled(true)
                )
        ]
    })
    
    interaction.reply({
        embeds: [
            new MessageEmbed()
            .setTitle(`BBRP - Application Manager`)
            .setDescription(`${settings.emotes.check} Application process started, Kindly head on to ${appChannel} to proceed with your applicaiton.`)
            .setTimestamp()
            .setFooter(ee.footertext, ee.footericon)
            .setColor('GREEN')
        ],
        ephemeral: true
    });

    //log apps
    let pendingApps = JSON.parse(fs.readFileSync('./database/pendingApps.json'))
    let appQuestions = JSON.parse(fs.readFileSync('./database/appQuestions.json'))
    
    pendingApps[member.id] = {
        "appID": settings.applications.counter, 
        "appliedOn": `${today.format('DD-MM-YYYY hh:mm:ss')} AEST`,
        "processedOn": "",
        "appData": appQuestions
    }

    settings.applications.counter++
    fs.writeFileSync(`./database/settings.json`, JSON.stringify(settings, null, 4))

    fs.writeFileSync('./database/pendingApps.json', JSON.stringify(pendingApps, null, 4))


    }
}