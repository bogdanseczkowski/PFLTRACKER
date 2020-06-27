const fs = require("fs");
var cloudscraper = require('cloudscraper');
let airplane_data_raw = fs.readFileSync("airplanes.json");
let tracklist = JSON.parse(airplane_data_raw);
let data_url="https://www.radarbox.com/data/flight-info?type=registration&query="
let last_status = [];
function getaircraft(url,callback){
    cloudscraper.get(url).then(callback).catch(console.error);
}
function onstatuschange(number,status,text){
    if(last_status[number]!=status){
        if(last_status[number] != undefined){
            console.log(text);
        }
        last_status[number] = status;
    }
}
function aircraftanal(data){
    let decoded = JSON.parse(data);
    if(decoded.status==="live"){
        onstatuschange(decoded.acr,decoded.status,"Lot " + decoded.cs + " samolotem " + tracklist.data.find(element => element.number == decoded.acr).type + " wystartował z " + decoded.aporgci + "\n Życzymy miłego lotu 🤖");
    }
    if(decoded.status === "landed"){
        onstatuschange(decoded.acr,decoded.status,"Lot " + decoded.cs + " samolotem " + tracklist.data.find(element => element.number == decoded.acr).type + " wylądował w " + decoded.apdstci);
    }
}
let minutes = 5, interval = minutes * 60 * 1000;
setInterval(function() {
    console.log(last_status)
    tracklist.data.forEach(element => {
        getaircraft(data_url+element.number,aircraftanal)
    });
}, interval);
