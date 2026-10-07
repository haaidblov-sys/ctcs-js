

function RunCTCS074B(script, canAllowPageEdit, canAllowJavaScriptFunc, othersAllowed, canAllowLibraries) {
  if (canAllowPageEdit === undefined) canAllowPageEdit = false;
     if (canAllowJavaScriptFunc === undefined) canAllowJavaScriptFunc = false;
     if (othersAllowed === undefined) othersAllowed = false;
     if (canAllowLibraries === undefined) canAllowLibraries = false;
  let Lines = script.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("//"));
  let Out = "";
  let Bugs = "";
  let Vars = {};
  let VER = "CTCS 0.7.4B";
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
  SysVars.MeaningCTCS = "CodeText Complex Scripting"
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
  let replaced = replaceVars(String(value));
  let n = Number(replaced);
  if (isNaN(n)) { bug(lineNum, context + ": '" + replaced + "' is not a number"); return null; }
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
    .replace(/>/g, "&gt;" )
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
        if (min === null || max === null) return;
        if (min > max) { bug(lineNum, "RandomInt: Min > Max"); return; }
        Vars[args.Name] = Math.floor(Math.random() * (max - min + 1)) + min;
        break;
      }

      case "RandomLetters": {
        if (!args.Name) { bug(lineNum, "RandomLetters: missing Name"); return; }
        let count = strictNumber(args.Length, lineNum, "RandomLetters.Length");
        if (count === null) return;
        if (count < 1 || count > 100000) { bug(lineNum, "RandomLetters: bad Length"); return; }
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let result = "";
        for (let i = 0; i < count; i++) result += letters[Math.floor(Math.random() * letters.length)];
        Vars[args.Name] = result;
        break;
      }

     case "RandomCharacters": {
        if (!args.Name) { bug(lineNum, "RandomCharacters: missing Name"); return; }
        let count = strictNumber(args.Length, lineNum, "RandomCharacters.Length");
        if (count === null) return;
        if (count < 1 || count > 100000) { bug(lineNum, "RandomLetters: bad Length"); return; }
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890#=£*%&'-:+;(!)?/.,_~¥©<|$®•¢™√^℅π°[÷=]×{±¶}✓∆.>";
        let result = "";
        for (let i = 0; i < count; i++) result += letters[Math.floor(Math.random() * letters.length)];
        Vars[args.Name] = result;
        break;
      }

      case "RandomLettersChoose": {
        if (!args.Name || args.From === undefined) { bug(lineNum, "RandomLettersChoose: missing args"); return; }
        let len = strictNumber(args.Length, lineNum, "RandomLettersChoose.Length");
        if (len === null) return;
        let source = replaceVars(args.From);
        if (source.length === 0) { bug(lineNum, "RandomLettersChoose: empty"); return; }
        let sep = args.JoinWith !== undefined ? args.JoinWith : "";
        let result = "";
        for (let i = 0; i < len; i++) {
          result += source[Math.floor(Math.random() * source.length)];
          if (i < len - 1) result += sep;
        }
        Vars[args.Name] = result;
        break;
      }

     case "Split": {
  if (!args.Text) { bug(lineNum, "Split: missing Text"); return; }
  if (!args.SplitText) { bug(lineNum, "Split: missing SplitText"); return; }
  if (args.StoreIn === undefined) { bug(lineNum, "Split: missing StoreIn"); return; }
  Vars[args.StoreIn] = replaceVars(args.Text).split(replaceVars(args.SplitText));
  break;
}

case "trimEnd": {
  if (!args.Text) { bug(lineNum, "trimEnd: missing Text"); return; }
  if (args.StoreIn === undefined) { bug(lineNum, "trimEnd: missing StoreIn"); return; }
  Vars[args.StoreIn] = replaceVars(args.Text).trimEnd();
  break;
}
case "JSONStringify": {
  if (!args.From) { bug(lineNum, "JSONStringify: missing From"); return; }
  if (!args.StoreIn) { bug(lineNum, "JSONStringify: missing StoreIn"); return; }
  if (!Vars.hasOwnProperty(args.From)) { bug(lineNum, "JSONStringify: variable not found"); return; }
  try {
    Vars[args.StoreIn] = JSON.stringify(Vars[args.From]);
  } catch (e) {
    bug(lineNum, "JSONStringify: " + e.message);
  }
  break;
}
case "trim": {
  if (!args.Text) { bug(lineNum, "trim: missing Text"); return; }
  if (args.StoreIn === undefined) { bug(lineNum, "trim: missing StoreIn"); return; }
  Vars[args.StoreIn] = replaceVars(args.Text).trim();
  break;
}

case "trimStart": {
  if (!args.Text) { bug(lineNum, "trimStart: missing Text"); return; }
  if (args.StoreIn === undefined) { bug(lineNum, "trimStart: missing StoreIn"); return; }
  Vars[args.StoreIn] = replaceVars(args.Text).trimStart();
  break;
}

case "replaceAll": {
  if (!args.Text) { bug(lineNum, "replaceAll: missing Text"); return; }
  if (!args.WithText) { bug(lineNum, "replaceAll: missing WithText"); return; }
  if (!args.Replacing) { bug(lineNum, "replaceAll: missing Replacing"); return; }
  if (args.StoreIn === undefined) { bug(lineNum, "replaceAll: missing StoreIn"); return; }
  Vars[args.StoreIn] = replaceVars(args.Text).replaceAll(replaceVars(args.Replacing), replaceVars(args.WithText));
  break;
}

