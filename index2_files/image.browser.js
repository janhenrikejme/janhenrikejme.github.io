// src/js/content-types/picture/image.browser.js
var ClickEnlarge = class _ClickEnlarge extends HTMLElement {
  constructor() {
    super();
    this.appendChild(_ClickEnlarge.template.content.cloneNode(true));
    this.mediaQueryList = window.matchMedia("(min-width: 680px)");
    this.mediaQueryListener = this.checkMediaQuery.bind(this);
    this.mediaQueryList.addEventListener("change", this.mediaQueryListener);
    this.openPopup = this.openPopup.bind(this);
  }
  static get template() {
    if (!this._template) {
      this._template = document.createElement("template");
      this._template.innerHTML = `
        <style>
          .enlarged-image {
            width: auto;
            height: calc(100vh - 2em - 6px);
            max-width: 100%;
            max-height: 100vh;
            object-fit: contain;
          }
          .close-button {
            cursor: pointer;
            position: absolute;
            top: var(--brick-space-x2, 10px);
            right: var(--brick-space-x2, 10px);
          }
          dialog {
            padding: 0;
            border: none;
            background: transparent;
          }
          dialog,
          dialog::backdrop {
            opacity: 0;
            transition: opacity 0.35s, display 0.35s allow-discrete;
          }
          dialog[open],
          dialog[open]::backdrop {
            opacity: 1;
          }
          dialog::backdrop {
            background: rgba(0, 0, 0, 0.5);
          }
        </style>
        <dialog>
          <div class="enlarged-image-container"></div>
          <brick-button-v9 class="close-button" data-size="small" data-icon-id="close" data-icontext="Lukk bildet"></brick-button-v9>
        </dialog>
      `;
    }
    return this._template;
  }
  connectedCallback() {
    if (this.dataset.enlarge === "true") {
      this.checkMediaQuery(this.mediaQueryList);
    }
  }
  checkMediaQuery(e) {
    if (e.matches) {
      if (!this.isMediaQueryMatched) {
        this.setUpListeners();
        this.isMediaQueryMatched = true;
      }
    } else {
      if (this.isMediaQueryMatched) {
        this.removeEventListener("click", this.openPopup);
        this.isMediaQueryMatched = false;
      }
    }
  }
  setUpListeners() {
    this.popup = this.querySelector("dialog");
    this.enlargedImgContainer = this.popup?.querySelector(
      ".enlarged-image-container"
    );
    this.addEventListener("click", this.openPopup);
    this.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.openPopup();
      }
    });
  }
  renderImage() {
    if (this.cloned) {
      return;
    }
    this.img = this.querySelector("img");
    this.cloned = true;
    const clonedImg = this.img.cloneNode(true);
    clonedImg.setAttribute("sizes", "100vw");
    clonedImg.classList.add("enlarged-image");
    this.enlargedImgContainer.appendChild(clonedImg);
    const internals = this.attachInternals();
    internals.ariaDescribedByElements = [this.enlargedImgContainer];
  }
  openPopup() {
    this.renderImage();
    if (this.popup.open) {
      this.popup.close();
      this.removeAttribute("aria-expanded");
    } else {
      this.popup.showModal();
      const closeButton = this.popup.querySelector("button");
      closeButton.focus();
      this.setAttribute("aria-expanded", "true");
    }
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.openPopup);
  }
};
if (customElements && !customElements.get("click-enlarge")) {
  customElements.define("click-enlarge", ClickEnlarge);
} else {
  console.warn("click-enlarge has already been defined");
}
var isSafari = /^(?!.*Chrome)(?!.*Chromium)(?!.*CriOS)(?!.*Android).*Safari/.test(
  navigator.userAgent
);
if (isSafari) {
  let ensureFullDecodeAndRepaint = function(img) {
    if (!img.src || img.src.startsWith("data:")) {
      return;
    }
    const nudge = () => {
      img.style.transform = "translateZ(0)";
      requestAnimationFrame(() => {
        img.style.transform = "";
        img.style.willChange = "";
      });
    };
    if ("decode" in img) {
      img.decode().then(nudge).catch(nudge);
    } else {
      if (img.complete) {
        nudge();
      } else {
        const loadHandler = () => {
          nudge();
          img.removeEventListener("load", loadHandler);
        };
        img.addEventListener("load", loadHandler);
      }
    }
  };
  const originalRegisterLazyLoad = document.addEventListener;
  document.addEventListener = function(type, listener, ...args) {
    if (type === "amedia:registerLazyLoad") {
      const wrappedListener = function(e) {
        const element = e.detail;
        if (element && element.render) {
          const originalRender = element.render;
          element.render = function() {
            const result = originalRender.call(this);
            const img = this.querySelector("img");
            if (img) {
              setTimeout(() => ensureFullDecodeAndRepaint(img), 50);
            }
            return result;
          };
        }
        listener.call(this, e);
      };
      return originalRegisterLazyLoad.call(
        this,
        type,
        wrappedListener,
        ...args
      );
    }
    return originalRegisterLazyLoad.call(this, type, listener, ...args);
  };
  const processEagerImages = () => {
    document.querySelectorAll('article img[loading="eager"]').forEach(ensureFullDecodeAndRepaint);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", processEagerImages);
  } else {
    processEagerImages();
  }
}
function initCaptionExpanders(selector) {
  const containers = document.querySelectorAll(selector);
  containers.forEach((container) => {
    if (container.dataset.captionExpanderInit === "true") return;
    const content = container.querySelector(".caption-content");
    if (!content) return;
    const prefersReducedMotionMQ = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    let prefersReducedMotion = prefersReducedMotionMQ.matches;
    const applyMotionPreference = () => {
      content.style.transition = prefersReducedMotion ? "none" : "";
    };
    applyMotionPreference();
    prefersReducedMotionMQ.addEventListener("change", (e) => {
      prefersReducedMotion = e.matches;
      content.style.removeProperty("max-height");
      applyMotionPreference();
    });
    const getLineHeight = (el) => {
      const cs = getComputedStyle(el);
      const lh = parseFloat(cs.lineHeight);
      return isFinite(lh) && cs.lineHeight !== "normal" ? lh : (parseFloat(cs.fontSize) || 16) * 1.2;
    };
    const measureFullHeight = (el) => {
      const saved = {
        webkitLineClamp: el.style.webkitLineClamp,
        display: el.style.display,
        maxHeight: el.style.maxHeight,
        webkitBoxOrient: el.style.webkitBoxOrient
      };
      el.style.webkitLineClamp = "unset";
      el.style.webkitBoxOrient = "unset";
      el.style.display = "block";
      el.style.maxHeight = "none";
      void el.offsetHeight;
      const height = el.scrollHeight;
      el.style.webkitLineClamp = saved.webkitLineClamp || "";
      el.style.display = saved.display || "";
      el.style.maxHeight = saved.maxHeight || "";
      el.style.webkitBoxOrient = saved.webkitBoxOrient || "";
      return height;
    };
    let cachedCollapsedHeight = null;
    let cachedFullHeight = null;
    let isAnimating = false;
    const animate = (from, to, onComplete) => {
      content.style.maxHeight = `${from}px`;
      isAnimating = true;
      requestAnimationFrame(() => {
        content.offsetHeight;
        content.style.maxHeight = `${to}px`;
      });
      const onEnd = (e) => {
        if (e.propertyName === "max-height") {
          content.removeEventListener("transitionend", onEnd);
          isAnimating = false;
          onComplete();
        }
      };
      content.addEventListener("transitionend", onEnd);
    };
    const toggleExpansion = () => {
      if (isAnimating) return;
      const isExpanded = container.getAttribute("aria-expanded") === "true";
      if (prefersReducedMotion) {
        container.setAttribute("aria-expanded", String(!isExpanded));
        content.style.removeProperty("max-height");
        return;
      }
      const fullHeight = cachedFullHeight ?? measureFullHeight(content);
      const collapsedHeight = cachedCollapsedHeight ?? Math.ceil(getLineHeight(content) * 2);
      if (!isExpanded) {
        container.setAttribute("aria-expanded", "true");
        animate(collapsedHeight, fullHeight, () => {
          content.style.maxHeight = "none";
        });
      } else {
        const currentHeight = content.getBoundingClientRect().height;
        animate(currentHeight, collapsedHeight, () => {
          container.setAttribute("aria-expanded", "false");
          content.style.removeProperty("max-height");
          container.dataset.overflow = "true";
        });
      }
    };
    const clickHandler = () => toggleExpansion();
    const keydownHandler = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleExpansion();
      }
    };
    const bind = () => {
      if (container.dataset.captionExpanderBound === "true") return;
      container.addEventListener("click", clickHandler);
      container.addEventListener("keydown", keydownHandler);
      container.dataset.captionExpanderBound = "true";
    };
    const unbind = () => {
      if (container.dataset.captionExpanderBound !== "true") return;
      container.removeEventListener("click", clickHandler);
      container.removeEventListener("keydown", keydownHandler);
      delete container.dataset.captionExpanderBound;
    };
    const updateOverflowState = () => {
      if (isAnimating) return;
      const wasExpanded = container.getAttribute("aria-expanded") === "true";
      const fullHeight = measureFullHeight(content);
      cachedFullHeight = fullHeight;
      const prevMaxHeight = content.style.maxHeight;
      content.style.maxHeight = "";
      container.setAttribute("aria-expanded", "false");
      void content.offsetHeight;
      const clampedHeight = content.getBoundingClientRect().height;
      cachedCollapsedHeight = Math.ceil(clampedHeight);
      if (prevMaxHeight) {
        content.style.maxHeight = prevMaxHeight;
      } else if (wasExpanded) {
        content.style.maxHeight = "none";
      }
      const hasOverflow = fullHeight > clampedHeight + 1;
      if (!hasOverflow) {
        container.dataset.overflow = "false";
        container.removeAttribute("tabindex");
        container.removeAttribute("role");
        container.removeAttribute("aria-expanded");
        unbind();
      } else {
        if (!container.hasAttribute("tabindex"))
          container.setAttribute("tabindex", "0");
        if (!container.hasAttribute("role"))
          container.setAttribute("role", "button");
        container.setAttribute("aria-expanded", String(wasExpanded));
        container.dataset.overflow = "true";
        bind();
      }
    };
    let measurePending = false;
    const scheduleMeasure = () => {
      if (measurePending) return;
      measurePending = true;
      requestAnimationFrame(() => {
        measurePending = false;
        updateOverflowState();
      });
    };
    scheduleMeasure();
    const invalidateCache = () => {
      cachedCollapsedHeight = null;
      cachedFullHeight = null;
      scheduleMeasure();
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(invalidateCache).catch(() => {
      });
    } else {
      window.addEventListener("load", scheduleMeasure, { once: true });
    }
    if (window.ResizeObserver) {
      new ResizeObserver(invalidateCache).observe(container);
    } else {
      window.addEventListener("resize", invalidateCache);
    }
    container.dataset.captionExpanderInit = "true";
  });
}
var runCaptionExpanders = () => {
  const topCaption = document.querySelector("#top-image-caption");
  if (topCaption) {
    initCaptionExpanders("#top-image-caption");
  }
  const observer = new MutationObserver(() => {
    const el = document.querySelector("#top-image-caption");
    if (el && el.dataset.captionExpanderInit !== "true") {
      initCaptionExpanders("#top-image-caption");
    }
  });
  const articleRoot = document.querySelector("article") || document.body;
  observer.observe(articleRoot, { childList: true, subtree: true });
};
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runCaptionExpanders, {
    once: true
  });
} else {
  runCaptionExpanders();
}
