/* ==========================================================================
   script.js : the behaviour of the page (JavaScript)
   ==========================================================================
   Three languages make up a web page, and each has one job:
     - index.html : WHAT is on the page (the content and its structure)
     - style.css  : HOW it looks (colours, sizes, layout)
     - script.js  : WHAT IT DOES when you interact with it (this file)

   JavaScript runs inside the visitor's browser, line by line, a bit like a
   Python script. The browser reads this file because the last line of
   index.html says <script src="script.js"></script>.

   This file has one job: open and close the full-screen menu.

   Comparing to Python:
     Python                      JavaScript
     ------                      ----------
     # comment                   // comment   (or a block like this one)
     def name(): ...             function name() { ... }
     if x and not y:             if (x && !y) { ... }
     x = 5                       var x = 5;
     print(x)                    console.log(x)
     return                      return
     None                        null
     True / False                true / false
     blocks use indentation      blocks use { curly braces }
     lines end with a newline    statements end with a semicolon ;
   ========================================================================== */


/* --------------------------------------------------------------------------
   The wrapper around everything: (function () { ... })();
   --------------------------------------------------------------------------
   This looks odd but it is a common pattern. It defines an anonymous
   function (a function with no name) and calls it immediately, which is the
   final "()" on the last line of the file.

   Why do it? Variables created inside a function are private to it. Python
   does the same thing: a variable made inside a def is local and does not
   leak into the rest of the program. Here that stops names like "btn" from
   clashing with any other script that might be added to the page later.
   -------------------------------------------------------------------------- */
(function () {

  /* ------------------------------------------------------------------------
     Finding the HTML elements this script needs to control
     ------------------------------------------------------------------------
     "document" is the browser's live copy of index.html, organised as a tree
     of elements. document.getElementById("menuBtn") searches that tree for
     the one element whose id attribute is "menuBtn" and hands it back, much
     like looking up a key in a Python dictionary.

     "var" declares a variable. The three ids used here match the id="..."
     attributes written in index.html:
       menuBtn     -> the "MENU" button in the header
       menuOverlay -> the full-screen menu panel
       menuClose   -> the "x" button inside that panel
     ------------------------------------------------------------------------ */
  var btn = document.getElementById('menuBtn');
  var overlay = document.getElementById('menuOverlay');
  var close = document.getElementById('menuClose');

  /* A safety check. If any lookup found nothing (for example this script is
     loaded on a page that has no menu), the variable holds null, which is
     JavaScript's version of Python's None. "!btn" means "btn is empty".
     "||" means "or", like Python's "or". "return" exits the whole wrapper
     function early, so the rest of the file does not run and cannot crash. */
  if (!btn || !overlay || !close) return;


  /* ------------------------------------------------------------------------
     function open(): show the menu
     ------------------------------------------------------------------------
     Like "def open():" in Python. Nothing inside it runs now. It only runs
     later, when something calls it (the button click set up further down).
     ------------------------------------------------------------------------ */
  function open() {

    /* "hidden" is a built-in HTML attribute. In index.html the menu starts
       with the word "hidden" on it, which makes the browser not display it.
       Setting overlay.hidden to false removes that attribute, so the menu
       appears. */
    overlay.hidden = false;

    /* aria-expanded is an accessibility attribute. Screen readers (software
       that reads pages aloud for blind users) read it to announce whether the
       button's menu is currently open. setAttribute(name, value) writes an
       attribute onto an element. The value is the text 'true', not the
       boolean. */
    btn.setAttribute('aria-expanded', 'true');

    /* Every element has a .style property for adding CSS from JavaScript.
       "overflow: hidden" on the whole page body switches off scrolling, so
       the page behind the menu cannot move while the menu is open. */
    document.body.style.overflow = 'hidden';

    /* .focus() moves the keyboard cursor onto the close button. People who
       use the keyboard instead of a mouse can then press Enter straight
       away to close the menu. */
    close.focus();
  }


  /* ------------------------------------------------------------------------
     function shut(): hide the menu again
     ------------------------------------------------------------------------
     The exact reverse of open(). It is called "shut" instead of "close"
     because "close" is already the variable name used above for the button.
     ------------------------------------------------------------------------ */
  function shut() {
    overlay.hidden = true;                          // put the menu away again
    btn.setAttribute('aria-expanded', 'false');     // tell screen readers it is closed
    document.body.style.overflow = '';              // an empty string removes the rule, so scrolling is back
    btn.focus();                                    // return the keyboard cursor to the MENU button
  }


  /* ------------------------------------------------------------------------
     Event listeners: "when X happens, run this function"
     ------------------------------------------------------------------------
     An event is something that happens on the page: a click, a key press, a
     mouse move. element.addEventListener(eventName, function) says "when
     this event happens on this element, call this function".

     In Python terms it is like registering a callback. Nothing happens at
     this point. The browser simply remembers the instruction and waits.

     Note that we pass open and shut with no brackets. That hands over the
     function itself so it can be called later. Writing open() would call it
     right now.
     ------------------------------------------------------------------------ */
  btn.addEventListener('click', open);     // clicking MENU opens the menu
  close.addEventListener('click', shut);   // clicking the x closes it

  /* A function can also be written inline, right where it is needed.
     "function (e) { ... }" is an unnamed function, a bit like a Python
     lambda but allowed to hold many lines. The browser passes it the event
     object, which this code calls "e", describing what just happened.

     Here the event is "keydown", any key press anywhere on the page
     (document). e.key is the name of the key pressed. "===" tests for equal
     (Python's ==). "&&" means "and". "!overlay.hidden" means "the menu is
     NOT hidden", in other words it is currently open.

     So: if the Escape key is pressed while the menu is open, close it. */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) shut();
  });

  /* Clicks inside the menu panel. When something inside an element is
     clicked, the click is reported on the exact thing clicked (e.target).
     tagName holds that element's type in capital letters, for example 'A'
     for a link (HTML's <a>). If a link was clicked, close the menu so the
     visitor lands on the new page or section with the menu out of the way. */
  overlay.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') shut();
  });

