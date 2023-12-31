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
    for (const file of e.currentTarget.files) {
      this.view.generateImageListCard(URL.createObjectURL(file));
    }
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
export default Controller;
