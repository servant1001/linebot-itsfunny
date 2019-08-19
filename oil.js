var request = require("request");
var cheerio = require("cheerio");
var linebot = require('linebot');

// 用於辨識Line Channel的資訊
var bot = linebot({
    channelId: '1598111754',
    channelSecret: '11180ce8858c11ee7ecc586dac638fee',
    channelAccessToken: 'SBoRhKY9L66U8LwlTqzDGly0KuClZFdTifwiprbKospMt6OO7Rwx3eWFLFEoC5zYzFtJFAag37P1iN0XivCxsAHABvon4YkjNzS4H3AWisUA2i9j16+5O20PrqxmZeQHEC59wTTSBJokvOvCrcg9RQdB04t89/1O/w1cDnyilFU='
});

module.exports = function __OilPrice(targetId) {
    request({
        url: "https://gas.goodlife.tw/",
        method: "GET"
    }, function(error, response, body) {
        if (error || !body) { // 失敗
            return;
        } else { // 成功
            var $ = cheerio.load(body);
            var oils = [];
            var rates = [];
            $('#tab1 #main_content #gas #main #rate ul').each(function(i, elem) {
                rates.push(
                $(this)
                    .text()
                    .split('\n')
                )
            })

            rates = rates.map(rate => ({
                rate_title: rate[14].trim(),
                rate_per: rate[15].trim(),

            }))
            // console.log(rates);

            $('#tab1 #main_content #gas #main #cpc ul').each(function(i, elem) {
                oils.push(
                $(this)
                    .text()
                    .split('\n')
                )
            })

            oils = oils.map(oil => ({
                type_92: oil[2].trim().split(':')[0],
                price_92: oil[3].trim(),
                type_95: oil[5].trim(),
                price_95: oil[6].trim(),
                type_98: oil[8].trim().split(':')[0],
                price_98: oil[9].trim()
            }))
            // console.log(oils);

            bot.push(targetId, 
                "今日中油油價 (每公升)\n" +
                oils[0].type_92 + "油價: " + oils[0].price_92 + "\n" +
                oils[0].type_95 + " " + oils[0].price_95 + "\n" +
                oils[0].type_98 + "油價: " + oils[0].price_98 + "\n" +
                rates[0].rate_title + " " + rates[0].rate_per);
        }
    });
}