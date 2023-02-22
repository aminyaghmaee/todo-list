//variables

const create = document.querySelector(".create");
const container = document.querySelector(".container");
const child = document.querySelector(".child");
const form = document.querySelector(".form");
const ourTasks = document.querySelector(".tasks");
const tasks = load();
console.log(tasks);
const createInput = document.getElementById("createInput");
const add = document.querySelector(".add");
const cancel = document.querySelector(".cancel");
const searchInput = document.querySelector(".searchInput");
const formAction = document.querySelector(".form-action");
const editSubmit = document.createElement("button");
editSubmit.className = "edit_submit";
editSubmit.textContent = "edit";

render(tasks);

// Func
function hideModal() {
  create.setAttribute("data-active", "false");
  container.style.display = "none";
  child.textContent = "Create";
  ourTasks.style.filter = "blur(0)";
  form.style.filter = "blur(0)";
  create.style.backgroundColor = "white";
  child.style.color = "black";
}

function showModal() {
  create.setAttribute("data-active", "true");
  child.style.color = "white";
  create.style.backgroundColor = "red";
  container.style.display = "flex";
  child.textContent = "Close";
  form.style.filter = "blur(4px)";
  ourTasks.style.filter = "blur(4px)";
}

function save(data) {
  return localStorage.setItem("tasks", JSON.stringify(data));
}

function load() {
  const tasks = localStorage.getItem("tasks");

  if (tasks) {
    return JSON.parse(tasks);
  } else {
    localStorage.setItem("tasks", JSON.stringify([]));
    return JSON.parse(localStorage.getItem("tasks"));
  }
}

function deleteTask(id) {
  const tasks = load();

  const newTasks = tasks.filter((task) => task.id !== id);
  save(newTasks);

  document.querySelector(`#task-${id}`).remove();
}

function active(id) {
  const tasks = load();
  const index = tasks.findIndex((task) => task.id == id);
  if (index >= 0) {
    document.querySelector(`#task-${id}`).classList.toggle("active");
    if (tasks[index].done == false) {
      tasks[index].done = true;
    } else if (tasks[index].done == true) {
      tasks[index].done = false;
    }
    save(tasks);
  }
}

function createTaskEl(task) {
  // Create taskEl
  const taskEl = document.createElement("div");
  taskEl.classList.add("mytaskclass");
  taskEl.setAttribute("id", `task-${task.id}`);
  taskEl.textContent = task.content;

  if (task.done) {
    taskEl.classList.add("active");
  } else if (task.done == false) {
    taskEl.classList.remove("active");
  }

  // Create remove button
  const buttons = document.createElement("div");
  buttons.className = "buttons";
  taskEl.appendChild(buttons);
  const buttonEdit = document.createElement("button");
  buttonEdit.textContent = "Edit";
  buttonEdit.classList.add("edit");
  buttonEdit.addEventListener("click", () => editTask(task.id));
  buttons.appendChild(buttonEdit);
  const buttonEl = document.createElement("button");
  buttonEl.textContent = "Delete";
  buttonEl.classList.add("delete");
  buttonEl.addEventListener("click", () => deleteTask(task.id));
  buttons.appendChild(buttonEl);

  taskEl.addEventListener("click", () => active(task.id));

  return taskEl;
}

function render(tasks) {
  ourTasks.replaceChildren();
  tasks.forEach((task) => {
    const taskEl = createTaskEl(task);
    ourTasks.appendChild(taskEl);
  });
}
// edit task:
function editTask(id) {
  event.cancelBubble = true;
  const isActivee = create.getAttribute("data-active");
  isActivee === "false" ? showModal() : hideModal();
  const taskFiltered = tasks.filter((item) => item.id == id);
  console.log(taskFiltered);

  createInput.value = taskFiltered[0].content;
  formAction.replaceChild(editSubmit, add);

  editSubmit.addEventListener("click", () => {
    taskFiltered[0].content = createInput.value;
    ourTasks.children[0] = taskFiltered[0].content;
    hideModal();
    console.log(taskFiltered[0].content);
  });
}

function search() {
  const filteredTask = tasks.filter((item) => {
    return item.content.search(searchInput.value) !== -1;
  });
  render(filteredTask);
}
searchInput.addEventListener("input", search);

//Create button

create.addEventListener("click", () => createButton());
function createButton() {
  {
    const isActive = create.getAttribute("data-active");
    isActive === "false" ? showModal() : hideModal();
    formAction.replaceChild(add, editSubmit);
  }
}
//Add button

add.addEventListener("click", () => {
  if (createInput.value == "") {
    return alert("please fill input");
  }
  const newTask = {
    id: Date.now(),
    content: createInput.value,
    done: false,
  };
  tasks.push(newTask);
  save(tasks);
  const newTaskEl = createTaskEl(newTask);
  ourTasks.appendChild(newTaskEl);
  createInput.value = "";
  hideModal();
});

//cancel button

cancel.addEventListener("click", () => {
  hideModal();
  createInput.value = "";
});
