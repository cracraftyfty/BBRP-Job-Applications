var Discord = require(`discord.js`);
const {
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton
} = require('discord.js')
var config = require(`../../botconfig/config.json`);
var settings = require(`../../botconfig/settings.json`);
var ee = require(`../../botconfig/embed.json`);
const fs = require('fs');
const fetch = require('node-fetch');
module.exports = {
    name: "test",
    category: "Owner",
    aliases: ["changebotavatar", "botavatar", "botprofilepicture", "botpfp"],
    cooldown: 5,
    usage: "changeavatar <Imagelink/Image>",
    description: "Changes the Avatar of the BOT: I SUGGEST YOU TO DO IT LIKE THAT: Type the command in the Chat, attach an Image to the Command (not via link, just add it) press enter",
    memberpermissions: [],
    requiredroles: [], 
    alloweduserids: settings.ownerIDS,
    minargs: 0,
    maxargs: 0,
    minplusargs: 0,
    maxplusargs: 0,
    argsmissing_message: "",
    argstoomany_message: "",
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        
        message.delete()

        /* await message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle('Lux Autos | Time Recorder')
                .setDescription('Press the desired buttons below to perform the certain activity')
                .setThumbnail(message.guild.iconURL())
                .setURL(ee.footericon)
                .setColor('YELLOW')
                .setFooter(ee.footertext, ee.footericon)
            ], 
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('on')
                        .setLabel('Clock On')
                        .setEmoji('🟠')
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId('off')
                        .setLabel('Clock Off')
                        .setEmoji('🔵')
                        .setStyle('DANGER'),
                    new Discord.MessageButton()
                        .setCustomId('profile')
                        .setLabel('Profile')
                        .setEmoji('📃')
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId('lb')
                        .setLabel('Leaderboard')
                        .setEmoji('📑')
                        .setStyle('SECONDARY')
                ),
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('onleave')
                        .setLabel('Mark On-Leave')
                        .setEmoji('<:slonleave:1008626218054201425>')
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId('offleave')
                        .setLabel('Mark Off-Leave')
                        .setEmoji('<:sloffleave:1008626215860572221> ')
                        .setStyle('DANGER')
                )
            ]},
        )  */


        await message.channel.send({
            embeds: [new Discord.MessageEmbed()
            .setTitle('Lux Autos | Live Feed')
            .setDescription('LIVE_FEED_PLACEHOLDER')
            .setThumbnail(message.guild.iconURL())
            .setURL(ee.footericon)
            .setColor('YELLOW')
            .setFooter(ee.footertext, ee.footericon)
            ]
        })
    }
}

/* 
new Discord.MessageButton()
    .setCustomId('on')
    .setLabel('Clock on')
    .setEmoji('🟢')
    .setStyle('PRIMARY'),
*/


/* 
.then(m => {
    if(!embeds[m.id]){
        embeds[m.id] = m.embeds[0]
        fs.writeFileSync(`./database/embeds.json`, JSON.stringify(embeds, null, 4))
    }
})
*/