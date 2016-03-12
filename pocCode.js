// POC code for MXR ( multitrack looper, for Issa & myself ^^ )
// @StepĥaneAG 2016

// --------------------------------------- BASICS --------------------------------------- //

// create audio context
var audioCtx = new AudioContext()
// create audio  analyser
var analyser = audioCtx.createAnalyser();
// create audio source ( here, oscillator )
var oscillator = audioCtx.createOscillator()
// create audio node ( here, gain )
var gainNode = audioCtx.createGain()

// to link source audio & destination ( speakers ), we use 'connect()' on the source node & pass the destination node as an argument
// default audio output ( speakers ) is accessible via 'AudioContext.destination'
oscillator.connect( gainNode )
gainNode.connect( audioCtx.destination )

// playing sound & setting the pitch & gain
oscillator.type = 'sine' // def: sine
oscillator.frequency.value = 2500 // def 440
gainNode.gain.value = 0.5

oscillator.start()

// to stop ( atually mute ) the sound, we disconnect the gain node from the destination node, hence breaking the graph so that no sound is produced
gainNode.disconnect( audioCtx.destination ) // or to use def: gainNode.disconnect()
// to reconnect after muting it
gainNode.connect( audioCtx.destination )





// --------------------------------------- VISUALISATION --------------------------------------- //
// to extract data from audio source, we need an AnalyserNode ( see basics )
// then, we connect it to the audio source
// analyser 'll capture audio data using an FFT in a certain freq domain ( anamyserNode.fft def: 2048 )
// also available: min/max power value for fft data scalin range .min/maxDecibels
//               : different data averaging constants .smoothingTimeConstant
// to capture data: mthds .getFloatFrequencyData() .getByteFrequencyData for frequency data
//                        .getFloatTimeDomainData() .getByteTimeDomainData() for waveform data
// /!\ need to use either Float32Array or Uint8Array
// ex: fft size 2048, we return .frequencyBinCount ( half fft ), then call Uint8Array with freqBinCnt as length arg -> this is how many points 'll be collected for that fft size
// analyser.fftSize = 2048
// var bufferLength = analyser.frequencyBinCount;
// var dataArray = new Uint8Array(bufferLength);
// to actually retrieve the data & copy it into our array, we can then call the data collection mthd
// we want, passing the array as arg, ex:
// analyser.getByteTimeDomainData( dataArray )
// we now have the audio data for that moment in time captured in oru array, and can proceed to visualize it, ex by plotting onto an HTML5 <canvas>

navigator.webkitGetUserMedia({audio: true}, function(stream){
  var audioSrc = audioCtx.createMediaStreamSource( stream ); // microphone input
  

  // microphone -> analyser [ -> destination ] // the analyer doesn't need to have an output to work
  source.connect( analyser );
  // analyser.connect( disto, ..)
}, function(err){
  console.log(err)
});


// ----------------------------------- WAVEFORM/OSCILLOSCOPE ----------------------------------- //
//original code in Voice-change-O-matic by Soledad Penadés )

// follow the standard pattern to set up a buffer
analyser.fftSize = 2048
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
// next, we clear the canvas of what had been draw before to get ready to display the new visualisation
canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)
// define draw()
function draw(){
  // use request anim frame to keep looping the drawing fcn once started
  drawVisual = requestAnimationFrame( draw );
  // then, we grab the time domain & copy it into our array
  analyser.getByteTimeDomainData( dataArray );
  // next, we fill the canvas witha solid color to start
  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  // we then set a line width & stroke color for the wave we'll draw, & beging drawing a path
  canvasCtx.lineWidth = 2;
  canvasCt.stokeStyle = 'rgb(0, 0, 0)';
  canvasCtx.beginPath();
  // we determine the width of each segment of the line to be drawn by dividing the canvas width by th earray length ( equal to the FrequencyBinCount, as defined earlier on ),
  // then define an x variable to define the position to move to for drawing each segment of the line
  var sliceWidth = WIDTH * &.0 / buffer.length;
  var x = 0;
  // then, we run through a loop, defining the position of a small segment of the wave for each point in the buffer at a certain height based on the data point value from the array,
  // the nmoving the line across to the place where the next wave segment should be drawn
  for (var i = 0; i < buffer.length; i++){
    var v = dataArray[i] / 128.0;
    var y = v * HEIGHT/2;
    if ( i=== 0 ) canvasCtx.moveTo(x, y)
    else canvasCtx.lineTo(x, y)
    x+= sliceWidth;
  }
  // finally, we finish the line in the middle of the right hand side of the canvas, then draw the stroke we've defined
  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
}
// at the end of this section of code, we invoke the 'draw()' fcn to start off the whole process
draw();
// => the result is a nice waveform display that updates several times a second


