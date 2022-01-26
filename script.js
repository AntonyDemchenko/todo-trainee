"use strict";

let newTodo = document.querySelector(".todo__input");
let todosList = document.querySelector(".todos-list");

let todoCount = document.querySelector(".todo-count__number");
let tasksSection = document.querySelector(".tasks");
let footer = document.querySelector(".footer");
let checkAllBtn = document.querySelector(".check-all");

// CREATE NEW ELEMENT
function createNewElement(elementTitle, elementID, elementChecked) {
  let listItem = document.createElement("li");
  listItem.className = "todos__item";
  listItem.setAttribute("item-id", elementID);

  let listItemCheckbox = document.createElement("input");
  listItemCheckbox.className = "todos__toggle";
  listItemCheckbox.setAttribute("type", "checkbox");
  listItemCheckbox.checked = elementChecked;
  listItem.append(listItemCheckbox);

  let listItemTitle = document.createElement("p");
  listItemTitle.className = "todos__title";
  listItemTitle.textContent = elementTitle;
  listItem.append(listItemTitle);

  let listItemDelete = document.createElement("button");
  listItemDelete.className = "todos__delete";

  listItemDelete.innerHTML = "&#215;";
  listItem.append(listItemDelete);

  todosList.append(listItem);
}

// RENDER ALL ELEMENTS FROM LOCALSTORAGE BY FIRST LOAD
function firstLoadRender() {
  let storage = JSON.parse(localStorage.getItem("todos-list")) || [];

  storage.forEach((item) =>
    createNewElement(item.title, item.id, item.completed)
  );
  if (storage.length != 0) {
    tasksSection.classList.add("active");
    footer.classList.add("active");
  }
}

window.addEventListener("load", firstLoadRender());

// FILTER TODOS DEPENDING FILTER TYPE
function filterTasks(filterType, collectElements) {
  if (filterType == "active") {
    filterType = false;
  } else if (filterType == "completed") {
    filterType = true;
  }

  let allTasks = document.querySelectorAll(".todos__item");
  let activeTasks = [];
  allTasks.forEach((element) => {
    if (element.querySelector(".todos__toggle").checked === filterType) {
      collectElements(element, activeTasks);
    }
  });

  return activeTasks;
}

//HIDE TASKS SECTION IF TODOS ARE ABSENT
function hideTasksSection() {
  if (!document.querySelector(".todos__item")) {
    tasksSection.className = "tasks";
    footer.className = "footer";
  }
}

// EVENT ADD TODO ITEM
newTodo.addEventListener("keydown", function (event) {
  let storage = JSON.parse(localStorage.getItem("todos-list")) || [];
  if (event.keyCode === 13 && newTodo.value.trim()) {
    let todoTask = { title: newTodo.value, completed: false, id: uuidv4() };

    storage.push(todoTask);

    localStorage.setItem("todos-list", JSON.stringify(storage));

    createNewElement(todoTask.title, todoTask.id, todoTask.completed);
    changeTodoCount();

    newTodo.value = "";

    tasksSection.classList.add("active");
    footer.classList.add("active");
  }
});

//CHANGE TODO COUNT
function changeTodoCount() {
  function collectElements(element, collector) {
    collector.push(element);
  }

  let activeTasks = filterTasks("active", collectElements);

  todoCount.textContent = activeTasks.length;

  let todoCountName = document.querySelector(".todo-count__name");
  if (activeTasks.length > 1) {
    todoCountName.textContent = "items";
    checkAllBtn.classList.remove("active");
  } else if (activeTasks.length == 0) {
    checkAllBtn.classList.toggle("active");
  } else {
    todoCountName.textContent = "item";
    checkAllBtn.classList.remove("active");
  }
}

// EVENT DELETE TODO ITEM
todosList.addEventListener("click", (event) => {
  if (event.target.className == "todos__delete") {
    event.target.closest(".todos__item").remove();
    deleteFromStorage(event.target);
  }

  changeTodoCount();
  hideTasksSection();
});

// FUNCTION FOR DELETE ITEM FROM STORAGE
function deleteFromStorage(element) {
  let itemId = element.closest("li").getAttribute("item-id");

  let storage = JSON.parse(localStorage.getItem("todos-list")) || [];

  let updatedStorage = storage.filter((item) => item.id != itemId);

  localStorage.setItem("todos-list", JSON.stringify(updatedStorage));
}

