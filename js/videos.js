// GLAMBYOYIN — video configuration
//
// Single source of truth for every <video class="js-video" data-video="…"> on
// the page. Films live in assets/makeup/ and assets/lashes/, each an H.264 MP4
// (720x1280, 30 fps, no audio track, faststart) with a JPEG poster frame of the
// same name. To swap a film, replace both files (keep the names) or point
// src/poster below at new ones; nothing else needs to change.
//
// Source files (GLAM BY OYIN.zip):
//   makeup-01  make up/IMG_4572.MOV    makeup-02  make up/IMG_5431.MOV
//   makeup-03  make up/IMG_8171.MP4    (trimmed at 38.85s to drop the Instagram end-card)
//   makeup-04  make up/IMG_9049.MOV
//   lashes-01  LASHES/IMG_1642.MOV     lashes-02  LASHES/IMG_1528.MOV
//   lashes-03  LASHES/IMG_4855.MOV
//
// Encode recipe for new footage (phone HEVC/4K sources play unreliably in
// Chrome/Firefox and are far too heavy to serve as-is):
//   ffmpeg -i SOURCE -map 0:v:0 -an -map_metadata -1 \
//     -vf "fps=30,scale=720:1280:flags=lanczos,format=yuv420p" \
//     -c:v libx264 -preset slow -crf 22 -profile:v high -level:v 4.0 \
//     -maxrate 3000k -bufsize 6000k -g 60 -movflags +faststart OUT.mp4
//   ffmpeg -ss SECONDS -i SOURCE -frames:v 1 -vf scale=720:1280 -q:v 4 OUT.jpg

const GLAMBYOYIN_VIDEOS = {
  "makeup-01": {
    src: "assets/makeup/makeup-01.mp4",
    poster: "assets/makeup/makeup-01.jpg",
    title: "GLAMBYOYIN makeup look, white gele and pearl choker",
    description: "Featured film in the In Motion section.",
    orientation: "portrait"
  },
  "makeup-02": {
    src: "assets/makeup/makeup-02.mp4",
    poster: "assets/makeup/makeup-02.jpg",
    title: "GLAMBYOYIN makeup look, braided updo and pearl necklace",
    description: "Featured film in the Makeup collection.",
    orientation: "portrait"
  },
  "makeup-03": {
    src: "assets/makeup/makeup-03.mp4",
    poster: "assets/makeup/makeup-03.jpg",
    title: "GLAMBYOYIN makeup look, pink gele",
    description: "Supporting film in the Makeup collection.",
    orientation: "portrait"
  },
  "makeup-04": {
    src: "assets/makeup/makeup-04.mp4",
    poster: "assets/makeup/makeup-04.jpg",
    title: "GLAMBYOYIN makeup look, orange gele and lace",
    description: "Supporting film in the Makeup collection.",
    orientation: "portrait"
  },
  "lashes-01": {
    src: "assets/lashes/lashes-01.mp4",
    poster: "assets/lashes/lashes-01.jpg",
    title: "GLAMBYOYIN lash work, close-up of one eye",
    description: "Featured film in the Lashes collection.",
    orientation: "portrait"
  },
  "lashes-02": {
    src: "assets/lashes/lashes-02.mp4",
    poster: "assets/lashes/lashes-02.jpg",
    title: "GLAMBYOYIN lash work, eyes closed",
    description: "Supporting film in the Lashes collection.",
    orientation: "portrait"
  },
  "lashes-03": {
    src: "assets/lashes/lashes-03.mp4",
    poster: "assets/lashes/lashes-03.jpg",
    title: "GLAMBYOYIN lash work, filmed from above",
    description: "Supporting film in the Lashes collection.",
    orientation: "portrait"
  }
};
