// accessing all elements of html
const btn = document.querySelector(".btn");
const tasks = document.querySelector(".tasks");
const items = document.querySelector("#task-items");
const addDate = document.querySelector("#date");
const clearBtn = document.querySelector(".clear");
const sortBtn = document.querySelector(".sort-button");
const dropDown = document.querySelector(".drop-down");

// Adding the date to the para
let date = new Date();
let options = { weekday: "long", month: "long", day: "numeric" };
let addingDate = date.toLocaleDateString("en-US", options);
addDate.innerText = addingDate;

// this will apply this class to change the color of placeholder when we click on it
tasks.addEventListener("click", function () {
  tasks.classList.add("dynamic-task");
});
//this function here will also change the color of placeholder back to normal when we click on somewhere else
tasks.addEventListener("blur", function () {
  tasks.classList.remove("dynamic-task");
});

//Saving the tasks to locan storage
const saveTasks = () => {
  //taking the array to store task
  const tasksArray = [];
  const taskItems = document.querySelectorAll("#task-items li");

  taskItems.forEach((task) => {
    const importantIcon = task.querySelector(".fa-star");
    tasksArray.push({
      text: task.textContent.trim(),
      completed: task.style.textDecoration === "line-through",
      important:
        importantIcon && importantIcon.style.color === "rgb(0, 116, 183)",
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasksArray));
};

//adding the functio to sort the items
// toogle dropdown visibility
sortBtn.addEventListener("click", () => {
  dropDown.style.display =
    dropDown.style.display === "block" ? "none" : "block";
});

//handling sorting when clicking on a dropdown menu option
dropDown.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const sortType = e.target.dataset.sort;
    sortTasks(sortType);
    dropDown.style.display = "none";
  }
});

//sorting function to actual sort data
const sortTasks = (type) => {
  const tasks = Array.from(
    document.querySelectorAll("#task-items .dynamic-item")
  );

  if (type === "alphabatical") {
    tasks.sort((a, b) => {
      return a.textContent.trim().localeCompare(b.textContent.trim());
    });
  } else if (type === "important") {
    tasks.sort((a, b) => {
      const aStar = a.querySelector(".fa-star");
      const bStar = b.querySelector(".fa-star");
      const aImp = getComputedStyle(aStar).color === "rgb(0, 116, 183)";
      const bImp = getComputedStyle(bStar).color === "rgb(0, 116, 183)";
      return bImp - aImp;
    });
  }
  //updating the dom
  const itemsContainer = document.querySelector("#task-items");
  itemsContainer.innerHTML = "";
  tasks.forEach((task) => itemsContainer.appendChild(task));
};

//adding the fuction to add on cancel icon
const cancelEvent = (cancel, listItem) => {
  cancel.addEventListener("click", () => {
    listItem.remove();
  });
  saveTasks();
};

//function to create list items

const createList = () => {
  let listItem = document.createElement("li");
  listItem.classList.add("dynamic-item");

  let icon = document.createElement("i");
  icon.className = "fa-regular fa-circle icon";
  
  const cancel = document.createElement("i");
  cancel.className = "fa-solid fa-xmark cancel-icon";

  const importantIcon = document.createElement("i");
  importantIcon.className = "fa-regular fa-star";

  listItem.appendChild(icon);
  listItem.appendChild(importantIcon);
  listItem.appendChild(cancel);
  cancel.addEventListener("click" , ()=>{
    listItem.remove();
  })
  return listItem;
};

// function to load the task from the local storage

const loadTasks = () => {
  const storeData = JSON.parse(localStorage.getItem("tasks"));

  if (storeData) {
    storeData.forEach((task) => {
      let listItem = createList();
      const importantIcon = listItem.childNodes[2];
      listItem.appendChild(document.createTextNode(task.text));
      if (task.completed) {
        listItem.style.textDecoration = "line-through";
      }
      if (task.important) {
        importantIcon.style.color = "rgb(0,116,183)";
      }

      items.appendChild(listItem);
      requestAnimationFrame(() => {
        listItem.classList.add("animate");
      });
    });
  }
};


//to add items in the list dynamically
const addNewItem = () => {
  let valueOfTask = tasks.value;

  //to check if the value in input is empty
  if (valueOfTask) {
    let listItem = createList();
    listItem.appendChild(document.createTextNode(" " + valueOfTask));
    items.appendChild(listItem);
    requestAnimationFrame(() => {
      listItem.classList.add("animate");
    });
    tasks.value = "";
    saveTasks();
  } else {
    alert("Please enter an item.");
  }
};

//marking list item as completed
items.addEventListener("click", function (evt) {
  let targetEvt = evt.target;
  const icon = targetEvt.querySelector("i");
  if (targetEvt.classList.contains("dynamic-item")) {
    if (targetEvt.style.textDecoration === "line-through") {
      targetEvt.style.textDecoration = "none";
      icon.style.backgroundColor = " #fff";
    } else {
      targetEvt.style.textDecoration = "line-through";
      icon.style.backgroundColor = " #0074B7";
    }
    saveTasks();
  }

  saveTasks();
});

//writing code to edit the task that i added by double clicking on them

const editTask = function (evt) {
  if (evt.classList.contains("dynamic-item")) {
    const currentTextNode = Array.from(evt.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE
    );
    const task = currentTextNode ? currentTextNode.textContent.trim() : "";
    const input = document.createElement("input");

    input.type = "text";
    input.value = task;
    input.className = "edit-input";
    if (currentTextNode) {
      evt.replaceChild(input, currentTextNode);
    }
    input.focus();
    //now writing the function to save these edit
    const saveEdit = () => {
      let updateText = input.value.trim();
      const isImportant = evt.querySelector(".fa-star").style.color === "rgb(0, 116, 183)";
      if (updateText) {
        evt.replaceChild(document.createTextNode(" " + updateText), input);
        if (isImportant) {
          const importantIcon = evt.querySelector(".fa-star");
          importantIcon.style.color = "rgb(0, 116, 183)";
        }
        saveTasks();
      } else {
        alert("Task cannot be empty!!!!");
        input.focus();
      }
    };
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveEdit();
      }
    });
  }
};

//function to mark task as important
const impTask = (e) => {
  if (e.target.style.color === "rgb(0, 116, 183)") {
    e.target.style.color = "gray";
  } else {
    e.target.style.color = "rgb(0, 116, 183)";
  }
  saveTasks();
};

// adding event listner to the ul to turn star into important task
items.addEventListener("click", (e) => {
  impTask(e);
});

//adding the event listner to edit the task after adding them by double clicking on them
items.addEventListener("dblclick", function (evt) {
  editTask(evt.target);
});

//adding the new task by clicking on the enter button
tasks.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addNewItem();
  }
});

// writing function to clear all the list item in the item conntainer
const clearTask = () => {
  items.innerHTML = "";
  localStorage.removeItem("tasks");
};

// adding event listner to the clear button
clearBtn.addEventListener("click", clearTask);

btn.addEventListener("click", addNewItem);
window.onload = () => {
  loadTasks();
  dropDown.style.display = "none";
};
