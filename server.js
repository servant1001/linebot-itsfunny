// 引用 linebot SDK
var linebot = require('linebot');
var jsdom = require('jsdom');
var request = require("request");
var rp = require('request-promise');
var cheerio = require("cheerio");
var nodemailer = require('nodemailer');
const Koa = require('koa');
const axios = require('axios');
const cors = require('@koa/cors');
const app = new Koa();

// 用於辨識Line Channel的資訊
var bot = linebot({
    channelId: '1598111754',
    channelSecret: '11180ce8858c11ee7ecc586dac638fee',
    channelAccessToken: 'SBoRhKY9L66U8LwlTqzDGly0KuClZFdTifwiprbKospMt6OO7Rwx3eWFLFEoC5zYzFtJFAag37P1iN0XivCxsAHABvon4YkjNzS4H3AWisUA2i9j16+5O20PrqxmZeQHEC59wTTSBJokvOvCrcg9RQdB04t89/1O/w1cDnyilFU='
});

// -- import --
var coin_rate = require('./coin_rate.js');
var x = require('./initial.js')
var weather = require('./weather.js');
var oil = require('./oil.js');
var yt = require('./youtube.js');
var translate = require('./translate.js');

const PORT = process.env.PORT || 3000;
const SITE_NAME = '西屯';
const opts = {
    uri: "http://opendata2.epa.gov.tw/AQI.json",
    json: true
};

// 使用 axios 非同步跨域抓取政府公開資訊
// app.use(cors());
// var AQI = 'http://opendata.epa.gov.tw/ws/Data/AQI/?$format=json'; // 注意不能是 Https
// axios.get(AQI).then(function (response) {
//     // var data = JSON.stringify(response);
//     console.log(response.data[0].SiteName);
//     bot.push('U434c4dca0b82d57a4d2c7f41a16de504', response.data[0].SiteName);
// }).catch(function (error) {
// 	console.log(error.config);
// });


// jsdom 基本範例
// const { JSDOM } = jsdom;
// const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
// console.log(dom.window.document.querySelector("p").textContent); // "Hello world"

// 引入jQuery
// const { JSDOM } = jsdom;
// const { window } = new JSDOM(`<!DOCTYPE html>`);
// const $ = require('jQuery')(window);
// console.log($); //测试jquery是否可以正常工作


function test_func() {
    request({
        url: "https://watch.ncdr.nat.gov.tw/watch_typhoon.aspx",
        method: "GET"
    }, function(error, response, body) {
        if (error || !body) { // 失敗
            console.log("擷取錯誤：" + error);
            return;
        } else { // 成功
            var $ = cheerio.load(body)

            var links = [];
            $('#main #tracks_div_id #typh_track_img_id').each(function(i, elem) {
                var link = $(this).attr('src');
                links.push({"link": link});
            })
            
            console.log(links);
            // test2(authors, titles, links, links_img);
        }
    });
}
// test_func();

var flag = 0;
function getCurrentTime() {
    
    var date = new Date(); //獲取當前時刻與日期
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var w = date.getDay();
    h += 8;
    if (h < 10) {
        h = '0' + h;
    }
    if (m < 10) {
        m = '0' + m;
    }
    if (s < 10) {
        s = '0' + s;
    }   
    var time = h + ':' + m + ':' + s; // 獲取當前時間
    if(h == '18' && m == '30' && w == 6 && flag == 0) {
        bot.push('Cada18ff74e64df8b5d6ab2f18fbbbd11', time + '即將為您播出 - 海賊王');
        flag = 1;
    }
    if(h == '19' && m == '04' && w == 6 && flag == 0) {
        bot.push('U434c4dca0b82d57a4d2c7f41a16de504', time);
        flag = 1;
    }
    if(h == '23' && flag == 1) { // 每天23:00重置 flag
        flag = 0;
    }
    // console.log(date.getMonth());
    // console.log(date.getFullYear());
}
// getCurrentTime();
// setInterval(getCurrentTime,2000);

