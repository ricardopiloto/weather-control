/**
 * Handles dragging of the main weather window.
 * Ported from the original `R` class.
 */
export class WindowDragHandler {
  constructor() {
    this.mouseMoveCallback = (event) => {
      this.mouseMove(event);
    };
  }

  start(parentElement, onStop) {
    this.parent = parentElement;

    document.addEventListener("mousemove", this.mouseMoveCallback);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", this.mouseMoveCallback);
      onStop({
        top: this.parent.offsetTop,
        left: this.parent.offsetLeft,
      });
    });
  }

  mouseMove(event) {
    this.parent.style.top = this.parent.offsetTop + event.movementY + "px";
    this.parent.style.left = this.parent.offsetLeft + event.movementX + "px";
    this.parent.style.position = "fixed";
    this.parent.style.zIndex = "100";
  }
}

