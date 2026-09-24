// GLAMBYOYIN — video configuration
//
// Single source of truth for every <video class="js-video" data-video="…">
// placeholder on the page. To add a real film: drop the file into /videos
// and the poster into /images/posters, then update the matching entry below.
// Nothing else needs to change — script.js reads this object at load time.

const GLAMBYOYIN_VIDEOS = {
  hero: {
    src: "videos/hero.mp4",
    poster: "images/posters/hero-poster.svg",
    title: "GLAMBYOYIN — brand film",
    description: "Full-width hero film behind the opening wordmark.",
    orientation: "landscape"
  },
  "look-01": {
    src: "videos/look-01.mp4",
    poster: "images/posters/look-01-poster.svg",
    title: "GLAMBYOYIN — look film 01",
    description: "Portrait film that reveals itself as the visitor scrolls.",
    orientation: "portrait"
  },
  "look-02": {
    src: "videos/look-02.mp4",
    poster: "images/posters/look-02-poster.svg",
    title: "GLAMBYOYIN — look film 02",
    description: "Full-width film that scales gently as the visitor scrolls.",
    orientation: "landscape"
  },
  "look-03": {
    src: "videos/look-03.mp4",
    poster: "images/posters/look-03-poster.svg",
    title: "GLAMBYOYIN — look film 03",
    description: "Final portrait film, the closing moment before the CTA.",
    orientation: "portrait"
  }
};