case "replace": {
  if (!args.Text) { bug(lineNum, "replace: missing Text"); return; }
  if (!args.WithText) { bug(lineNum, "replace: missing WithText"); return; }
  if (!args.Replacing) { bug(lineNum, "replace: missing Replacing"); return; }
  if (args.StoreIn === undefined) { bug(lineNum, "replace: missing StoreIn"); return; }
  Vars[args.StoreIn] = replaceVars(args.Text).replace(replaceVars(args.Replacing), replaceVars(args.WithText));
  break;
}

case "substring": {
  if (!args.Value1) { bug(lineNum, "substring: missing Value1"); return; }
  if (!args.Value2) { bug(lineNum, "substring: missing Value2"); return; }
  if (!args.FromText){ bug(lineNum, "substring: missing FromText"); return; }
  if (args.StoreIn === undefined) { bug(lineNum, "substring: missing StoreIn"); return; }
  Vars[args.StoreIn] = replaceVars(args.FromText).substring(replaceVars(args.Value1), replaceVars(args.Value2));
  break;
}

case "startsWith": {
  if (!args.Beginning) { bug(lineNum, "startsWith: missing Beginning"); return; }
  if (!args.FromText){ bug(lineNum, "startsWith: missing FromText"); return; }
  if (args.StoreIn === undefined) { bug(lineNum, "startsWith: missing StoreIn"); return; }
  Vars[args.StoreIn] = replaceVars(args.FromText).startsWith(args.Beginning) ? "true" : "false";
  break;
}
case "endsWith": {
  if (!args.Ending) { bug(lineNum, "endsWith: missing Ending"); return; }
  if (!args.FromText){ bug(lineNum, "endsWith: missing FromText"); return; }
  if (args.StoreIn === undefined) { bug(lineNum, "endsWith: missing StoreIn"); return; }
  Vars[args.StoreIn] = replaceVars(args.FromText).endsWith(args.Ending) ? "true" : "false";
  break;
}

      case "MakeArray":
        if (!args.Name) { bug(lineNum, "MakeArray: missing Name"); return; }
        if (Vars.hasOwnProperty(args.Name)) { bug(lineNum, "MakeArray: exists"); return; }
        Vars[args.Name] = [];
        break;

      case "Push":
        if (!args.Name || args.Value === undefined) { bug(lineNum, "Push: missing args"); return; }
        if (!Array.isArray(Vars[args.Name])) { bug(lineNum, "Push: not array"); return; }
        Vars[args.Name].push(replaceVars(String(args.Value)));
        break;
        
              case "PushHeavy": {
  if (!args.Name || args.Value1 === undefined || args.SplitingBy === undefined) {
    bug(lineNum, "PushHeavy: missing args");
    return;
  }
  if (!Array.isArray(Vars[args.Name])) {
    bug(lineNum, "PushHeavy: not array");
    return;
  }

  let text = replaceVars(String(args.Value1));
  let delims = replaceVars(String(args.SplitingBy));
  let BT = "";
  let outputarr = [];

  for (let i = 0; i < text.length; i++) {
    let ch = text.charAt(i);
    if (delims.indexOf(ch) !== -1) {
    
      outputarr.push(BT);
      BT = "";
    } else {
      BT += ch;
    }
  }
  outputarr.push(BT);  

  for (let i = 0; i < outputarr.length; i++) {
    Vars[args.Name].push(outputarr[i]);
  }
  break;
}
      
      case "Pop":
        if (!args.Name) { bug(lineNum, "Pop: missing Name"); return; }
        if (!Array.isArray(Vars[args.Name])) { bug(lineNum, "Pop: not array"); return; }
        if (Vars[args.Name].length === 0) { bug(lineNum, "Pop: empty"); return; }
        Vars[args.StoreIn || "Popped"] = Vars[args.Name].pop();
        break;

      case "Shift":
        if (!args.Name) { bug(lineNum, "Shift: missing Name"); return; }
        if (!Array.isArray(Vars[args.Name])) { bug(lineNum, "Shift: not array"); return; }
        if (Vars[args.Name].length === 0) { bug(lineNum, "Shift: empty"); return; }
        Vars[args.StoreIn || "Shifted"] = Vars[args.Name].shift();
        break;

      case "Unshift":
        if (!args.Name || args.Value === undefined) { bug(lineNum, "Unshift: missing args"); return; }
        if (!Array.isArray(Vars[args.Name])) { bug(lineNum, "Unshift: not array"); return; }
        Vars[args.Name].unshift(replaceVars(String(args.Value)));
        break;

      case "Splice": {
        if (!args.Name || args.Index === undefined || args.Count === undefined) { bug(lineNum, "Splice: missing args"); return; }
        if (!Array.isArray(Vars[args.Name])) { bug(lineNum, "Splice: not array"); return; }
        Vars[args.Name].splice(Number(replaceVars(args.Index)), Number(replaceVars(args.Count)));
        break;
      }

      case "Size":
        if (!args.Name) { bug(lineNum, "Size: missing Name"); return; }
        if (!Array.isArray(Vars[args.Name])) { bug(lineNum, "Size: not array"); return; }
        Vars[args.StoreIn || "Length"] = Vars[args.Name].length;
        break;

      case "GetIndex": {
        if (!args.Name || args.Index === undefined || args.StoreIn === undefined) { bug(lineNum, "GetIndex: missing args"); return; }
        if (!Array.isArray(Vars[args.Name])) { bug(lineNum, "GetIndex: not array"); return; }
        let idx = Number(replaceVars(args.Index));
        if (isNaN(idx) || idx < 0 || idx >= Vars[args.Name].length) { bug(lineNum, "GetIndex: out of range"); return; }
        Vars[args.StoreIn] = Vars[args.Name][idx];
        break;
      }

      case "SetIndex": {
        if (!args.Name || args.Index === undefined || args.Value === undefined) { bug(lineNum, "SetIndex: missing args"); return; }
        if (!Array.isArray(Vars[args.Name])) { bug(lineNum, "SetIndex: not array"); return; }
        let idx = Number(replaceVars(args.Index));
        if (isNaN(idx) || idx < 0 || idx >= Vars[args.Name].length) { bug(lineNum, "SetIndex: out of range"); return; }
        Vars[args.Name][idx] = replaceVars(String(args.Value));
        break;
      }

      case "ArrayToString":
        if (!args.Name || args.StoreIn === undefined) { bug(lineNum, "ArrayToString: missing args"); return; }
        if (!Array.isArray(Vars[args.Name])) { bug(lineNum, "ArrayToString: not array"); return; }
        Vars[args.StoreIn] = Vars[args.Name].join(args.Separator || ", ");
        break;

        case "MakeVar": {
  if (!args.Name || args.Value === undefined) { bug(lineNum, "MakeVar: missing args"); return; }
  if (Vars.hasOwnProperty(args.Name)) { bug(lineNum, "MakeVar: exists"); return; }
  let makeVal = replaceVars(args.Value);
  Vars[args.Name] = isNaN(Number(makeVal)) ? makeVal : Number(makeVal);
  break;
}

