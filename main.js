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
  li.id = document.getElementsByClassName('todo-item').length + 1;
  customCheck.classList.add("checkmark");
  label.classList.add("handle");
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
  item.title.length === 0 ? li.classList.add("break") : '';
  return li;
}

const addNewItem = (task) => {
  const tasks = JSON.parse(localStorage.tasks);
  const id = document.getElementsByClassName('todo-item').length + 1;
  tasks.push({ id: id, title: task.title, done: task.done });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById("lp-lu").appendChild(makeItem(task));

  document.getElementById("new-item-input").value = "";
}

const initialiseList = () => {
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

    // checklist.insertBefore(task, newItem);
  });
  // updateFirstLast();
}

const updateList = (el) => {
  const list = document.getElementsByClassName('todo-item');
  const dataItems = [];

  for (const todo of list) {
    dataItems.push({
      id: todo.id,
      title: todo.textContent,
      done: todo.classList.contains("done"),
      dragged: todo.classList.contains("dragged")
    })
  }

  let indexToRemove;
  dataItems.forEach((item, i) => {
    if (item.id === el.id) {
      if (!item.dragged) {
        indexToRemove = i;
      }
    }
    item.dragged = false;
  });

  if (indexToRemove) {
    dataItems.splice(indexToRemove, 1);
  }

  localStorage.setItem("tasks", JSON.stringify(dataItems));
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
  // updateFirstLast();
}

const moveItem = (e, up) => {
  const itemElem = e.srcElement.parentNode;
  if (up) {
    const sibling = itemElem.previousElementSibling;
    itemElem.replaceWith(itemElem, sibling);
  } else {
    const sibling = itemElem.nextElementSibling;
    itemElem.replaceWith(sibling, itemElem);
  }

  const list = document.getElementsByClassName('todo-item');
  const dataItems = [];
  for (const todo of list) {
    dataItems.push({
      id: todo.id,
      title: todo.textContent,
      done: todo.classList.contains("done"),
      dragged: todo.classList.contains("dragged")
    })
  }
  localStorage.setItem("tasks", JSON.stringify(dataItems));
}

const updateFirstLast = () => {
  const todos = document.querySelectorAll(".todo-item");
  let first = null;
  let newFirst = null;
  let last = null;
  let newLast = null;

  if(document.querySelector(".first")) {
    first = document.querySelector(".first");
    first.classList.remove("first");
    first.querySelector("button#moveUp").toggleAttribute("disabled");
  }
  if (document.querySelector(".last")) {
    last = document.querySelector(".last");
    last.classList.remove("last");
    last.querySelector("button#moveDown").toggleAttribute("disabled");
  }
  newFirst = todos[0];
  newLast = todos[todos.length - 1];
  newFirst.classList.add("first");
  newFirst.querySelector("button#moveUp").toggleAttribute("disabled");
  newLast.classList.add("last");
  newLast.querySelector("button#moveDown").toggleAttribute("disabled");
}

const setupList = () => {
  const defaultTasks = [{ id: 0, title: "Open to do list", done: true }];
  const inputForm = document.getElementById("inputForm");
  const newInputItem = document.getElementById("new-item-input");

  localStorage.tasks ? '' : localStorage.setItem("tasks", JSON.stringify(defaultTasks));

  inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewItem({ title: newInputItem.value, done: false });
  });

  initialiseList();
}

window.onload = () => {
  setupList();
  const drake = dragula([
    document.getElementById('hp-hu'),
    document.getElementById('hp-lu'),
    document.getElementById('lp-hu'),
    document.getElementById('lp-lu'),
  ], {
    revertOnSpill: true,
    moves: function (el, container, handle) {
      return handle.classList.contains('handle');
    }
  });
  drake.on('drop', (el, target, source, sibling) => {
    el.classList.add("dragged")
    updateList(el);
  })
}