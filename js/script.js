// GLAMBYOYIN — shared site behavior

document.addEventListener("DOMContentLoaded", function () {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initNav();
  initVideoSources();
  initRevealAndVideoVisibility();
  initParallax();
  initFooterYear();

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

  // ---------- Video placeholders: wire config (see js/videos.js) to markup ----------
  function initVideoSources() {
    var videoEls = document.querySelectorAll(".js-video[data-video]");
    if (!videoEls.length || typeof GLAMBYOYIN_VIDEOS === "undefined") return;

    videoEls.forEach(function (video) {
      var cfg = GLAMBYOYIN_VIDEOS[video.dataset.video];
      if (!cfg) return;

      video.poster = cfg.poster;
      // Belt-and-suspenders: paint the poster as a CSS background too, so the
      // frame never looks empty even if a browser handles `poster` oddly.
      video.style.backgroundImage = "url('" + cfg.poster + "')";
      video.style.backgroundSize = "cover";
      video.style.backgroundPosition = "center";
      if (cfg.title) video.setAttribute("aria-label", cfg.title);

      var source = document.createElement("source");
      source.src = cfg.src;
      source.type = "video/mp4";
      video.appendChild(source);
      // A missing placeholder file (expected until real footage is added)
      // just leaves the poster/background showing — nothing to handle.
    });
  }

  // ---------- Scroll reveal + video play/pause ----------
  // Deliberately rect-based rather than IntersectionObserver: several
  // reveal/video elements sit inside .reveal-mask frames that animate via
  // clip-path, and a target clipped to zero area can make an
  // IntersectionObserver report a false "not intersecting" — a simple
  // getBoundingClientRect() check against the viewport has no such edge case.
  function initRevealAndVideoVisibility() {
    var revealSelector = ".reveal, .reveal-scale, .reveal-mask, .reveal-left, .reveal-right";

    // Stagger direct children inside known groups so grids/rows cascade in.
    [".portfolio-grid", ".experience-rows"].forEach(function (groupSelector) {
      document.querySelectorAll(groupSelector).forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, i) {
          var delay = Math.min(i * 80, 400) + "ms";
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

    var videoEls = Array.prototype.slice.call(document.querySelectorAll(".js-video[data-video]"));

    function inViewport(rect, leadIn) {
      return rect.bottom > 0 && rect.top < window.innerHeight - (leadIn || 0);
    }

    function checkReveal() {
      if (!revealEls.length) return;
      revealEls = revealEls.filter(function (el) {
        var rect = el.getBoundingClientRect();
        if (inViewport(rect, window.innerHeight * 0.08)) {
          el.classList.add("is-visible");
          return false;
        }
        return true;
      });
    }

    function checkVideos() {
      if (reducedMotion || !videoEls.length) return;
      videoEls.forEach(function (video) {
        var wrapper = video.closest(".media-frame, .hero-media, .video-landscape-frame, .final-moment") || video;
        if (inViewport(wrapper.getBoundingClientRect())) {
          if (video.paused) video.play().catch(function () {});
        } else if (!video.paused) {
          video.pause();
        }
      });
    }

    var ticking = false;
    function onScrollOrResize() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        checkReveal();
        checkVideos();
        ticking = false;
      });
    }

    checkReveal();
    checkVideos();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
  }

  // ---------- Subtle parallax (desktop only, motion-safe) ----------
  function initParallax() {
    if (reducedMotion) return;
    var targets = document.querySelectorAll("[data-parallax]");
    if (!targets.length || !window.matchMedia("(min-width: 720px)").matches) return;

    var ticking = false;

    function update() {
      targets.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var viewportCenter = window.innerHeight / 2;
        var elementCenter = rect.top + rect.height / 2;
        var distance = (elementCenter - viewportCenter) / window.innerHeight;
        var offset = distance * 26; // px of drift, kept subtle
        el.style.transform = "scale(1.08) translateY(" + offset.toFixed(1) + "px)";
      });
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    update();
  }

  // ---------- Footer year ----------
  function initFooterYear() {
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }
});
