var request = require("request");
var cheerio = require("cheerio");
var linebot = require('linebot');
// var translate = require('google-translate-api'); // 有網路VPN問題不能用
var translate = require('@k3rn31p4nic/google-translate-api');

// 用於辨識Line Channel的資訊
var bot = linebot({
    channelId: '1598111754',
    channelSecret: '11180ce8858c11ee7ecc586dac638fee',
    channelAccessToken: 'SBoRhKY9L66U8LwlTqzDGly0KuClZFdTifwiprbKospMt6OO7Rwx3eWFLFEoC5zYzFtJFAag37P1iN0XivCxsAHABvon4YkjNzS4H3AWisUA2i9j16+5O20PrqxmZeQHEC59wTTSBJokvOvCrcg9RQdB04t89/1O/w1cDnyilFU='
});

module.exports = function __translate(targetId, str_to, str_from) {

    
    var languages = [
        {language: '中文', code: 'zh-tw'},
        {language: '繁體中文', code: 'zh-tw'},
        {language: '簡體中文', code: 'zh-cn'},
        {language: '英文', code: 'en'},
        {language: '日文', code: 'ja'},
        {language: '韓文', code: 'ko'},
        {language: '泰文', code: 'th'},
        {language: '越南文', code: 'vi'},
        {language: '印尼文', code: 'id'},
        {language: '德文', code: 'de'},
        {language: '法文', code: 'fr'},
        {language: '俄文', code: 'ru'}
    ];

    var index = 3; // 預設翻譯語言是英文
    for(i=0; i<languages.length; i++) {
        if(str_to == languages[i].language) {
            index = i;
        }
    }

    translate(str_from, {to: languages[index].code}).then(res => {
        console.error(res.text);
        console.log(res.from.language.iso);
        bot.push(targetId, res.text);
        }).catch(err => {
           console.error(err);
    });
    
}