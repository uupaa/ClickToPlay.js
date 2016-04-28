(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("ClickToPlay", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
var UserAgent = WebModule["UserAgent"];
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
var AudioContext = global["AudioContext"]       ||       // [Chrome][Firefox][Edge]
                   global["webkitAudioContext"] || null; // [iOS Safari 6+]
var MP4  = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAALrbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAE4gAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAA" +
           "AAAAAAAAAAAAAAAAAAAgAAAhV0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAE4gAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAIAAAACAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAABOIAAAAAAABAA" +
           "AAAAGNbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAABAAAABQABVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABOG1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQ" +
           "AAAPhzdGJsAAAAlHN0c2QAAAAAAAAAAQAAAIRhdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAIAAgABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAALmF2Y0MBQsAe/+EAFmdCwB7ZAgRoQAAAAwFAAAADAIPFi5IBAA" +
           "Voy4PLIAAAABhzdHRzAAAAAAAAAAEAAAABAAFAAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAK3AAAAAQAAABRzdGNvAAAAAAAAAAEAAAMbAAAAYnVkdGEAAABabWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAA" +
           "AAAAAtaWxzdAAAACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY1Ni40MC4xMDEAAAAIZnJlZQAAAr9tZGF0AAACcAYF//9s3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0OCByMjYwMSBhMGNkN2QzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZW" +
           "Z0IDIwMDMtMjAxNSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTAgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3" +
           "JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTQgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG" +
           "5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0wIHdlaWdodHA9MCBrZXlpbnQ9MjUwIGtleWludF9taW49MSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPT" +
           "QwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAD9liIQFf///D0UAAT/PJycnJycnJ1111111111111111111111111111111111111111111111111" +
           "11111114A=";
var WAVE = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YQAAAAA=";

// --- class / interfaces ----------------------------------
function ClickToPlay(order,         // @arg Object - resource order slip. { video: UINT8, audio: Uint8, sound: UINT8 }
                     readyCallback, // @arg Function - readyCallback():void
                     target) {      // @arg Node|MouseEvent|TouchEvent = document.body - touch target HTMLElement or event object
//{@dev
    if (VERIFY) {
        $valid($type(order,          "Object"),            ClickToPlay, "order");
        $valid($keys(order,          "video|audio|sound"), ClickToPlay, "order");
        $valid($type(order.video,    "UINT8"),             ClickToPlay, "order.video");
        $valid($type(order.audio,    "UINT8"),             ClickToPlay, "order.audio");
        $valid($type(order.sound,    "UINT8"),             ClickToPlay, "order.sound");
        $valid(order.video + order.audio + order.sound,    ClickToPlay, "order");
        $valid($type(readyCallback,  "Function"),          ClickToPlay, "readyCallback");
        $valid($type(target,         "Node|Event|omit"),   ClickToPlay, "target");
    }
//}@dev

    this._restricted = _isRestrictedAutoplay();
    this._ready = false;
    this._video = [];
    this._audio = [];
    this._sound = [];

    _init.call(this, order, readyCallback, target);
}

ClickToPlay["VERBOSE"] = VERBOSE;
ClickToPlay["prototype"] = Object.create(ClickToPlay, {
    "constructor":  { "value": ClickToPlay                              }, // new ClickToPlay(order, readyCallback, target):ClickToPlay
    "restricted":   { "get":   function() { return this._restricted;  } }, // ClickToPlay#restricted:Boolean
    "ready":        { "get":   function() { return this._ready;       } }, // ClickToPlay#ready:Boolean
    "video":        { "get":   function() { return this._video;       } }, // ClickToPlay#video:VideoNodeArray
    "audio":        { "get":   function() { return this._audio;       } }, // ClickToPlay#audio:AudioNodeArray
    "sound":        { "get":   function() { return this._sound;       } }, // ClickToPlay#sound:WebAudioContextArray
});

// --- implements ------------------------------------------
function _isRestrictedAutoplay() { // @ret Boolean
    var ua = new UserAgent();

    if ( ua["iOS"] ) {
        // iOS restricted. Media#load(), Media#play() and Media#autoplay
        return true;
    }
    if ( ua["Android"] && ua["Chromium"] ) {
        // Chrome for Android 51+ restricted. Media#load(), Media#play() and Media#autoplay
        return true;
    }
    return false;
}

function _init(order, readyCallback, target) {
    target = target || document.body || null;

    var that       = this;
    var videoCount = order["video"] || 0;
    var audioCount = order["audio"] || 0;
    var soundCount = order["sound"] || 0;

    var i = 0, iz = 0;

    for (i = 0, iz = videoCount; i < iz; ++i) {
        this._video[i] = document.createElement("video");
    }
    for (i = 0, iz = audioCount; i < iz; ++i) {
        this._audio[i] = document.createElement("audio");
    }
    for (i = 0, iz = soundCount; i < iz; ++i) {
        this._sound[i] = AudioContext ? new AudioContext() : null;
    }

    if (this._ready) { // already? -> callback
        readyCallback(this._video, this._audio, this._sound);
    } else if (this["restricted"]) { // iOS Safari
        if (target && target instanceof Event) {
            _beSilent(target);
        } else if (target && target instanceof Node) {
            target.addEventListener("touchend", _beSilent, true);
            target.addEventListener("click",    _beSilent, true);
        }
    } else { // PC Chrome, PC Safari, Firefox, Edge
        this._ready = true;
        readyCallback(this._video, this._audio, this._sound);
    }

    function _beSilent(event) { // @arg Node|Event
        if (ClickToPlay["VERBOSE"]) {
            console.info("ClickToPlay: " + event.target.tagName + " " + event.type); // eg "ClickToPlay: body click"
        }
        if (target instanceof Node) {
            target.removeEventListener("touchend", _beSilent, true);
            target.removeEventListener("click",    _beSilent, true);
        }

        that._video.forEach(function(video) {
            video.src = MP4;
            video.load();
        });
        that._audio.forEach(function(audio) {
            audio.src = WAVE;
            audio.load();
        });
        that._sound.forEach(function(ctx) {
            if (ctx) {
                var source = ctx["createBufferSource"]();

                source["buffer"] = ctx["createBuffer"](1, 1, ctx["sampleRate"]);
                if (source["start"]) {
                    source["start"](0);
                } else {
                    source["noteOn"](0); // [DEPRECATED WebAudio SPEC][iOS 6 only]
                }
            }
        });
        that._ready = true;
        readyCallback(that._video, that._audio, that._sound);
    }
}

function _playSound(ctx) {
    var source = ctx["createBufferSource"]();

    source["buffer"] = ctx["createBuffer"](1, 1, ctx["sampleRate"]);
    if (source["start"]) {
        source["start"](0);
    } else {
        source["noteOn"](0); // [DEPRECATED WebAudio SPEC][iOS 6 only]
    }
}

return ClickToPlay; // return entity

});

