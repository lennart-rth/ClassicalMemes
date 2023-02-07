const video = document.querySelector('video');
var posx = document.querySelector("#posx");
var posy = document.querySelector("#posy");
var zoomx = document.querySelector("#zoomx");
var zoomy = document.querySelector("#zoomy");
var zoom = document.querySelector("#zoom");
var stage = document.querySelector(".stage");
var btn = document.querySelector("#playpause")

const constraints = {
  video: {
    height:1000,
    width:1000,
    facingMode: "user",
    zoom: true,
  }
};

navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
  video.srcObject = stream;
  video.play();
});

var x = 50;
var y = 50;
var isPlaying = true;


video.addEventListener('devicechange', (event) => {
  console.log(video.srcObject)
});

posx.addEventListener("input", function() {
  x = this.value;
  video.style["object-position"] = x + "% " +  y +"%";
})

posy.addEventListener("input", function() {
  y = this.value;
  video.style["object-position"] = x + "% " +  y +"%";
})

zoomx.addEventListener("input", function() {
  video.style["width"] = this.value + "px";
})
zoomy.addEventListener("input", function() {
  video.style["height"] = this.value + "px";
})

zoom.addEventListener("input", function() {
  video.style["transform"] = "scale("+this.value+")"
})

stage.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

function mouseUp() {
    window.removeEventListener('mousemove', move, true);
}

function mouseDown(e) {
    window.addEventListener('mousemove', move, true);
}

function move(e) {
  adx = e.clientX-(zoomx.value/2)
  ady = e.clientY-(zoomy.value/2)
    stage.style.top = ady + 'px';
    stage.style.left = adx + 'px';
};

function togglePlay() {
  if (isPlaying) {
    video.pause()
    isPlaying = false;
  } else {
    video.play();
    isPlaying = true;
  }
};

function submit(){
  let div = document.querySelector('#preview');
  console.log(div)

  html2canvas(div).then(
      function (canvas) {
          document
          .querySelector('#out')
          .appendChild(canvas);
      })
}

