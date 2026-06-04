var currentTheme = 'before';

var cssLink = document.getElementById('theme-css');
var toggle = document.getElementById('toggle');
var labelBefore = document.getElementById('label-before');
var labelAfter = document.getElementById('label-after');
var formPreview = document.getElementById('form-preview');

function setTheme(theme) {
  currentTheme = theme;
  cssLink.href = 'css/' + theme + '.css';

  if (theme === 'after') {
    toggle.classList.add('active');
    labelBefore.classList.remove('active');
    labelAfter.classList.add('active');
    formPreview.classList.add('after-active');
  } else {
    toggle.classList.remove('active');
    labelBefore.classList.add('active');
    labelAfter.classList.remove('active');
    formPreview.classList.remove('after-active');
  }
}

function toggleTheme() {
  setTheme(currentTheme === 'before' ? 'after' : 'before');
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function highlightCSS(css) {
  var lines = css.split('\n');
  var result = '';
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var trimmed = line.trim();

    if (!trimmed || trimmed === '}') {
      result += '<span class="line-context">' + escapeHtml(line) + '</span>';
      continue;
    }

    if (trimmed.endsWith('{')) {
      result += '<span class="line-context"><strong style="color:#c4b5fd">' + escapeHtml(line) + '</strong></span>';
      continue;
    }

    if (trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.endsWith('*/')) {
      result += '<span class="line-context" style="color:rgba(255,255,255,0.3);font-style:italic">' + escapeHtml(line) + '</span>';
      continue;
    }

    var colonIdx = trimmed.indexOf(':');
    if (colonIdx > 0) {
      var prop = trimmed.substring(0, colonIdx);
      var value = trimmed.substring(colonIdx + 1);
      result += '<span class="line-context">  <span class="prop-name">' + escapeHtml(prop) + '</span>:<span class="prop-value">' + escapeHtml(value) + '</span></span>';
      continue;
    }

    result += '<span class="line-context">' + escapeHtml(line) + '</span>';
  }
  return result;
}

function loadCSSDiff() {
  var beforePanel = document.getElementById('diff-before');
  var afterPanel = document.getElementById('diff-after');

  fetch('css/before.css')
    .then(function(r) { return r.text(); })
    .then(function(beforeCSS) {
      beforePanel.innerHTML = highlightCSS(beforeCSS);
    });

  fetch('css/after.css')
    .then(function(r) { return r.text(); })
    .then(function(afterCSS) {
      afterPanel.innerHTML = highlightCSS(afterCSS);
    });
}

function downloadCSS() {
  fetch('css/after.css')
    .then(function(r) { return r.text(); })
    .then(function(css) {
      var blob = new Blob([css], { type: 'text/css' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'after.css';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
}

loadCSSDiff();
