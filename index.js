const fs = require('fs');
const output = require("./output");
var date = null;
var beatsPerMinuteMin = 0;
var beatsPerMinuteMax = 0;
var beatsPerMinuteMedian = 0;
var latestDataTimestamp = null;

function inputFileReader(filepath, cb) {
    fs.readFile(filepath, "utf8", (err, fileData) => {
        if (err) {
            return cb && cb(err);
        }
        try {
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch (err) {
            return cb && cb(err);
        }
    })
};

function outputFileWriter(filepath, data) {
    fs.writeFile(filepath, data, err => {
        if (err) throw err;
    })
};


inputFileReader('./heartrate.json', (err, heartrate) => {
    if (err) {
        console.log(err);
        return;
    }
    var l = heartrate.length;
    var beatsPerMinute = [];
    var endTime = [];
    for (var i = 0; i < l; i++) {
        var beatsPerMinuteValue = heartrate[i].beatsPerMinute;
        var endTimeValue = heartrate[i].timestamps.endTime;
        beatsPerMinute.push(beatsPerMinuteValue);
        endTime.push(endTimeValue);
    }

    var endTimeSort = endTime.sort((a, b) => a - b);
    latestDataTimestamp = endTimeSort[l - 1];
    date = latestDataTimestamp.substring(0, 10);

    var beatsPerMinuteSort = beatsPerMinute.sort((a, b) => a - b);
    beatsPerMinuteMin = Math.min(...beatsPerMinuteSort);
    beatsPerMinuteMax = Math.max(...beatsPerMinuteSort);

    const midPoint = Math.floor(l / 2);
    beatsPerMinuteMedian = l % 2 === 1 ? beatsPerMinuteSort[midPoint] : (beatsPerMinuteSort[midPoint - 1] + beatsPerMinuteSort[midPoint]) / 2;
    let latestHeartRate = {
        "date": date,
        "min": beatsPerMinuteMin,
        "max": beatsPerMinuteMax,
        "median": beatsPerMinuteMedian,
        "latestDataTimestamp": latestDataTimestamp,
    };

    console.log(latestHeartRate);

    output.push(latestHeartRate);

    outputFileWriter('./output.json', JSON.stringify(output));
});

