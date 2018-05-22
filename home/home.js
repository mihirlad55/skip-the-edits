window.onscroll = function() {lock()};

var box = document.getElementById("essays");

var locked = box.offsetTop - 120;

function lock() {
  if (window.pageYOffset >= locked) {
    box.classList.add("locked")
  } else {
    box.classList.remove("locked");
  }
}