/* The closing "})();" has three parts:
     }   ends the body of the wrapper function opened at the top
     )   closes the bracket that wrapped the whole function
     ()  calls the function immediately, so everything above runs once as
         soon as the page loads */
})();


/* ==========================================================================
   Extra behaviour for the other pages
   ==========================================================================
   Each block below is wrapped in its own (function () { ... })(); like the
   menu code above, so its variables stay private. Each one first looks for
   its elements, and does nothing if the page does not have them, so this one
   file can be shared by every page.
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. Switch on the "js" marker
   --------------------------------------------------------------------------
   document.documentElement is the <html> element, the top of the page.
   .classList.add('js') gives it class="js". The CSS rules that start with
   ".js" (the scroll-in animation) therefore apply only when JavaScript is
   running, so nothing stays invisible if the script fails to load.
   -------------------------------------------------------------------------- */
(function () {
  document.documentElement.classList.add('js');
})();


/* --------------------------------------------------------------------------
   2. Slide-in as you scroll (the three pillars on the Why Neptune page)
   --------------------------------------------------------------------------
   Every element with class="slide-in" gets a number called --p (a CSS
   variable) that goes from 0 to 1 as the visitor scrolls it up the screen.
   style.css turns that number into a sideways movement and a fade, so the
   box slides in from the left or right edge in step with the scrolling.

   How the number is worked out, for one box:
     - getBoundingClientRect().top is the distance in pixels from the top of
       the window to the top of the box. It is the window height when the box
       is just about to enter at the bottom, and gets smaller as the page
       scrolls.
     - (windowHeight - top) is how far the box has come up from the bottom.
     - dividing that by (windowHeight * 0.45) says "the box has fully arrived
       once it has travelled up 45% of the window height".
     - Math.min(1, Math.max(0, x)) squeezes the result into the range 0 to 1,
       like Python's min(1, max(0, x)).
     - p * (2 - p) is an "ease-out" curve: fast at first, gently slowing
       down at the end, which looks more natural than a straight line.
   -------------------------------------------------------------------------- */