case "Set": {
  if (!args.Name || args.Value === undefined) { bug(lineNum, "Set: missing args"); return; }
  if (!Vars.hasOwnProperty(args.Name)) { bug(lineNum, "Set: not found"); return; }
  let setVal = replaceVars(args.Value);
  Vars[args.Name] = isNaN(Number(setVal)) ? setVal : Number(setVal);
  break;
}
        
case "Mov": {
  if (!args.Name || args.Value === undefined) { bug(lineNum, "Mov: missing args"); return; }
  let movVal = replaceVars(args.Value);
  Vars[args.Name] = isNaN(Number(movVal)) ? movVal : Number(movVal);
  break;
}
      case "Rename":
        if (!args.From || !args.To) { bug(lineNum, "Rename: missing args"); return; }
        if (!Vars.hasOwnProperty(args.From)) { bug(lineNum, "Rename: not found"); return; }
        if (Vars.hasOwnProperty(args.To)) { bug(lineNum, "Rename: target exists"); return; }
        Vars[args.To] = Vars[args.From];
        delete Vars[args.From];
        break;

      case "Copy":
        if (!args.From || !args.To) { bug(lineNum, "Copy: missing args"); return; }
        if (!Vars.hasOwnProperty(args.From)) { bug(lineNum, "Copy: not found"); return; }
        Vars[args.To] = Array.isArray(Vars[args.From]) ? [...Vars[args.From]] : Vars[args.From];
        break;

      case "Save":
        if (!args.Name || args.Value === undefined) { bug(lineNum, "Save: missing args"); return; }
        localStorage.setItem("CTCS_" + args.Name, replaceVars(args.Value));
        break;

      case "Load":
  if (!args.Name) { bug(lineNum, "Load: missing Name"); return; }
  let loadKey = args.StoreIn || "Loaded";
  Vars[loadKey] = localStorage.getItem("CTCS_" + args.Name) || "0";
  break;
  
 
      case "Wipe":
        localStorage.clear();
        Out += "All data wiped.<br>";
        break;

      case "JSONGet": {
        if (!args.From || !args.Key || !args.StoreIn) { bug(lineNum, "JSONGet: missing args"); return; }
        let fromVal = Vars[args.From];
        let keyPath = replaceVars(args.Key);
        try {
          let obj = typeof fromVal === "string" ? JSON.parse(fromVal) : fromVal;
          let parts = keyPath.split(".");
          let val = obj;
          for (let p = 0; p < parts.length; p++) {
            if (val === null || val === undefined) break;
            val = val[parts[p]];
          }
          if (val === undefined) { Vars[args.StoreIn] = ""; }
          else if (typeof val === "object") { Vars[args.StoreIn] = JSON.stringify(val); }
          else { Vars[args.StoreIn] = String(val); }
        } catch(e) { bug(lineNum, "JSONGet: invalid JSON"); }
        break;
      }

      case "ClearPage":
        if (!requirePageEdit(lineNum, "ClearPage")) return;
        document.body.innerHTML = '<div id="out"></div>';
        document.body.style.cssText = "";
        break;

