// src/js/content-types/scrollytelling/scrollytelling-video.browser.js
var AmediaScrollytellingVideo = class extends HTMLElement {
  init() {
    if (this.isInit) {
      return;
    }
    this.isInit = true;
    const videoId = this.getAttribute("videoId");
    const videoClass = this.getAttribute("videoClass");
    const src = `https://lw-amedia-cf.lwcdn.com/v-${videoId}_high.mp4`;
    const poster = `https://lw-amedia-cf.lwcdn.com/i/v-i-${videoId}-1.jpg`;
    const videoHtml = `
            <video class="video ${videoClass}" playsinline muted loop preload="metadata" preload="auto" poster="${poster}">
                <source src="${src}" type="video/mp4">
            </video>
        `;
    this.insertAdjacentHTML("afterbegin", videoHtml);
  }
  connectedCallback() {
    this.init();
  }
};
if (customElements && !customElements.get("amedia-scrollytelling-video")) {
  customElements.define(
    "amedia-scrollytelling-video",
    AmediaScrollytellingVideo
  );
} else {
  console.warn("amedia-scrollytelling-video has already been defined");
}
