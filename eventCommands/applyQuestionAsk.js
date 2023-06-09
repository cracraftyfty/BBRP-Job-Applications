const Discord = require('discord.js')
const moment = require("moment-timezone");
const fs = require('fs')
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals');
const settings = require('../database/settings.json');
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!customId.startsWith("appForm")) return;  
    
    if(customId.startsWith("appForm-submit")) return appSubmitPrompt()

    async function appSubmitPrompt() {
        return interaction.update({
            components: [
                new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId(`app-confirm-${member.id}`)
                            .setLabel('Submit Application')
                            .setEmoji(settings.emotes.blue_beacon)
                            .setStyle('SUCCESS'),
                        new Discord.MessageButton()
                            .setCustomId(`app-deny-${member.id}`)
                            .setLabel('DO NOT Submit Application')
                            .setEmoji(settings.emotes.red_beacon)
                            .setStyle('DANGER')
                    )
            ]
        })
    }

    let formSet = customId.split('-')[1]
    let userID = customId.split('-')[2]

    let pendingApps = JSON.parse(fs.readFileSync('./database/pendingApps.json'))
    let appQuestions = JSON.parse(fs.readFileSync('./database/appQuestions.json'))

    let comps = []

    switch(formSet){
        case '1':
            comps = [
                new TextInputComponent()
                .setCustomId(`q1+${userID}`)
                .setLabel('Time in city')
                .setStyle("SHORT")
                .setMinLength(1)
                .setMaxLength(150)
                .setPlaceholder(pendingApps[userID].appData.q1)
                .setRequired(false), 
                new TextInputComponent()
                .setCustomId(`q2+${userID}`)
                .setLabel('Whitelist Status')
                .setStyle("SHORT")
                .setMinLength(1)
                .setMaxLength(150)
                .setPlaceholder(pendingApps[userID].appData.q2)
                .setRequired(false),
                new TextInputComponent()
                .setCustomId(`q3+${userID}`)
                .setLabel('Work Timings')
                .setStyle("LONG")
                .setMinLength(1)
                .setMaxLength(2500)
                .setPlaceholder(pendingApps[userID].appData.q3)
                .setRequired(false),
                new TextInputComponent()
                .setCustomId(`q4+${userID}`)
                .setLabel('Can you fulfil time reqirement?')
                .setStyle("SHORT")
                .setMinLength(1)
                .setMaxLength(150)
                .setPlaceholder(pendingApps[userID].appData.q4)
                .setRequired(false),
                new TextInputComponent()
                .setCustomId(`q5+${userID}`)
                .setLabel('About Yourself')
                .setStyle("LONG")
                .setMinLength(1)
                .setMaxLength(2500)
                .setPlaceholder(pendingApps[userID].appData.q5)
                .setRequired(false),
            ]
            break;
        case '2':
            comps = [
                new TextInputComponent()
                .setCustomId(`q6+${userID}`)
                .setLabel('What other jobs do you work?')
                .setStyle("LONG")
                .setMinLength(1)
                .setMaxLength(1500)
                .setPlaceholder(pendingApps[userID].appData.q6)
                .setRequired(false), 
                new TextInputComponent()
                .setCustomId(`q7+${userID}`)
                .setLabel('Reason of work')
                .setStyle("LONG")
                .setMinLength(1)
                .setMaxLength(2500)
                .setPlaceholder(pendingApps[userID].appData.q7)
                .setRequired(false)
            ]
            break;
    }

    discordModals(client);
    const modal = new Modal() 
    .setCustomId(`appquestions+${formSet}+${member.id}`)
    .setTitle(`BBTP Application - Part ${formSet}`)
    .addComponents(comps);
    await showModal(modal, {
        client: client,
        interaction: interaction
    }).catch(e => {
        interaction.reply(e.message ? e.message : e);
    })
}