case "HTTPsGET": {
    if(!OA) return;
  if (!args.URL)     { bug(lineNum, "HTTPsGET: missing URL"); return; }
  if (!args.Method)  { bug(lineNum, "HTTPsGET: missing Method"); return; }
  if (!args.StoreIn) { bug(lineNum, "HTTPsGET: missing StoreIn"); return; }
  let METHOD  = replaceVars(args.Method).toUpperCase();
  let URL     = replaceVars(args.URL);
  let STORE   = args.StoreIn;
  let FORMAT  = args.Format ? replaceVars(args.Format) : "text";
  let headers = {};
  if (args.Headers1 !== undefined && args.Headers2 !== undefined) {
    headers[replaceVars(args.Headers1)] = replaceVars(args.Headers2);
  }
  let opts = { method: METHOD, headers: headers };
  if (METHOD !== "GET" && METHOD !== "HEAD" && args.Body !== undefined) {
    opts.body = replaceVars(args.Body);
  }
  Vars[STORE] = "loading...";
  Vars["HTTPStatus"] = "pending";
  fetch(URL, opts)
    .then(function(res) {
      Vars["HTTPStatus"] = res.status;
      if (!res.ok) throw new Error("HTTP " + res.status);
      return FORMAT === "json" ? res.json() : res.text();
    })
    .then(function(data) {
      Vars[STORE] = FORMAT === "json" ? JSON.stringify(data) : String(data);
      Vars["HTTPStatus"] = "success";
    })
    .catch(function(err) {
      Vars[STORE] = "";
      Vars["HTTPStatus"] = "error";
      Vars["HTTPError"]  = err.message;
    });
  break;
}

      case "ChangeBodyCSS":
        if (!requirePageEdit(lineNum, "ChangeBodyCSS")) return;
        if (args.CSS === undefined) { bug(lineNum, "ChangeBodyCSS: missing CSS"); return; }
        document.body.style.cssText = replaceVars(args.CSS);
        break;

      case "ChangeCSS": {
        if (!requirePageEdit(lineNum, "ChangeCSS")) return;
        if (!args.Target || !args.CSS) { bug(lineNum, "ChangeCSS: missing args"); return; }
        let elements = document.querySelectorAll(replaceVars(args.Target));
        if (elements.length === 0) { bug(lineNum, "ChangeCSS: no match"); return; }
        let css = replaceVars(args.CSS);
        elements.forEach(function(el) {
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
        });
        break;
      }
    case "CallFunc": {
  if (!args.Name) { bug(lineNum, "CallFunc: missing Name"); return; }
  if (!Functions.hasOwnProperty(args.Name)) {
    bug(lineNum, "CallFunc: '" + args.Name + "' not defined");
    return;
  }
  let fn = Functions[args.Name];
  let argList = args.Args
    ? replaceVars(args.Args).split(",").map(s => s.trim())
    : [];
  if (argList.length !== fn.params.length) {
    bug(lineNum, "CallFunc: '" + args.Name + "' expects " + fn.params.length + " args, got " + argList.length);
    return;
  }
  let varsSnapshot = {};
  for (let key in Vars) varsSnapshot[key] = Vars[key];

  let saved = {};
  for (let i = 0; i < fn.params.length; i++) {
    let param = fn.params[i];
    saved[param] = Vars.hasOwnProperty(param) ? Vars[param] : undefined;
    Vars[param] = argList[i];
  }
    returnValue = null;
  returnSignal = false;
  runBlock(fn.body, lineNum);
  let result = returnValue;
  returnSignal = false;
  returnValue = null;
  for (let param of fn.params) {
    if (saved[param] === undefined) delete Vars[param];
    else Vars[param] = saved[param];
  }
  for (let key in Vars) {
    if (!varsSnapshot.hasOwnProperty(key)) delete Vars[key];
  }
  if (args.StoreIn) {
    Vars[args.StoreIn] = result !== null ? result : "";
  }
  break;
}
      case "CreateElement": {
        if (!requirePageEdit(lineNum, "CreateElement")) return;
        if (!args.Tag) { bug(lineNum, "CreateElement: missing Tag"); return; }
        let el = document.createElement(replaceVars(args.Tag));
        el.textContent = args.Text ? replaceVars(args.Text) : "";
        if (args.ID) el.id = replaceVars(args.ID);
        if (args.Class) el.className = replaceVars(args.Class);
        if (args.Style) el.style.cssText = replaceVars(args.Style);
        let target = args.Target ? replaceVars(args.Target) : "body";
        let parent = document.querySelector(target);
        if (!parent) { bug(lineNum, "CreateElement: no parent"); return; }
        parent.appendChild(el);
        break;
      }

      case "RemoveElement": {
        if (!requirePageEdit(lineNum, "RemoveElement")) return;
        if (!args.Target) { bug(lineNum, "RemoveElement: missing Target"); return; }
        let els = document.querySelectorAll(replaceVars(args.Target));
        if (els.length === 0) { bug(lineNum, "RemoveElement: no match"); return; }
        els.forEach(function(el) { el.remove(); });
        break;
      }

      case "SetText": {
        if (!requirePageEdit(lineNum, "SetText")) return;
        if (!args.Target || args.Text === undefined) { bug(lineNum, "SetText: missing args"); return; }
        let els = document.querySelectorAll(replaceVars(args.Target));
        if (els.length === 0) { bug(lineNum, "SetText: no match"); return; }
        let text = replaceVars(args.Text);
        els.forEach(function(el) { el.textContent = text; });
        break;
      }
      case "Element3D": {
  if (!requirePageEdit(lineNum, "Element3D")) return;
  if (!args.StyleCSS) { bug(lineNum, "Element3D: missing StyleCSS"); return; }
        if (!args.ID) { bug(lineNum, "Element3D: missing ID"); return; }
  let el = document.createElement("div");
  el.id = replaceVars(args.ID);
        let SCSS = replaceVars(args.StyleCSS);
  el.style.cssText = `${SCSS}`;
  document.body.appendChild(el);
  break;
}
     case "JSmath": {
         if(!AJSF) return;
  if (args.JSinput === undefined) { bug(lineNum, "JSmath: missing JSinput"); return; }
  if (args.Mode === undefined) { bug(lineNum, "JSmath: missing Mode"); return; }
  if (args.Name === undefined) { bug(lineNum, "JSmath: missing Name"); return; }
  let input = replaceVars(String(args.JSinput));
  let allowed = ["abs","ceil","floor","round","trunc","sign",
                 "sqrt","cbrt","pow","exp","log","log2","log10",
                 "sin","cos","tan","asin","acos","atan","atan2",
                 "sinh","cosh","tanh","min","max","random","hypot"];
  let sanitized = input;
  allowed.forEach(function(fn) {
    let re = new RegExp("Math\\." + fn + "\\b", "g");
    sanitized = sanitized.replace(re, "0");
  });
  sanitized = sanitized.replace(/Math\.(PI|E|LN2|LN10|SQRT2|LOG2E|LOG10E|SQRT1_2)\b/g, "0");
  if (!/^[0-9+\-*/().,\s%]*$/.test(sanitized)) {
    bug(lineNum, "JSmath: unsafe input — only math allowed");
    return;
  }
  let badWords = ["eval","Function","constructor","window","document",
                  "alert","fetch","XMLHttp","import","require",
                  "prototype","__proto__","this","global"];
  for (let w = 0; w < badWords.length; w++) {
    if (input.indexOf(badWords[w]) !== -1) {
      bug(lineNum, "JSmath: blocked keyword '" + badWords[w] + "'");
      return;
    }
  }
  let result;
  try {
    result = Function('"use strict"; return (' + input + ');')();
  } catch (e) {
    bug(lineNum, "JSmath: " + e.message);
    return;
  }

  if (typeof result !== "number" || isNaN(result)) {
    bug(lineNum, "JSmath: result is not a number");
    return;
  }
  if (args.Mode === "CreateVar") {
    if (Vars.hasOwnProperty(args.Name)) { bug(lineNum, "JSmath: '" + args.Name + "' exists"); return; }
    Vars[args.Name] = result;
  } else if (args.Mode === "SetVar") {
    if (!Vars.hasOwnProperty(args.Name)) { bug(lineNum, "JSmath: '" + args.Name + "' not found"); return; }
    Vars[args.Name] = result;
  } else {
    bug(lineNum, "JSmath: unknown Mode (use CreateVar or SetVar)");
    return;
  }
  break;
}
      case "SetHTML": {
        if (!requirePageEdit(lineNum, "SetHTML")) return;
        if (!args.Target || args.HTML === undefined) { bug(lineNum, "SetHTML: missing args"); return; }
        let els = document.querySelectorAll(replaceVars(args.Target));
        if (els.length === 0) { bug(lineNum, "SetHTML: no match"); return; }
        let html = replaceVars(args.HTML);
        els.forEach(function(el) { el.innerHTML = html; });
        break;
      }

      case "AppendHTML": {
        if (!requirePageEdit(lineNum, "AppendHTML")) return;
        if (!args.HTML) { bug(lineNum, "AppendHTML: missing HTML"); return; }
        let target = args.Target ? replaceVars(args.Target) : "body";
        let parent = document.querySelector(target);
        if (!parent) { bug(lineNum, "AppendHTML: no parent"); return; }
        parent.insertAdjacentHTML("beforeend", replaceVars(args.HTML));
        break;
      }
