const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const Discord = require('discord.js')
const moment = require("moment-timezone");
var today =  moment.tz('Australia/Sydney');
const fs = require('fs')
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals');
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!customId.startsWith('appsub-')) return;  

    let process = customId.split('-')[1]

    //Roles
    //let awaiting training role
    let ROLE_TRAINING = await guild.roles.cache.find(r => r.id === settings.job_roles.training)
    let ROLE_INTERVIEW = await guild.roles.cache.find(r => r.id === settings.job_roles.interview)
    let ROLE_STAFF = await guild.roles.cache.find(r => r.id === settings.job_roles.staff)
    let job = 'BBRP'

    let employee 
    await guild.members.fetch(customId.split('-')[3].toString()).then(u => employee = u);

    let userfile = JSON.parse(fs.readFileSync(`./database/users/${employee.id}.json`))
    let currentStaff = JSON.parse(fs.readFileSync(`./database/currentStaff.json`))
    let pendingApps = JSON.parse(fs.readFileSync('./database/pendingApps.json'))

    switch(process) {
        case 'process': 
            employee.send({
                embeds: [
                    new MessageEmbed() 
                    .setAuthor({name: `To: ${cap(userfile.details.cityName)}`,iconURL: employee.user.avatarURL()})
                    .setTitle(`${cap(job)} Application`)
                    .setColor('YELLOW') 
                    .setDescription(`**Hello**,\n\nYour application for **BBRP** is being reviewed by the recruitment team, stay tuned!\n\n**Regards**,\n**BBRP Management**`)
                    .setTimestamp()
                    .setThumbnail(ee.footericon)
                    .setFooter({text: ee.footertext, iconURL: ee.footericon})
                ]
            })
            interaction.component.setDisabled(true).setEmoji(settings.emotes.check).setLabel('Under Review')
            interaction.update({
                components: interaction.message.components
            });
            break;

        case 'interview': 
            employee.send({
                embeds: [
                    new MessageEmbed() 
                    .setAuthor({name: `To: ${cap(userfile.details.cityName)}`,iconURL: employee.user.avatarURL()})
                    .setTitle(`${cap(job)} Application`)
                    .setColor(ee.color) 
                    .setDescription(`**Hello**,\n\nCongratulations! We have reviewed your application for **BBRP** and we're interested with doing an interview with you! You will be contacted to schedule a interview!\n\n**Regards**,\n**BBRP Management**`)
                    .setTimestamp()
                    .setThumbnail(ee.footericon)
                    .setFooter({text: ee.footertext, iconURL: ee.footericon})
                ]
            })

            employee.roles.add(ROLE_INTERVIEW)

            interaction.component.setDisabled(true).setEmoji(settings.emotes.check).setLabel('Awaiting Interview')
            interaction.update({
                components: interaction.message.components
            });
    
            break;

        case 'hire': 
            employee.send({
                embeds: [
                    new MessageEmbed() 
                    .setAuthor({name: `To: ${cap(userfile.details.cityName)}`,iconURL: employee.user.avatarURL()})
                    .setTitle(`${cap(job)} Application`)
                    .setColor('GREEN') 
                    .setDescription(`**Hello**,\n\nThank you for applying for **BBRP** your application is accepted and you have been hired!\n\n**Regards**,\n**BBRP Management**`)
                    .setTimestamp()
                    .setThumbnail(ee.footericon)
                    .setFooter({text: ee.footertext, iconURL: ee.footericon})
                ]
            })

            employee.roles.add(ROLE_TRAINING)
            employee.roles.remove(ROLE_INTERVIEW)

            interaction.message.delete()

            await client.channels.cache.get(settings.channels.misc.acceptedApps).send({
                embeds: [
                    new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(employee.user.avatarURL())
                    .setDescription(`**Applicant**: ${userfile.details.cityName} (PH: ${userfile.details.cityNumber})\n**Applied On**: ${pendingApps[employee.id].appliedOn}\n**Accepted On**: ${today.format('DD-MM-YYYY | hh:mm:ss')} AEST\n**Accepted By**: ${member.user.tag} (ID: ${member.id})`)
                ],
                files: [`./database/appLogs/${employee.id}#${pendingApps[employee.id].appID}.txt`]
            })

            await client.channels.cache.get(settings.channels.misc.currentStaff).send({
                embeds: [
                    new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(employee.user.avatarURL())
                    .setDescription(`**Applicant**: ${userfile.details.cityName} (PH: ${userfile.details.cityNumber})\n**Applied On**: ${pendingApps[employee.id].appliedOn}\n**Accepted On**: ${today.format('DD-MM-YYYY | hh:mm:ss')} AEST\n**Accepted By**: ${member.user.tag} (ID: ${member.id})`)
                    
                ],
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId(`employee-training-${pendingApps[employee.id].appID}-${employee.id}`)
                            .setLabel('Complete Training')
                            .setEmoji('🔖')
                            .setStyle('PRIMARY'),
                        new Discord.MessageButton()
                            .setCustomId(`appsub-message-${pendingApps[employee.id].appID}-${employee.id}`)
                            .setLabel('Message Employee')
                            .setEmoji('📣')
                            .setStyle('SECONDARY'),
                        new Discord.MessageButton()
                            .setCustomId(`employee-promote-${pendingApps[employee.id].appID}-${employee.id}`)
                            .setLabel('Promote')
                            .setEmoji('<a:slabove:1011674687329271860>')
                            .setStyle('SUCCESS'),
                        new Discord.MessageButton()
                            .setCustomId(`employee-demote-${pendingApps[employee.id].appID}-${employee.id}`)
                            .setLabel('Demote')
                            .setEmoji('<a:sldown:1011674682388398090>')
                            .setStyle('DANGER'),
                        new Discord.MessageButton()
                            .setCustomId(`employee-fire-${pendingApps[employee.id].appID}-${employee.id}`)
                            .setLabel('Fire Employee')
                            .setEmoji(settings.emotes.warn)
                            .setStyle('DANGER')
                    )
                ]
            }).then(async m => {
                m.startThread({
                    name: `Employee Thread`,
                    reason: `BBRP Employee for ${userfile.details.cityName}`,
                })                
            })

            let acceptedApps = JSON.parse(fs.readFileSync('./database/acceptedApps.json', 'utf8'))
            pendingApps[employee.id].processedOn = `${today.format('DD-MM-YYYY HH:mm:ss')} AEST`
            pendingApps[employee.id].staffMsgID = ''
            acceptedApps[`${employee.id}#${pendingApps[employee.id].appID}`] = pendingApps[employee.id]
            fs.writeFileSync('./database/acceptedApps.json', JSON.stringify(acceptedApps, null, 4))

            delete pendingApps[employee.id]
            fs.writeFileSync('./database/pendingApps.json', JSON.stringify(pendingApps, null, 4))
            break;

        case 'deny': 
            interaction.message.delete()
            employee.send({
                embeds: [
                    new MessageEmbed() 
                    .setAuthor({name: `To: ${cap(userfile.details.cityName)}`,iconURL: employee.user.avatarURL()})
                    .setTitle(`${cap(job)} Application`)
                    .setColor('RED') 
                    .setDescription(`**Hello**,\n\nThank you for applying for **BBRP** your application was unfortunately unsuccessful. We wish you best of luck in ur future endevours\n\n**Regards**,\n**BBRP Management**`)
                    .setTimestamp()
                    .setThumbnail(ee.footericon)
                    .setFooter({text: ee.footertext, iconURL: ee.footericon})
                ]
            })

            employee.roles.remove(ROLE_INTERVIEW)
            await client.channels.cache.get(settings.channels.misc.deniedApps).send({
                embeds: [
                    new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(employee.user.avatarURL())
                    .setDescription(`**Applicant**: ${userfile.details.cityName} (PH: ${userfile.details.cityNumber})\n**Applied On**: ${pendingApps[employee.id].appliedOn}\n**Denied On**: ${today.format('DD-MM-YYYY | hh:mm:ss')} AEST\n**Denied By**: ${member.user.tag} (ID: ${member.id})`)
                ],
                files: [`./database/appLogs/${employee.id}#${pendingApps[employee.id].appID}.txt`]
            })

            let deniedApps = JSON.parse(fs.readFileSync('./database/acceptedApps.json', 'utf8'))
            pendingApps[employee.id].processedOn = `${today.format('DD-MM-YYYY HH:mm:ss')} AEST`
            deniedApps[`${employee.id}#${pendingApps[employee.id].appID}`] = pendingApps[employee.id]
            fs.writeFileSync('./database/acceptedApps.json', JSON.stringify(deniedApps, null, 4))

            delete pendingApps[employee.id]
            fs.writeFileSync('./database/pendingApps.json', JSON.stringify(pendingApps, null, 4))
            break;

        case 'message':  
            discordModals(client);
            const modal = new Modal()
            .setCustomId("modal-customid")
            .setTitle(`Message ${cap(userfile.details.cityName)}`)
            .addComponents([
                new TextInputComponent()
                .setCustomId("msg")
                .setLabel("Enter message")  
                .setStyle("LONG")
                .setMinLength(3)
                .setMaxLength(1500)
                .setPlaceholder(`Please enter the message you want to send to ${cap(userfile.details.cityName)}`)
                .setRequired(true)
            ])
            await showModal(modal, {
                client: client,
                interaction: interaction
            }).catch(e => {
                interaction.reply(e.message ? e.message : e);
            })

            let testcounter = 0
        
            client.on('modalSubmit', (modal) => {
                if(testcounter != 0) return
                testcounter ++
                if(modal.customId === 'modal-customid') {
                    let sendMessage = modal.getTextInputValue('msg');

                    modal.reply({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${settings.emotes.check} Message sent to **${member}**`)
                            .setColor(ee.color)
                        ],
                        ephemeral: true
                    });   

                    employee.send({
                        embeds: [
                            new MessageEmbed() 
                            .setTitle(`${cap(job)}`)
                            .setColor(ee.color) 
                            .setAuthor({name: `To: ${cap(userfile.details.cityName)}`})
                            .setDescription(`**Hello**,\n\n${sendMessage}\n\n**Regards**,\n**BBRP Management**`)
                            .setTimestamp()
                            .setThumbnail(ee.footericon)
                            .setFooter({text: ee.footertext, iconURL: ee.footericon})
                        ]
                    })
                }
            })
        break;
    }
}