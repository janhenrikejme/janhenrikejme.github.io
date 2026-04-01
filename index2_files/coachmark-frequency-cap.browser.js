// src/js/content-types/partials/share-btns/coachmark-frequency-cap.browser.js
var COACH_MARK_ID = "coach-mark";
var STORAGE_KEY_SEEN = "coachMark_seen";
var STORAGE_KEY_CLOSED = "coachMark_closed";
var COOLDOWN_DAYS = 1;
var ONE_DAY_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1e3;
var now = () => Date.now();
var safeGetItem = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};
var safeSetItem = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
  }
};
var isWithinCooldown = (timestamp) => {
  if (!timestamp) return false;
  const parsed = parseInt(timestamp, 10);
  if (Number.isNaN(parsed)) return false;
  return now() - parsed < ONE_DAY_MS;
};
var shouldShowCoachMark = () => {
  const lastClosed = safeGetItem(STORAGE_KEY_CLOSED);
  return !isWithinCooldown(lastClosed);
};
var showCoachMark = (coachMark) => {
  if (!coachMark) return;
  coachMark.classList.remove("is-hidden");
  coachMark.classList.remove("coach-mark-loading");
  if (!isWithinCooldown(safeGetItem(STORAGE_KEY_CLOSED))) {
    safeSetItem(STORAGE_KEY_SEEN, String(now()));
  }
};
var hideCoachMark = (coachMark) => {
  if (!coachMark) return;
  coachMark.classList.add("is-hidden");
  coachMark.classList.remove("coach-mark-loading");
};
var initCoachMark = () => {
  const coachMark = document.getElementById(COACH_MARK_ID);
  if (!coachMark) return;
  const closeButton = coachMark.querySelector(".coach-mark-close-btn");
  if (!closeButton) return;
  if (shouldShowCoachMark()) {
    showCoachMark(coachMark);
  } else {
    hideCoachMark(coachMark);
  }
  closeButton.addEventListener("click", () => {
    console.log("[coach-mark] close clicked");
    hideCoachMark(coachMark);
    safeSetItem(STORAGE_KEY_CLOSED, String(now()));
  });
};
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initCoachMark, 0);
  });
} else {
  setTimeout(initCoachMark, 0);
}
