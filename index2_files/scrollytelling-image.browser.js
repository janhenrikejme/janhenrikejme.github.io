// src/js/content-types/scrollytelling/scrollytelling-image.browser.js
var AmediaScrollytellingImage = class extends HTMLElement {
  static get observedAttributes() {
    return ["class"];
  }
  init() {
    if (this.isInit) {
      return;
    }
    this.isInit = true;
    const aoiAttr = this.getAttribute("aoi");
    this.aoi = aoiAttr ? JSON.parse(window.atob(aoiAttr)) : null;
    this.height = parseInt(this.getAttribute("height") || "0", 10);
    this.width = parseInt(this.getAttribute("width") || "0", 10);
    this.img = this.querySelector("img");
    this.setAOI();
    window.addEventListener("resize", () => this.setAOI());
    window.addEventListener("orientationchange", () => this.setAOI());
  }
  getLayoutProperties() {
    if (this.aoi === null) {
      return;
    }
    const { y, x, height, width } = this.aoi;
    const availableHeight = this.offsetHeight;
    const availableWidth = this.offsetWidth;
    const scale = Math.max(
      availableHeight / this.height,
      availableWidth / this.width
    );
    const imageWidth = Math.round(this.width * scale);
    const imageHeight = Math.round(this.height * scale);
    const aoiX = imageWidth * (x / 100);
    const aoiY = imageHeight * (y / 100);
    const aoiW = imageWidth * (width / 100);
    const aoiH = imageHeight * (height / 100);
    const aoiArea = aoiW * aoiH;
    const imageArea = imageWidth * imageHeight;
    const showFullImage = imageArea * 0.95 <= aoiArea;
    let yOffset = 0;
    let xOffset = 0;
    if (availableWidth === imageWidth) {
      const maxOffset = (imageHeight - availableHeight) * -1;
      const aoiOffset = -(aoiY + (aoiH - availableHeight) / 2);
      yOffset = Math.round(Math.min(0, Math.max(maxOffset, aoiOffset)));
    } else {
      const maxOffset = (imageWidth - availableWidth) * -1;
      const aoiOffset = -(aoiX + (aoiW - availableWidth) / 2);
      xOffset = Math.round(Math.min(0, Math.max(maxOffset, aoiOffset)));
    }
    return {
      showFullImage,
      imageHeight,
      imageWidth,
      xOffset,
      yOffset
    };
  }
  setAOI() {
    const layoutProperties = this.getLayoutProperties();
    if (!layoutProperties) return;
    const { showFullImage, imageHeight, imageWidth, xOffset, yOffset } = layoutProperties;
    if (showFullImage) {
      requestAnimationFrame(() => {
        this.style.setProperty("--scrolly-objectfit", "cover");
      });
    } else {
      requestAnimationFrame(() => {
        this.style.cssText += `
          --scrolly-height: ${imageHeight}px;
          --scrolly-width: ${imageWidth}px;
          --scrolly-objectfit: fill;
        `;
        this.querySelector("img").style.cssText += `
          margin-left: ${xOffset}px;
          margin-top: ${yOffset}px;
        `;
      });
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (name === "class") {
      if (newValue && newValue.indexOf("hidden") === -1) {
        this.setAOI();
      }
    }
  }
  connectedCallback() {
    this.init();
  }
};
if (customElements && !customElements.get("amedia-scrollytelling-image")) {
  customElements.define(
    "amedia-scrollytelling-image",
    AmediaScrollytellingImage
  );
} else {
  console.warn("amedia-scrollytelling-image has already been defined");
}
