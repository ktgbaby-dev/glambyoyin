// GLAMBYOYIN — shared site behavior

document.addEventListener("DOMContentLoaded", function () {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Visitors who asked to save data or reduce motion get posters plus native
  // controls instead of autoplaying films.
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var noAutoplay = reducedMotion || saveData;
  var smallScreen = window.matchMedia("(max-width: 720px)");

  initNav();
  initScrollEffects();
  initFooterYear();
  initCopyButtons();

  // ---------- Mobile nav ----------
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    function closeMenu() {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  // ---------- Scroll reveal + films ----------
  // Rect-based rather than IntersectionObserver: the .reveal-mask frames
  // animate their media via clip-path, and a target clipped to zero area can
  // make an IntersectionObserver report a false "not intersecting".
  function initScrollEffects() {
    var revealSelector = ".reveal, .reveal-scale, .reveal-mask, .reveal-left, .reveal-right";

    // Stagger direct children inside known groups so rows and pairs cascade in.
    [".experience-rows", ".collection-supporting"].forEach(function (groupSelector) {
      document.querySelectorAll(groupSelector).forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, i) {
          var delay = Math.min(i * 90, 400) + "ms";
          if (child.matches(revealSelector)) child.style.transitionDelay = delay;
          child.querySelectorAll(revealSelector).forEach(function (nested) {
            nested.style.transitionDelay = delay;
          });
        });
      });
    });

    var revealEls = Array.prototype.slice.call(document.querySelectorAll(revealSelector));
    if (reducedMotion) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
      revealEls = [];
    }

    var films = collectFilms();

    function checkReveal() {
      if (!revealEls.length) return;
      var vh = window.innerHeight;
      revealEls = revealEls.filter(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < vh * 0.92) {
          el.classList.add("is-visible");
          return false;
        }
        return true;
      });
    }

    function checkFilms() {
      if (!films.length) return;
      var vh = window.innerHeight;
      var onScreen = [];

      films.forEach(function (film) {
        var rect = film.frame.getBoundingClientRect();
        // Attach poster + source only once the film is within reach, so nothing
        // below the fold costs a byte on first load.
        if (!film.ready && rect.top < vh * 2.5 && rect.bottom > -vh) loadFilm(film);
        if (!film.ready || noAutoplay) return;

        var ratio = visibleRatio(rect, vh);
        if (ratio >= 0.35) onScreen.push({ film: film, ratio: ratio });
        else pause(film.video);
      });

      if (noAutoplay) return;
      // Play only the most visible films; phones decode at most two at once.
      var cap = smallScreen.matches ? 2 : 3;
      onScreen.sort(function (a, b) { return b.ratio - a.ratio; });
      onScreen.forEach(function (entry, i) {
        if (i < cap) play(entry.film.video);
        else pause(entry.film.video);
      });
    }

    var ticking = false;
    function update() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        checkReveal();
        checkFilms();
        ticking = false;
      });
    }

    checkReveal();
    checkFilms();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) films.forEach(function (film) { pause(film.video); });
      else update();
    });
  }

  function collectFilms() {
    if (typeof GLAMBYOYIN_VIDEOS === "undefined") return [];
    var films = [];
    document.querySelectorAll(".js-video[data-video]").forEach(function (video) {
      var cfg = GLAMBYOYIN_VIDEOS[video.dataset.video];
      if (!cfg) return;
      if (cfg.title) video.setAttribute("aria-label", cfg.title);
      films.push({ video: video, cfg: cfg, frame: video.closest(".media-frame") || video, ready: false });
    });
    return films;
  }

  function loadFilm(film) {
    var video = film.video;
    video.poster = film.cfg.poster;
    // The poster doubles as a CSS background so the frame is never blank
    // between the poster being dropped and the first decoded frame painting.
    video.style.backgroundImage = "url('" + film.cfg.poster + "')";
    video.style.backgroundSize = "cover";
    video.style.backgroundPosition = "center";
    if (noAutoplay) video.controls = true;

    var source = document.createElement("source");
    source.src = film.cfg.src;
    source.type = "video/mp4";
    video.appendChild(source);
    film.ready = true;
  }

  // Share of the frame on screen; frames taller than the viewport count as
  // fully visible once they fill it.
  function visibleRatio(rect, vh) {
    var visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    if (visible <= 0 || rect.height <= 0) return 0;
    return Math.min(1, visible / Math.min(rect.height, vh));
  }

  function play(video) {
    if (video.paused) video.play().catch(function () { /* autoplay refused: poster stays */ });
  }

  function pause(video) {
    if (!video.paused) video.pause();
  }

  // ---------- Footer year ----------
  function initFooterYear() {
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  // ---------- Copy-to-clipboard (account number) ----------
  function initCopyButtons() {
    document.querySelectorAll(".copy-btn[data-copy]").forEach(function (btn) {
      var defaultText = btn.textContent;
      var resetTimer = null;

      function showCopied() {
        window.clearTimeout(resetTimer);
        btn.textContent = "Copied";
        btn.classList.add("copied");
        resetTimer = window.setTimeout(function () {
          btn.textContent = defaultText;
          btn.classList.remove("copied");
        }, 1600);
      }

      function fallbackCopy(value) {
        var input = document.createElement("textarea");
        input.value = value;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        try {
          document.execCommand("copy");
        } catch (e) {
          /* nothing more we can do without clipboard access */
        }
        document.body.removeChild(input);
      }

      btn.addEventListener("click", function () {
        var value = btn.dataset.copy;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(value)
            .then(showCopied)
            .catch(function () {
              fallbackCopy(value);
              showCopied();
            });
        } else {
          fallbackCopy(value);
          showCopied();
        }
      });
    });
  }
});
