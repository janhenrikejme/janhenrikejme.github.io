// src/js/content-types/scrollytelling/scrollytelling.browser.js
function measureScroll(element) {
  const boundingClientRect = element.getBoundingClientRect();
  const { top, height } = boundingClientRect;
  const childCount = element.children.length;
  let frameHeight = window.innerHeight;
  if (childCount > 1) {
    frameHeight = height / (childCount - 1);
  }
  const adjustedTop = 1 - (top - frameHeight);
  const adjustedHeight = height + frameHeight;
  const embedProgress = 100 * adjustedTop / adjustedHeight;
  const frameIndex = Math.floor(adjustedTop / frameHeight);
  const frameTop = adjustedTop % frameHeight;
  const frameProgress = 100 * frameTop / frameHeight;
  return {
    embedProgress,
    frameIndex,
    frameProgress
  };
}
function checkIntersection(entries) {
  entries.forEach((entry) => {
    const mediaId = entry.target.getAttribute("data-scrollytelling-media");
    const media = this.querySelector(`#scrollytelling-media-${mediaId}`);
    const toggle = !(entry.intersectionRatio <= 0);
    media.classList.toggle("visible", toggle);
    media.classList.toggle("hidden", false);
    if (media.getAttribute("videoId")) {
      const video = media.getElementsByTagName("video")[0];
      if (video) {
        video.classList.toggle("playing", toggle);
        video.classList.toggle("hidden", false);
        if (toggle) {
          video.play();
        } else {
          video.pause();
        }
      }
    }
    if (media.getAttribute("smartEmbedUrl")) {
      let activeFrame = false;
      const handleScroll = () => {
        const { embedProgress, frameIndex, frameProgress } = measureScroll(
          entry.target
        );
        if (embedProgress < 0 && embedProgress > 100.0001) {
          activeFrame = false;
        } else {
          const embedProgressEvent = new CustomEvent("embedProgress", {
            detail: {
              embedProgress,
              frameIndex,
              frameProgress
            }
          });
          const frameProgressEvent = new CustomEvent("frameProgress", {
            detail: {
              frameIndex,
              frameProgress
            }
          });
          media.dispatchEvent(embedProgressEvent);
          media.dispatchEvent(frameProgressEvent);
          if (frameIndex !== activeFrame) {
            const frameIndexEvent = new CustomEvent("frameIndex", {
              detail: {
                frameIndex,
                frameProgress
              }
            });
            media.dispatchEvent(frameIndexEvent);
            activeFrame = frameIndex;
          }
        }
      };
      if (toggle) {
        const startEmbed = new CustomEvent("showEmbed", {
          detail: {
            url: media.getAttribute("smartEmbedUrl")
          }
        });
        media.dispatchEvent(startEmbed);
        window.addEventListener("scroll", handleScroll, { passive: true });
      } else {
        const endEmbed = new CustomEvent("hideEmbed", {
          detail: {
            url: media.getAttribute("smartEmbedUrl")
          }
        });
        media.dispatchEvent(endEmbed);
        window.removeEventListener("scroll", handleScroll, { passive: true });
      }
    }
  });
}
var AmediaScrollytelling = class extends HTMLElement {
  init() {
    this.createObserver();
    this.checkFbBrowser();
  }
  checkFbBrowser() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isFB = ua.indexOf("FBAN") > -1 || ua.indexOf("FBAV") > -1;
    this.classList.add(`is-fb-${isFB}`);
  }
  createObserver() {
    const options = {
      rootMargin: "0px 0px 100%",
      threshold: [0]
    };
    const intersectionObserver = new IntersectionObserver(
      checkIntersection.bind(this),
      options
    );
    const textContainers = [
      ...this.getElementsByClassName("scrollytelling-text-container")
    ];
    textContainers.forEach((element) => intersectionObserver.observe(element));
  }
  connectedCallback() {
    this.init();
  }
};
if (customElements && !customElements.get("amedia-scrollytelling")) {
  customElements.define("amedia-scrollytelling", AmediaScrollytelling);
} else {
  console.warn("amedia-scrollytelling has already been defined");
}
