var request = require("request");
var cheerio = require("cheerio");
var linebot = require('linebot');

// 用於辨識Line Channel的資訊
var bot = linebot({
    channelId: '1598111754',
    channelSecret: '11180ce8858c11ee7ecc586dac638fee',
    channelAccessToken: 'SBoRhKY9L66U8LwlTqzDGly0KuClZFdTifwiprbKospMt6OO7Rwx3eWFLFEoC5zYzFtJFAag37P1iN0XivCxsAHABvon4YkjNzS4H3AWisUA2i9j16+5O20PrqxmZeQHEC59wTTSBJokvOvCrcg9RQdB04t89/1O/w1cDnyilFU='
});

module.exports = function __weather(targetId, city) {

    var city_eng = "Taipei_City";
    if(city == "台北" || city[0] == "台北市" || city == "臺北" || city == "臺北市") {
        city_eng = "Taipei_City";
    }else if(city == "新北" || city == "新北市") {
        city_eng = "New_Taipei_City";
    }else if(city == "桃園" || city == "桃園市") {
        city_eng = "Taoyuan_City";
    }else if(city == "台中" || city == "台中市" || city == "臺中" || city == "臺中市") {
        city_eng = "Taichung_City";
    }else if(city == "台南" || city == "台南市" || city == "臺南" || city == "臺南市") {
        city_eng = "Tainan_City";
    }else if(city == "高雄" || city == "高雄市") {
        city_eng = "Kaohsiung_City";
    }else if(city == "基隆" || city == "基隆市") {
        city_eng = "Keelung_City";
    }else if(city == "新竹" || city == "新竹市") {
        city_eng = "Hsinchu_City";
    }else if(city == "新竹縣") {
        city_eng = "Hsinchu_County";
    }else if(city == "苗栗" || city == "苗栗縣") {
        city_eng = "Miaoli_County";
    }else if(city == "彰化" || city == "彰化縣") {
        city_eng = "Changhua_County";
    }else if(city == "南投" || city == "南投縣") {
        city_eng = "Nantou_County";
    }else if(city == "雲林" || city == "雲林縣") {
        city_eng = "Yunlin_County";
    }else if(city == "嘉義" || city == "嘉義市") {
        city_eng = "Chiayi_City";
    }else if(city == "嘉義縣") {
        city_eng = "Chiayi_County";
    }else if(city == "屏東" || city == "屏東縣") {
        city_eng = "Pingtung_County";
    }else if(city == "宜蘭" || city == "宜蘭縣") {
        city_eng = "Yilan_County";
    }else if(city == "花蓮" || city == "花蓮縣") {
        city_eng = "Hualien_County";
    }else if(city == "台東" || city == "台東縣" || city == "臺東" || city == "臺東縣") {
        city_eng = "Taitung_County";
    }else if(city == "澎湖" || city == "澎湖縣") {
        city_eng = "Taitung_County";
    }else if(city == "金門" || city == "金門縣") {
        city_eng = "Kinmen_County";
    }else if(city == "連江" || city == "連江縣") {
        city_eng = "Lienchiang_County";
    }

    request({
        url: "http://www.cwb.gov.tw/V7/forecast/taiwan/" + city_eng + ".htm",
        method: "GET"
    }, function(error, response, body) {
        if (error || !body) { // 失敗
            console.log("擷取錯誤：" + error);
            return;
        } else { // 成功
            var $ = cheerio.load(body)

            var weathers = [];
            $('#box8 .FcstBoxTable01 tbody tr').each(function(i, elem) {
                weathers.push(
                    $(this)
                        .text()
                        .split('\n')
                )
            })
            
            weathers = weathers.map(weather => ({
                time: weather[1].substring(2).split(' ')[0],
                temp: weather[2].substring(2),
                desc: weather[5].substring(2),
                rain: weather[6].substring(2),
            }))

            bot.push(targetId, 
            city + "天氣\n" +
            "-" + weathers[0].time + "-\n" + 
            "氣溫: " + weathers[0].temp + "℃\n" +
            "降雨機率: " + weathers[0].rain + "\n" +
            "-" + weathers[1].time + "-\n" + 
            "氣溫: " + weathers[1].temp + "℃\n" +
            "降雨機率: " + weathers[1].rain);
            
            // console.log(targetId + " " + city_str);
            // console.log(city+"\n" +
            // "-" + weathers[0].time + "-\n" + 
            // "氣溫: " + weathers[0].temp + "℃\n" +
            // "降雨機率: " + weathers[0].rain + "\n" +
            // "-" + weathers[1].time + "-\n" + 
            // "氣溫: " + weathers[1].temp + "℃\n" +
            // "降雨機率: " + weathers[1].rain)
        }
    });
}