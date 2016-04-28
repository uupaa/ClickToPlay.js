var ModuleTestClickToPlay = (function(global) {

var test = new Test(["ClickToPlay"], { // Add the ModuleName to be tested here (if necessary).
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     false,  // enable worker test.
        node:       false,  // enable node test.
        nw:         true,  // enable nw.js test.
        el:         true,  // enable electron (render process) test.
        button:     true,  // show button.
        both:       false,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
            console.error(error.message);
        }
    });

if (IN_BROWSER || IN_NW || IN_EL) {
    test.add([
        testClickToPlay,
    ]);
}

// --- test cases ------------------------------------------
function testClickToPlay(test, pass, miss) {
    var mp4 = "../assets/test.mp4";
    var aac = "../assets/test.aac";

    var task = new Task("testClickToPlay", 3, function(error, buffer) {
        test.done(pass());
    });

    var clickToPlay = new ClickToPlay({ video: 1, audio: 1, sound: 1 },
                                      function(video, audio, sound) {
        _testVideo( video );
        _testAudio( audio );
        _testSound( sound );

    }, document.body);

    function _testVideo(videoNodeArray) {
        var video = videoNodeArray[0];

        video.width  = 128;
        video.height = 128;

        document.body.appendChild(video);

        video.oncanplay = function() { task.pass(); };
        video.src = mp4;
        video.play();
    }

    function _testAudio(audioNodeArray) {
        var audio = audioNodeArray[0];

        document.body.appendChild(audio);

        audio.oncanplay = function() { task.pass(); };
        audio.src = aac;
        audio.play();
    }

    function _testSound(sound) {
        var audioContext = sound[0];

        FileLoader.toArrayBuffer(aac, function(arrayBuffer) {
            audioContext.decodeAudioData(arrayBuffer, function(pcm) { // AudioBuffer
                console.log(pcm.duration, pcm.length, pcm.sampleRate, pcm.numberOfChannels);

                var source = audioContext.createBufferSource();

                source.buffer = pcm;
                source.connect(audioContext.destination);

                console.log("playing");
                //source.start(0);
                source.start ? source.start(0)
                             : source.noteOn(0);
                task.pass();
            });
        });
    }
}

return test.run();

})(GLOBAL);

