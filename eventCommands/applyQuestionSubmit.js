const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const Discord = require('discord.js')
const moment = require("moment-timezone")
const wait = require('node:timers/promises').setTimeout;
const fs = require('fs');
const settings = require('../database/settings.json')
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if (interaction.type !== 'MODAL_SUBMIT') return;
    if(customId.startsWith('appquestions')){

        let userFile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))
        let pendingApps = JSON.parse(fs.readFileSync('./database/pendingApps.json'))
        let appQuestions = JSON.parse(fs.readFileSync('./database/appQuestions.json'))

       

        interaction.fields.components.forEach(field => {
            if(field.components[0].value){
                pendingApps[member.id].appData[`a${field.components[0].customId.split('+')[0].split('')[1]}`] = field.components[0].value
            }            
        })
        fs.writeFileSync('./database/pendingApps.json', JSON.stringify(pendingApps, null, 4))

        let enablesubmit = true
        //Check if ready for submit
        for(let keys in pendingApps[member.id].appData){
            if(keys.startsWith('a')){
                if(!pendingApps[member.id].appData[keys]) enablesubmit = false
            }
        }
        if(enablesubmit === true){
            interaction.update({
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId(`appForm-1-${member.id}`)
                            .setLabel('Part 1')
                            .setEmoji('🔖')
                            .setStyle('SECONDARY'),
                        new Discord.MessageButton()
                            .setCustomId(`appForm-2-${member.id}`)
                            .setLabel('Part 2')
                            .setEmoji('🔖')
                            .setStyle('SECONDARY'),
                        new Discord.MessageButton()
                            .setCustomId(`appForm-submit-${member.id}`)
                            .setLabel('Submit Form')
                            .setEmoji(settings.emotes.loading)
                            .setStyle('SUCCESS')
                            .setDisabled(false)
                    )                    
                ]
            })
        }

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('BLUE')
                .setTitle(`BBRP - Job Application`)
                .setDescription(`${settings.emotes.check} Response submitted`)
                .setTimestamp()
                .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon
                })
            ],
            ephemeral: true
        })

        
    }

   
}