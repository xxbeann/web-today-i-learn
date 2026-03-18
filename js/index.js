const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");
const tilDateInput = document.querySelector("#til-date");
const tilTitleInput = document.querySelector("#til-title");
const tilContentInput = document.querySelector("#til-content");
const protectedImages = document.querySelectorAll("img");
const galleryImages = document.querySelectorAll(".gallery-grid img");
const imageModal = document.querySelector("#image-modal");
const imageModalImg = document.querySelector("#image-modal-img");
const imageModalTitle = document.querySelector("#image-modal-title");
const modalCloseTargets = document.querySelectorAll("[data-modal-close]");
const tilStorageKey = "jeongkong-til-items";

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

function extractTilItemsFromDom() {
  if (!tilList) {
    return [];
  }

  return Array.from(tilList.querySelectorAll(".til-item")).map(function (item) {
    const timeElement = item.querySelector("time");
    const titleElement = item.querySelector("h3");
    const contentElement = item.querySelector("p");

    return {
      date: timeElement ? timeElement.dateTime || timeElement.textContent : "",
      title: titleElement ? titleElement.textContent.trim() : "",
      content: contentElement ? contentElement.textContent.trim() : "",
    };
  }).filter(function (item) {
    return item.date && item.title && item.content;
  });
}

function saveTilItems(items) {
  localStorage.setItem(tilStorageKey, JSON.stringify(items));
}

function getStoredTilItems() {
  const storedItems = localStorage.getItem(tilStorageKey);

  if (!storedItems) {
    return null;
  }

  try {
    const parsedItems = JSON.parse(storedItems);

    if (!Array.isArray(parsedItems)) {
      return [];
    }

    return parsedItems.filter(function (item) {
      return item && item.date && item.title && item.content;
    });
  } catch {
    return [];
  }
}

function renderTilItems(items) {
  if (!tilList) {
    return;
  }

  tilList.replaceChildren();

  items.forEach(function (item) {
    tilList.append(createTilItem(item.date, item.title, item.content));
  });
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
  const storedTilItems = getStoredTilItems();

  if (storedTilItems === null) {
    saveTilItems(extractTilItemsFromDom());
  } else {
    renderTilItems(storedTilItems);
  }

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

    const updatedTilItems = extractTilItemsFromDom();
    saveTilItems(updatedTilItems);

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

protectedImages.forEach(function (image) {
  image.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

  image.addEventListener("dragstart", function (event) {
    event.preventDefault();
  });
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && imageModal && !imageModal.hidden) {
    closeImageModal();
  }
});
