'use strict';

var Crawler = require("js-crawler");
var request = require('request');
var cheerio = require('cheerio');
/*
 * GET /crawl route.
 */
var crawler = new Crawler().configure({ maxRequestsPerSecond: 2 });
var arrUrl = [];
var arrReport = [];
arrReport["images"] = [];
arrReport["pages"] = [];
arrReport["social"] = [];

function getCrawlPage(req, res) {
    var strUrl = void 0;
    if (req && req.query && !req.query.url) {
        var response = { message: "Query string url is required" };
        res.status(200).json(response);
        return;
    } else {
        strUrl = req.query.url;
        //Validation code here
    }
    crawler.crawl({
        url: strUrl,
        success: function success(page) {
            var $ = cheerio.load(page.content);

            $("a").each(function (item, a) {
                var url = a.attribs.href;
                if (url != undefined) {
                    if (url && url.includes("facebook") || url.includes("twitter") || url.includes("linkedin")) {
                        arrReport["social"].push(url);
                    } else {
                        arrReport["pages"].push(url);
                    }
                }
                //console.log("Links = " + url);
                //c.queue(url);
            });
            $("i").each(function (item, a) {
                //console.log("inside", $(this));
                var url = a.parent.attribs.href;
                if (url != undefined) {
                    arrReport["images"].push(url);
                    //console.log(" Img =  " + url);
                    //c.queue(url);
                }
            });
            arrUrl.push(page.url);
        },
        failure: function failure(page) {},
        finished: function finished(crawledUrls) {
            //console.log(arrUrl);
            var response = { message: "Crawl done.", "allUrls": getUnique(arrUrl), "uniquePags": getUnique(arrReport.pages), "image": getUnique(arrReport.images),
                "social": getUnique(arrReport.social) };
            //console.log("Result " + response);
            res.send(response);
        }
    });
}

function getUnique(arrInput) {
    return arrInput.filter(function (v, i, a) {
        return a.indexOf(v) === i;
    });
}
//export all the functions
module.exports = { getCrawlPage: getCrawlPage };
//# sourceMappingURL=CrawlController.js.map