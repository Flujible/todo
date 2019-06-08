const makeItem = (item) => {
  const label = document.createElement("label");
  const li = document.createElement("li");
  const check = document.createElement("input");
  const text = document.createTextNode(item.title);
  const customCheck = document.createElement("span");
  const bin = document.createElement("button");
  const moveUp = document.createElement("button");
  const moveDown = document.createElement("button");
  bin.classList.add("fas");
  bin.classList.add("fa-trash-alt");
  bin.id = "delete";
  bin.addEventListener("click", (e) => removeElement(e));
  moveUp.classList.add("fas");
  moveUp.classList.add("fa-arrow-up");
  moveUp.id = "moveUp";
  moveUp.addEventListener("click", (e) => moveItem(e, true));
  moveDown.classList.add("fas");
  moveDown.classList.add("fa-arrow-down");
  moveDown.id = "moveDown";
  moveDown.addEventListener("click", (e) => moveItem(e, false));
  li.classList.add("todo-item");
  li.id = item.id;
  customCheck.classList.add("checkmark");
  label.classList.add("item");
  label.appendChild(check);
  label.appendChild(customCheck);
  label.appendChild(text);
  li.appendChild(label);
  li.appendChild(moveUp);
  li.appendChild(moveDown);
  li.appendChild(bin);
  check.type = "checkbox";
  item.done ? li.classList.add("done") : '';
  item.break ? li.classList.add("break") : '';
  return li;
}

const addNewItem = (task) => {
  let tasks = JSON.parse(localStorage.tasks);
  let id = Math.random();
  tasks.map(task => {
    while (task.id.toString() === id.toString()) {
      id = Math.random();
    }
  });
  tasks.push({ id: id, title: task.title, done: task.done, break: task.title ? false : true});
  localStorage.setItem("tasks", JSON.stringify(tasks));

  const todoItems = document.getElementsByClassName("todo-item");
  while (todoItems.length > 0) {
    todoItems[0].parentNode.removeChild(todoItems[0]);
  }

  document.getElementById("newItemInput").value = "";
  updateList();
}

const updateList = () => {
  const taskList = JSON.parse(localStorage.tasks)
  taskList.map(item => {
    const task = makeItem(item);
    const inputEl = task.querySelector('input');
    inputEl.checked = item.done;
    inputEl.addEventListener('change', (e) => {
      item.done = e.target.checked
      task.classList.toggle("done", e.target.checked);
      localStorage.setItem("tasks", JSON.stringify(taskList));
    }, true);

    checklist.insertBefore(task, newItem);
  });
}

const removeElement = (e) => {
  const item = e.srcElement.parentNode;
  const itemId = item.id;
  const taskList = JSON.parse(localStorage.tasks);
  let indexToRemove;
  taskList.map((task, i) => {
    task.id.toString() === itemId.toString() ? indexToRemove = i : '';
  });
  taskList.splice(indexToRemove, 1);

  localStorage.setItem("tasks", JSON.stringify(taskList));
  item.parentNode.removeChild(item);
}

const moveItem = (e, up) => {
  const item = e.srcElement.parentNode;
  const itemId = item.id;
  const taskList = JSON.parse(localStorage.tasks);
  let indexToMove;
  taskList.map((task, i) => {
    task.id.toString() === itemId.toString() ? indexToMove = i : '';
  });
  const itemToMove = taskList.splice(indexToMove, 1);
  if(up) {
    taskList.splice(indexToMove, -1, itemToMove);
  } else {
    taskList.splice(indexToMove, 0, itemToMove);
  }

  localStorage.setItem("tasks", JSON.stringify(taskList));
}

const setupList = () => {
  const defaultTasks = [{ id: Math.random(), title: "Open to do list", done: true }];
  const inputForm = document.getElementById("inputForm");
  const newInputItem = document.getElementById("newItemInput");

  localStorage.tasks ? '' : localStorage.setItem("tasks", JSON.stringify(defaultTasks));

  inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewItem({ title: newInputItem.value, done: false });
  });

  updateList();
}
