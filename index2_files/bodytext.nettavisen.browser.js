// src/js/content-types/partials/body-text/bodytext.nettavisen.browser.js
var tableScrollElements = document.querySelectorAll(".amedia-table-wrapper") || [];
tableScrollElements.forEach((tableScrollElement) => {
  const hasOverflow = tableScrollElement.scrollWidth > tableScrollElement.clientWidth;
  if (tableScrollElements.length && hasOverflow) {
    let mouseMoveFunction = function(e) {
      const mouseX2 = e.pageX - this.offsetLeft;
      if (mouseX) this.scrollLeft = this.scrollX + mouseX - mouseX2;
    };
    tableScrollElement.setAttribute("tabindex", "0");
    tableScrollElement.setAttribute("role", "region");
    tableScrollElement.setAttribute(
      "aria-label",
      "Skrollbar tabell. Bruk piltastene for \xE5 skrolle tabellen horisontalt."
    );
    let mouseX = 0;
    tableScrollElement.style.cursor = "grab";
    tableScrollElement.addEventListener("mousedown", function(e) {
      this.scrollX = this.scrollLeft;
      mouseX = e.pageX - this.offsetLeft;
      this.style.cursor = "grabbing";
      this.addEventListener("mousemove", mouseMoveFunction);
    });
    tableScrollElement.addEventListener("mouseup", function() {
      this.removeEventListener("mousemove", mouseMoveFunction);
      mouseX = 0;
      this.style.cursor = "grab";
    });
  }
});
