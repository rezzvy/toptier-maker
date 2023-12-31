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
        const baseWidth = 140;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const height = baseWidth / aspectRatio;

        canvas.width = baseWidth;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, baseWidth, height);

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
    this.projectTitleElement.textContent = projectData.title;
    this.projectDescriptionElement.textContent = projectData.description;
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
      <div class="img-list-drag-item" ondragstart="__imgDragStart(event)" draggable="true">
          <img src="${imgSrc}" />
          <div class="delete-img-list-btn" onclick="__deleteParent(event)"><img src="./assets/trash.svg"></div>
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
      <div class="_content" ondragenter="__dragEnter(event)" ondragleave="__dragLeave(event)" ondrop="__imgOnDrop(event)" ondragover="__imgOnDragOver(event)"></div>
      <div class="_option flex-center" onclick="__removeParentElement(event)"><img src="./assets/trash.svg"></div>
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
}
export default View;