case "__USE__": {
  if (!canAllowLibraries) {
    return;
  }
  if (!args.From) { bug(lineNum, "__USE__: missing From"); return; }
  let libId = replaceVars(args.From);
  let ns = args.As ? replaceVars(args.As) : "";

  if (LoadedLibs.hasOwnProperty(libId)) {
    bug(lineNum, "__USE__: '" + libId + "' already loaded");
    return;
  }
  if (LibStack.indexOf(libId) !== -1) {
    bug(lineNum, "__USE__: circular import of '" + libId + "'");
    return;
  }
  if (LibStack.length >= 3) {
    bug(lineNum, "__USE__: too deep (max 3 nested libraries)");
    return;
  }

  let el = document.getElementById(libId);
  if (!el) { bug(lineNum, "__USE__: library '" + libId + "' not found"); return; }
  if (el.type !== "text/ctcs-lib") {
    bug(lineNum, "__USE__: '" + libId + "' is not a library (needs type=\"text/ctcs-lib\")");
    return;
  }

  let libLines = el.textContent
    .split("\n")
    .map(l => l.trim())
    .filter(l => l && !l.startsWith("//"));

  LibStack.push(libId);

  for (let i = 0; i < libLines.length; i++) {
    let L = libLines[i];

    if (L.includes('Type: "__USE__"')) {
      let savedLine = lineNum;
      parseCommand(L, savedLine);
      continue;
    }

    if (L.includes('Type: "Define"')) {
      let endIdx = findBlockEnd(libLines, i);
      if (endIdx === -1) {
        bug(lineNum, "__USE__: malformed Define in '" + libId + "'");
        LibStack.pop();
        return;
      }

      let body = libLines.slice(i + 1, endIdx);
      let nameM = L.match(/Name:\s*"([^"]+)"/);
      if (nameM && ns) {
        L = L.replace(/Name:\s*"[^"]+"/, 'Name: "' + ns + "." + nameM[1] + '"');
      }
      registerFunction(L, body, lineNum);
      i = endIdx;
      continue;
    }

    bug(lineNum, "__USE__: '" + libId + "' may only contain Define blocks (found: " + L.substring(0, 40) + ")");
    LibStack.pop();
    return;
  }

  LibStack.pop();
  LoadedLibs[libId] = true;

  Out += "<div style='color:#7ee787;font-size:12px;'>📦 Loaded: " + libId +
         (ns ? " as '" + ns + "'" : "") + "</div>";
  break;
}

    
      case "OnClick":
      case "OnButtonHold":
      case "OnButtonRelease":
      case "FetchThen":
      case "Define":
        break;