(function () {
  var items = document.querySelectorAll('.slide-in');
  if (!items.length) return;                 // no such elements on this page

  /* Visitors who asked their device for less motion see the boxes at rest. */
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function update() {
    var h = window.innerHeight;
    items.forEach(function (el) {
      var p = 1;
      if (!calm) {
        var top = el.getBoundingClientRect().top;
        p = Math.min(1, Math.max(0, (h - top) / (h * 0.45)));
        p = p * (2 - p);
      }
      el.style.setProperty('--p', p);        // hand the number to the CSS
    });
  }

  /* Run once now, then again whenever the page scrolls or the window is
     resized. requestAnimationFrame asks the browser to run the function just
     before it next draws the screen, so it is not run more often than needed. */
  var waiting = false;
  function onScroll() {
    if (waiting) return;
    waiting = true;
    window.requestAnimationFrame(function () { waiting = false; update(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();


/* --------------------------------------------------------------------------
   3. Carousels (the NEXT > buttons)
   --------------------------------------------------------------------------
   Each carousel in the HTML is a box with class "carousel", holding a
   sideways-scrolling strip ("slides") and a NEXT button. Clicking NEXT
   scrolls the strip left by one strip-width, which brings the next slide
   into view. After the last slide it goes back to the first.
   -------------------------------------------------------------------------- */
(function () {
  document.querySelectorAll('.carousel').forEach(function (box) {
    /* box.querySelector finds the first matching element INSIDE this box. */
    var strip = box.querySelector('.slides');
    var next = box.querySelector('.carousel-next');
    if (!strip || !next) return;

    next.addEventListener('click', function () {
      /* scrollLeft is how far the strip is scrolled, clientWidth is its
         visible width and scrollWidth is its full length. When
         scrollLeft + clientWidth reaches scrollWidth, we are at the end.
         The "- 4" allows for tiny rounding differences. */
      var atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4;
      if (atEnd) {
        strip.scrollTo({ left: 0 });                        // back to the start
      } else {
        strip.scrollBy({ left: strip.clientWidth });        // one slide to the right
      }
    });
  });
})();


/* --------------------------------------------------------------------------
   4. The contact form
   --------------------------------------------------------------------------
   This site has no server, so the form cannot send anything itself.
   Instead, when it is submitted we build a "mailto:" link from what the
   visitor typed and open it, which starts a new email in their email
   program, already filled in and addressed to us. The visitor presses send.

   e.preventDefault() stops the browser's normal form submission.
   encodeURIComponent() converts text so it is safe inside a web address (for
   example a space becomes %20). "\n" is a new line, like in Python.
   -------------------------------------------------------------------------- */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements['name'].value;
    var email = form.elements['email'].value;
    var company = form.elements['company'].value;
    var message = form.elements['message'].value;

    var subject = 'Neptune enquiry from ' + name;
    var body = 'Name: ' + name + '\n' +
               'Email: ' + email + '\n' +
               'Company / plant: ' + company + '\n\n' +
               message;

    window.location.href = 'mailto:info@castlegale.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    /* Show the thank-you note under the button. Removing the "hidden"
       attribute (setting .hidden to false) makes it visible. */
    var note = document.getElementById('formNote');
    if (note) note.hidden = false;
  });
})();


/* --------------------------------------------------------------------------
   5. THE ANIMATION LIST: which things animate when they scroll into view
   --------------------------------------------------------------------------
   Each line below is one animation, written as a Python-style list:

       [ 'which elements', 'effect', stagger, extra delay in seconds ],

   - 'which elements' is a CSS selector, the same kind used in style.css
     (".hero h2" means every <h2> inside an element with class="hero").
   - 'effect' is one of:
       rise   comes up from below        drop   comes down from above
       left   slides in from the left    right  slides in from the right
       pop    grows with a little bounce spin   turns while growing
       fade   just fades in
   - stagger (true or false, optional): when several matching elements share
     the same parent (for example the three footer columns), true makes them
     arrive one after another, 0.1 seconds apart, instead of all together.
   - the last number (optional) is an extra wait in seconds before it starts.

   TO REMOVE AN ANIMATION from one part of the site, delete its line. TO
   CHANGE IT, change the effect word. To remove every one of these scroll
   animations at once, delete this whole section 5 (everything from the
   comment above down to the end of the file). Each animation plays once only.

   Animations that need no JavaScript (the drifting water, buttons that lift,
   the menu items, the FAQ answers) are in style.css, section 6C, each marked
   with how to remove it.
   -------------------------------------------------------------------------- */
(function () {

  var ANIMATIONS = [
    /* --- Header: plays as soon as the page loads --- */
    ['.site-header .logo', 'drop'],                              // the logo drops in
    ['.wordmark a', 'letters'],                                  // NEPTUNE (the link inside the heading) appears one letter at a time (special effect, see below)
    ['.tagline', 'rise', false, 0.7],                            // "Your Plant, Your Way." rises after the letters
    ['.page-intro', 'rise'],                                     // the title strip on the extra pages
    ['.menu-btn', 'fade', false, 0.5],                           // the MENU button fades in
    ['.contact-btn', 'fade', false, 0.6],                        // the Contact us button fades in

    /* --- Home page --- */
    ['.values', 'rise'],                                         // the big teal sentence
    ['.hero h2', 'rise'],                                        // the headline
    ['.testimonial', 'left'],                                    // the testimonial slides in from the left
    ['.hero .btn', 'rise'],                                      // the "More stories" button
    ['.video-frame', 'pop'],                                     // the video pops up
    ['.split:not(.reverse) .split-text', 'left'],                // Problem: text from the left
    ['.split:not(.reverse) .media-box', 'right'],                // Problem: picture from the right
    ['.split.reverse .media-box', 'left'],                       // Solution: picture from the left
    ['.split.reverse .split-text', 'right'],                     // Solution: text from the right
    ['.faq details', 'rise', true],                              // FAQ questions, one after another
    ['.cta-box', 'pop'],                                         // the call-to-action box pops up
    ['.or', 'spin', false, 0.4],                                 // the circled "or" spins in
    ['.water-band p', 'rise', true],                             // the two lines in the water band

    /* --- Headings of sections (every <h2> that sits directly in a section and has no class) --- */
    ['section > h2:not([class])', 'rise'],

    /* --- Why Neptune page (the three pillars have their own slide-in in section 2) --- */
    ['.pillar .big-c', 'pop', false, 0.3],                       // the coloured C pops as each box arrives
    ['.learn-band h2', 'rise'],
    ['.learn-band .btn', 'rise', true],
    ['.carousel', 'pop'],                                        // both carousels
    ['.quote > *', 'rise', true],                                // "Request a quote" and "Want to find out more?" blocks

    /* --- Features page --- */
    ['.feature', 'rise'],                                        // each big box rises
    ['.feature:not(.reverse) .feature-text', 'left'],            // text and picture arrive from opposite sides
    ['.feature:not(.reverse) .media-box', 'right'],
    ['.feature.reverse .feature-text', 'right'],
    ['.feature.reverse .media-box', 'left'],

    /* --- Our team page --- */
    ['.team-title', 'rise'],                                     // the big headings (their underline is drawn by style.css)
    ['.team-hint', 'fade'],                                      // the small hint under "Led by Science"
    ['.person', 'pop', true],                                    // the four person bubbles pop up one after another
    ['.team-bubble', 'rise'],

    /* --- Contact page --- */
    ['.contact-details', 'left'],
    ['.contact-form label, .contact-form .btn', 'rise', true],   // form fields rise one after another

    /* --- Footer (on every page) --- */
    ['.footer-left, .footer-menu, .footer-address', 'rise', true],
    ['.footer-bottom p', 'fade']
  ];

  /* Visitors who asked for less motion get no animation at all. Leaving the
     function here means nothing is hidden and nothing moves. */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ------------------------------------------------------------------------
     Step 1: tag the chosen elements.
     ------------------------------------------------------------------------
     For each line in the list, document.querySelectorAll(selector) finds all
     the matching elements. "forEach" runs a function on each, like a Python
     "for el in elements:" loop.

     A Map is like a Python dict. "counts" remembers, for each parent
     element, how many matches inside it have been seen so far, so that the
     stagger delay can be worked out (0 s, 0.1 s, 0.2 s, ...). It is capped at
     0.5 s so a long list does not make the last item wait too long.
     ------------------------------------------------------------------------ */
  ANIMATIONS.forEach(function (rule) {
    var selector = rule[0], effect = rule[1], stagger = rule[2], extra = rule[3] || 0;
    var counts = new Map();

    document.querySelectorAll(selector).forEach(function (el) {
      if (el.classList.contains('anim')) return;       // already animated by an earlier line, leave it alone

      /* The special effect "letters": split the word into one <span> per
         letter, and give each its own small delay so they appear in a wave.
         The original text is kept as aria-label so screen readers still read
         "NEPTUNE" as one word, and each letter is hidden from them. */
      if (effect === 'letters') {
        var word = el.textContent.trim();
        el.setAttribute('aria-label', word);
        el.textContent = '';
        word.split('').forEach(function (ch, i) {
          var s = document.createElement('span');
          s.className = 'letter anim anim-rise';
          s.setAttribute('aria-hidden', 'true');
          s.style.setProperty('--delay', (0.1 + i * 0.08) + 's');
          s.textContent = ch;
          el.appendChild(s);
        });
        return;
      }

      var n = 0;
      if (stagger) {
        n = counts.get(el.parentNode) || 0;            // how many siblings came before this one
        counts.set(el.parentNode, n + 1);
      }
      el.classList.add('anim', 'anim-' + effect);
      el.style.setProperty('--delay', (extra + Math.min(n * 0.1, 0.5)) + 's');
    });
  });

  /* ------------------------------------------------------------------------
     Step 2: watch them, and play each one the first time it comes into view.
     ------------------------------------------------------------------------
     The same IntersectionObserver idea as section 2: the browser tells us
     when an element enters the visible part of the window. We then add the
     class "in-view", which style.css turns into the animation, and stop
     watching, so it plays once only. "threshold: 0.1" means an element counts as
     in view once 10% of it is showing. If a browser has no
     IntersectionObserver, everything is shown at once.
     ------------------------------------------------------------------------ */
  var targets = document.querySelectorAll('.anim');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(function (el) { observer.observe(el); });
})();



/* --------------------------------------------------------------------------
   6. Marking the current page in the menus
   --------------------------------------------------------------------------
   location.pathname is the path part of the address in the browser, for
   example "/team.html". .split('/') cuts it into pieces at each slash (like
   Python's str.split) and .pop() takes the last piece, the file name. If the
   path ends in a slash the last piece is empty, which means the home page,
   so "||" ("or") falls back to 'index.html'.

   Then every link in the two menus is checked: if the file name in its href
   (the part before any "#") matches this page, the link gets
   aria-current="page". style.css lights up links that have it. To remove
   this feature, delete this section 6 and the "aria-current" block in
   style.css.
   -------------------------------------------------------------------------- */
(function () {
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu-overlay a, .footer-menu a').forEach(function (a) {
    var target = (a.getAttribute('href') || '').split('#')[0];
    if (target === here) a.setAttribute('aria-current', 'page');
  });
})();


