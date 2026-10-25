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
  });
})();