// ------------------------------------ FREQUENCY BAR GRAPH- ----------------------------------- //
//original code in Voice-change-O-matic by Soledad Penadés )
// Winamp-style frequency bar graph

// first, we setup our analyser & data array, then clear the current canvas display with 'clearRect()'.
// the only difference from before it that we set the fft size to be much smaller, so that each bar in the graph is big enough to actually look like a bar rather than a thin strand
analysr.fftSize = 256;
var bufferLength = analysr.frequencyBinCOunt;
console.log(bufferLength);
var dataArray = new Uint8Array( bufferLength );
canvasCtx.clearRect( 0, 0, WIDTH, HEIGHT );
// thne, we start our 'draw()' fcn off, again setting up a loop using 'requestAnimationFrame()' so that the displayed data keeps updating, and clearing the display with each animation frame
functon draw(){
  drawVisual = requestAnimationFrame(draw);
  analyser.getByteFrequencyData( dataArray );
  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  // then, we set our 'barWidth' to be equal to the canvas width divided by the number of bars ( the buffer length ).
  // however, we're also multiplying that width by 2.5, because most of the frequencies 'll come bck as having no audio in them, as most of the sounds we hear everyday are in certain lower frequency range.
  // we don't want to display loads of empty bars, therefore we simply shift the ones that'll display regularly at a noticeable height across so they fill the canvas display.
  // we also set a 'barHeight' variable & an x variable to record how far across the screen to draw the current bar
  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight;
  var x = 0;
  // as before, we now start a loop & cycle through each value in the 'dataArray'.
  // for each one, w make the 'barHeight' equal to the array value, set a fill color based on the 'barHeight' ( tallers are brighter ), and draw a bar at x pixels across the canvas, which is 'barWIdth' wide
  // and 'barHeight'/2 tall ( it was eventually decided to cut each bar in half so they would all fit on the canvas better )
  //
  // the one value that needs explaning is the vertical offset position we're drawing each bar at: 'HEIGHT - barHeight/2'.
  // this is done because we want each bar to stick up from the bottom of the canvas, not down from the top, as it would if we set the vertical position to 0.
  // therefore, we instead set the vertical position each time to the height of the canvas minus barHeight/2, hence each bar 'll be drawn from partway down the canvas, down to the bottom.
  for (var i = 0; i < bufferlNegth; i++){
    barHeight = dataArray[i]/2;
    canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ', 50, 50)';
    canvasCtx.fillRect(x, HEIGHT-barHeight/2, barWidth, barHeight);
    x += barWidth + 1;
  }
}
// again, we invoke the 'draw()' fcn at th end of the code to set the whole process in motion
draw();
// => this should give a nice Winamp-style result


// --------------------------------------- MXR POC CODE --------------------------------------- //

// grab audio stream from microphone ( tested on ubuntu chrome )
var audioCtx = new AudioContext()
navigator.webkitGetUserMedia({audio: true}, function(stream){
  var microphone = audioCtx.createMediaStreamSource( stream );
  var filter = audioCtx.createBiquadFilter();

  // microphone -> filter -> destination
  microphone.connect( filter );
  filter.connect( audioCtx.destination );
}, function(err){
  console.log(err)
});
