function setFavicons(favImg) {
  let headTitle = document.querySelector("head");
  let setFavicon = document.createElement("link");
  setFavicon.setAttribute("rel", "shortcut icon");
  setFavicon.setAttribute("href", favImg);
  headTitle.appendChild(setFavicon);
}
setFavicons("https://cdn-icons-png.flaticon.com/512/10750/10750900.png");

const evilButton = document.getElementById("evil-button");
const OFFSET = 100;

evilButton.addEventListener("click", () => {
  alert("Nice Try");
  window.close();
});

document.addEventListener("mousemove", (e) => {
  const x = e.pageX;
  const y = e.pageY;
  const buttonBox = evilButton.getBoundingClientRect();
  const horizontalDistanceFrom = distanceFromCenter(
    buttonBox.x,
    x,
    buttonBox.width
  );
  const verticalDistanceFrom = distanceFromCenter(
    buttonBox.y,
    y,
    buttonBox.height
  );
  const horizontalOffset = buttonBox.width / 2 + OFFSET;
  const verticalOffset = buttonBox.height / 2 + OFFSET;
  if (
    Math.abs(horizontalDistanceFrom) <= horizontalOffset &&
    Math.abs(verticalDistanceFrom) <= verticalOffset
  ) {
    setButtonPosition(
      buttonBox.x + (horizontalOffset / horizontalDistanceFrom) * 10,
      buttonBox.y + (verticalOffset / verticalDistanceFrom) * 10
    );
  }
});

function setButtonPosition(left, top) {
  const windowBox = document.body.getBoundingClientRect();
  const buttonBox = evilButton.getBoundingClientRect();

  if (distanceFromCenter(left, windowBox.left, buttonBox.width) < 0) {
    left = windowBox.right - buttonBox.width - OFFSET;
  }
  if (distanceFromCenter(left, windowBox.right, buttonBox.width) > 0) {
    left = windowBox.left + OFFSET;
  }
  if (distanceFromCenter(top, windowBox.top, buttonBox.height) < 0) {
    top = windowBox.bottom - buttonBox.height - OFFSET;
  }
  if (distanceFromCenter(top, windowBox.bottom, buttonBox.height) > 0) {
    top = windowBox.top + OFFSET;
  }

  evilButton.style.left = `${left}px`;
  evilButton.style.top = `${top}px`;
}

function distanceFromCenter(boxPosition, mousePosition, boxSize) {
  return boxPosition - mousePosition + boxSize / 2;
}

const button = document.getElementById("runaway-btn");

const animateMove = (element, prop, pixels) =>
  anime({
    targets: element,
    [prop]: `${pixels}px`,
    easing: "easeOutCirc"
  });

["mouseover", "click"].forEach(function (el) {
  button.addEventListener(el, function (event) {
    const top = getRandomNumber(window.innerHeight - this.offsetHeight);
    const left = getRandomNumber(window.innerWidth - this.offsetWidth);

    animateMove(this, "left", left).play();
    animateMove(this, "top", top).play();
  });
});

const getRandomNumber = (num) => {
  return Math.floor(Math.random() * (num + 1));
};

document.getElementById("button").addEventListener(
  "click",
  (function (clicked) {
    return function () {
      if (!clicked) {
        var last = this.innerHTML;
        this.innerHTML = "why is it so hard";
        clicked = true;
        setTimeout(
          function () {
            this.innerHTML = last;
            clicked = false;
          }.bind(this),
          2000
        );
      }
    };
  })(false),
  this
);

/* init */

var setRinging = function () {
  setTimeout(function () {
    $(".ringing").addClass("-ringing");
  }, 600);
};

setRinging();

/* user */

$("#accept").click(function () {
  $(".ringing").removeClass("-ringing");

  setTimeout(function () {
    $(".ringing").addClass("-flip");

    $(".speaking").removeClass("flipback");

    onStart();
  }, 0);
});

$("#hold").click(function () {
  $(".speaking").toggleClass("hold");

  onPause($(".speaking").hasClass("hold"));
});

$("#refuse").click(function () {
  $(".ringing").removeClass("-ringing");

  setTimeout(function () {
    $(".ringing").addClass("-fadeout");
  }, 0);

  setTimeout(function () {
    $(".ringing").addClass("-ringing").removeClass("-fadeout");
  }, 2000);
});

$("#drop").click(function () {
  onStop();

  $(".speaking").addClass("-drop");

  setTimeout(function () {
    $(".ringing").removeClass("-flip");

    $(".speaking")
      .addClass("flipback")
      .removeClass("hold")
      .removeClass("-drop");

    setRinging();
  }, 2000);
});

$(".sound").click(function () {
  muted = !muted;
  onMuteChange();
  onMute(muted);
});

var onMuteChange = function () {
  if (muted) {
    $(".fa-ban").removeClass("hidden");
    $(".fa-phone").removeClass("hidden");
    $("#eq").addClass("hidden");
  } else {
    $(".fa-ban").addClass("hidden");
    $(".fa-phone").addClass("hidden");
    $("#eq").removeClass("hidden");
  }
};

/* eq */

var muted = true;
var stopped = false;

var analyser = null;
var audio = null;

var onStart = function () {
  onMuteChange();
  stopped = false;
  play(muted);
};

var onPause = function (pause) {
  if (!audio) {
    return;
  }
  if (pause) {
    audio.pause();
  } else {
    audio.play();
  }
};

var onStop = function () {
  stopped = true;
  if (!audio) {
    return;
  }
  audio.pause();
  audio.currentTime = 0;
};

var onMute = function (mute) {
  if (!audio) {
    return;
  }
  audio.volume = mute ? 0 : 1;
};

var newAudioContext = function () {
  var Context = window["AudioContext"] || window["webkitAudioContext"];
  return new Context();
};

function play(muted) {
  var context, source;

  if (analyser === null) {
    context = newAudioContext();
    analyser = context.createAnalyser();

    audio = new Audio(
      "https://myzuka.org/Song/Play/928634?t=635644027144137542&s=6c6027dd9659abea2d0fd7693f43ef92"
    );

    source = context.createMediaElementSource(audio);
    source.connect(analyser);

    analyser.connect(context.destination);
  }

  audio.volume = muted ? 0 : 1;
  audio.play();

  startEq(analyser);
}

function startEq(analyser) {
  var canvas = document.getElementById("eq");
  var context2d = canvas.getContext("2d");
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);

  var animate = function () {
    if (muted) {
      setTimeout(function () {
        requestAnimationFrame(animate);
      }, 200);
      return;
    }

    var i, c, sum;

    var color = "#707084",
      w = 9,
      hx = 60,
      x = 0,
      y = 160,
      space = 9 + 2,
      count = 40,
      val = frequencyData.length / count;

    context2d.clearRect(0, 0, 300, 300);

    analyser.getByteFrequencyData(frequencyData);

    sum = 0;
    c = 0;
    for (i = 0; i < frequencyData.length; i++) {
      sum += frequencyData[i];
      if (c++ > val) {
        context2d.beginPath();
        context2d.rect(x + (i / val - 1) * space, y, w, -(sum / hx));
        context2d.fillStyle = color;
        context2d.fill();
        context2d.closePath();
        c = 0;
        sum = 0;
      }
    }

    if (stopped) {
      return;
    }

    setTimeout(function () {
      requestAnimationFrame(animate);
    }, 10);
  };

  requestAnimationFrame(animate);
}
