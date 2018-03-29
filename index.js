var Nightmare = require("nightmare");

Nightmare.action('injectHTML', function (selector, html, done) {
    console.log('B->', html)
    debugger;
    this.evaluate_now(function (selector, html) {

        function applyHTML() {
            "use strict";
            for (var i = 0; i < this.length; i++)
                this[i].innerHTML = html;
        }

        try {
            if (typeof selector == "string")
                return applyHTML.call(document.getElementsByTagName(selector));

            if (selector.tag)
                return applyHTML.call(document.getElementsByTagName(selector.tag));

            if (selector.id)
                return document.getElementById(selector.id).innerHTML = html;

            if (selector.className)
                return applyHTML.call(document.getElementsByClassName(selector.className));

            if (selector.jQuery)
                return applyHTML.call(($ || jQuery || window.jQuery)(selector.jQuery));

        } catch (ex) {
            document.getElementsByTagName("html")[0].innerHTML = ex.stack;
        }
    }, done, selector, html)
});

/**
 * Navigates to a url and takes a screenshot
 * @param {String} url
 * @param {String} path - screenshot path
 * @param {Object} options
 * @param {Number} options.width
 * @param {Number} options.height
 * @param {String} options.waitAfterSelector
 * @param {Number} options.waitMilliseconds
 * @param {Object} options.clip
 * @param {Number} options.clip.x
 * @param {Number} options.clip.y
 * @param {Number} options.clip.width
 * @param {Number} options.clip.height
 *
 * @param {function()} callback
 */
module.exports.fromURL = function (url, path, options, callback) {
    "use strict";

    console.log('A->', url)
    if(typeof options == "function") {
        callback = options;
        options = null;
    }
    options = options || {};
    callback = callback || function(){};

    var n = Nightmare({
        show: true,
        width: options.width || 1280,
        height: options.height || 720
    });

    n
        .goto(url)
        .wait(options.waitAfterSelector || "html")
        .wait(options.waitMilliseconds || 1000)
        .screenshot(path, options.clip)
        .then(function () {
            callback();
        });
    n.end();
};

/**
 * Navigates to a url and takes a screenshot
 * @param {String} html
 * @param {String} path - screenshot path
 * @param {Object} options
 * @param {Number} options.width
 * @param {Number} options.height
 * @param {String} options.waitAfterSelector
 * @param {Number} options.waitMilliseconds
 * @param {Object} options.clip
 * @param {Number} options.clip.x
 * @param {Number} options.clip.y
 * @param {Number} options.clip.width
 * @param {Number} options.clip.height
 * @param {Object} options.inject
 * @param {Number} options.inject.url
 * @param {String|{tag: String}|{id: String}|{className: String}|{jQuery: String}} options.inject.selector
 *
 * @param {function()} callback
 */
module.exports.fromHTML = function (html, path, options, callback) {
    "use strict";
    var identifier = Math.random();
    if(typeof options == "function") {
        callback = options;
        options = null;
    }

    options = options || {};
    callback = callback || function(){};
    options.inject = options.inject || {};

    var n = Nightmare({
        show: true,
        width: options.width || 1280,
        height: options.height || 720
    });

    n
        .goto(options.inject.url || "about:blank")
        .wait(options.waitAfterSelector || "html")
        .wait(options.waitMilliseconds || 1000)
        .injectHTML(options.inject.selector || "html", html)
        .wait(options.waitAfterSelector || "html")
        .wait(options.waitMilliseconds || 1000)
        .screenshot(path, options.clip)
        .then(function () {
            callback();
        });
    n.end();

};
