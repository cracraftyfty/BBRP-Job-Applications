//Import Modules
const config = require(`../botconfig/config.json`);
const { MessageEmbed,InteractionType  } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const nwc = require('../functions/nwc.js');
const cap = require('../functions/cap.js');
const intcheck = require('../functions/intcheck.js');
const settings = require('../database/settings.json');
const { onCoolDown, replacemsg } = require("../handlers/functions");
const botsettings = require(`../botconfig/settings.json`);
const Discord = require('discord.js')
const fs = require('fs')
const ms = require('ms')
const moment = require('moment-timezone')
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals'); // Define the discord-modals package!
const { Formatters } = require('discord.js');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    //if(!interaction.isSelectMenu()) return
    //if(!customId.startsWith('order')) return;
    //if(!interaction.values.includes('order_clothing')) return
    //console.log(customId)
    
}