import Slide from "./Slide.js";
const container = document.getElementById("slide");
const slides = document.getElementById("slide-elements");
const controls = document.getElementById("slide-controls");
if (container && slides && controls && slides.children.length) {
    const slide = new Slide(container, Array.from(slides.children), controls, 3000);
}
//# sourceMappingURL=script.js.map