// INDICATE CHOSEN FILTER BUTTON
let filterBtns = document.querySelector(".filter-btns");
filterBtns.addEventListener("click", (event) => {
  let allSortBtns = filterBtns.querySelectorAll("li");
  allSortBtns.forEach((item) => {
    item.classList.remove("selected");
  });
  // console.log(event.target)
  event.target.closest("li").classList.add("selected");
});

// FILTER TODO LIST, LEFT ACTIVE TASKS
let filterActiveBtn = document.querySelector(".filter-btns .active");
filterActiveBtn.addEventListener("click", (event) => {
  filterAllBtn.click();

  function hideCheckedItems(element, collector) {
    element.classList.add("hide");
  }

  filterTasks("completed", hideCheckedItems);
});

// FILTER TODO LIST, LEFT COMPLETED TASKS
let filterCompletedBtn = document.querySelector(".filter-btns .completed");
filterCompletedBtn.addEventListener("click", (event) => {
  filterAllBtn.click();

  function hideActiveItems(element, collector) {
    element.classList.add("hide");
  }

  filterTasks("active", hideActiveItems);
});

// FILTER TODO LIST, LEFT ALL TASKS
let filterAllBtn = document.querySelector(".filter-btns .all");
filterAllBtn.addEventListener("click", (event) => {
  let allTasks = document.querySelectorAll(".todos__item");
  allTasks.forEach((element) => {
    element.classList.remove("hide");
  });
});

// EVENT SWITCH ALL CHECKBOX TO CHECKED
checkAllBtn.addEventListener("click", (event) => {
  checkAllBtn.classList.toggle("active");
  let allTasks = document.querySelectorAll(".todos__item");
  let storage = JSON.parse(localStorage.getItem("todos-list")) || [];
  let updatedStorage = [];

  if (
    [...allTasks].every(
      (item) => item.querySelector(".todos__toggle").checked == true
    )
  ) {
    allTasks.forEach((item) => {
      item.querySelector(".todos__toggle").checked = false;

      updatedStorage = storage.map((item) => {
        item.completed = false;
        return item;
      });
    });
  } else {
    allTasks.forEach((item) => {
      item.querySelector(".todos__toggle").checked = true;

      updatedStorage = storage.map((item) => {
        item.completed = true;
        return item;
      });
    });
    checkAllBtn.classList.toggle("active");
  }

  localStorage.setItem("todos-list", JSON.stringify(updatedStorage));

  changeTodoCount();
  filterBySortMode();
});

// FILTER ITEMS AFTER CLICK ON CHECKBOX BY CHOSEN FILTER MODE
todosList.addEventListener("click", (event) => {
  if (event.target.className == "todos__toggle") {
    filterBySortMode();

    let storage = JSON.parse(localStorage.getItem("todos-list")) || [];

    let itemId = event.target.closest(".todos__item").getAttribute("item-id");

    let updatedStorage = storage.map((item) => {
      if (item.id == itemId) {
        item.completed = !item.completed;
        return item;
      } else {
        return item;
      }
    });

    localStorage.setItem("todos-list", JSON.stringify(updatedStorage));
  }
});

function switchCompletedFag() {}

// FILTER BY CHOSEN FILTER MODE
function filterBySortMode() {
  let filterType = document.querySelector(".filter-btns .selected");

  if (filterType.classList.contains("active")) {
    filterActiveBtn.click();
  } else if (filterType.classList.contains("completed")) {
    filterCompletedBtn.click();
  }
}

// EVENT DELETE ALL CHECKED ITEMS
let deleteChecked = document.querySelector(".delete-checked");
deleteChecked.addEventListener("click", (event) => {
  let allTasks = document.querySelectorAll(".todos__item");
  allTasks.forEach((item) => {
    if (item.querySelector(".todos__toggle").checked == true) {
      item.remove();
    }
  });

  let storage = JSON.parse(localStorage.getItem("todos-list")) || [];

  let updatedStorage = storage.filter((element) => element.completed == false);

  localStorage.setItem("todos-list", JSON.stringify(updatedStorage));
  changeTodoCount();
  hideTasksSection();
});
