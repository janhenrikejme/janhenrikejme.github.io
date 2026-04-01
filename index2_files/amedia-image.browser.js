// src/js/content-types/picture/imageModel.js
var escapeApostrophe = (str) => str.replace(/'/g, "&apos;");
var attr = (element) => (attr2, fallback) => element.getAttribute(attr2) || fallback;
function createImageModel(element) {
  const get = attr(element);
  const aoiAttr = get("aoi");
  const portraitWidth = parseInt(get("data-widthifheightimage", 0));
  return {
    alt: get("alt", ""),
    aoi: aoiAttr ? JSON.parse(atob(aoiAttr)) : null,
    caption: escapeApostrophe(get("caption", "")),
    descriptionText: escapeApostrophe(get("data-description", "")),
    design: get("data-design", ""),
    height: parseInt(get("height", 0)),
    hideFigcaptionText: get("data-hidefigcaptiontext") === "true",
    isFullscreen: get("data-fullscreen") !== "false",
    isSlideshow: get("data-is-slideshow") === "true",
    isPortrait: portraitWidth > 0,
    photographer: get("photographer", ""),
    portraitWidth,
    ratio: parseFloat(get("ratio", 0)),
    src: JSON.parse(atob(get("src"))),
    topImageIsHeightImage: get("data-topimageisheightimage") === "true",
    width: parseInt(get("width", 0))
  };
}

// src/js/content-types/picture/amedia-image.browser.js
var el;
var initialized;
var container;
var displayElement;
var displayImage;
var isLoading;
var isOpen;
var isClosing;
var animationStart;
var animationEnd;
var opts;
var appendEl = "appendChild";
var createEl = "createElement";
var removeEl = "removeChild";
function changeCSS({ style }, newStyle) {
  style.cssText = newStyle;
}
function getRect() {
  const { top, left, width, height } = el.getBoundingClientRect();
  const leftOffset = left - (container.clientWidth - width) / 2;
  const centerTop = top - (container.clientHeight - height) / 2;
  const scaleWidth = el.clientWidth / displayElement.clientWidth;
  const scaleHeight = el.clientHeight / displayElement.clientHeight;
  return `transform:translate3D(${leftOffset}px, ${centerTop}px, 0) scale3D(${scaleWidth}, ${scaleHeight}, 0)`;
}
function removeContainer() {
  const srcEl = displayElement;
  srcEl.removeAttribute("src");
  document.body[removeEl](container);
  container[removeEl](displayElement);
  changeCSS(container, "");
  changeCSS(displayElement, "");
  if (opts.onClose) {
    opts.onClose();
  }
  isClosing = false;
  isLoading = false;
}
function open() {
  if (animationStart) {
    animationStart();
  }
  displayElement.style.cssText += getRect();
  changeCSS(container, `opacity:1;pointer-events:auto`);
  animationEnd = setTimeout(animationEnd, 410);
  isOpen = true;
  if (isOpen) {
    displayElement.style.cssText += "cursor:zoom-out";
  }
  setTimeout(() => {
    displayElement.style.cssText += "transition:transform .35s;transform:none";
  }, 60);
}
function close() {
  if (isClosing) {
    return;
  }
  displayElement.style.cssText += getRect();
  changeCSS(container, "pointer-events:auto");
  setTimeout(removeContainer, 350);
  clearTimeout(animationEnd);
  isOpen = false;
  isClosing = true;
}
function initialize() {
  container = document[createEl]("DIV");
  container.id = "bp_container";
  container.onclick = close;
  displayImage = document[createEl]("IMG");
  displayImage.onload = open;
  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape" && isOpen) {
      close();
    }
  });
  document.addEventListener(
    "focus",
    (e) => {
      if (isOpen && !container.contains(e.target)) {
        e.stopPropagation();
      }
    },
    true
  );
  initialized = true;
}
function BigPicture(options) {
  if (!initialized) {
    initialize();
  }
  if (isLoading) {
    removeContainer();
  }
  opts = options;
  el = options.el;
  displayElement = displayImage;
  displayElement.src = el.src;
  const css = document.createElement("style");
  css.className = "big-picture-styles";
  css.innerHTML = `#bp_container {bottom: 0;left: 0;right: 0;position: fixed;opacity: 0;}#bp_container > * {position: absolute;right: 0;z-index: 10;}#bp_container {pointer-events: none;}#bp_container {top: 0;z-index: 9999;background: transparent;opacity: 0;transition: opacity 0.35s;}#bp_container img {user-select: none;max-height: 96%;max-width: 96%;top: 0;bottom: 0;left: 0;margin: auto;box-shadow: 0 0 3em rgba(0, 0, 0, 0.4);z-index: -1;}`;
  const bpStyles = document.querySelector(".big-picture-styles");
  if (!bpStyles) document.head.append(css);
  container[appendEl](displayElement);
  document.body[appendEl](container);
  return {
    close
  };
}
var resolution = window.devicePixelRatio ? Math.min(2, window.devicePixelRatio) : 1;
var AmediaImage = class extends HTMLElement {
  setImageSrc() {
    const { src } = this.model;
    const parentWidth = resolution * this.offsetWidth;
    const bestFit = Object.keys(src).map((width) => parseInt(width, 10)).filter((width) => width >= parentWidth).sort((a, b) => a - b).pop();
    this.img.src = src[bestFit || 1200] || src.static;
  }
  setImageSrcset(imagelist = this.model.src) {
    const list = [];
    if (imagelist) {
      Object.keys(imagelist).forEach((size) => {
        list.push(`${imagelist[size]} ${size}w`);
      });
    }
    this.img.srcset = list.join(", ");
  }
  setAspectRatio() {
    const { width, height } = this.model;
    if (!!width && !!height) {
      this.img.style.aspectRatio = `${width} / ${height}`;
    }
  }
  init() {
    const {
      caption,
      design,
      photographer,
      isSlideshow,
      hideFigcaptionText,
      descriptionText,
      isPortrait,
      isFullscreen,
      portraitWidth,
      ratio
    } = this.model;
    if (isSlideshow) {
      this.wrapper = document.createElement("div");
      this.append(this.wrapper);
    } else {
      if (isPortrait && portraitWidth > 0 && design !== "nettavisen") {
        this.setAttribute(
          "style",
          `--article-height-image-width: ${portraitWidth}px;`
        );
      }
      const figure = document.createElement("figure");
      this.wrapper = document.createElement("div");
      this.wrapper.classList.add("article-image-wrap");
      if (ratio > 0) {
        this.wrapper.classList.add("image-wrapper");
        this.wrapper.style.paddingTop = `${ratio}%`;
      }
      figure.appendChild(this.wrapper);
      let description = "";
      if (isSlideshow) {
        description = descriptionText ? `<span class="image-description">${descriptionText}</span>` : "";
      }
      if (caption || photographer) {
        const captionText = hideFigcaptionText ? "" : description || caption || "";
        if (captionText || photographer) {
          figure.insertAdjacentHTML(
            "beforeend",
            `
              <div class="article-caption-wrap" style="visibility:hidden;">
                <figcaption class="article-caption">
                ${captionText}
                ${photographer && `<span class="image-photographer">${photographer}</span>`}
                </figcaption>
              </div>
            `
          );
        }
      }
      this.appendChild(figure);
      const viewportWidth = document.documentElement.clientWidth;
      if (viewportWidth > 680 && !isFullscreen) {
        this.addEventListener(
          "click",
          (event) => BigPicture({ el: event.target })
        );
      }
      const figcaption = this.querySelector("figcaption");
      const counter = this.nextElementSibling;
      if (figcaption && counter && counter.classList.contains("gallery-count")) {
        figcaption.insertAdjacentElement("afterbegin", counter);
        counter.style.display = "block";
      }
    }
    document.dispatchEvent(
      new CustomEvent("amedia:registerLazyLoad", {
        detail: this
      })
    );
  }
  setAOI() {
    const { aoi } = this.model;
    if (!aoi || aoi === null) return;
    const { y, x, height, width } = aoi;
    const availableHeight = this.offsetHeight;
    const availableWidth = this.offsetWidth;
    const scale = Math.max(
      availableHeight / this.model.height,
      availableWidth / this.model.width
    );
    const imageWidth = Math.round(this.model.width * scale);
    const imageHeight = Math.round(this.model.height * scale);
    const aoiX = imageWidth * (x / 100);
    const aoiY = imageHeight * (y / 100);
    const aoiW = imageWidth * (width / 100);
    const aoiH = imageHeight * (height / 100);
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
    this.img.setAttribute(
      "style",
      `object-fit:fill;width:${imageWidth}px;height:${imageHeight}px;margin-left:${xOffset}px;margin-top:${yOffset}px;`
    );
  }
  render() {
    const { alt, isSlideshow, topImageIsHeightImage } = this.model;
    const img = new Image();
    this.img = img;
    if (isSlideshow) {
      img.classList.add("b-slider-slide-image");
      if (topImageIsHeightImage) {
        img.classList.add("b-slider-slide-image-height");
      }
    } else {
      img.classList.add("article-image");
    }
    this.setImageSrc();
    this.setAspectRatio();
    img.setAttribute("alt", alt);
    this.wrapper.appendChild(img);
    this.setAOI();
    if (this.querySelector(".article-caption-wrap")) {
      this.querySelector(".article-caption-wrap").style.visibility = "visible";
    }
    window.addEventListener("resize", () => this.setAOI());
    window.addEventListener("orientationchange", () => this.setAOI());
  }
  connectedCallback() {
    if (!this._created) {
      this.model = createImageModel(this);
      this.init();
    }
    this._created = true;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue && newValue.indexOf("hidden") === -1) {
      this.setAOI();
    }
  }
};
if (customElements && !customElements.get("amedia-image")) {
  customElements.define("amedia-image", AmediaImage);
} else {
  console.warn("amedia-image has already been defined");
}
