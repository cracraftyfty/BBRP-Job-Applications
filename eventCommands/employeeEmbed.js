const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const Discord = require('discord.js');
const moment = require("moment-timezone");
var today =  moment.tz('Australia/Sydney')
const fs = require('fs');
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!customId.startsWith("employee-")) return
    console.log(customId)
    let employee 
    try{    
        await guild.members.fetch(customId.split('-')[3].toString()).then(u => employee = u);
    }catch{
        employee = {'id': customId.split('-')[3].toString()}
    }

    let ROLE_TRAINING = await guild.roles.cache.find(r => r.id === settings.job_roles.training)
    let ROLE_INTERVIEW = await guild.roles.cache.find(r => r.id === settings.job_roles.interview)
    let ROLE_STAFF = await guild.roles.cache.find(r => r.id === settings.job_roles.staff)
    let ROLE_TRAINEE = await guild.roles.cache.find(r => r.id === settings.job_roles.trainee)
    let ROLE_SALES = await guild.roles.cache.find(r => r.id === settings.job_roles.sales)
    let ROLE_SENIOR_SALES= await guild.roles.cache.find(r => r.id === settings.job_roles.senior_sales)
    let ROLE_JUNIOR_MANAGER = await guild.roles.cache.find(r => r.id === settings.job_roles.junior_manager)
    let ROLE_MANAGER = await guild.roles.cache.find(r => r.id === settings.job_roles.manager)

    let userfile = JSON.parse(fs.readFileSync(`./database/users/${employee.id}.json`))
    let currentStaff = JSON.parse(fs.readFileSync(`./database/currentStaff.json`))
    let pendingApps = JSON.parse(fs.readFileSync('./database/pendingApps.json'))
    let acceptedApps = JSON.parse(fs.readFileSync('./database/acceptedApps.json'))

    if(customId.startsWith("employee-training-")){
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} Employee flagged as **Training Completed**`)
            ],
            ephemeral: true
        })

        interaction.message.edit({
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`employee-timewarn-${acceptedApps[`${employee.id}#${customId.split('-')[2]}`].appID}-${employee.id}`)
                        .setLabel(`Time Warn (${userfile.timeWarn}/3)`)
                        .setEmoji(settings.emotes.warn)
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId(`appsub-message-${acceptedApps[`${employee.id}#${customId.split('-')[2]}`].appID}-${employee.id}`)
                        .setLabel('Message Employee')
                        .setEmoji('📣')
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId(`employee-promote-${acceptedApps[`${employee.id}#${customId.split('-')[2]}`].appID}-${employee.id}`)
                        .setLabel('Promote')
                        .setEmoji('<a:slabove:1011674687329271860>')
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId(`employee-demote-${acceptedApps[`${employee.id}#${customId.split('-')[2]}`].appID}-${employee.id}`)
                        .setLabel('Demote')
                        .setEmoji('<a:sldown:1011674682388398090>')
                        .setStyle('DANGER'),
                    new Discord.MessageButton()
                        .setCustomId(`employee-fire-${acceptedApps[`${employee.id}#${customId.split('-')[2]}`].appID}-${employee.id}`)
                        .setLabel('Fire Employee')
                        .setEmoji(settings.emotes.warn)
                        .setStyle('DANGER')
                )
            ]
        })

        await employee.roles.add(ROLE_STAFF)
        await employee.roles.add(ROLE_TRAINEE)
        await employee.roles.remove(ROLE_TRAINING)

        currentStaff[employee.id] = acceptedApps[`${employee.id}#${customId.split('-')[2]}`]
        currentStaff[employee.id][`staffMsgID`] = interaction.message.id
        fs.writeFileSync(`./database/currentStaff.json`, JSON.stringify(currentStaff, null, 4))
        
    }

    if(customId.startsWith("employee-promote-")){
        let employeeRoles = await employee.roles.cache.map(r => `${r.id}`)
        
        let staffRole = []
        
        for(let i of settings.rank){
            if(employeeRoles.includes(i)){
              staffRole.push(i)
            }
        }

        if(staffRole.length === 0) return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong}, Something went wrong, Possibly none of the staff roles were found on employee`)
        ],ephemeral: true})

        let index = settings.rank.indexOf(staffRole.join(''))
        if(index === settings.rank.length-1) return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} WAAAAITT! Hold on there Champ,\n<@&${settings.rank[index]}> is the highest role Bot can promote to people.\nEither ur making a mistake, or ur on crack`)
        ], ephemeral: true})

        let nextRole = await guild.roles.cache.find(r => r.id === settings.rank[index+1])
        let currRole = await guild.roles.cache.find(r => r.id === settings.rank[index])

        employee.roles.add(nextRole)
        employee.roles.remove(currRole)

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} Promoted ${employee} to ${nextRole} from ${currRole}`)
            ], ephemeral: true
        })

        client.channels.cache.get('856095548548972554').send({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} Promoted ${employee} to ${nextRole} from ${currRole}`)
            ], ephemeral: true
        })
    }

    if(customId.startsWith("employee-demote-")){
        let employeeRoles = await employee.roles.cache.map(r => `${r.id}`)
        let staffRole = []
        
        for(let i of settings.rank){
            if(employeeRoles.includes(i)){
              staffRole.push(i)
            }
        }

        if(staffRole.length === 0) return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong}, Something went wrong, Possibly none of the staff roles were found on employee`)
        ],ephemeral: true})

        let index = settings.rank.indexOf(staffRole.join(''))
        if(index == 0) return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} <@&${settings.rank[index]}> is the lowest role Bot can demote to people. Maybe fire em?`)
        ],ephemeral: true})

        let nextRole = await guild.roles.cache.find(r => r.id === settings.rank[index-1])
        let currRole = await guild.roles.cache.find(r => r.id === settings.rank[index])

        employee.roles.add(nextRole)
        employee.roles.remove(currRole)

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.check} Demoted ${employee} to ${nextRole} from ${currRole}`)
            ], ephemeral: true
        })

        client.channels.cache.get('856095548548972554').send({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.check} Demoted ${employee} to ${nextRole} from ${currRole}`)
            ], ephemeral: true
        })
    }

    if(customId.startsWith("employee-fire-")){

        let employeeID = settings.employeeID

        console.log(interaction.customId)
        interaction.customId = `employee-fire-${customId.split('-')[2]}-${employeeID}`
        console.log(interaction.customId)

        try{       
            employee.roles.remove(ROLE_TRAINING)
            employee.roles.remove(ROLE_INTERVIEW)
            employee.roles.remove(ROLE_STAFF)
            employee.roles.remove(ROLE_SALES)
            employee.roles.remove(ROLE_TRAINEE)
            employee.roles.remove(ROLE_SENIOR_SALES)
            employee.roles.remove(ROLE_JUNIOR_MANAGER)
            employee.roles.remove(ROLE_MANAGER)
        }catch{

        }

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.check} ${employee} fired from work`)
            ],
            ephemeral: true
        })

        delete currentStaff[employee.id]
        interaction.message.delete()

        fs.unlink(`./database/users/${employee.id}.json`)
    }

    //Done
    if(customId.startsWith("employee-timewarn-")){
        if(userfile.timeWarn === 3){
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${settings.emotes.wrong} Unable to send more time warnings, employee already recieved 3 warnings`)
                ],
                ephemeral: true
            })
        }

        
        userfile.timeWarn++

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} Successfully sent **${userfile.timeWarn}/3** Time warning to **${cap(userfile.details.cityName)}**`)
            ],
            ephemeral: true
        })

        interaction.component.setLabel(`Time Warn (${userfile.timeWarn}/3)`)
        interaction.message.edit({
            components: interaction.message.components
        });

        employee.send({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setTitle(`Lux Autos - Official Warning`)
                .setAuthor({
                    name: `To: ${cap(userfile.details.cityName)}\nFrom: BBRP Management\nDate: ${today.format('DD.MM.YYYY')}`
                })
                .setThumbnail(guild.iconURL())
                .setDescription(`**Hello**,\n\nUnfortunately this message isn't a nice one, today you will be receiving an official warning for not making your weekly hours (varies per position) and/or your 50x repair kit quota.\n\nWhat this means is that you've now been placed on your **Warning No. ${userfile.timeWarn}/3**\n\nPlease make us aware before the weekend after pays if you're unable to do your weekly hours or repair kits in the future otherwise you will be receiving more of these lovely messages.\n\nIt's like baseball - three strikes and you're out.\n\n**Kind Regards**,\n**BBRP Management**`)
                .setTimestamp()
                .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon
                })
            ]
        })

        fs.writeFileSync(`./database/users/${employee.id}.json`, JSON.stringify(userfile, null, 4))

        
    }

}