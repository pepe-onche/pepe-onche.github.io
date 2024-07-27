var max = 600000;

function redirect() {
  window.location.replace('https://onche.org/topic/'+Math.floor(Math.random()*max+1))
}

function newTab() {
  var win = window.open('https://onche.org/topic/'+Math.floor(Math.random()*max+1), '_blank');
  win.focus();
}
