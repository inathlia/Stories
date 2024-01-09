import Timeout from "./Timeout.js";

export default class Slide {
  container: Element;
  slides: Element[];
  controls: Element;
  time: number;
  index: number;
  slide: Element;
  timeout: Timeout | null;
  paused: boolean;
  pausedTimeout: Timeout | null;

  constructor(container: Element, slides: Element[], controls: Element, time: number = 5000) {
    this.container = container;
    this.slides = slides;
    this.controls = controls;
    this.time = time;
    this.index = localStorage.getItem("activeSlide")? Number(localStorage.getItem("activeSlide")) : 0;
    this.slide = this.slides[this.index];
    this.timeout = null;
    this.paused = false;
    this.pausedTimeout = null;

    this.init();
  }

  hide(el: Element) {
    el.classList.remove("active");
    if(el instanceof HTMLVideoElement) {
      el.currentTime = 0;
      el.pause();
    }
  }

  show(index: number) {
    this.index = index;
    this.slide = this.slides[this.index];
    localStorage.setItem("activeSlide", String(this.index));
    this.slides.forEach((el) => this.hide(el));
    this.slide.classList.add("active");
    if(this.slide instanceof HTMLVideoElement) {
      this.autoVideo(this.slide);
    } else {
      this.auto(this.time);
    }
  }

  autoVideo(video: HTMLVideoElement) {
    video.muted = true;
    video.play();
    let firstPlay = true;
    video.addEventListener("playing", () => {
      if(firstPlay) this.auto(video.duration * 1000);
      firstPlay = false;
    });
  }

  auto(time: number) {
    this.timeout?.clear(); // clear timeout to prevent bug while loading new slide
    this.timeout = new Timeout(() => this.next(), time);
  }

  prev() {
    if(this.paused) return;
    console.log('prev');
    const prev = this.index > 0 ? this.index - 1 : this.slides.length - 1;
    this.show(prev);
  }

  next() {
    if(this.paused) return;
    console.log('next');
    const next = this.index < this.slides.length - 1 ? this.index + 1 : 0;
    this.show(next);
  }

  pause() {
    this.pausedTimeout = new Timeout(() => {
      this.timeout?.pause();
      this.paused = true;
      if(this.slide instanceof HTMLVideoElement) this.slide.pause();
    }, 300);
    console.log('paused');
  }

  continue() {
    this.pausedTimeout?.clear;
    if(this.paused) {
      this.paused = false;
      this.timeout?.continue();
      if(this.slide instanceof HTMLVideoElement) this.slide.play();
    }
    console.log('continue');
  }

  private addControls() {
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    prevButton.innerText = "Previous";
    nextButton.innerText = "Next";
    this.controls.appendChild(prevButton);
    this.controls.appendChild(nextButton);

    this.controls.addEventListener("pointerdown", () => this.pause());
    this.controls.addEventListener("pointerup", () => this.continue());

    prevButton.addEventListener("pointerup", () => this.prev());
    nextButton.addEventListener("pointerup", () => this.next());
  }

  private init() {
    this.addControls();
    this.show(this.index);
  }
}