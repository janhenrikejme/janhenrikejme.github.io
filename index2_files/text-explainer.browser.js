// src/js/content-types/partials/body-text/text-explainer.browser.js
var generateUUID = () => {
  if (typeof crypto === "object") {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (typeof crypto.getRandomValues === "function" && typeof Uint8Array === "function") {
      const callback = (c) => {
        const num = Number(c);
        return (num ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> num / 4).toString(16);
      };
      return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, callback);
    }
  }
  let timestamp = (/* @__PURE__ */ new Date()).getTime();
  let perforNow = typeof performance !== "undefined" && performance.now && performance.now() * 1e3 || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let random = Math.random() * 16;
    if (timestamp > 0) {
      random = (timestamp + random) % 16 | 0;
      timestamp = Math.floor(timestamp / 16);
    } else {
      random = (perforNow + random) % 16 | 0;
      perforNow = Math.floor(perforNow / 16);
    }
    return (c === "x" ? random : random & 3 | 8).toString(16);
  });
};
var TextExplainer = class extends HTMLElement {
  constructor() {
    super();
    const uniqueId = generateUUID();
    this._uniqueId = uniqueId;
    this._createTemplate();
    this._addEventListeners();
  }
  _calculateDialogueBoxPosition() {
    const dialogueButtonRect = this.querySelector(".dialogue-button").getBoundingClientRect();
    let parentElement = this.parentElement;
    const dialogueBox = this._dialogueBox;
    const windowWidth = window.innerWidth;
    const dialogueBoxWidth = 400;
    const dialogueBoxRight = "auto";
    let dialogueBoxLeft = dialogueButtonRect.left;
    if (windowWidth < 770) {
      while (parentElement && getComputedStyle(parentElement).display === "inline") {
        parentElement = parentElement.parentElement;
      }
      if (parentElement) {
        parentElement.style.position = "relative";
      }
      dialogueBox.style.left = `0px`;
      dialogueBox.style.right = dialogueBoxRight;
    } else {
      const cutOff = dialogueBoxLeft + dialogueBoxWidth - windowWidth;
      if (cutOff > 0) {
        dialogueBoxLeft -= cutOff;
      }
      dialogueBox.style.left = `${dialogueBoxLeft}px`;
      dialogueBox.style.top = `${dialogueButtonRect.top + dialogueButtonRect.height}px`;
    }
  }
  _createTemplate() {
    const { title, explanation } = this.dataset;
    const template = document.createElement("template");
    template.innerHTML = /* html */
    `
    <button 
      type="button" 
      id="dialouge-btn-${this._uniqueId}" 
      class="dialogue-button" 
      aria-controls="dialogue-box-${this._uniqueId}" 
      aria-expanded="false" 
      aria-haspopup="dialog"
      aria-label="${title} (klikk for forklaring p\xE5 ordet)"
      data-dialogue>${title}</button>

    <dialog 
      id="dialogue-box-${this._uniqueId}"
      class="dialogue-box" 
      role="dialog" 
      aria-describedby="dialogue-description-${this._uniqueId}">
      <div class="dialogue-container">
        <button class="close-dialogue" aria-label="Lukk">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h3 id="dialogue-title-${this._uniqueId}" class="dialogue-title">
          <dfn aria-describedby="dialogue-description-${this._uniqueId}">${title}</dfn>
        </h3>
        <div id="dialogue-description-${this._uniqueId}">${explanation}</div>
      </div>
    </dialog>
    `;
    const content = template.content.cloneNode(true);
    this.appendChild(content);
  }
  _addEventListeners() {
    this._dialogueButton = this.querySelector(".dialogue-button");
    this._dialogueBox = this.querySelector(".dialogue-box");
    this._closeDialogue = this.querySelector(".close-dialogue");
    this._dialogueButton.addEventListener("click", () => {
      if (this._dialogueBox.open) {
        this._closeDialogueBox(this._dialogueBox, this._dialogueButton);
      } else {
        this._openDialogueBox(this._dialogueBox);
      }
    });
    this._closeDialogue.addEventListener("click", () => {
      this._closeDialogueBox(this._dialogueBox, this._dialogueButton);
    });
    document.addEventListener("click", (event) => {
      if (this._dialogueBox.open && !event.target.closest(".dialogue-box") && !event.target.closest(".dialogue-button")) {
        this._closeDialogueBox(this._dialogueBox, this._dialogueButton);
      }
    });
    document.addEventListener("keydown", this._closeDialogOnEscape);
    let isThrottled = false;
    const handleScroll = () => {
      if (!isThrottled) {
        window.requestAnimationFrame(() => {
          this._calculateDialogueBoxPosition();
          isThrottled = false;
        });
        isThrottled = true;
        setTimeout(() => {
          isThrottled = false;
        }, 100);
      }
    };
    window.addEventListener("scroll", () => {
      if (this._dialogueBox.open) {
        handleScroll();
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    });
  }
  _openDialogueBox() {
    const openDialogues = document.querySelectorAll(".dialogue-box[open]");
    openDialogues.forEach((dialogue) => {
      dialogue.classList.remove("open");
      dialogue.classList.add("closed");
      dialogue.close();
    });
    this._dialogueBox.classList.remove("closed");
    this._calculateDialogueBoxPosition();
    this._dialogueBox.show();
    this._dialogueBox.classList.add("open");
    this._dialogueButton.setAttribute("aria-expanded", "true");
    this._closeDialogue.focus();
  }
  _closeDialogueBox() {
    const openDialogues = document.querySelectorAll(".dialogue-box[open]");
    openDialogues.forEach((dialogue) => {
      dialogue.classList.remove("open");
      dialogue.classList.add("closed");
    });
    this._dialogueBox.classList.add("closed");
    this._dialogueBox.addEventListener("transitionend", (event) => {
      if ((event.propertyName === "margin" || event.propertyName === "opacity") && event.target.classList.contains("closed")) {
        this._dialogueBox.close();
      }
    });
    this._dialogueButton.setAttribute("aria-expanded", "false");
    this._dialogueButton.focus();
  }
  _closeDialogOnEscape = (event) => {
    if (event.keyCode === 27) {
      this._closeDialogueBox(this._dialogueBox, this._dialogueButton);
    }
  };
  _handleDocumentClick(event) {
    if (this._dialogueBox.open && !event.target.closest(".dialogue-box") && !event.target.closest(".dialogue-button")) {
      this._closeDialogueBox();
    }
  }
};
if (customElements && !customElements.get("text-explainer")) {
  customElements.define("text-explainer", TextExplainer);
} else {
  console.warn("text-explainer has already been defined");
}
