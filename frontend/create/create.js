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

// ----------выбираем тайп при нажатии------------------

const allFocs = document.querySelectorAll(".typeitems");

allFocs.forEach((item) => {
  item.addEventListener("click", function () {
    // 1. Сначала проходим по всем блокам и удаляем у них класс "focus"
    allFocs.forEach((el) => el.classList.remove("focus"));

    // 2. А теперь добавляем класс только тому, по которому кликнули
    this.classList.add("focus");
  });
});

// ----------меняем цвет у кагори при нажатии-----------------------

const categories = document.querySelectorAll(".offer_category_items");

categories.forEach((item) => {
  item.addEventListener("click", function () {
    // 1. Сначала у всех блоков убираем класс 'categor' у их иконок
    categories.forEach((el) => {
      const icon = el.querySelector(".ico_cat");
      if (icon) icon.classList.remove("categor");
    });

    // 2. Находим иконку именно внутри того блока, по которому кликнули
    const currentIcon = this.querySelector(".ico_cat");

    // 3. Добавляем ей класс 'categor'
    if (currentIcon) {
      currentIcon.classList.add("categor");
    }
  });
});

// --

const categoryItems = document.querySelectorAll(".offer_category_items");

categoryItems.forEach((item) => {
  item.addEventListener("click", function () {
    // 1. Проходим по всем категориям и удаляем класс "categr"
    categoryItems.forEach((el) => el.classList.remove("categr"));

    // 2. Добавляем класс "categr" именно тому блоку, по которому кликнули
    this.classList.add("categr");
  });
});

// ---------------------------------------------------------------
// -------скрин оффера с интеграцией инпутов и всех категорий------
// 1. Находим элементы превью (те самые ID, что мы добавили в HTML)
const previewType = document.getElementById("preview_type_label");
const previewCat = document.getElementById("preview_category");
const previewPrice = document.getElementById("preview_price");
const previewTitle = document.getElementById("preview_title");
const previewDesc = document.getElementById("preview_desc");

// 2. Обновляем тип (Продаю/Покупаю) при клике
allFocs.forEach((item) => {
  item.addEventListener("click", function () {
    if (this.innerText.includes("Найти")) {
      previewType.innerText = "Покупаю";
      previewType.classList.add("offer_top_znak_buy"); // Твой градиент
    } else {
      previewType.innerText = "Продаю";
      previewType.classList.remove("offer_top_znak_buy");
    }
  });
});

// 3. Обновляем категорию в превью (Биты, Сведение и т.д.)
categoryItems.forEach((item) => {
  item.addEventListener("click", function () {
    // Берем только текст, игнорируя иконку
    const textNode = Array.from(this.childNodes).find(
      (node) =>
        node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "",
    );

    if (textNode) {
      previewCat.innerText = textNode.textContent.trim();
    }
  });
});

// 4. Обновляем текстовые поля (Название, Описание, Цена)
// Ищем инпуты внутри блока информации
const infoInputs = document.querySelectorAll(
  ".offer_information_con input, .offer_information_con textarea",
);

infoInputs.forEach((input, index) => {
  input.addEventListener("input", function () {
    if (index === 0) previewTitle.innerText = this.value || "Название оффера";
    if (index === 1) previewDesc.innerText = this.value || "Описание оффера...";
    if (index === 2) {
      let val = this.value.replace(/\D/g, ""); // Только цифры
      this.value = val;
      previewPrice.innerText = (val || "0") + "р";
    }
  });
});