function earthquake() {
    request({
        url: "http://www.cwb.gov.tw/V7/modules/MOD_EC_Home.htm", // 中央氣象局網頁
        method: "GET"
    }, function (error, response, body) {
        if (error || !body) {
            return;
        }
        const $ = cheerio.load(body); // 載入 body
        const result = []; // 建立一個儲存結果的容器
        const table_tr = $(".BoxTable tr"); // 爬最外層的 Table(class=BoxTable) 中的 tr

        for (let i = 1; i < table_tr.length; i++) { // 走訪 tr
            const table_td = table_tr.eq(i).find('td'); // 擷取欄位(td)
            const time = table_td.eq(1).text(); // time (台灣時間)
            const latitude = table_td.eq(2).text(); // latitude (緯度)
            const longitude = table_td.eq(3).text(); // longitude (經度)
            const amgnitude = table_td.eq(4).text(); // magnitude (規模)
            const depth = table_td.eq(5).text(); // depth (深度)
            const location = table_td.eq(6).text(); // location (位置)
            const url = table_td.eq(7).text(); // url (網址)
            // 建立物件並(push)存入結果
            result.push(Object.assign({ time, latitude, longitude, amgnitude, depth, location, url }));
        }
        // 在終端機(console)列出結果
        console.log(result);
    });
};
// earthquake();

// 寄信模組 - 使用 nodemailer，缺點會有安全性問題，使用前需關閉google兩步驟驗證登入並開啟低安全性應用程式存取權
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'servant1001@gmail.com', // here use your real email
//         pass: 'q123ASDFGHWERTYU' // put your password correctly (not in this question please)
//     }
// });

// var mailOptions = {
//     from: 'servant1001@gmail.com',
//     to: 'servant1001@gmail.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
// };
  
// transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });
// 寄信模組 End

bot.on('join', function (event) {
    if(event.source.groupId) {
        // event.reply('join group: ' + event.source.groupId);
        bot.push('U434c4dca0b82d57a4d2c7f41a16de504', '我被加入群組: ' + event.source.groupId);
    }
    if(event.source.roomId) {
        // event.reply('join room: ' + event.source.roomId);
    }
});


// function test2(authors, titles, links, links_img) {
    
//     var columns = [];
//     for(i=0; i<4; i++) {
//         columns.push({
//             thumbnailImageUrl: links_img[i].link,
//                 title: titles[i].title,
//                 text: authors[i].author,
//                 actions: [{
//                   type: 'uri',
//                   label: '點我觀看',
//                   uri: links[i].link
//                 }]
//         })
//     }
    
//     var yt_trending = {
//         type: 'template',
//         altText: 'this is a carousel template',
//         template: {
//             type: 'carousel',
//             columns: columns

