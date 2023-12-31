function __dragEnter(e) {
  e.currentTarget.classList.add("drag-hover");
}

function __dragLeave(e) {
  e.currentTarget.classList.remove("drag-hover");
}

function __imgOnDrop(e) {
  const target = e.dataTransfer.getData("text");
  const targetElement = document.querySelector(`[src="${target}"]`).parentElement;

  e.currentTarget.appendChild(targetElement);
  e.currentTarget.classList.remove("drag-hover");
}

function __imgDragStart(e) {
  const imgSrc = e.currentTarget.firstElementChild.src;
  e.dataTransfer.setData("text", imgSrc);
}

function __imgOnDragOver(e) {
  e.preventDefault();
}

// for remove board
function __removeParentElement(e) {
  if (e.currentTarget.previousElementSibling.children.length !== 0) {
    const dialog = window.confirm("This is not empty, are you sure want to delete?");
    return dialog ? e.currentTarget.parentElement.remove() : "";
  }

  e.currentTarget.parentElement.remove();
}

// for remove img item
function __deleteParent(event) {
  event.currentTarget.parentElement.remove();
}
