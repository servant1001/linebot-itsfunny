var request = require("request");
var cheerio = require("cheerio");
var linebot = require('linebot');

// 用於辨識Line Channel的資訊
var bot = linebot({
    channelId: '1598111754',
    channelSecret: '11180ce8858c11ee7ecc586dac638fee',
    channelAccessToken: 'SBoRhKY9L66U8LwlTqzDGly0KuClZFdTifwiprbKospMt6OO7Rwx3eWFLFEoC5zYzFtJFAag37P1iN0XivCxsAHABvon4YkjNzS4H3AWisUA2i9j16+5O20PrqxmZeQHEC59wTTSBJokvOvCrcg9RQdB04t89/1O/w1cDnyilFU='
});

module.exports = function __yt_trend(targetId, str) {

    var mode = 0;
    var url = 'https://www.youtube.com/feed/trending?gl=TW&hl=zh-TW'; // 預設熱榜模式
    if(str.indexOf('-') != -1) { // 搜尋功能
        mode = 1;
        str = str.split('-');
        url = 'https://www.youtube.com/results?search_query=' + str[1];
    }
    // console.log(mode);

    request({
        url: url,
        method: "GET"
    }, function(error, response, body) {
        if (error || !body) { // 失敗
            console.log("擷取錯誤：" + error);
            return;
        } else { // 成功
            var $ = cheerio.load(body)

            var authors = [];
            var titles = [];
            var num_viewers = []
            var links = [];
            var links_img = [];
            $('.yt-lockup-byline a').each(function(i, elem) {
                var author = $(this).text();
                authors.push({"author": author});
            })

            $('.yt-lockup-title a').each(function(i, elem) {
                var title = $(this).attr('title');
                if(title.length > 37) {
                    title = title.substring(0,37)+"...";
                }
                titles.push({"title": title});
            })

            $('.yt-lockup-meta li').each(function(i, elem) {
                var num_viewer = $(this).text();
                num_viewers.push({"viewers": num_viewer});
            })

            if(!mode) {
                $('.expanded-shelf-content-item img').each(function(i, elem) {
                    var link = $(this).attr('data-thumb');
                    if(link != undefined) {
                        links_img.push({"link": link});
                    }else if(link = $(this).attr('src')){
                        links_img.push({"link": link});
                    }
                })
            }else {
                $('.yt-lockup.yt-lockup-tile.yt-lockup-video.vve-check.clearfix img').each(function(i, elem) {
                    var link = $(this).attr('data-thumb');
                    if(link != undefined) {
                        links_img.push({"link": link});
                        
                    }else if(link = $(this).attr('src')){
                        links_img.push({"link": link});
                    }
                })
            }
            
            $('.yt-lockup-content a').each(function(i, elem) {
                var link = $(this).attr('href');
                if(link.indexOf('/watch?v=') != -1) {
                    links.push({"link": 'https://www.youtube.com'+link});
                }
            })

            // console.log(body);
            push_func(targetId, authors, titles, links, links_img);
        }
    });
}

function push_func(targetId, authors, titles, links, links_img) {
    
    var columns = [];
    for(i=0; i<5; i++) {
        columns.push({
            thumbnailImageUrl: links_img[i].link,
                title: titles[i].title,
                text: authors[i].author,
                actions: [{
                  type: 'uri',
                  label: '點我觀看',
                  uri: links[i].link
                }]
        })
        // console.log(links[i]);
    }
    
    var yt_trending = {
        type: 'template',
        altText: 'this is a carousel template',
        template: {
            type: 'carousel',
            columns: columns

        }
    }
    // console.log(titles[1].title);
    // console.log(yt_trending.template.columns);
    bot.push(targetId, yt_trending);
}