case "OnElement3DTouch":
  break;
        default:
        bug(lineNum, 'Unknown command: "' + type + '"');
    }
  }

  function runFetchThen(L, body, lineNum) {
      if(!OA) return;
    if (!requirePageEdit(lineNum, "FetchThen")) return;
    let urlM = L.match(/URL:\s*"([^"]+)"/);
    let storeM = L.match(/StoreIn:\s*"([^"]+)"/);
    let fmtM = L.match(/Format:\s*"([^"]+)"/);
    if (!urlM || !storeM) { bug(lineNum, "FetchThen: missing args"); return; }
    let url = replaceVars(urlM[1]);
    let storeIn = storeM[1];
    let format = fmtM ? fmtM[1] : "text";
    Vars[storeIn] = "loading...";
    Vars["FetchStatus"] = "loading";
    fetch(url)
      .then(function(res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return format === "json" ? res.json() : res.text();
      })
      .then(function(data) {
        Vars[storeIn] = format === "json" ? JSON.stringify(data) : String(data);
        Vars["FetchStatus"] = "success";
        let oldOut = Out, oldBugs = Bugs;
        Out = ""; Bugs = "";
        runBlock(body, lineNum);
        if (Out) outputTo(Out, false);
        if (Bugs) outputTo(Bugs, true);
        Out = oldOut; Bugs = oldBugs;
      })
      .catch(function(err) {
        Vars[storeIn] = "";
        Vars["FetchStatus"] = "error";
        Vars["FetchError"] = err.message;
      });
  }
