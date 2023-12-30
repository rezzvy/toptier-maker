function __imgOnDrop(e) {
  const target = e.dataTransfer.getData("text");
  const targetElement = document.querySelector(`[src="${target}"]`).parentElement;

  e.currentTarget.appendChild(targetElement);
}

function __imgDragStart(e) {
  const imgSrc = e.currentTarget.firstElementChild.src;
  e.dataTransfer.setData("text", imgSrc);
}

function __imgOnDragOver(e) {
  e.preventDefault();
}

function __removeParentElement(e) {
  if (e.currentTarget.previousElementSibling.children.length !== 0) {
    const dialog = window.confirm("This is not empty, are you sure want to delete?");
    return dialog ? e.currentTarget.parentElement.remove() : "";
  }

  e.currentTarget.parentElement.remove();
}
