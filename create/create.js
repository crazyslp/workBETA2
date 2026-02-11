// ------------------- файл перетаскивался
const dropZone = document.getElementById("drop_zone");
const fileInput = document.getElementById("file_input");
const uploadBtn = dropZone.querySelector("button");

// 1. Клик по блоку вызывает выбор файла
dropZone.addEventListener("click", () => {
  fileInput.click();
});

// 2. Предотвращаем двойной вызов при клике именно на кнопку (всплытие)
uploadBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fileInput.click();
});

// 3. Визуальные эффекты при перетаскивании
["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add("active");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("active");
  });
});

// 4. Обработка сброса файла (Drop)
dropZone.addEventListener("drop", (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
});

// 5. Обработка выбора через проводник
fileInput.addEventListener("change", function () {
  handleFiles(this.files);
});

// 6. Основная функция обработки
function handleFiles(files) {
  const fileArray = [...files];

  // Пример валидации расширений (согласно вашему HTML)
  const allowedExtensions = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "mp3",
    "wav",
    "mp4",
    "mov",
    "avi",
    "pdf",
    "zip",
    "rar",
  ];

  fileArray.forEach((file) => {
    const extension = file.name.split(".").pop().toLowerCase();

    if (allowedExtensions.includes(extension)) {
      console.log(`Файл "${file.name}" принят`);
      // Здесь логика загрузки или превью
    } else {
      alert(`Файл "${file.name}" имеет недопустимый формат!`);
    }
  });
}

// -------------------------------------------
