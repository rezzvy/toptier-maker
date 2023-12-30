class Model {
  constructor() {
    this.projectData = {
      title: "",
      description: "",
      board: "",
      imgList: "",
    };
  }

  setProjectData(obj) {
    const { title, description, board, imgList } = obj;

    this.projectData.title = title;
    this.projectData.description = description;
    this.projectData.board = board;
    this.projectData.imgList = imgList;
  }

  importData(json, callback) {
    const reader = new FileReader();

    reader.onload = function (e) {
      this.projectData = JSON.parse(e.target.result);
      callback(this.projectData);
    };

    reader.readAsText(json);
  }

  exportData() {
    const blob = new Blob([JSON.stringify(this.projectData)], { type: "application/json" });
    return URL.createObjectURL(blob);
  }
}

class View {
  constructor() {
    this.addBoardButton = document.getElementById("add-board-btn");
    this.boardContainer = document.querySelector(".tier-list-box-container");
    this.uploadImageContainer = document.querySelector(".img-list-drag");
    this.uploadImageInput = document.getElementById("input-image");
    this.colors = ["#ff7777", "#ffee77", "#77ff7d", "#77a3ff", "#a777ff", "#f277ff"];
    this.exportButton = document.getElementById("export-btn");
    this.importFileInput = document.getElementById("import-project");
    this.projectTitleElement = document.querySelector(".tier-list-title");
    this.projectDescriptionElement = document.querySelector(".tier-list-description");
  }

  convertImages(callback) {
    const convert = (blob, convertCompleteCallback) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = document.createElement("img");

      img.src = blob;
      img.onload = function (e) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const newImgSource = canvas.toDataURL("image/webp");
        convertCompleteCallback(newImgSource);
      };
    };

    const imgs = document.querySelectorAll(".img-list-drag-item img");
    let conversionCounter = 0;

    for (let i = 0; i < imgs.length; i++) {
      convert(imgs[i].src, (source) => {
        imgs[i].src = source;
        conversionCounter++;

        if (conversionCounter === imgs.length) {
          callback();
        }
      });
    }
  }

  import(projectData) {
    this.boardContainer.innerHTML = projectData.board;
    this.uploadImageContainer.innerHTML = projectData.imgList;
  }

  getBoardContent() {
    return document.querySelector(".tier-list-box-container").innerHTML;
  }

  getImageListContent() {
    return document.querySelector(".img-list-drag").innerHTML;
  }

  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  generateImageListCard(imgSrc) {
    this.uploadImageContainer.innerHTML += `
    <div class="img-list-drag-item" ondragstart="view.__imgDragStart(event)" draggable="true">
        <img src="${imgSrc}" />
    </div>
    `;
  }

  generateBoard() {
    const length = this.boardContainer.children.length;
    const color = this.colors[length] ? this.colors[length] : this.getRandomColor();

    const div = document.createElement("div");
    div.classList.add("tier-list-item");
    div.innerHTML = `
    <div class="_color flex-center" style="--bg-color: ${color}" contenteditable="true" spellcheck="false">${length + 1}</div>
    <div class="_content" ondrop="view.__imgOnDrop(event)" ondragover="view.__imgOnDragOver(event)"></div>
    <div class="_option flex-center"></div>
  `;

    this.boardContainer.appendChild(div);
  }

  generateGhostAnchor(src, downloadTitle) {
    const anchor = document.createElement("a");
    anchor.href = src;
    anchor.download = downloadTitle;

    anchor.click();

    setTimeout(() => {
      anchor.remove();
    }, 1000);
  }

  __imgOnDrop(e) {
    const target = e.dataTransfer.getData("text");
    const targetElement = document.querySelector(`[src="${target}"]`).parentElement;

    e.currentTarget.appendChild(targetElement);
  }

  __imgDragStart(e) {
    const imgSrc = e.currentTarget.firstElementChild.src;
    e.dataTransfer.setData("text", imgSrc);
  }

  __imgOnDragOver(e) {
    e.preventDefault();
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

    this.view.addBoardButton.addEventListener("click", () => {
      this.view.generateBoard();
    });

    this.view.uploadImageInput.addEventListener("change", (e) => {
      this.uploadImageHandler(e);
    });

    this.view.exportButton.addEventListener("click", (e) => {
      this.exportHandler();
    });

    this.view.importFileInput.addEventListener("input", (e) => {
      this.importHandler(e);
    });
  }

  uploadImageHandler(e) {
    this.view.generateImageListCard(URL.createObjectURL(e.target.files[0]));
  }

  importHandler(e) {
    this.model.importData(e.currentTarget.files[0], (e) => {
      this.view.import(e);
    });
  }

  exportHandler() {
    const convertImageCompleteCallback = () => {
      this.model.setProjectData({
        title: this.view.projectTitleElement.textContent,
        description: this.view.projectDescriptionElement.textContent,
        board: this.view.getBoardContent(),
        imgList: this.view.getImageListContent(),
      });

      this.view.generateGhostAnchor(this.model.exportData(), this.model.projectData.title);
    };

    this.view.convertImages(convertImageCompleteCallback);
  }
}

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

function init() {
  controller.init();
}

document.addEventListener("DOMContentLoaded", init);
