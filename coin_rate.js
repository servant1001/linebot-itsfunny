var request = require("request");
var cheerio = require("cheerio");
var linebot = require('linebot');

// 用於辨識Line Channel的資訊
var bot = linebot({
    channelId: '1598111754',
    channelSecret: '11180ce8858c11ee7ecc586dac638fee',
    channelAccessToken: 'SBoRhKY9L66U8LwlTqzDGly0KuClZFdTifwiprbKospMt6OO7Rwx3eWFLFEoC5zYzFtJFAag37P1iN0XivCxsAHABvon4YkjNzS4H3AWisUA2i9j16+5O20PrqxmZeQHEC59wTTSBJokvOvCrcg9RQdB04t89/1O/w1cDnyilFU='
});

module.exports = function _japan(targetId, coin) {
    request({
        url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
        method: "GET"
    }, function(error, response, body) {
        if (error || !body) { // 失敗
            return;
        } else { // 成功
            var index = 0;
            var $ = cheerio.load(body);
            var target = $(".rate-content-sight.text-right.print_hide");
            // jp = target[15].children[0].data;
            
            // if (jp < 0.29) {
            //     bot.push('U434c4dca0b82d57a4d2c7f41a16de504', '現在日幣 ' + jp + '，該買啦！');
            // }

            var rates = [];
            $('body .page-wrapper main .container table tbody tr').each(function(i, elem) {
                rates.push($(this).text().split('\n'));
            })

            rates = rates.map(rate => ({
                contry: rate[8].trim(),
                cash_rate_buy: rate[15].trim(),
                cash_rate_sell: rate[16].trim(),
                spot_rate_buy: rate[17].trim(),
                spot_rate_sell: rate[18].trim(),
            }))
            
            for(i=0; i<rates.length; i++) {
                if(coin == rates[i].contry.split(' ')[0]) {
                    index = i;
                }
            }

            bot.push('U434c4dca0b82d57a4d2c7f41a16de504',
                rates[index].contry + "\n" +
                "現金買入: " + rates[index].cash_rate_buy + "\n" +
                "現金賣出: " + rates[index].cash_rate_sell + "\n" +
                "即期買入: " + rates[index].spot_rate_buy + "\n" +
                "即期賣出: " + rates[index].spot_rate_buy + "\n");
        }
    });
}
