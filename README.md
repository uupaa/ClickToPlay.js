# ClickToPlay.js [![Build Status](https://travis-ci.org/uupaa/ClickToPlay.js.svg)](https://travis-ci.org/uupaa/ClickToPlay.js)

[![npm](https://nodei.co/npm/uupaa.clicktoplay.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.clicktoplay.js/)

Management of the Click-To-Play resources.

This module made of [WebModule](https://github.com/uupaa/WebModule).

## Documentation
- [Spec](https://github.com/uupaa/ClickToPlay.js/wiki/)
- [API Spec](https://github.com/uupaa/ClickToPlay.js/wiki/ClickToPlay)

## Browser, NW.js and Electron

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/ClickToPlay.js"></script>
<input type="button" value="click to play" onclick="play()" />
<script>

function play() {
    var clickToPlay = new ClickToPlay({ video: 1, audio: 1, sound: 1 },
                                      function(video,   // @arg HTMLVideoElementArray
                                               audio,   // @arg HTMLAudioElementArray
                                               sound) { // @arg WebAudioContextArray
/*
        playVideo( video );
        playAudio( audio );
        playSound( sound );
 */

    }, window.event);
}
</script>
```

