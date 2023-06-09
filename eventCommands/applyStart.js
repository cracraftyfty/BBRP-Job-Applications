const { MessageEmbed } = require("discord.js");
const moment = require("moment-timezone");
const fs = require('fs')
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals');
const settings = require('../database/settings.json')
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!['apply'].includes(customId)) return;  


    let pendingApps = JSON.parse(fs.readFileSync('./database/pendingApps.json'))
    if(pendingApps.hasOwnProperty(member.id)) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} You already have an application under process, unable to start another\nApplied On: **${pendingApps[member.id].appliedOn}**`)
        ],
        ephemeral: true
    })

    let comps = [
        new TextInputComponent()
            .setCustomId("cityname")
            .setLabel("City Name")
            .setStyle("SHORT")
            .setMinLength(3)
            .setMaxLength(150)
            .setPlaceholder("What is your City Name?")
            .setRequired(true), 
        new TextInputComponent() 
            .setCustomId("citynumber")
            .setLabel("City Number")
            .setStyle("SHORT")
            .setMinLength(3)
            .setMaxLength(7)
            .setPlaceholder("What is your City Number?")
            .setRequired(true),
        new TextInputComponent() 
            .setCustomId("steamname")
            .setLabel("Steam Name")
            .setStyle("SHORT")
            .setMinLength(3)
            .setMaxLength(150)
            .setPlaceholder("What is your steam name?")
            .setRequired(true)
    ]

    discordModals(client);
    const modal = new Modal() 
    .setCustomId(`apply+${member.id}`)
    .setTitle("BBRP - Staff Registration")
    .addComponents(comps);
    await showModal(modal, {
        client: client,
        interaction: interaction
    }).catch(e => {
        interaction.reply(e.message ? e.message : e);
    })
}