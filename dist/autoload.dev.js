"use strict";

//live2d-widget v0.0.3
// 注意：live2d_path 参数应使用绝对路径
var live2d_path = "https://fastly.jsdelivr.net/gh/sarakale/live2d-widget@latest/"; // 封装异步加载资源的方法

function loadExternalResource(url, type) {
  return new Promise(function (resolve, reject) {
    var tag;

    if (type === "css") {
      tag = document.createElement("link");
      tag.rel = "stylesheet";
      tag.href = url;
    } else if (type === "js") {
      tag = document.createElement("script");
      tag.src = url;
    }

    if (tag) {
      tag.onload = function () {
        return resolve(url);
      };

      tag.onerror = function () {
        return reject(url);
      };

      document.head.appendChild(tag);
    }
  });
} // 加载 waifu.css live2d.min.js waifu-tips.js


if (screen.width >= 768) {
  Promise.all([loadExternalResource(live2d_path + "waifu.css", "css"), loadExternalResource(live2d_path + "live2d.min.js", "js"), loadExternalResource(live2d_path + "waifu-tips.js", "js")]).then(function () {
    initWidget({
      waifuPath: live2d_path + "waifu-tips.json",
      apiPath: "https://live2d.fghrsh.net/api/" //cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/"

    });
  });
} // initWidget 第一个参数为 waifu-tips.json 的路径，第二个参数为 API 地址
// API 后端可自行搭建，参考 https://github.com/fghrsh/live2d_api
// 初始化看板娘会自动加载指定目录下的 waifu-tips.json


console.log("\n  \u304F__,.\u30D8\u30FD.        /  ,\u30FC\uFF64 \u3009\n           \uFF3C ', !-\u2500\u2010-i  /  /\xB4\n           \uFF0F\uFF40\uFF70'       L/\uFF0F\uFF40\u30FD\uFF64\n         /   \uFF0F,   /|   ,   ,       ',\n       \uFF72   / /-\u2010/  \uFF49  L_ \uFF8A \u30FD!   i\n        \uFF9A \uFF8D 7\uFF72\uFF40\uFF84   \uFF9A'\uFF67-\uFF84\uFF64!\u30CF|   |\n          !,/7 '0'     \xB40i\u30BD|    |\n          |.\u4ECE\"    _     ,,,, / |./    |\n          \uFF9A'| i\uFF1E.\uFF64,,__  _,.\u30A4 /   .i   |\n            \uFF9A'| | / k_\uFF17_/\uFF9A'\u30FD,  \uFF8A.  |\n              | |/i \u3008|/   i  ,.\uFF8D |  i  |\n             .|/ /  \uFF49\uFF1A    \uFF8D!    \uFF3C  |\n              k\u30FD>\uFF64\uFF8A    _,.\uFF8D\uFF64    /\uFF64!\n              !'\u3008//\uFF40\uFF34\xB4', \uFF3C \uFF40'7'\uFF70r'\n              \uFF9A'\u30FDL__|___i,___,\u30F3\uFF9A|\u30CE\n                  \uFF84-,/  |___./\n                  '\uFF70'    !_,.:\n");