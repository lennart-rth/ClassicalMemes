const video = document.getElementById('video');
const scaleAnchor = document.getElementById('scaleAnchor');
const topAnchor = document.getElementById('topAnchor');
const bottomAnchor = document.getElementById('bottomAnchor');
const leftAnchor = document.getElementById('leftAnchor');
const rightAnchor = document.getElementById('rightAnchor');
const borderRadiusSlider = document.getElementById('borderRadius');

var videoX;
var videoY;
var videoW;
var videoH;
var mouseX;
var mouseY;

var tempX;
var tempY;
var tempZ;
var tempTop;
var tempBottom;
var tempLeft;
var tempRight;

var trimTop = 0;
var trimBottom = 0;
var trimLeft = 0;
var trimRight = 0;

var borderRadius = 0;

video.onmousedown = initVideoMove;
scaleAnchor.onmousedown = initVideoMove;
topAnchor.onmousedown = initVideoMove;
bottomAnchor.onmousedown = initVideoMove;
leftAnchor.onmousedown = initVideoMove;
rightAnchor.onmousedown = initVideoMove;

borderRadiusSlider.oninput = updateBorder;


function initVideoMove(e) {
    e = e || window.event;
    e.preventDefault();

    mouseX = e.clientX;
    mouseY = e.clientY;

    document.onmouseup = closeVideoDrag;

    if (e.target.id == "video") {
        tempX = videoX;
        tempY = videoY;
        document.onmousemove = videoMove;
    }else if (e.target.id == "scaleAnchor"){
        tempX = videoW;
        tempY = videoH;
        tempZ = videoY;
        tempTop = trimTop;
        tempBottom= trimBottom;
        tempLeft = trimLeft;
        tempRight = trimRight;
        document.onmousemove = videoScale;
    } else if (e.target.id == "topAnchor"){
        tempY = trimTop;
        document.onmousemove = videoTopTrim;
    }else if (e.target.id == "bottomAnchor"){
        tempY = trimBottom;
        document.onmousemove = videoBottomTrim;
    }else if (e.target.id == "leftAnchor"){
        tempX = trimLeft;
        document.onmousemove = videoLeftTrim;
    }else if (e.target.id == "rightAnchor"){
        tempX = trimRight;
        document.onmousemove = videoRightTrim;
    }
}

function videoMove(e) {
    e = e || window.event;
    e.preventDefault();

    videoX = tempX + e.clientX - mouseX;
    videoY = tempY + e.clientY - mouseY;

    updateVideoPosition();
}

function videoScale(e) {
  e = e || window.event;
  e.preventDefault();

  const diffX = mouseX - e.clientX;
  const diffY = mouseY - e.clientY;

  const distance = Math.max(diffX,-diffY)
  const aspectRatio = video.videoWidth/video.videoHeight;

  if (tempX - distance*aspectRatio > 10 && tempY - distance > 10) {
    videoW = tempX - distance*aspectRatio;
    videoH = tempY - distance;
    videoY = tempZ + tempY - videoH
  }

  trimTop = tempTop*(videoH/tempY);
  trimBottom = tempBottom*(videoH/tempY);
  trimLeft = tempLeft*(videoW/tempX);
  trimRight = tempRight*(videoW/tempX);

  updateVideoPosition();
}

function videoTopTrim(e){
    e = e || window.event;
    e.preventDefault();

    const diffY = e.clientY - mouseY;
    if (tempY + diffY < 0){trimTop = 0;}else{trimTop = tempY + diffY;};

    updateAnchors();
}

function videoBottomTrim(e){
  e = e || window.event;
  e.preventDefault();

  const diffY = mouseY - e.clientY;
  if (tempY + diffY < 0){trimBottom = 0;}else{trimBottom = tempY + diffY;};

  updateAnchors();
}

function videoLeftTrim(e){
  e = e || window.event;
  e.preventDefault();

  const diffX = e.clientX - mouseX;
  if (tempX + diffX < 0){trimLeft = 0;}else{trimLeft = tempX + diffX;};

  updateAnchors();
}

function videoRightTrim(e){
  e = e || window.event;
  e.preventDefault();

  const diffX = mouseX - e.clientX;
  if (tempX + diffX < 0){trimRight = 0;}else{trimRight = tempX + diffX;};

  updateAnchors();
}

function closeVideoDrag() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

function updateBorder() {
  borderRadius = this.value;

  updateVideoPosition();
}

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        video.addEventListener("loadedmetadata", onWebcamLoaded);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function onWebcamLoaded() {
    videoX = 200;
    videoY = 200;
    videoW = video.videoWidth/2;
    videoH = video.videoHeight/2;
    borderRadius = 20;
    updateVideoPosition();
  };

function toggleAnchors() {
  if (scaleAnchor.style.display === "none") {
    scaleAnchor.style.display = "block";
    topAnchor.style.display = "block";
    bottomAnchor.style.display = "block";
    leftAnchor.style.display = "block";
    rightAnchor.style.display = "block";
  } else {
    scaleAnchor.style.display = "none";
    topAnchor.style.display = "none";
    bottomAnchor.style.display = "none";
    leftAnchor.style.display = "none";
    rightAnchor.style.display = "none";
  }
}

function updateVideoPosition(){
    updatePosition(video,videoX,videoY,videoW,videoH);
    updateAnchors(null)
}

function updateAnchors(){
    const topY = videoY-5+trimTop;
    const leftX = videoX-5+trimLeft;
    const bottomY = videoY+videoH-5-trimBottom;
    const rightX = videoX+videoW-5-trimRight;

    const midX = leftX+(Math.abs(leftX-rightX)/2);
    const midY = topY+(Math.abs(topY-bottomY)/2);

    video.style.clipPath = `inset(${trimTop}px ${trimRight}px ${trimBottom}px ${trimLeft}px round ${borderRadius}px)`;
    
    updatePosition(scaleAnchor,rightX,topY,10,10);
    updatePosition(topAnchor,midX,topY,10,10);
    updatePosition(bottomAnchor,midX,bottomY,10,10);
    updatePosition(leftAnchor,leftX,midY,10,10);
    updatePosition(rightAnchor,rightX,midY,10,10);
}

function updatePosition(element,x,y,w,h){
  element.style.left = x + "px";
  element.style.top = y + "px";
  element.style.width = w + "px";
  element.style.height = h + "px";
}