const { MessageEmbed } = require("discord.js");
const ee = require(`../../botconfig/embed.json`);
const fs = require('fs');
const cap = require('../../functions/cap.js');
const settings = require('../../database/settings.json');
var CronJob = require('cron').CronJob;
module.exports = async (client) => {
    const allevents = [];
    const event_files = fs.readdirSync(`./eventCommands/`).filter((file) => file.endsWith(".js"));
    for (const file of event_files) {
        try {
            const event = require(`../../eventCommands/${file}`)
            let eventName = file.split(".")[0];
            allevents.push(eventName);
            client.on('interactionCreate', event.bind(null, client));
        } catch (e) {
            console.log(e)
        }
    }

   //7am tsunami
   var job2 = new CronJob('0 0 * * FRI', function() {
    console.log('[BBRP] Resetting Weekly times')
    fetchLogs()
  }, null, true, 'Australia/Sydney');
  job2.start()


    async function fetchLogs(){
        let guild = client.guilds.cache.get('695613600403816489')
        let user_dir = fs.readdirSync('./database/users')
        let dept = "luxautos"
        let LB_DICT = {}
        await guild.members.fetch()
        let StaffMembers = await guild.roles.cache.get(settings.job_roles.staff).members.map(m=>m.user.id)
        user_dir.forEach(async file => {
            let user = JSON.parse(fs.readFileSync(`./database/users/${file}`))
            if(StaffMembers.includes(user.details.discordID)){     
                if(user.details.cityName){
                    LB_DICT[user.details.cityName] = 0
                    LB_DICT[user.details.cityName] += user.time_log[dept]*1000        
                }
                else{
                    LB_DICT[user.details.discordTag] = 0
                    LB_DICT[user.details.discordTag] += user.time_log[dept]*1000        
                }  
                StaffMembers.splice(StaffMembers.indexOf(user.details.discordID), 1)
            }else{
                /* fs.rename(`./database/users/${file}`, `./database/usersDUMP/${file}`, function(err){
                    if(err) throw err
                    console.log(`DELETED: ./database/users/${file}`)
                    client.channels.cache.get('1037590368780292168').send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`> User Fired/Left server.... Deleting DB File: **${file.split('.')[0]}**`)
                            .setColor(ee.color)
                        ]
                    })
                }) */
                client.channels.cache.get('1037590368780292168').send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`> User Fired/Left server.... Deleting DB File: **${file.split('.')[0]}**`)
                            .setColor(ee.color)
                        ]
                    })
            }
        })

        let users_unregistered = StaffMembers.map(uid => '- <@'+uid+'>').join('\n')

        if(StaffMembers.length > 0){
            client.channels.cache.get('1067670633053442148').send({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`Following users have not yet registered into the bot and have the <@&${settings.job_roles.staff}> Role:\n${users_unregistered}`)
                    .setColor(ee.color)
                ]
            })
        }

        var items = Object.keys(LB_DICT).map(function(key) {
            return [key, LB_DICT[key]];
        });
      
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
      
        let total_duty_time = 0
        let LB_MESSAGE = ''
      
        let loop = items.length

        let curr_date = today.format('DD/MM/YYYY')
        let old_date = today.subtract(7, 'd').format('DD/MM/YYYY');
        let MONTH = `${old_date} - ${curr_date}`

        await channel.threads.create({
            name: MONTH,
            reason: 'Weekly Time log',
        }).then(t => {
            t.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`BBRP`)
                    .setDescription('Weekly Time Logs')
                    .setColor(ee.color)
                ]
            })
            for(i=0;i<loop;i++){
                if(LB_MESSAGE.length >= 4000){
                    t.send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(LB_MESSAGE)
                            .setColor(ee.color)
                        ]
                    })
                    LB_MESSAGE = ''
                }
                if(items[i][1] < 21600000){
                    LB_MESSAGE += `${i+1}- ${settings.emotes.warn} **${cap(items[i][0])}**: ${ms(items[i][1])}\n`
                    total_duty_time += items[i][1]
                }else{
                    LB_MESSAGE += `${i+1}- **${cap(items[i][0])}**: ${ms(items[i][1])}\n`
                    total_duty_time += items[i][1]
                }
    
    
                if(i === loop-1){
                    t.send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(LB_MESSAGE)
                            .setColor(ee.color)
                        ]
                    })
                    LB_MESSAGE = ''
                }
            }
    
            resetTimes()
        });

        
    } 

    async function resetTimes(){
        var today =  moment.tz('Australia/Sydney');

        let curr_date = today.format('DD/MM/YYYY')
        let old_date = today.subtract(7, 'd').format('DD/MM/YYYY');
        let MONTH = `${old_date} - ${curr_date}`

        let staff_dir = fs.readdirSync('./database/users')

        //return console.log(MONTH)
        await staff_dir.forEach(file => {
            let userfile = JSON.parse(fs.readFileSync(`./database/users/${file}`))
            let total_time = userfile.time_log.luxautos

            let cityName = userfile.details.cityName
            if(!cityName) cityName = userfile.details.discordTag
            userfile.prior_months[MONTH]
            userfile.prior_months[MONTH] = userfile.time_log
            userfile.time_log = {
                "luxautos": 0
            }
            fs.writeFileSync(`./database/users/${file}`, JSON.stringify(userfile, null, 4))
        })

        console.log(curr_date, old_date)
    }
}