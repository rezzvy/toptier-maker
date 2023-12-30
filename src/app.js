class Model {
  constructor() {}
}

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
    const div = document.createElement("div");
    div.classList.add("img-list-drag-item");
    div.innerHTML = `<img src="${imgSrc}" />`;

    div.ondragstart = function (e) {
      e.dataTransfer.setData("text", imgSrc);
    };

    div.draggable = true;
    this.uploadImageContainer.append(div);
  }

  generateBoard() {
    const length = this.boardContainer.children.length;
    const color = this.colors[length] ? this.colors[length] : this.getRandomColor();

    const div = document.createElement("div");
    div.classList.add("tier-list-item");

    const divChildColor = document.createElement("div");
    divChildColor.classList.add("_color", "flex-center");
    divChildColor.style.setProperty("--bg-color", color);
    divChildColor.textContent = length + 1;
    div.appendChild(divChildColor);

    const divChildContent = document.createElement("div");
    divChildContent.classList.add("_content");
    div.appendChild(divChildContent);

    divChildContent.ondrop = function (e) {
      const target = e.dataTransfer.getData("text");
      const targetElement = document.querySelector(`[src="${target}"]`).parentElement;

      if (targetElement.parentElement.parentElement.isEqualNode(e.currentTarget.parentElement)) return console.log("aa");

      e.currentTarget.appendChild(targetElement);
    };

    divChildContent.ondragover = function (e) {
      e.preventDefault();
    };

    const divChildDelete = document.createElement("div");
    divChildDelete.classList.add("_option", "flex-center");
    divChildDelete.textContent = "A";
    div.appendChild(divChildDelete);

    this.boardContainer.append(div);
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    for (let i = 0; i < 4; i++) {
      this.view.generateBoard();
    }

    this.view.uploadImageContainer.ondragover = function (e) {
      e.preventDefault();
    };

    this.view.uploadImageContainer.ondrop = function (e) {
      const target = e.dataTransfer.getData("text");
      e.currentTarget.appendChild(document.querySelector(`[src="${target}"]`).parentElement);
    };

    this.view.addBoardButton.addEventListener("click", (e) => {
      this.view.generateBoard();
    });

    this.view.uploadImageInput.addEventListener("change", (e) => {
      const blob = URL.createObjectURL(e.target.files[0]);

      this.view.generateImageListCard(blob);
    });
  }
}

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

function init() {
  controller.init();
}

document.addEventListener("DOMContentLoaded", init);
