const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const moment = require("moment-timezone");
var today =  moment.tz('Australia/Sydney');
const fs = require('fs');
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;

    if(customId.startsWith("app-deny")){
        interaction.update({
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
                            .setStyle('SUCCESS')
                    )
            ]
        })
    } 

    if(customId.startsWith("app-confirm")){
        
        let pendingApps = JSON.parse(fs.readFileSync('./database/pendingApps.json'))
        let userFile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))

        let txt_file_msg = `BBRP - JOB APPLICATION\n===========================================================\nApplicant Discord: ${member.user.tag} (ID: ${member.id})\nApplicant City Info: ${userFile.details.cityName} (PH: ${userFile.details.cityNumber})\nApplied On: ${today.format('DD-MM-YYYY | HH:mm:ss')}\n===========================================================\n`
        for(let keys in pendingApps[member.id].appData){
            if(keys.startsWith('q')) txt_file_msg += `${cap(keys)}: ${pendingApps[member.id].appData[keys]}\n`
            if(keys.startsWith('a')) txt_file_msg += `${cap(keys)}: ${pendingApps[member.id].appData[keys]}\n\n`
        }
        fs.writeFileSync(`./database/appLogs/${member.id}#${pendingApps[member.id].appID}.txt`, txt_file_msg)

        client.channels.cache.get(settings.applications.app_lodge_channel_id).send({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(guild.iconURL())
                .setAuthor({
                    name: `${cap(userFile.details.cityName)} (Ph: ${userFile.details.cityNumber})`,
                    iconUrl: member.user.avatarURL()
                })
                .setTitle(`BBRP - Job Application`)
                .setDescription(`Job application recieved\n\nApplied On: **${today.format('DD-MM-YYYY | HH:mm:ss')}**`)
                .setTimestamp()
                .setFooter({
                    text: `${member.user.tag} (ID: ${member.user.id})`,
                    iconUrl: guild.iconURL()
                })
            ],
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`appsub-process-${pendingApps[member.id].appID}-${member.id}`)
                        .setLabel('Process Application')
                        .setEmoji(settings.emotes.loading)
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId(`appsub-interview-${pendingApps[member.id].appID}-${member.id}`)
                        .setLabel('Offer Interview')
                        .setEmoji('📑')
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId(`appsub-message-${pendingApps[member.id].appID}-${member.id}`)
                        .setLabel('Message Applicant')
                        .setEmoji('📣')
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId(`appsub-hire-${pendingApps[member.id].appID}-${member.id}`)
                        .setLabel('Hire Applicant')
                        .setEmoji(settings.emotes.check)
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId(`appsub-deny-${pendingApps[member.id].appID}-${member.id}`)
                        .setLabel('Deny Application')
                        .setEmoji(settings.emotes.wrong)
                        .setStyle('DANGER')
                )
            ],
            files: [`./database/appLogs/${member.id}#${pendingApps[member.id].appID}.txt`]
        }).then(m => {
            m.startThread({
                name: `BBRP Application`,
	            reason: `BBRP Application from ${userFile.details.cityName}`,
            })
        })

        interaction.message.edit({
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`app-den2y-${pendingApps[member.id].appID}-${member.id}`)
                        .setLabel('Application successfully submitted')
                        .setEmoji(settings.emotes.check)
                        .setStyle('SUCCESS')
                        .setDisabled(true)
                )
            ]
        })

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} Application Submitted. This channel will be deleted in 10 seconds`)
            ]
        })

        setTimeout(() => {
            interaction.channel.delete()
        }, 10000)
        
    }
}