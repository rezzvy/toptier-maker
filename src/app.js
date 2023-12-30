class Model {}

class View {
  constructor() {
    this.addBoardButton = document.getElementById("add-board-btn");
    this.boardContainer = document.querySelector(".tier-list-box-container");

    this.uploadImageContainer = document.querySelector(".img-list-drag");
    this.uploadImageInput = document.getElementById("input-image");

    this.colors = ["#ff7777", "#ffee77", "#77ff7d", "#77a3ff", "#a777ff", "#f277ff"];
  }

  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  generateImageListCard(imgSrc) {
    let placeholder = `<img src="${imgSrc}" />`;
    const div = document.createElement("div");
    div.classList.add("img-list-drag-item");
    div.innerHTML = placeholder;

    this.uploadImageContainer.append(div);
  }

  generateBoard() {
    const length = this.boardContainer.children.length;
    const color = this.colors[length] ? this.colors[length] : this.getRandomColor();

    let placeholder = `
          <div class="_color flex-center" style="--bg-color: ${color};">${length + 1}</div>
          <div class="_content"></div>
          <div class="_option flex-center">C</div>
      `;

    const div = document.createElement("div");
    div.classList.add("tier-list-item");
    div.innerHTML = placeholder;

    this.boardContainer.append(div);
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    this.view.addBoardButton.addEventListener("click", (e) => {
      this.view.generateBoard();
    });

    this.view.uploadImageInput.addEventListener("change", (e) => {
      const blob = URL.createObjectURL(e.target.files[0]);

      this.view.generateImageListCard(blob)
    });
  }
}

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

controller.init();
