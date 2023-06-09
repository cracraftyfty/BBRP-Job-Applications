//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
const fs = require('fs');
const moment = require('moment-timezone');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if (interaction.type !== 'MODAL_SUBMIT') return;
    if([`register+${member.id}`].includes(customId)){
        let firstResponse = interaction.fields.getTextInputValue('cityname');
        let secondResponse = interaction.fields.getTextInputValue('citynumber');
        let fourthResponse = interaction.fields.getTextInputValue('steamname')
        let fifthResponse = interaction.fields.getTextInputValue('email_link')
        let thirdResponse = interaction.fields.getTextInputValue('worksheet_link');

        let passthru = true
        let stafffFile
        let staff_dir = fs.readdirSync(`./database/users/`)

        staff_dir.forEach(file => {
            let staffFile = JSON.parse(fs.readFileSync(`./database/users/${file}`))
            if(staffFile.details.sheet === thirdResponse){
                passthru = false
                stafffFile = staffFile
                return
            }
        })

        if(!passthru) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} Link already assigned to **${cap(stafffFile.details.cityName)}**`)
            ],
            ephemeral: true
        })

        let userTemplate = JSON.parse(fs.readFileSync('./database/userTemplate.json'))
        if(!fs.existsSync(`./database/users/${member.id}.json`)){
            userTemplate.details.discordID = member.id
            userTemplate.details.discordTag = member.user.tag
            fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userTemplate, null, 4))
        }
        let userfile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('BBRP - Staff Registration')
                .setDescription(`${settings.emotes.check} Information Added successfully.`)
                .addField('Name', cap(firstResponse), true)
                .addField('Number', secondResponse, true)
                .addField('Steam Name', fourthResponse, true)
                .addField('Email ID', fifthResponse, true)
                .setTimestamp()
                .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon
                })
                .setColor('GREEN')
            ], ephemeral: true
        });
        userfile.details.cityName = firstResponse
        userfile.details.cityNumber = secondResponse
        userfile.details.steamName = fourthResponse
        userfile.details.email = fifthResponse
        if(thirdResponse) userfile.details.sheet = thirdResponse 

        fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userfile, null, 4))
    }
}