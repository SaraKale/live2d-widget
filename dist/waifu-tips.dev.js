"use strict";

/*
 * live2d-widget v0.0.3
 * https://github.com/sarakale/live2d-widget
 */
function loadWidget(config) {
  var waifuPath = config.waifuPath,
      apiPath = config.apiPath,
      cdnPath = config.cdnPath;
  var useCDN = false,
      modelList;

  if (typeof cdnPath === "string") {
    useCDN = true;
    if (!cdnPath.endsWith("/")) cdnPath += "/";
  }

  if (!apiPath.endsWith("/")) apiPath += "/";
  localStorage.removeItem("waifu-display");
  sessionStorage.removeItem("waifu-text");
  document.body.insertAdjacentHTML("beforeend", "<div id=\"waifu\">\n\t\t\t<div id=\"waifu-tips\"></div>\n\t\t\t<canvas id=\"live2d\" width=\"300\" height=\"300\"></canvas>\n\t\t\t<div id=\"waifu-tool\">\n\t\t\t\t<span class=\"fa fa-lg fa-comment\"></span>\n\t\t\t\t<span class=\"nexmoefont icon-bilibili\"></span>\n\t\t\t\t<span class=\"fa fa-lg fa-user-circle\"></span>\n\t\t\t\t<span class=\"fa fa-lg fa-street-view\"></span>\n\t\t\t\t<span class=\"fa fa-lg fa-camera-retro\"></span>\n\t\t\t\t<span class=\"fa fa-lg fa-info-circle\"></span>\n\t\t\t\t<span class=\"fa fa-lg fa-times\"></span>\n\t\t\t</div>\n\t\t</div>"); // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element

  setTimeout(function () {
    document.getElementById("waifu").style.bottom = 0;
  }, 0);

  function randomSelection(obj) {
    return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
  } // 检测用户活动状态，并在空闲时显示消息


  var userAction = false,
      userActionTimer,
      messageTimer,
      messageArray = ["好久不见，日子过得好快呢……", "如果遇到问题了就看我右边按钮吧~", "慢慢欣赏主人的风景，一边喝茶吧~", "静心听歌，聆听最真实的自己。", "记得把我入 Adblock 白名单哦！"];
  window.addEventListener("mousemove", function () {
    return userAction = true;
  });
  window.addEventListener("keydown", function () {
    return userAction = true;
  });
  setInterval(function () {
    if (userAction) {
      userAction = false;
      clearInterval(userActionTimer);
      userActionTimer = null;
    } else if (!userActionTimer) {
      userActionTimer = setInterval(function () {
        showMessage(randomSelection(messageArray), 6000, 9);
      }, 20000);
    }
  }, 1000);

  (function registerEventListener() {
    document.querySelector("#waifu-tool .fa-comment").addEventListener("click", showHitokoto);
    document.querySelector("#waifu-tool .icon-bilibili").addEventListener("click", function () {
      open("https://space.bilibili.com/4197121"); //修改为你的B站地址
    });
    /**
    document.querySelector("#waifu-tool .fa-paper-plane").addEventListener("click", () => {
    	if (window.Asteroids) {
    		if (!window.ASTEROIDSPLAYERS) window.ASTEROIDSPLAYERS = [];
    		window.ASTEROIDSPLAYERS.push(new Asteroids());
    	} else {
    		let script = document.createElement("script");
    		script.src = "https://fastly.jsdelivr.net/gh/GalaxyMimi/CDN/asteroids.js";
    		document.head.appendChild(script);
    	}
    });
    **/

    document.querySelector("#waifu-tool .fa-user-circle").addEventListener("click", loadOtherModel);
    document.querySelector("#waifu-tool .fa-street-view").addEventListener("click", loadRandModel);
    document.querySelector("#waifu-tool .fa-camera-retro").addEventListener("click", function () {
      showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
      Live2D.captureName = "photo.png";
      Live2D.captureFrame = true;
    });
    document.querySelector("#waifu-tool .fa-info-circle").addEventListener("click", function () {
      open("https://github.com/sarakale/live2d-widget");
    });
    document.querySelector("#waifu-tool .fa-times").addEventListener("click", function () {
      localStorage.setItem("waifu-display", Date.now());
      showMessage("愿你有一天能与重要的人重逢。", 2000, 11);
      document.getElementById("waifu").style.bottom = "-500px";
      setTimeout(function () {
        document.getElementById("waifu").style.display = "none";
        document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
      }, 3000);
    });

    var devtools = function devtools() {};

    console.log("%c", devtools);

    devtools.toString = function () {
      showMessage("哈哈，你打开了控制台，是想要看看我的小秘密吗？", 6000, 9);
    };

    window.addEventListener("copy", function () {
      showMessage("你都复制了些什么呀，转载要记得加上出处哦！", 6000, 9);
    });
    window.addEventListener("visibilitychange", function () {
      if (!document.hidden) showMessage("哇，你终于回来了～", 6000, 9);
    });
  })();

  (function welcomeMessage() {
    var text;

    if (location.pathname === "/") {
      // 如果是主页
      var now = new Date().getHours();
      if (now > 5 && now <= 7) text = "早上好！一日之计在于晨，美好的一天就要开始了。";else if (now > 7 && now <= 11) text = "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！";else if (now > 11 && now <= 13) text = "中午了，工作了一个上午，现在是午餐时间！";else if (now > 13 && now <= 17) text = "午后很容易犯困呢，今天的运动目标完成了吗？";else if (now > 17 && now <= 19) text = "傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～";else if (now > 19 && now <= 21) text = "晚上好，今天过得怎么样？";else if (now > 21 && now <= 23) text = ["已经这么晚了呀，早点休息吧，晚安～", "深夜时要爱护眼睛呀！"];else text = "你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？";
    } else if (document.referrer !== "") {
      var referrer = new URL(document.referrer),
          domain = referrer.hostname.split(".")[1];
      if (location.hostname === referrer.hostname) text = "\u6B22\u8FCE\u6765\u5230<span>\u300C".concat(document.title.split(" - ")[0], "\u300D</span>");else if (domain === "baidu") text = "Hello\uFF01\u6765\u81EA \u767E\u5EA6\u641C\u7D22 \u7684\u670B\u53CB<br>\u4F60\u662F\u641C\u7D22 <span>".concat(referrer.search.split("&wd=")[1].split("&")[0], "</span> \u627E\u5230\u7684\u6211\u5417\uFF1F");else if (domain === "so") text = "Hello\uFF01\u6765\u81EA 360\u641C\u7D22 \u7684\u670B\u53CB<br>\u4F60\u662F\u641C\u7D22 <span>".concat(referrer.search.split("&q=")[1].split("&")[0], "</span> \u627E\u5230\u7684\u6211\u5417\uFF1F");else if (domain === "google") text = "Hello\uFF01\u6765\u81EA \u8C37\u6B4C\u641C\u7D22 \u7684\u670B\u53CB<br>\u6B22\u8FCE\u9605\u8BFB<span>\u300C".concat(document.title.split(" - ")[0], "\u300D</span>");else text = "Hello\uFF01\u6765\u81EA <span>".concat(referrer.hostname, "</span> \u7684\u670B\u53CB");
    } else {
      text = "\u6B22\u8FCE\u6765\u5230<span>\u300C".concat(document.title.split(" - ")[0], "\u300D</span>");
    }

    showMessage(text, 7000, 8);
  })();

  function showHitokoto() {
    // 增加 hitokoto.cn 的 API
    fetch("https://v1.hitokoto.cn").then(function (response) {
      return response.json();
    }).then(function (result) {
      var text = "\u8FD9\u53E5\u4E00\u8A00\u6765\u81EA <span>\u300C".concat(result.from, "\u300D</span>\uFF0C\u662F <span>").concat(result.creator, "</span> \u5728 hitokoto.cn \u6295\u7A3F\u7684\u3002");
      showMessage(result.hitokoto, 6000, 9);
      setTimeout(function () {
        showMessage(text, 4000, 9);
      }, 6000);
    });
  }

  function showMessage(text, timeout, priority) {
    if (!text || sessionStorage.getItem("waifu-text") && sessionStorage.getItem("waifu-text") > priority) return;

    if (messageTimer) {
      clearTimeout(messageTimer);
      messageTimer = null;
    }

    text = randomSelection(text);
    sessionStorage.setItem("waifu-text", priority);
    var tips = document.getElementById("waifu-tips");
    tips.innerHTML = text;
    tips.classList.add("waifu-tips-active");
    messageTimer = setTimeout(function () {
      sessionStorage.removeItem("waifu-text");
      tips.classList.remove("waifu-tips-active");
    }, timeout);
  }

  (function initModel() {
    var modelId = localStorage.getItem("modelId"),
        modelTexturesId = localStorage.getItem("modelTexturesId");

    if (modelId === null) {
      // 首次访问加载指定模型和指定材质，请打开浏览器按F12看控制台输出报告
      modelId = 1; // 模型 ID

      modelTexturesId = 0; // 材质 ID
    }

    loadModel(modelId, modelTexturesId);
    fetch(waifuPath).then(function (response) {
      return response.json();
    }).then(function (result) {
      result.mouseover.forEach(function (tips) {
        window.addEventListener("mouseover", function (event) {
          if (!event.target.matches(tips.selector)) return;
          var text = randomSelection(tips.text);
          text = text.replace("{text}", event.target.innerText);
          showMessage(text, 4000, 8);
        });
      });
      result.click.forEach(function (tips) {
        window.addEventListener("click", function (event) {
          if (!event.target.matches(tips.selector)) return;
          var text = randomSelection(tips.text);
          text = text.replace("{text}", event.target.innerText);
          showMessage(text, 4000, 8);
        });
      });
      result.seasons.forEach(function (tips) {
        var now = new Date(),
            after = tips.date.split("-")[0],
            before = tips.date.split("-")[1] || after;

        if (after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0] && after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1]) {
          var text = randomSelection(tips.text);
          text = text.replace("{year}", now.getFullYear()); //showMessage(text, 7000, true);

          messageArray.push(text);
        }
      });
    });
  })();

  function loadModelList() {
    var response, result;
    return regeneratorRuntime.async(function loadModelList$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(fetch("".concat(cdnPath, "model_list.json")));

          case 2:
            response = _context.sent;
            _context.next = 5;
            return regeneratorRuntime.awrap(response.json());

          case 5:
            result = _context.sent;
            modelList = result;

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  }

  function loadModel(modelId, modelTexturesId, message) {
    var target;
    return regeneratorRuntime.async(function loadModel$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            localStorage.setItem("modelId", modelId);
            localStorage.setItem("modelTexturesId", modelTexturesId);
            showMessage(message, 4000, 10);

            if (!useCDN) {
              _context2.next = 11;
              break;
            }

            if (modelList) {
              _context2.next = 7;
              break;
            }

            _context2.next = 7;
            return regeneratorRuntime.awrap(loadModelList());

          case 7:
            target = randomSelection(modelList.models[modelId]);
            loadlive2d("live2d", "".concat(cdnPath, "model/").concat(target, "/index.json"));
            _context2.next = 13;
            break;

          case 11:
            loadlive2d("live2d", "".concat(apiPath, "get/?id=").concat(modelId, "-").concat(modelTexturesId));
            console.log("Live2D \u6A21\u578B ".concat(modelId, "-").concat(modelTexturesId, " \u52A0\u8F7D\u5B8C\u6210"));

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    });
  }

  function loadRandModel() {
    var modelId, modelTexturesId, target;
    return regeneratorRuntime.async(function loadRandModel$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            modelId = localStorage.getItem("modelId"), modelTexturesId = localStorage.getItem("modelTexturesId");

            if (!useCDN) {
              _context3.next = 10;
              break;
            }

            if (modelList) {
              _context3.next = 5;
              break;
            }

            _context3.next = 5;
            return regeneratorRuntime.awrap(loadModelList());

          case 5:
            target = randomSelection(modelList.models[modelId]);
            loadlive2d("live2d", "".concat(cdnPath, "model/").concat(target, "/index.json"));
            showMessage("我的新衣服好看吗？", 4000, 10);
            _context3.next = 11;
            break;

          case 10:
            // 可选 "rand"(随机), "switch"(顺序)
            fetch("".concat(apiPath, "rand_textures/?id=").concat(modelId, "-").concat(modelTexturesId)).then(function (response) {
              return response.json();
            }).then(function (result) {
              if (result.textures.id === 1 && (modelTexturesId === 1 || modelTexturesId === 0)) showMessage("我还没有其他衣服呢！", 4000, 10);else loadModel(modelId, result.textures.id, "我的新衣服好看吗？");
            });

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    });
  }

  function loadOtherModel() {
    var modelId, index;
    return regeneratorRuntime.async(function loadOtherModel$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            modelId = localStorage.getItem("modelId");

            if (!useCDN) {
              _context4.next = 9;
              break;
            }

            if (modelList) {
              _context4.next = 5;
              break;
            }

            _context4.next = 5;
            return regeneratorRuntime.awrap(loadModelList());

          case 5:
            index = ++modelId >= modelList.models.length ? 0 : modelId;
            loadModel(index, 0, modelList.messages[index]);
            _context4.next = 10;
            break;

          case 9:
            fetch("".concat(apiPath, "switch/?id=").concat(modelId)).then(function (response) {
              return response.json();
            }).then(function (result) {
              loadModel(result.model.id, 0, result.model.message);
            });

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    });
  }
}

function initWidget(config) {
  var apiPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "/";

  if (typeof config === "string") {
    config = {
      waifuPath: config,
      apiPath: apiPath
    };
  }

  document.body.insertAdjacentHTML("beforeend", "<div id=\"waifu-toggle\">\n\t\t\t<span>\u770B\u677F\u5A18</span>\n\t\t</div>");
  var toggle = document.getElementById("waifu-toggle");
  toggle.addEventListener("click", function () {
    toggle.classList.remove("waifu-toggle-active");

    if (toggle.getAttribute("first-time")) {
      loadWidget(config);
      toggle.removeAttribute("first-time");
    } else {
      localStorage.removeItem("waifu-display");
      document.getElementById("waifu").style.display = "";
      setTimeout(function () {
        document.getElementById("waifu").style.bottom = 0;
      }, 0);
    }
  });

  if (localStorage.getItem("waifu-display") && Date.now() - localStorage.getItem("waifu-display") <= 86400000) {
    toggle.setAttribute("first-time", true);
    setTimeout(function () {
      toggle.classList.add("waifu-toggle-active");
    }, 0);
  } else {
    loadWidget(config);
  }
}