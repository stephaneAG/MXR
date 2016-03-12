/* the following is some POC code to quickly add/remove tracks in MXR */

// MXR obj
var mxr = {}
mxr.tracks = [];
mxr.addTrack = function(track){
  // add the track to an array
  this.tracks.push ( track );
  // render its view in the correct location
  document.querySelector('#additional_tracks').insertBefore(
    track.renderView(), document.querySelector('.add-track') 
  )
  // randomize the color of the remove track button
  if ( this.tracks.length !== 0)
    document.querySelector( '#'+this.tracks[this.tracks.length-1].id )
     .querySelector('.control.delete-track').style.color = track.color; //'blue';
  
  // add the necessary listeners ( .. ) 
}

// Track obj
mxr.Track = function(){
  var trackObj = {}
  trackObj.setName = function(name){ this.name = name; } // Track obj API
  trackObj.setType = function(type){ this.type = type; }
  trackObj.setDuration = function(duration){ this.duration = duration; }
  trackObj.setCurrentTime = function(currentTime){ this.currentTime = currentTime; }
  trackObj.setWaveform = function(waveform){ this.waveform = waveform; }
  
  trackObj.fastBackward = function(){}
  trackObj.backward = function(){}
  trackObj.stepBackward = function(){}
  trackObj.play = function(){}
  trackObj.pause = function(){}
  trackObj.stop = function(){}
  trackObj.stepForward = function(){}
  trackObj.forward = function(){}
  trackObj.fastForward = function(){}

  trackObj.toggleMute = function(){}
  trackObj.volumeDown = function(){}
  trackObj.volumeUp = function(){}
  trackObj.toggleReverse = function(){}
  trackObj.toggleLoop = function(){}
  trackObj.setSection = function(){}

  trackObj.filters = {}
  trackObj.equalizer = {}

  trackObj.fromFile = function(){}
  trackObj.fromMicrophone = function(){}
  trackObj.fromStream = function(){}

  trackObj.connect = function(input, output){} // link to other Web Audio nodes  

  trackObj.htmlTemplate = '\
      <div class="name">track_name</div>\
      <i class="fa fa-line-spacer"></i>\
      <div class="type">track_type</div>\
      <div class="duration">00:00</div>\
      <i class="fa fa-line-spacer"></i>\
      <div class="current-time">00:00</div>\
      <div class="wave"><canvas class="track_waveform"></canvas></div>\
      <div class="controls">\
        <a class="control delete-track" href="#"><i class="fa fa-minus-square"></i></a>\
        <a class="control fast-backward" href="#"><i class="fa fa-fast-backward"></i></a>\
        <a class="control backward" href="#"><i class="fa fa-backward"></i></a>\
        <a class="control step-backward" href="#"><i class="fa fa-step-backward"></i></a>\
        <a class="control play" href="#"><i class="fa fa-play"></i></a>\
        <a class="control pause" href="#"><i class="fa fa-pause"></i></a>\
        <a class="control stop" href="#"><i class="fa fa-stop"></i></a>\
        <a class="control step-forward" href="#"><i class="fa fa-step-forward"></i></a>\
        <a class="control forward" href="#"><i class="fa fa-forward"></i></a>\
        <a class="control fast-forward" href="#"><i class="fa fa-fast-forward"></i></a>\
        <!-- volume controls -->\
        <a class="control volume-off" href="#"><i class="fa fa-volume-off"></i></a>\
        <a class="control volume-down" href="#"><i class="fa fa-volume-down"></i></a>\
        <a class="control volume-up" href="#"><i class="fa fa-volume-up"></i></a>\
        <!-- additional controls -->\
        <a class="control reverse" href="#"><i class="fa fa-undo"></i></a>\
        <a class="control loop" href="#"><i class="fa fa-refresh"></i></a>\
        <a class="control section" href="#"><i class="fa fa-columns"></i></a>\
        <!-- filters & equalizer -->\
        <a class="control filters" href="#"><i class="fa fa-tasks"></i></a>\
        <a class="control equalizer" href="#"><i class="fa fa-sliders"></i></a>\
        <!-- track: load file or record from microphone -->\
        <a class="control open" href="#"><i class="fa fa-upload"></i></a>\
        <a class="control mike" href="#"><i class="fa fa-microphone"></i></a>\
      </div>\
  ';

  trackObj.id = 'id' + ( Date.now() / 1000 | 0 );

  var randomColor = 'rgb(' +
        (Math.floor(Math.random() * 256)) + ',' + 
        (Math.floor(Math.random() * 256)) + ',' +
        (Math.floor(Math.random() * 256)) + ')';
  trackObj.color = randomColor;

  // produce html
  trackObj.renderView = function(){
    var trackWrapper = document.createElement('div')
    trackWrapper.classList.add('track');
    //trackWrapper.id = 'id' + ( Date.now() / 1000 | 0 );
    trackWrapper.id = this.id
    trackWrapper.innerHTML = this.htmlTemplate;
    // to be able to randomize the color of the left border & the remove track button
    
    //trackWrapper.style.borderLeftColor = randomColor;
    trackWrapper.style.borderLeftColor = this.color;
    return trackWrapper;
  }

  return trackObj;
}

/* now at the bottom of the html page 
document.querySelector('#new-track').addEventListener('click', function(){
  var newTrack = new mxr.Track();
  mxr.addTrack( newTrack )
}, true);
*/
