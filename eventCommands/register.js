const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals');
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!['register'].includes(customId)) return;    

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
                .setRequired(true),
            new TextInputComponent()
                .setCustomId("worksheet_link")
                .setLabel("Sheet Tab Link")
                .setStyle("SHORT")
                .setMinLength(3)
                .setMaxLength(1000)
                .setPlaceholder("Enter the link of your worksheet tab")
                .setRequired(true),
            new TextInputComponent()
                .setCustomId("email_link")
                .setLabel("Email ID used")
                .setStyle("SHORT")
                .setMinLength(3)
                .setMaxLength(1000)
                .setPlaceholder("Enter the EMAIL ID you used for spreadsheet")
                .setRequired(true)
    ]

    discordModals(client);
    const modal = new Modal() 
    .setCustomId(`register+${member.id}`)
    .setTitle("BBRP - Staff Registration")
    .addComponents(comps);
    await showModal(modal, {
        client: client,
        interaction: interaction
    }).catch(e => {
        interaction.reply(e.message ? e.message : e);
    })
}