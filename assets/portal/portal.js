// Renders one tile per valid entry of window.GAMES (defined in games.js).
// Uses textContent only; stores nothing; makes no network requests of its own.
(function () {
  'use strict';

  var container = document.getElementById('games');
  var games = window.GAMES;

  if (!container) { return; }
  if (!Array.isArray(games)) {
    console.warn('Portal: window.GAMES is missing or not an array; nothing to render.');
    return;
  }

  var ID_RE = /^[a-z0-9-]+$/;
  var BAD_URL_RE = /^\s*(http:|https:|\/\/|javascript:)/i;
  var seen = {};

  function isText(v) { return typeof v === 'string' && v.length > 0; }

  function validate(g, index) {
    if (!g || typeof g !== 'object') { return 'entry is not an object'; }
    if (!isText(g.id) || !ID_RE.test(g.id)) { return 'invalid id'; }
    if (g.id.charAt(0) === '_') { return 'id must not start with "_"'; }
    if (seen[g.id]) { return 'duplicate id'; }
    if (!isText(g.name) || g.name.length > 24) { return 'name must be 1-24 characters'; }
    if (!isText(g.image)) { return 'missing image'; }
    if (BAD_URL_RE.test(g.image)) { return 'image must be a relative path inside the site'; }
    if (g.href !== undefined && (!isText(g.href) || BAD_URL_RE.test(g.href))) {
      return 'href must be a relative path inside the site';
    }
    return null;
  }

  function makeTile(g) {
    var a = document.createElement('a');
    a.className = 'tile';
    a.href = g.href ? g.href : 'games/' + g.id + '/';

    var img = document.createElement('img');
    img.alt = '';
    img.width = 512;
    img.height = 512;
    img.loading = 'lazy';
    img.addEventListener('error', function () {
      if (img.parentNode) { img.parentNode.removeChild(img); }
      a.classList.add('tile--no-image');
    });
    img.src = g.image;

    var name = document.createElement('span');
    name.className = 'tile-name';
    name.textContent = g.name;

    a.appendChild(img);
    a.appendChild(name);
    return a;
  }

  games.forEach(function (g, i) {
    var problem = validate(g, i);
    if (problem) {
      console.warn('Portal: skipped games[' + i + ']: ' + problem + '.', g);
      return;
    }
    seen[g.id] = true;
    container.appendChild(makeTile(g));
  });
})();
