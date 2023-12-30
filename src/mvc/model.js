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

export default Model;
