const fs = require("fs");
var cloudscraper = require('cloudscraper');
let airplane_data_raw = fs.readFileSync("airplanes.json");
let tracklist = JSON.parse(airplane_data_raw);
let data_url="https://www.radarbox.com/data/flight-info?type=registration&query="
let replay_url="https://www.radarbox.com/data/get-replay?fid="
let last_status = [];
function getdata(url,callback){
    cloudscraper.get(url).then(callback).catch(console.error);
}
function getHours(str) {
    var time = 0;
    var days = str.match(/(\d+)\s*d/);
    var hours = str.match(/(\d+)\s*h/);
    var minutes = str.match(/(\d+)\s*m/);
    if (days) { time += parseInt(days[1])*24; }
    if (hours) { time += parseInt(hours[1]); }
    if (minutes) { time += parseInt(minutes[1])/60; }
    return time;
}
function onstatuschange(number,status,text){
    if(last_status[number]!=status){
        if(last_status[number] != undefined){
            console.log(text);
            if(status == "landed"){
                getdata(replay_url+decoded.fid,savestats);
            }
        }
        last_status[number] = status;
    }
}
function savestats(data){
    let time = new Date().getTime();
    fs.writeFileSync(time + ".json",data);
}
function aircraftanal(data){
    let decoded = JSON.parse(data);
    if(decoded.status==="live"){
        onstatuschange(decoded.acr,decoded.status,"Lot " + decoded.cs + " samolotem " + tracklist.data.find(element => element.number == decoded.acr).type + " wystartował z " + decoded.aporgci + "\n Życzymy miłego lotu 🤖");
    }
    if(decoded.status === "landed"){
        //To Do: create stats
        onstatuschange(decoded.acr,decoded.status,"Lot " + decoded.cs + " samolotem " + tracklist.data.find(element => element.number == decoded.acr).type + " wylądował w " + decoded.apdstci);
    }
}
let minutes = 5, interval = minutes * 60 * 1000;
setInterval(function() {
    tracklist.data.forEach(element => {
        getdata(data_url+element.number,aircraftanal)
    });
}, interval);