function runOnElement3DTouch(L, body, lineNum) {
  let targetM = L.match(/Target:\s*"([^"]+)"/);
  if (!targetM) { bug(lineNum, "OnElement3DTouch: missing Target"); return; }
  let eventM = L.match(/Event:\s*"([^"]+)"/);
  let event = eventM ? eventM[1] : "hover";

  let elements = document.querySelectorAll(replaceVars(targetM[1]));
  if (elements.length === 0) { bug(lineNum, "OnElement3DTouch: no match"); return; }

  let eventName = event === "click" ? "click" : event === "leave" ? "mouseleave" : "mouseenter";

  elements.forEach(function(el) {
    el.addEventListener(eventName, function() {
      let oldOut = Out, oldBugs = Bugs;
      Out = ""; Bugs = "";
      runBlock(body, lineNum);
      if (Out) outputTo(Out, false);
      if (Bugs) outputTo(Bugs, true);
      Out = oldOut; Bugs = oldBugs;
    });
    if (event === "hover") {
      el.addEventListener("touchstart", function() {
        let oldOut = Out, oldBugs = Bugs;
        Out = ""; Bugs = "";
        runBlock(body, lineNum);
        Out = oldOut; Bugs = oldBugs;
      });
    }
  });
}
  function runOnClick(L, body, lineNum) {
    let targetM = L.match(/Target:\s*"([^"]+)"/);
    if (!targetM) { bug(lineNum, "OnClick: missing Target"); return; }
    let elements = document.querySelectorAll(replaceVars(targetM[1]));
    if (elements.length === 0) { bug(lineNum, "OnClick: no match"); return; }
    elements.forEach(function(el) {
      el.addEventListener("click", function() {
        let oldOut = Out, oldBugs = Bugs;
        Out = ""; Bugs = "";
        runBlock(body, lineNum);
        if (Out) outputTo(Out, false);
        if (Bugs) outputTo(Bugs, true);
        Out = oldOut; Bugs = oldBugs;
      });
    });
  }

  function runOnButtonHold(L, body, lineNum) {
    let targetM = L.match(/Target:\s*"([^"]+)"/);
    if (!targetM) { bug(lineNum, "OnButtonHold: missing Target"); return; }
    let interval = 100;
    let msM = L.match(/Ms:\s*"?(\d+)"?/);
    if (msM) interval = Number(msM[1]);
    let elements = document.querySelectorAll(replaceVars(targetM[1]));
    if (elements.length === 0) { bug(lineNum, "OnButtonHold: no match"); return; }
    elements.forEach(function(el) {
      let holdTimer = null;
      function startHold() {
        if (holdTimer) return;
        holdTimer = setInterval(function() {
          runBlock(body, lineNum);
          if (Out) { outputTo(Out, false); Out = ""; }
          if (Bugs) { outputTo(Bugs, true); Bugs = ""; }
        }, interval);
      }
      function stopHold() {
        if (holdTimer) { clearInterval(holdTimer); holdTimer = null; }
      }
      el.addEventListener("mousedown", startHold);
      el.addEventListener("mouseup", stopHold);
      el.addEventListener("mouseleave", stopHold);
      el.addEventListener("touchstart", function(e) { e.preventDefault(); startHold(); });
      el.addEventListener("touchend", stopHold);
    });
  }
  
  function runOnButtonRelease(L, body, lineNum) {
    let targetM = L.match(/Target:\s*"([^"]+)"/);
    if (!targetM) { bug(lineNum, "OnButtonRelease: missing Target"); return; }
    let elements = document.querySelectorAll(replaceVars(targetM[1]));
    if (elements.length === 0) { bug(lineNum, "OnButtonRelease: no match"); return; }
    elements.forEach(function(el) {
      el.addEventListener("mouseup", function() {
        runBlock(body, lineNum);
        if (Out) { outputTo(Out, false); Out = ""; }
        if (Bugs) { outputTo(Bugs, true); Bugs = ""; }
      });
      el.addEventListener("touchend", function() { runBlock(body, lineNum); });
    });
  }

  function findBlockEnd(lines, startIdx) {
    let depth = 0;
    for (let j = startIdx + 1; j < lines.length; j++) {
      let t = lines[j];
    if (t.includes('Type: "If"') || t.includes('Type: "Loop"') || t.includes('Type: "OnClick"') ||
    t.includes('Type: "FetchThen"') || t.includes('Type: "Define"') ||
    t.includes('Type: "OnButtonHold"') || t.includes('Type: "OnButtonRelease"') ||
    t.includes('Type: "OnElement3DTouch"')) depth++;   // ← add this
if (t.includes("$eif!") || t.includes("$endLoop!") || t.includes("$endOnClick!") ||
    t.includes("$endFetchThen!") || t.includes("$endDefine!") ||
    t.includes("$endHold!") || t.includes("$endRelease!") ||
    t.includes("$endTouch!")) {                          // ← and this
  if (depth === 0) return j;
  depth--;
}
    }
    return -1;
  }

  function parseIfBranches(lines, startIdx, endIdx) {
    let branches = [];
    let currentCond = lines[startIdx];
    let currentStart = startIdx + 1;
    let depth = 0;
    for (let j = startIdx + 1; j < endIdx; j++) {
      let t = lines[j];
      if (t.includes('Type: "If"')) { depth++; continue; }
      if (t.includes("$eif!")) { depth--; continue; }
      if (depth === 0) {
        if (t.includes("$Else If")) {
          branches.push({ cond: currentCond, start: currentStart, end: j });
          let match = t.match(/\$Else\s+If\s+(.*?)\$\{/);
          currentCond = match ? 'Type: "If" ' + match[1] : null;
          currentStart = j + 1;
          continue;
        }
        if (t.includes("$Else${")) {
          branches.push({ cond: currentCond, start: currentStart, end: j });
          currentCond = "ELSE";
          currentStart = j + 1;
          continue;
        }
      }
    }
    branches.push({ cond: currentCond, start: currentStart, end: endIdx });
    return branches;
  }

  function runLoop(L, body, lineNum) {
    let Lc = replaceVars(L);
    let varM = Lc.match(/Var:\s*"([^"]+)"/);
    let fromM = Lc.match(/From:\s*"?(-?\d+\.?\d*)"?/);
    let toM = Lc.match(/To:\s*"?(-?\d+\.?\d*)"?/);
    let stepM = Lc.match(/Step:\s*"?(-?\d+\.?\d*)"?/);
    if (!varM || !fromM || !toM) { bug(lineNum, "Loop: missing args"); return; }
    let varName = varM[1];
    let from = Number(fromM[1]), to = Number(toM[1]);
    let step = stepM ? Number(stepM[1]) : 1;
    if (step === 0) { bug(lineNum, "Loop: Step cannot be 0"); return; }
    if (Math.floor(Math.abs(to - from) / Math.abs(step)) > 100000) { bug(lineNum, "Loop: too many"); return; }
   if (step > 0) {
  for (let v = from; v <= to; v += step) { Vars[varName] = v; runBlock(body, lineNum); if (returnSignal) return; }
} else {
  for (let v = from; v >= to; v += step) { Vars[varName] = v; runBlock(body, lineNum); if (returnSignal) return; }
}
  }

  function runBlock(lines, lineNum) {
    for (let k = 0; k < lines.length; k++) {
    	  SysVars.CurrentOutput = Out;
  SysVars.CurrentErrorCount = ErrorCount;
  SysVars.CurrentBugs = Bugs;
  SysVars.CurrentHTML = document.body.innerHTML;
  SysVars.CurrentBodyCSS = document.body.style.cssText;
      let L = lines[k];
if (L.includes('Type: "OnElement3DTouch"')) {
  let endIdx = findBlockEnd(lines, k);
  if (endIdx === -1) { bug(lineNum, "OnElement3DTouch: missing $endTouch!"); return; }
  runOnElement3DTouch(L, lines.slice(k + 1, endIdx), lineNum);
  k = endIdx;
  continue;
}
      if (L.includes('Type: "FetchThen"')) {
        let endIdx = findBlockEnd(lines, k);
        if (endIdx === -1) { bug(lineNum, "FetchThen: missing end"); return; }
        runFetchThen(L, lines.slice(k + 1, endIdx), lineNum); k = endIdx; continue;
      }
      if (L.includes('Type: "Define"')) {
        let endIdx = findBlockEnd(lines, k);
        if (endIdx === -1) { bug(lineNum, "Define: missing end"); return; }
        registerFunction(L, lines.slice(k + 1, endIdx), lineNum); k = endIdx; continue;
      }
      if (L.includes('Type: "OnButtonHold"')) {
        let endIdx = findBlockEnd(lines, k);
        if (endIdx === -1) { bug(lineNum, "OnButtonHold: missing end"); return; }
        runOnButtonHold(L, lines.slice(k + 1, endIdx), lineNum); k = endIdx; continue;
      }
      if (L.includes('Type: "OnButtonRelease"')) {
        let endIdx = findBlockEnd(lines, k);
        if (endIdx === -1) { bug(lineNum, "OnButtonRelease: missing end"); return; }
        runOnButtonRelease(L, lines.slice(k + 1, endIdx), lineNum); k = endIdx; continue;
      }
      if (L.includes('Type: "OnClick"')) {
        let endIdx = findBlockEnd(lines, k);
        if (endIdx === -1) { bug(lineNum, "OnClick: missing end"); return; }
        runOnClick(L, lines.slice(k + 1, endIdx), lineNum); k = endIdx; continue;
      }
      if (L.includes('Type: "If"')) {
  let endIdx = findBlockEnd(lines, k);
  if (endIdx === -1) { bug(lineNum, "If: missing end"); return; }
  let branches = parseIfBranches(lines, k, endIdx);
  for (let b = 0; b < branches.length; b++) {
    let br = branches[b];
    if (br.cond === "ELSE") { runBlock(lines.slice(br.start, br.end), lineNum); if (returnSignal) return; break; }
    let res = evalCondition(br.cond, lineNum);
    if (res === true) { runBlock(lines.slice(br.start, br.end), lineNum); if (returnSignal) return; break; }
  }
  k = endIdx; continue;
}
      if (L.includes('Type: "Loop"')) {
        let endIdx = findBlockEnd(lines, k);
        if (endIdx === -1) { bug(lineNum, "Loop: missing end"); return; }
        runLoop(L, lines.slice(k + 1, endIdx), lineNum); k = endIdx; continue;
      }

      if (L.startsWith("${")) continue;
      if (L.includes("$eif!")) continue;
      if (L.includes("$endLoop!")) continue;
      if (L.includes("$endOnClick!")) continue;
      if (L.includes("$endFetchThen!")) continue;
      if (L.includes("$endDefine!")) continue;
      if (L.includes("$endHold!")) continue;
      if (L.includes("$endRelease!")) continue;
     if (L.includes("$endTouch!")) continue;
      if (L.includes("$Else")) continue;

      if (L.startsWith("Type:")) parseCommand(L, lineNum);
    }
  }

  for (let i = 0; i < Lines.length; i++) {
    let L = Lines[i];

    if (L.startsWith("${")) continue;
    if (L.includes("$eif!")) continue;
    if (L.includes("$endLoop!")) continue;
    if (L.includes("$endOnClick!")) continue;
    if (L.includes("$endFetchThen!")) continue;
    if (L.includes("$endDefine!")) continue;
    if (L.includes("$endHold!")) continue;
    if (L.includes("$endRelease!")) continue;
    if (L.includes("$Else")) continue;
    if (L.includes("$endTouch!")) continue;
if (L.includes('Type: "OnElement3DTouch"')) {
  let endIdx = findBlockEnd(Lines, i);
  if (endIdx === -1) { bug(i + 1, "OnElement3DTouch: missing $endTouch!"); break; }
  runOnElement3DTouch(L, Lines.slice(i + 1, endIdx), i + 1);
  i = endIdx;
  continue;
}
    if (L.includes('Type: "FetchThen"')) {
      let endIdx = findBlockEnd(Lines, i);
      if (endIdx === -1) { bug(i + 1, "FetchThen: missing end"); break; }
      runFetchThen(L, Lines.slice(i + 1, endIdx), i + 1); i = endIdx; continue;
    }
    if (L.includes('Type: "Define"')) {
      let endIdx = findBlockEnd(Lines, i);
      if (endIdx === -1) { bug(i + 1, "Define: missing end"); break; }
      registerFunction(L, Lines.slice(i + 1, endIdx), i + 1); i = endIdx; continue;
    }
    if (L.includes('Type: "OnButtonHold"')) {
      let endIdx = findBlockEnd(Lines, i);
      if (endIdx === -1) { bug(i + 1, "OnButtonHold: missing end"); break; }
      runOnButtonHold(L, Lines.slice(i + 1, endIdx), i + 1); i = endIdx; continue;
    }
    if (L.includes('Type: "OnButtonRelease"')) {
      let endIdx = findBlockEnd(Lines, i);
      if (endIdx === -1) { bug(i + 1, "OnButtonRelease: missing end"); break; }
      runOnButtonRelease(L, Lines.slice(i + 1, endIdx), i + 1); i = endIdx; continue;
    }
    if (L.includes('Type: "OnClick"')) {
      let endIdx = findBlockEnd(Lines, i);
      if (endIdx === -1) { bug(i + 1, "OnClick: missing end"); break; }
      runOnClick(L, Lines.slice(i + 1, endIdx), i + 1); i = endIdx; continue;
    }
   if (L.includes('Type: "If"')) {
  let endIdx = findBlockEnd(Lines, i);
  if (endIdx === -1) { bug(i + 1, "If: missing end"); break; }
  let branches = parseIfBranches(Lines, i, endIdx);
  for (let b = 0; b < branches.length; b++) {
    let br = branches[b];
    if (br.cond === "ELSE") { runBlock(Lines.slice(br.start, br.end), i + 1); if (returnSignal) return; break; }
    let res = evalCondition(br.cond, i + 1);
    if (res === true) { runBlock(Lines.slice(br.start, br.end), i + 1); if (returnSignal) return; break; }
  }
  i = endIdx; continue;
}
    if (L.includes('Type: "Loop"')) {
      let endIdx = findBlockEnd(Lines, i);
      if (endIdx === -1) { bug(i + 1, "Loop: missing end"); break; }
      runLoop(L, Lines.slice(i + 1, endIdx), i + 1); i = endIdx; continue;
    }

  if (L.startsWith("Type:")) {
  parseCommand(L, i + 1);
  if (returnSignal) return;
} else if (L.trim() !== "") {
  bug(i + 1, 'Not a command');
}
}


  Out = replaceVars(Out);
  Out = Out.replaceAll("/#VarS#/", "!{");
  Out = Out.replaceAll("/#VarE#/", "}!");
  Out = Out.replaceAll("/#SysS#/", "?{");
  Out = Out.replaceAll("/#SysE#/", "}?");
  Out = Out.replaceAll("/#N#/", "\n");
  Out = Out.replaceAll("/#BR#/", "<br>");
  
  let stats = ErrorCount === 0 ? "Ran" : ErrorCount + " error(s)";

  return {
    output: Bugs + Out + "<br>-----------<br>" + stats + "<br>" + VER,
    raw: Out,
    bugInfo: Bugs,
    version: VER,
    errors: ErrorCount,
    status: stats
  };
  }