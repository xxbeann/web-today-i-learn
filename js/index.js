const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");
const tilDateInput = document.querySelector("#til-date");
const tilTitleInput = document.querySelector("#til-title");
const tilContentInput = document.querySelector("#til-content");
const galleryImages = document.querySelectorAll(".gallery-grid img");
const imageModal = document.querySelector("#image-modal");
const imageModalImg = document.querySelector("#image-modal-img");
const imageModalTitle = document.querySelector("#image-modal-title");
const modalCloseTargets = document.querySelectorAll("[data-modal-close]");

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
}

if (tilDateInput) {
  tilDateInput.value = getTodayDate();
}

function createTilItem(date, title, content) {
  const tilItem = document.createElement("article");
  tilItem.className = "til-item";

  const timeElement = document.createElement("time");
  timeElement.dateTime = date;
  timeElement.textContent = date;

  const titleElement = document.createElement("h3");
  titleElement.textContent = title;

  const contentElement = document.createElement("p");
  contentElement.textContent = content;

  tilItem.append(timeElement, titleElement, contentElement);

  return tilItem;
}

function openImageModal(image) {
  if (!imageModal || !imageModalImg) {
    return;
  }

  imageModalImg.src = image.src;
  imageModalImg.alt = image.alt;
  if (imageModalTitle) {
    imageModalTitle.textContent = image.alt;
  }
  imageModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeImageModal() {
  if (!imageModal || !imageModalImg) {
    return;
  }

  imageModal.hidden = true;
  imageModalImg.src = "";
  imageModalImg.alt = "";
  if (imageModalTitle) {
    imageModalTitle.textContent = "갤러리 이미지 크게 보기";
  }
  document.body.classList.remove("modal-open");
}

if (tilForm && tilList && tilDateInput && tilTitleInput && tilContentInput) {
  tilForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const date = tilDateInput.value;
    const title = tilTitleInput.value.trim();
    const content = tilContentInput.value.trim();

    if (!date || !title || !content) {
      return;
    }

    const tilItem = createTilItem(date, title, content);
    tilList.prepend(tilItem);
    tilForm.reset();
    tilDateInput.value = getTodayDate();
    tilTitleInput.focus();
  });
}

galleryImages.forEach(function (image) {
  image.addEventListener("click", function () {
    openImageModal(image);
  });
});

modalCloseTargets.forEach(function (target) {
  target.addEventListener("click", closeImageModal);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && imageModal && !imageModal.hidden) {
    closeImageModal();
  }
});