/* --------------------------------------------------------------------------
   7. The number that counts up ("68.4%" in the home page headline)
   --------------------------------------------------------------------------
   The HTML holds <span class="count-up" data-to="68.4">68.4</span>. When it
   scrolls into view this code counts from 0 up to the value in data-to over
   1.6 seconds. .dataset.to reads the data-to attribute. toFixed(1) rounds
   to one decimal place, like Python's f"{x:.1f}".

   The speed follows an "ease-out" curve (1 - (1 - t) cubed): quick at the
   start, slowing as it nears the final number. requestAnimationFrame calls
   the function before every screen redraw, and "t" is how far through the
   1.6 seconds we are, from 0 to 1. Visitors with reduced motion see the
   final number straight away. To remove this effect, delete this section 7.
   -------------------------------------------------------------------------- */
(function () {
  var items = document.querySelectorAll('.count-up');
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  function run(el) {
    var target = parseFloat(el.dataset.to);
    var start = null;
    var duration = 1600;                           // milliseconds
    el.textContent = (0).toFixed(1);
    function step(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(1);
      if (t < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        setTimeout(function () { run(entry.target); }, 400);   // wait for the headline to finish rising
      }
    });
  }, { threshold: 0.5 });
  items.forEach(function (el) { observer.observe(el); });
})();


/* --------------------------------------------------------------------------
   8. Back to top button
   --------------------------------------------------------------------------
   document.createElement('button') makes a new button that is not on the page
   yet, and document.body.appendChild(...) adds it at the end of the page.
   Once the visitor has scrolled more than 600 pixels (window.scrollY) it gets
   the class "show", which style.css turns into a fade-in. Clicking it scrolls
   smoothly back to the top. To remove it, delete this section 8 and the
   ".back-to-top" block in style.css.
   -------------------------------------------------------------------------- */
(function () {
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&uarr;';                         // &uarr; is an up arrow
  document.body.appendChild(btn);

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  });

  function check() { btn.classList.toggle('show', window.scrollY > 600); }
  window.addEventListener('scroll', check, { passive: true });
  check();
})();