//         }
//     }
//     // console.log(titles[1].title);
//     // console.log(yt_trending.template.columns);
//     bot.push('U434c4dca0b82d57a4d2c7f41a16de504', yt_trending);
// }
// test2();

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
    // event.message.text是使用者傳給bot的訊息
    // 準備要回傳的內容

    switch(event.message.type) {
        case 'text':
            Main_text();
            break;
        case 'sticker':
            Main_sticker("一般");
            break;
    }
    
    // 地圖
    function loca(text) {
        switch(text) {
            case "百羊":
                var location = {
                    type: 'location',
                    title: '百羊書房',
                    address: '407台中市西屯區黎明路三段306號1樓',
                    latitude: 24.181867,
                    longitude: 120.638507
                }
                break;
        }
        return location;
    }   

    function Main_text() {
        var str = event.message.text;
        var today = new Date();
        var current_time = today.getHours() + ":" + today.getMinutes();
        
        if(str.indexOf('::') != -1) {
            str = str.split('::');
            if(event.source.groupId) {
                translate(event.source.groupId, str[0], str[1]);
            }else {
                event.source.profile().then(function (profile) {
                    return translate(profile.userId, str[0], str[1]);
                });
            }
        }else if(str.indexOf('翻譯') != -1) {
            event.reply('目前支援語言:\n' +
        '1.繁體中文\n2.簡體中文\n3.英文\n4.日文\n5.韓文\n6.泰文\n7.越南文\n8.印尼文\n9.德文\n10.法文\n11.俄文\n' +
        '使用範例:\n輸入-> 英文::你好\n機器人回傳-> Hello\n*支援單詞、句型翻譯功能!');

        }else if(str.indexOf('你好') != -1) {
            event.reply('哈囉');
        }else if(str.indexOf('哈') != -1) {
            event.reply(temp());
        }else if(str.indexOf('你是誰') != -1) {
            event.reply("我是出生就會說話，2歲就會算數學，智商180的天才");
        }else if(str.indexOf('空氣') != -1) {
            rp(opts)
            .then(function (repos) {
                let data;
                
                for (i in repos) {
                    if (repos[i].SiteName == SITE_NAME) {
                        data = repos[i];
                        break;
                    }
                }
                event.reply(data.County + data.SiteName +
                    '\n\nPM2.5指數：'+ data["PM2.5_AVG"] + 
                    '\n狀態：' + data.Status);
            })
            .catch(function (err) {
                console.log('出錯了～找不到指定資源…');
            });

        }else if(str.indexOf('我是誰') != -1) {
            event.source.profile().then(function (profile) {
                return event.reply('你是 ' + profile.displayName + ' ' + profile.userId);
            });
        }else if(str.indexOf('群組') != -1) {
            if(event.source.groupId) {
                event.reply('join group: ' + event.source.groupId);
            }else {
                event.reply('這裡只有你和我ㄛ');
            }
        }else if(str.indexOf('百羊') != -1) {
            event.reply(loca("百羊"));
        }else if(str.indexOf('最帥') != -1) {
            event.reply('還用說嗎? 當然是你最帥啦!');
        }else if(str.indexOf('幾點') != -1 || str.indexOf('時間') != -1) {
            event.reply('現在時間 ' + current_time);
        }else if(str.indexOf('測試') != -1) {
            event.reply(yt_trending());
        }else if(str.indexOf('天氣') != -1) {
            var city = str.split("天氣");

            if(event.source.groupId) {
                weather(event.source.groupId, city[0]);
            }else {
                event.source.profile().then(function (profile) {
                    return weather(profile.userId, city[0]);
                });
            }
        }else if(str.indexOf('匯率') != -1) {
            str = str.split('匯率');
            if(event.source.groupId) {
                coin_rate(event.source.groupId, str[0]);
            }else {
                event.source.profile().then(function (profile) {
                    return coin_rate(profile.userId, str[0]);
                });
            }
        }else if(str.indexOf('yt') != -1) {
            if(event.source.groupId) {
                yt(event.source.groupId, str);
            }else {
                event.source.profile().then(function (profile) {
                    return yt(profile.userId, str);
                });
            }
        }else if(str.indexOf('油價') != -1) {
            if(event.source.groupId) {
                oil(event.source.groupId);
            }else {
                event.source.profile().then(function (profile) {
                    return oil(profile.userId);
                });
            }
        }else if(str.indexOf('發票') != -1) {
            var year = today.getFullYear() - 1911; // 西元換算民國
            var month = today.getMonth();
            var moth_str = '';
            if(month == 0 || month == 1) {
                year -= 1;
                moth_str = '1112';
            }else if(month == 2 || month == 3){
                moth_str = '0102';
            }else if(month == 4 || month == 5){
                moth_str = '0304';
            }else if(month == 6 || month == 7){
                moth_str = '0506';
            }else if(month == 8 || month == 9){
                moth_str = '0708';
            }else if(month == 10 || month == 11){
                moth_str = '0910';
            }
            
            event.reply({
                type: 'image',
                originalContentUrl: 'https://img.bluezz.tw/invoice/' + year + '/' + moth_str + '.jpg',
                previewImageUrl: 'https://img.bluezz.tw/invoice/' + year + '/' + moth_str + '.jpg'
            });
            
        }else if(str.indexOf('無聊') != -1) {
            event.reply('說個笑話，哈哈哈哈!');
        }else if(str.indexOf('吃飯') != -1) {
            event.reply('@佩妏 @武晉吃晚飯囉!');
        }else if(str.indexOf('#') != -1) {
            var str_array = str.split('#');
            event.source.profile().then(function (profile) {
                switch(str_array[0]) {
                    case '妏':
                        return bot.push('U809f14365e5ca818c511e52dfdf94146', profile.displayName+': '+ str_array[1]);
                        break;
                    case '威':
                        return bot.push('U434c4dca0b82d57a4d2c7f41a16de504', profile.displayName+': '+ str_array[1]);
                        break;
                    case '雨':
                        return bot.push('U7ad4f8e1b9046dd545d2b2e5348fe8c2', profile.displayName+': '+ str_array[1]);
                        break;
                    default:
                        break;
                }
            });
            event.reply('訊息送出成功!');
            
        }else if(str.indexOf('謝謝') != -1) {
            var random = getRandom(1,3);
            switch(random) {
                case 1:
                    event.reply('不客氣~');
                    break;
                case 2:
                    event.reply('どういたしまして');
                    break;
                case 3:
                    event.reply('You are welcome');
                    break;
            }
        }else if(str.indexOf('真的') != -1) {
            event.reply('真的!!!');
        }else if(str.indexOf('可愛') != -1) {
            var random = getRandom(1,2);
            switch(random) {
                case 1:
                    event.reply('So cute!!');
                    break;
                case 2:
                    event.reply('かわいい!!');
                    break;
            }
        }else if(str.indexOf('怎麼') != -1) {
            Main_sticker('驚訝');
        }else if(str.indexOf('晚安') != -1) {
            Main_sticker('晚安');
        }else if(str.indexOf('音樂') != -1) {
            var music_no = getRandom(1,5);
            switch(music_no) {
                case 1:
                    event.reply('https://www.youtube.com/watch?v=yvbftoh7llc');
                    break;
                case 2:
                    event.reply('https://www.youtube.com/watch?v=nGzADKIDf4A');
                    break;
                case 3:
                    event.reply('https://www.youtube.com/watch?v=XdXopI_eld4');
                    break;
                case 4:
                    event.reply('https://www.youtube.com/watch?v=ArvEolpKllc&t=565s');
                    break;
                case 5:
                    event.reply('https://www.youtube.com/watch?v=kxGQ7LV4DKQ');
                    break;
            }
            
        }else {
            //event.reply('請再說一次!');
        }
    }

    function Main_sticker(sticker_type) {
        var sticker_no;
        switch(sticker_type) {
            case "鼓勵":
                sticker_no = {
                    type: 'sticker',
                    packageId: '1',
                    stickerId: '125'
                }
                break;
            case "驚訝":
                sticker_no = {
                    type: 'sticker',
                    packageId: '1',
                    stickerId: '17'
                }
                break;
            case "生氣":
                sticker_no = {
                    type: 'sticker',
                    packageId: '1',
                    stickerId: '6'
                }
                break;
            case "疑問":
                sticker_no = {
                    type: 'sticker',
                    packageId: '11539',
                    stickerId: '52114120'
                }
                break;
            case "晚安":
                sticker_no = {
                    type: 'sticker',
                    packageId: '1',
                    stickerId: '149'
                }
                break;
            default:
                // var random = getRandom(1,150);
                sticker_no = {
                    type: 'sticker',
                    packageId: '1',
                    stickerId: '407'
                }
                break;
        }
        
        return event.reply(sticker_no);
    }
    
    function getRandom(min,max) {
        return Math.floor(Math.random()*(max-min+1))+min;
    };

});

// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', PORT, function () {
    console.log('Server running on port 3000');
});