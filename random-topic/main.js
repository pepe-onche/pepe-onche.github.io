var max = 600000;

async function redirect() {
  window.location.replace(await getRandomTopicURL())
}

async function newTab() {
  var win = window.open(await getRandomTopicURL(), '_blank');
  win.focus();
}

async function getRandomTopicURL() {
  let done = false
  let topicId = null
  let url = null
  let tries = 0

  while (!done) {
    if (tries >= 8) throw Error()

    topicId = Math.floor(Math.random()*max+1)
    url = 'https://onche.org/topic/'+topicId
    const res = await fetch('https://corsproxy.io/?' + encodeURIComponent(url), {
      redirect: 'manual'
    })

    if (res.ok) {
      done = true
    }

    tries += 1
  }

  return url
}
