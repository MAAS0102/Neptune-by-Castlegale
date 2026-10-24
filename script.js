// Full-screen menu overlay
(function () {
  var btn = document.getElementById('menuBtn');
  var overlay = document.getElementById('menuOverlay');
  var close = document.getElementById('menuClose');
  if (!btn || !overlay || !close) return;

  function open() {
    overlay.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    close.focus();
  }
  function shut() {
    overlay.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    btn.focus();
  }

  btn.addEventListener('click', open);
  close.addEventListener('click', shut);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) shut();
  });
  overlay.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') shut();
  });
})();
