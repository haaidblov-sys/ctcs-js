function RunCTCS(script, canAllowPageEdit, canAllowJavaScriptFunc, othersAllowed, canAllowLibraries) {
  if (canAllowPageEdit === undefined) canAllowPageEdit = false;
  if (canAllowJavaScriptFunc === undefined) canAllowJavaScriptFunc = false;
  if (othersAllowed === undefined) othersAllowed = false;
  if (canAllowLibraries === undefined) canAllowLibraries = false;

  let Lines = script.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("//"));
  let Out = "";
  let Bugs = "";
  let Vars = {};
  let VER = "CTCS 0.6.9 libs-fixed";
  let ErrorCount = 0;
  let RES = 0;
  let AJSF = canAllowJavaScriptFunc;
  let OA = othersAllowed;
  let SysVars = {};
  let returnValue = null;
  let returnSignal = false;
  let now = new Date();

  SysVars.GetDate = now.toDateString();
  SysVars.GetDateAsString = now.toString();
  SysVars.MadeIn = "WebCode (ALIF Technology / Google Play)";
  SysVars.MadeInURL = "https://play.google.com/store/apps/details?id=com.qamar.ide.web";
  SysVars.GetTodayDate = now.getDate();
  SysVars.GetDay = now.getDay();
  SysVars.GetDayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][now.getDay()];
  SysVars.GetYear = now.getFullYear();
  SysVars.GetMonth = now.getMonth() + 1;
  SysVars.GetMonthName = ["January","February","March","April","May","June","July","August","September","October","November","December"][now.getMonth()];
  SysVars.GetHour = now.getHours();
  SysVars.GetMinute = now.getMinutes();
  SysVars.GetSecond = now.getSeconds();
  SysVars.HostName = window.location.hostname || "localhost";
  let ua = navigator.userAgent || "Unknown";
  SysVars.UserAgent = ua;
  SysVars.CurrentDevice = /Mobi|Android/i.test(ua) ? "Mobile" : /Tablet|iPad/i.test(ua) ? "Tablet" : "Desktop";
  SysVars.CurrentOS = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "Unknown";
  SysVars.CurrentBrowser = ua.includes("Firefox") ? "Firefox" : ua.includes("Edg") ? "Edge" : ua.includes("Chrome") ? "Chrome" : ua.includes("Safari") ? "Safari" : "Unknown";
  SysVars.ScreenWidth = screen.width;
  SysVars.ScreenHeight = screen.height;
  SysVars.IsTouch = ("ontouchstart" in window) ? "Yes" : "No";
  SysVars.PixelRatio = window.devicePixelRatio || 1;
  SysVars.CPUCores = navigator.hardwareConcurrency || "Unknown";
  SysVars.DeviceMemory = navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Unknown";
  SysVars.MaxTouchPoints = navigator.maxTouchPoints || 0;
  SysVars.WebsiteTitle = document.title || "Untitled";
  SysVars.WebsiteURL = window.location.href || "";
  SysVars.WebsiteHost = window.location.hostname || "Isn't hosted!";
  SysVars.WebsitePath = window.location.pathname || "";
  SysVars.WebsiteProtocol = window.location.protocol || "";
  SysVars.DocumentReferrer = document.referrer || "None";
  SysVars.DocumentEncoding = document.characterSet || "Unknown";
  SysVars.DocumentLastModified = document.lastModified || "Unknown";
  SysVars.DocumentReadyState = document.readyState || "Unknown";
  SysVars.DocumentCookiesEnabled = navigator.cookieEnabled ? "Yes" : "No";
  let tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  SysVars.CurrentCountry = tz.includes("/") ? tz.split("/")[1].replace(/_/g, " ") : "Unknown";
  SysVars.CurrentTimezone = tz;
  SysVars.IsOnline = navigator.onLine ? "Yes" : "No";
  SysVars.ConnectionType = (navigator.connection && navigator.connection.effectiveType) || "Unknown";
  SysVars.ConnectionDownlink = (navigator.connection && navigator.connection.downlink) || "Unknown";
  SysVars.ConnectionRTT = (navigator.connection && navigator.connection.rtt) || "Unknown";
  SysVars.ConnectionSaveData = (navigator.connection && navigator.connection.saveData) ? "Yes" : "No";
  SysVars.Language = navigator.language || "Unknown";
  SysVars.Languages = (navigator.languages && navigator.languages.join(", ")) || "Unknown";
  SysVars.PrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches ? "Yes" : "No";
  SysVars.PrefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "Yes" : "No";
  SysVars.CookieEnabled = navigator.cookieEnabled ? "Yes" : "No";
  SysVars.BatteryLevel = "loading...";
  SysVars.BatteryCharging = "loading...";
  SysVars.BatteryChargingTime = "loading...";
  SysVars.BatteryDischargingTime = "loading...";
  if (navigator.getBattery) {
    navigator.getBattery().then(function(b) {
      SysVars.BatteryLevel = Math.round(b.level * 100) + "%";
      SysVars.BatteryCharging = b.charging ? "Yes" : "No";
      SysVars.BatteryChargingTime = b.chargingTime === Infinity ? "N/A" : b.chargingTime + "s";
      SysVars.BatteryDischargingTime = b.dischargingTime === Infinity ? "N/A" : b.dischargingTime + "s";
    }).catch(function() {
      SysVars.BatteryLevel = "Not available";
      SysVars.BatteryCharging = "Not available";
      SysVars.BatteryChargingTime = "Not available";
      SysVars.BatteryDischargingTime = "Not available";
    });
  } else {
    SysVars.BatteryLevel = "Not supported";
    SysVars.BatteryCharging = "Not supported";
    SysVars.BatteryChargingTime = "Not supported";
    SysVars.BatteryDischargingTime = "Not supported";
  }
  SysVars.Version = VER;

  Vars["FetchStatus"] = "idle";
  Vars["FetchError"] = "";

  let Functions = {};
  let LoadedLibs = {};
  let LibStack = [];

  function outputTo(html, isBug) {
    let outEl = document.getElementById("out");
    if (outEl) {
      if (isBug) outEl.innerHTML += "<div style='color:#ff3366'>" + html + "</div>";
      else outEl.innerHTML += html;
    } else {
      let text = html.replace(/<br>/g, "\n");
      if (isBug) console.warn("[CTCS BUGS]", text);
      else console.log("[CTCS]", text);
    }
  }

  function bug(line, msg) {
    ErrorCount++;
    Bugs += "Line " + line + ": " + msg + "<br>";
  }

  function requirePageEdit(lineNum, command) {
    if (!canAllowPageEdit) { bug(lineNum, command + ": page editing is disabled"); return false; }
    return true;
  }

  function replaceVars(s) {
    s = s.replace(/!\{(\w+)\}!/g, (m, n) => {
      if (!Vars.hasOwnProperty(n)) return "!{" + n + "}!";
      return Vars[n];
    });
    s = s.replace(/\?\{(\w+)\}\?/g, (m, n) => {
      if (!SysVars.hasOwnProperty(n)) { bug(0, "Unknown system variable: ?{" + n + "}?"); return "?{" + n + "}?"; }
      return SysVars[n];
    });
    return s;
  }

  function strictNumber(value, lineNum, context) {
    if (value === undefined || value === null || value === "") { bug(lineNum, context + ": missing numeric value"); return null; }
    let n = Number(value);
    if (isNaN(n)) { bug(lineNum, context + ": '" + value + "' is not a number"); return null; }
    return n;
  }

  function compare(v1, op, v2) {
    let n1 = Number(v1), n2 = Number(v2);
    let useNumbers = !isNaN(n1) && !isNaN(n2);
    if (op === ">")  return useNumbers ? n1 > n2  : v1 > v2;
    if (op === "<")  return useNumbers ? n1 < n2  : v1 < v2;
    if (op === ">=") return useNumbers ? n1 >= n2 : v1 >= v2;
    if (op === "<=") return useNumbers ? n1 <= n2 : v1 <= v2;
    if (op === "==") return useNumbers ? n1 === n2 : v1 === v2;
    if (op === "!=") return useNumbers ? n1 !== n2 : v1 !== v2;
    return null;
  }

  function evalCondition(L, lineNum) {
    let v1M = L.match(/Value1:\s*"([^"]*)"/);
    let opM = L.match(/Op:\s*"([^"]+)"/);
    let v2M = L.match(/Value2:\s*"([^"]*)"/);
    if (!v1M) { bug(lineNum, "If: missing Value1"); return null; }
    if (!opM) { bug(lineNum, "If: missing Op"); return null; }
    if (!v2M) { bug(lineNum, "If: missing Value2"); return null; }
    let res = compare(replaceVars(v1M[1]), opM[1], replaceVars(v2M[1]));
    if (res === null) { bug(lineNum, "If: unknown Op '" + opM[1] + "'"); return null; }
    return res;
  }

  function registerFunction(L, body, lineNum) {
    let nameM = L.match(/Name:\s*"([^"]+)"/);
    if (!nameM) { bug(lineNum, "Define: missing Name"); return; }
    let name = nameM[1];
    if (Functions.hasOwnProperty(name)) { bug(lineNum, "Define: '" + name + "' already defined"); return; }
    let paramsM = L.match(/Params:\s*"([^"]*)"/);
    let params = [];
    if (paramsM && paramsM[1].trim()) {
      params = paramsM[1].split(",").map(function(p) { return p.trim(); }).filter(function(p) { return p; });
    }
    Functions[name] = { params: params, body: body };
  }

  function parseCommand(L, lineNum) {
    if (!L.startsWith("Type:")) { bug(lineNum, 'Line does not start with "Type:"'); return; }
    let typeM = L.match(/Type:\s*"([^"]+)"/);
    if (!typeM) { bug(lineNum, 'Missing or invalid Type'); return; }
    let type = typeM[1];
    if (!L.endsWith("endFunc!") && !L.includes("${")) { bug(lineNum, "Missing endFunc!"); return; }

    let args = {};
    let argRegex = /(\w+):\s*"([^"]*)"|(\w+):\s*(-?\d+\.?\d*)/g;
    let m;
    while ((m = argRegex.exec(L)) !== null) {
      if (m[1]) args[m[1]] = m[2];
      else if (m[3]) args[m[3]] = Number(m[4]);
    }

    switch (type) {
      case "Title":
        if (!requirePageEdit(lineNum, "Title")) return;
        if (args.Value1 === undefined) { bug(lineNum, "Title: missing Value1"); return; }
        document.title = replaceVars(args.Value1);
        break;

      case "PrintText": {
        if (args.Value1 === undefined) { bug(lineNum, "PrintText: missing Value1"); return; }
        const localVerbatim = [];
        let text = args.Value1.replace(/#L\/([\s\S]*?)\/#E\//g, (m, content) => {
          const idx = localVerbatim.length;
          localVerbatim.push(content);
          return "\u0000V" + idx + "\u0000";
        });
        text = replaceVars(text);
        text = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        text = text.replace(/\u0000V(\d+)\u0000/g, (m, i) => localVerbatim[Number(i)]);
        Out += text;
        break;
      }

      case "RunScript": {
        if (!args.ID) { bug(lineNum, "RunScript: missing ID"); return; }
        let el = document.getElementById(args.ID);
        if (!el) { bug(lineNum, "RunScript: '" + args.ID + "' not found"); return; }
        let code = el.textContent;
        let newLines = code.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("//"));
        runBlock(newLines, lineNum);
        break;
      }

      case "PrintNewLine":
        Out += "<br>";
        break;

      case "PrintLine":
        Out += "------------<br>";
        break;

      case "Length": {
        if (!args.Name) { bug(lineNum, "Length: missing Name"); return; }
        if (args.StoreIn === undefined) { bug(lineNum, "Length: missing StoreIn"); return; }
        Vars[args.StoreIn] = String(Vars[args.Name] || "").length;
        break;
      }

      case "Split": {
        if (!args.Text) { bug(lineNum, "Split: missing Text"); return; }
        if (!args.SplitText) { bug(lineNum, "Split: missing SplitText"); return; }
        if (args.StoreIn === undefined) { bug(lineNum, "Split: missing StoreIn"); return; }
        Vars[args.StoreIn] = replaceVars(args.Text).split(replaceVars(args.SplitText));
        break;
      }

      case "ConsoleLog":
        if (args.Value1 === undefined) { bug(lineNum, "ConsoleLog: missing Value1"); return; }
        console.log(replaceVars(args.Value1));
        break;

      case "GetBodyCSS": {
        if (!args.StoreIn) { bug(lineNum, "GetBodyCSS: missing StoreIn"); return; }
        Vars[args.StoreIn] = document.body.style.cssText;
        break;
      }

      case "GetInput": {
        if (!requirePageEdit(lineNum, "GetInput")) return;
        if (args.Target === undefined) { bug(lineNum, "GetInput: missing Target"); return; }
        if (args.Name === undefined) { bug(lineNum, "GetInput: missing Name"); return; }
        let el = document.querySelector(replaceVars(args.Target));
        if (!el) { bug(lineNum, "GetInput: no match"); return; }
        Vars[args.Name] = el.value;
        break;
      }

      case "RegexTest": {
        if (!args.Text) { bug(lineNum, "RegexTest: missing Text"); return; }
        if (!args.Pattern) { bug(lineNum, "RegexTest: missing Pattern"); return; }
        if (!args.StoreIn) { bug(lineNum, "RegexTest: missing StoreIn"); return; }
        try {
          let flags = args.Flags ? replaceVars(args.Flags) : "";
          let re = new RegExp(replaceVars(args.Pattern), flags);
          Vars[args.StoreIn] = re.test(replaceVars(args.Text)) ? "true" : "false";
        } catch (e) {
          bug(lineNum, "RegexTest: invalid pattern — " + e.message);
        }
        break;
      }

      case "SetTimeout": {
        if (!args.Call) { bug(lineNum, "SetTimeout: missing Call"); return; }
        if (args.Ms === undefined) { bug(lineNum, "SetTimeout: missing Ms"); return; }
        let fnName = args.Call;
        let ms = Number(replaceVars(args.Ms));
        setTimeout(function() {
          if (!Functions.hasOwnProperty(fnName)) return;
          let oldOut = Out, oldBugs = Bugs;
          Out = ""; Bugs = "";
          runBlock(Functions[fnName].body, lineNum);
          if (Out) outputTo(Out, false);
          if (Bugs) outputTo(Bugs, true);
          Out = oldOut; Bugs = oldBugs;
        }, ms);
        break;
      }

      case "RegexMatch": {
        if (!args.Text) { bug(lineNum, "RegexMatch: missing Text"); return; }
        if (!args.Pattern) { bug(lineNum, "RegexMatch: missing Pattern"); return; }
        if (!args.StoreIn) { bug(lineNum, "RegexMatch: missing StoreIn"); return; }
        try {
          let flags = args.Flags ? replaceVars(args.Flags) : "";
          let re = new RegExp(replaceVars(args.Pattern), flags);
          let matches = replaceVars(args.Text).match(re);
          Vars[args.StoreIn] = matches ? matches.join(", ") : "";
        } catch (e) {
          bug(lineNum, "RegexMatch: invalid pattern — " + e.message);
        }
        break;
      }

      case "RegexReplace": {
        if (!args.Text) { bug(lineNum, "RegexReplace: missing Text"); return; }
        if (!args.Pattern) { bug(lineNum, "RegexReplace: missing Pattern"); return; }
        if (!args.WithText) { bug(lineNum, "RegexReplace: missing WithText"); return; }
        if (!args.StoreIn) { bug(lineNum, "RegexReplace: missing StoreIn"); return; }
        try {
          let flags = args.Flags ? replaceVars(args.Flags) : "";
          let re = new RegExp(replaceVars(args.Pattern), flags);
          Vars[args.StoreIn] = replaceVars(args.Text).replace(re, replaceVars(args.WithText));
        } catch (e) {
          bug(lineNum, "RegexReplace: invalid pattern — " + e.message);
        }
        break;
      }

      case "SetInput": {
        if (!requirePageEdit(lineNum, "SetInput")) return;
        if (args.Target === undefined || args.Value === undefined) { bug(lineNum, "SetInput: missing args"); return; }
        let el = document.querySelector(replaceVars(args.Target));
        if (!el) { bug(lineNum, "SetInput: no match"); return; }
        el.value = replaceVars(args.Value);
        break;
      }

      case "SetTextareaText": {
        if (!requirePageEdit(lineNum, "SetTextareaText")) return;
        if (args.Target === undefined || args.Text === undefined) { bug(lineNum, "SetTextareaText: missing args"); return; }
        let el = document.querySelector(replaceVars(args.Target));
        if (!el) { bug(lineNum, "SetTextareaText: no match"); return; }
        el.value = replaceVars(args.Text);
        break;
      }

      case "GetTextareaText": {
        if (!requirePageEdit(lineNum, "GetTextareaText")) return;
        if (args.Target === undefined || args.StoreIn === undefined) { bug(lineNum, "GetTextareaText: missing args"); return; }
        let el = document.querySelector(replaceVars(args.Target));
        if (!el) { bug(lineNum, "GetTextareaText: no match"); return; }
        Vars[args.StoreIn] = el.value;
        break;
      }

      case "ClearTextarea": {
        if (!requirePageEdit(lineNum, "ClearTextarea")) return;
        if (args.Target === undefined) { bug(lineNum, "ClearTextarea: missing Target"); return; }
        let el = document.querySelector(replaceVars(args.Target));
        if (!el) { bug(lineNum, "ClearTextarea: no match"); return; }
        el.value = "";
        break;
      }

      case "UpperCase": {
        if (!args.Name) { bug(lineNum, "UpperCase: missing Name"); return; }
        Vars[args.Name] = String(Vars[args.Name] || "").toUpperCase();
        break;
      }

      case "LowerCase": {
        if (!args.Name) { bug(lineNum, "LowerCase: missing Name"); return; }
        Vars[args.Name] = String(Vars[args.Name] || "").toLowerCase();
        break;
      }

      case "JSjson": {
        if (args.JSON === undefined) { bug(lineNum, "JSjson: missing JSON"); return; }
        if (args.Key === undefined) { bug(lineNum, "JSjson: missing Key"); return; }
        if (!args.StoreIn) { bug(lineNum, "JSjson: missing StoreIn"); return; }
        let raw = replaceVars(args.JSON);
        let keyPath = replaceVars(args.Key);
        let obj;
        try {
          obj = JSON.parse(raw);
        } catch (e) {
          bug(lineNum, "JSjson: invalid JSON — " + e.message);
          return;
        }
        let parts = keyPath.split(".");
        let val = obj;
        for (let i = 0; i < parts.length; i++) {
          if (val === null || val === undefined) break;
          let part = parts[i];
          if (/^\d+$/.test(part)) {
            let idx = Number(part);
            if (!Array.isArray(val) || idx >= val.length) { val = undefined; break; }
            val = val[idx];
          } else {
            if (typeof val !== "object" || !val.hasOwnProperty(part)) { val = undefined; break; }
            val = val[part];
          }
        }
        if (val === undefined) {
          Vars[args.StoreIn] = "";
        } else if (typeof val === "object") {
          Vars[args.StoreIn] = JSON.stringify(val);
        } else {
          Vars[args.StoreIn] = String(val);
        }
        break;
      }

      case "CharAt": {
        if (!args.Name || args.Index === undefined) { bug(lineNum, "CharAt: missing args"); return; }
        if (!args.StoreIn) { bug(lineNum, "CharAt: missing StoreIn"); return; }
        Vars[args.StoreIn] = String(Vars[args.Name] || "").charAt(Number(args.Index));
        break;
      }

      case "Return": {
        if (args.Value === undefined) { bug(lineNum, "Return: missing Value"); return; }
        returnValue = replaceVars(args.Value);
        returnSignal = true;
        break;
      }

      case "IndexOf": {
        if (!args.Name || !args.Search) { bug(lineNum, "IndexOf: missing args"); return; }
        if (!args.StoreIn) { bug(lineNum, "IndexOf: missing StoreIn"); return; }
        Vars[args.StoreIn] = String(Vars[args.Name] || "").indexOf(replaceVars(args.Search));
        break;
      }

      case "Includes": {
        if (!args.Name || !args.Search) { bug(lineNum, "Includes: missing args"); return; }
        if (!args.StoreIn) { bug(lineNum, "Includes: missing StoreIn"); return; }
        Vars[args.StoreIn] = String(Vars[args.Name] || "").includes(replaceVars(args.Search)) ? "true" : "false";
        break;
      }

      case "Repeat": {
        if (!args.Name || args.Count === undefined) { bug(lineNum, "Repeat: missing args"); return; }
        Vars[args.Name] = String(Vars[args.Name] || "").repeat(Number(args.Count));
        break;
      }

      case "PadStart": {
        if (!args.Name || args.Length === undefined) { bug(lineNum, "PadStart: missing args"); return; }
        let padChar = args.With ? replaceVars(args.With) : " ";
        Vars[args.Name] = String(Vars[args.Name] || "").padStart(Number(args.Length), padChar);
        break;
      }

      case "FocusTextarea": {
        if (!requirePageEdit(lineNum, "FocusTextarea")) return;
        if (args.Target === undefined) { bug(lineNum, "FocusTextarea: missing Target"); return; }
        let el = document.querySelector(replaceVars(args.Target));
        if (!el) { bug(lineNum, "FocusTextarea: no match"); return; }
        el.focus();
        break;
      }

      case "ScrollTo": {
        if (!requirePageEdit(lineNum, "ScrollTo")) return;
        if (args.Target === undefined || args.Y === undefined) { bug(lineNum, "ScrollTo: missing args"); return; }
        let el = document.querySelector(replaceVars(args.Target));
        if (!el) { bug(lineNum, "ScrollTo: no match"); return; }
        el.scrollTop = Number(replaceVars(args.Y));
        break;
      }

      case "ScrollTop": {
        if (!requirePageEdit(lineNum, "ScrollTop")) return;
        if (args.Target === undefined) { bug(lineNum, "ScrollTop: missing Target"); return; }
        let el = document.querySelector(replaceVars(args.Target));
        if (!el) { bug(lineNum, "ScrollTop: no match"); return; }
        el.scrollTop = 0;
        break;
      }

      case "ScrollBottom": {
        if (!requirePageEdit(lineNum, "ScrollBottom")) return;
        if (args.Target === undefined) { bug(lineNum, "ScrollBottom: missing Target"); return; }
        let el = document.querySelector(replaceVars(args.Target));
        if (!el) { bug(lineNum, "ScrollBottom: no match"); return; }
        el.scrollTop = el.scrollHeight;
        break;
      }

      case "HideElement": {
        if (!requirePageEdit(lineNum, "HideElement")) return;
        if (args.Target === undefined) { bug(lineNum, "HideElement: missing Target"); return; }
        let els = document.querySelectorAll(replaceVars(args.Target));
        if (els.length === 0) { bug(lineNum, "HideElement: no match"); return; }
        els.forEach(function(el) { el.style.display = "none"; });
        break;
      }

      case "LoopPrintText": {
        if (args.Text === undefined) { bug(lineNum, "LoopPrintText: missing Text"); return; }
        if (args.Times === undefined) { bug(lineNum, "LoopPrintText: missing Times"); return; }
        if (args.StoreIn === undefined) { bug(lineNum, "LoopPrintText: missing StoreIn"); return; }
        let result = "";
        for (let i = 0; i < Number(args.Times); i++) {
          result += replaceVars(args.Text).replace(/!\{LOOP_AT\}!/g, i);
        }
        Vars[args.StoreIn] = result;
        break;
      }

      case "ShowElement": {
        if (!requirePageEdit(lineNum, "ShowElement")) return;
        if (args.Target === undefined) { bug(lineNum, "ShowElement: missing Target"); return; }
        let els = document.querySelectorAll(replaceVars(args.Target));
        if (els.length === 0) { bug(lineNum, "ShowElement: no match"); return; }
        let display = args.Display ? replaceVars(args.Display) : "block";
        els.forEach(function(el) { el.style.display = display; });
        break;
      }

      case "DisableButton": {
        if (!requirePageEdit(lineNum, "DisableButton")) return;
        if (args.Target === undefined) { bug(lineNum, "DisableButton: missing Target"); return; }
        let els = document.querySelectorAll(replaceVars(args.Target));
        if (els.length === 0) { bug(lineNum, "DisableButton: no match"); return; }
        els.forEach(function(el) { el.disabled = true; });
        break;
      }

      case "EnableButton": {
        if (!requirePageEdit(lineNum, "EnableButton")) return;
        if (args.Target === undefined) { bug(lineNum, "EnableButton: missing Target"); return; }
        let els = document.querySelectorAll(replaceVars(args.Target));
        if (els.length === 0) { bug(lineNum, "EnableButton: no match"); return; }
        els.forEach(function(el) { el.disabled = false; });
        break;
      }

      case "GetElementText": {
        if (args.Target === undefined || args.StoreIn === undefined) { bug(lineNum, "GetElementText: missing args"); return; }
        let el = document.querySelector(replaceVars(args.Target));
        if (!el) { bug(lineNum, "GetElementText: no match"); return; }
        Vars[args.StoreIn] = el.textContent;
        break;
      }

      case "ElementExists": {
        if (args.Target === undefined || args.StoreIn === undefined) { bug(lineNum, "ElementExists: missing args"); return; }
        let els = document.querySelectorAll(replaceVars(args.Target));
        Vars[args.StoreIn] = els.length > 0 ? "true" : "false";
        break;
      }

      case "CountElements": {
        if (args.Target === undefined || args.StoreIn === undefined) { bug(lineNum, "CountElements: missing args"); return; }
        let els = document.querySelectorAll(replaceVars(args.Target));
        Vars[args.StoreIn] = els.length;
        break;
      }

      case "SetElementHeight": {
        if (!requirePageEdit(lineNum, "SetElementHeight")) return;
        if (args.Target === undefined || args.Value === undefined) { bug(lineNum, "SetElementHeight: missing args"); return; }
        let el = document.querySelector(replaceVars(args.Target));
        if (!el) { bug(lineNum, "SetElementHeight: no match"); return; }
        el.style.height = replaceVars(args.Value);
        break;
      }

      case "SetElementWidth": {
        if (!requirePageEdit(lineNum, "SetElementWidth")) return;
        if (args.Target === undefined || args.Value === undefined) { bug(lineNum, "SetElementWidth: missing args"); return; }
        let el = document.querySelector(replaceVars(args.Target));
        if (!el) { bug(lineNum, "SetElementWidth: no match"); return; }
        el.style.width = replaceVars(args.Value);
        break;
      }

      case "GetTime":
        if (!args.Name) { bug(lineNum, "GetTime: missing Name"); return; }
        Vars[args.Name] = Date.now();
        break;

      case "DelayedCSS": {
        if (!requirePageEdit(lineNum, "DelayedCSS")) return;
        if (args.Target === undefined || args.CSS === undefined || args.Ms === undefined) { bug(lineNum, "DelayedCSS: missing args"); return; }
        let sel = replaceVars(args.Target);
        let css = replaceVars(args.CSS);
        let ms = Number(replaceVars(args.Ms));
        setTimeout(function() {
          let el = document.querySelector(sel);
          if (el) {
            let rules = css.split(";");
            for (let i = 0; i < rules.length; i++) {
              let rule = rules[i].trim();
              if (!rule) continue;
              let colon = rule.indexOf(":");
              if (colon === -1) continue;
              let prop = rule.substring(0, colon).trim();
              let val = rule.substring(colon + 1).trim();
              prop = prop.replace(/-([a-z])/g, function(m, c) { return c.toUpperCase(); });
              if (prop && val) el.style[prop] = val;
            }
          }
        }, ms);
        break;
      }

      case "DelayedHTML": {
        if (!requirePageEdit(lineNum, "DelayedHTML")) return;
        if (args.Target === undefined || args.HTML === undefined || args.Ms === undefined) { bug(lineNum, "DelayedHTML: missing args"); return; }
        let sel = replaceVars(args.Target);
        let html = replaceVars(args.HTML);
        let ms = Number(replaceVars(args.Ms));
        setTimeout(function() {
          let el = document.querySelector(sel);
          if (el) el.innerHTML = html;
        }, ms);
        break;
      }

      case "MathAdd":
        if (args.Value1 === undefined || args.Value2 === undefined || args.Name === undefined || args.Mode === undefined) { bug(lineNum, "MathAdd: missing args"); return; }
        RES = Number(replaceVars(args.Value1)) + Number(replaceVars(args.Value2));
        if (isNaN(RES)) { bug(lineNum, "MathAdd: bad numbers"); return; }
        if (args.Mode === "CreateVar") {
          if (Vars.hasOwnProperty(args.Name)) { bug(lineNum, "MathAdd: exists"); return; }
          Vars[args.Name] = RES;
        } else if (args.Mode === "SetVar") {
          if (!Vars.hasOwnProperty(args.Name)) { bug(lineNum, "MathAdd: not found"); return; }
          Vars[args.Name] = RES;
        } else { bug(lineNum, "MathAdd: unknown Mode"); return; }
        break;

      case "MathSub": {
        if (args.Value1 === undefined || args.Value2 === undefined || args.Name === undefined) { bug(lineNum, "MathSub: missing args"); return; }
        let a = Number(replaceVars(args.Value1)), b = Number(replaceVars(args.Value2));
        if (isNaN(a) || isNaN(b)) { bug(lineNum, "MathSub: bad numbers"); return; }
        Vars[args.Name] = a - b;
        break;
      }

      case "MathMul": {
        if (args.Value1 === undefined || args.Value2 === undefined || args.Name === undefined) { bug(lineNum, "MathMul: missing args"); return; }
        let a = Number(replaceVars(args.Value1)), b = Number(replaceVars(args.Value2));
        if (isNaN(a) || isNaN(b)) { bug(lineNum, "MathMul: bad numbers"); return; }
        Vars[args.Name] = a * b;
        break;
      }

      case "MathDiv": {
        if (args.Value1 === undefined || args.Value2 === undefined || args.Name === undefined) { bug(lineNum, "MathDiv: missing args"); return; }
        let a = Number(replaceVars(args.Value1)), b = Number(replaceVars(args.Value2));
        if (isNaN(a) || isNaN(b)) { bug(lineNum, "MathDiv: bad numbers"); return; }
        if (b === 0) { bug(lineNum, "MathDiv: divide by 0"); return; }
        Vars[args.Name] = a / b;
        break;
      }

      case "RandomInt": {
        if (!args.Name) { bug(lineNum, "RandomInt: missing Name"); return; }
        let min = strictNumber(args.Min, lineNum, "RandomInt.Min");
        let max = strictNumber(args.Max, lineNum, "RandomInt.Max");
        if (