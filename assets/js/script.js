const task_form = document.getElementById("task_form")
const btn_modal_close = document.getElementById("btn_modal_close")
// containers
const todo_cards_container  = document.getElementById("todo-cards")
const progress_cards_container  = document.getElementById("in-progress-cards")
const done_cards_container  = document.getElementById("done-cards")


// add new task
task_form.addEventListener("submit",(event)=>{
    event.preventDefault()
    const form = event.target

    const title = form.title.value
    const task_due_date = form.task_due_date.value
    const desc = form.desc.value
    const task_id = generateUniqueId()
    
    if(title && task_due_date && desc){
        
        let newTask = document.createElement("div");
        newTask.classList.add("taskParent");
        newTask.setAttribute("draggable", true)
        newTask.setAttribute("task_id", task_id)
        newTask.innerHTML = `
        <h2 class="task heading" draggable="true">${title}</h2>
        <div class="taskDate">${task_due_date}</div>
        <p>${desc}</p>
        <button class="deleteBtn" onclick="delete_task(this, '${task_id}')">Delete</button>
      `;


      todo_cards_container.appendChild(newTask)
      addDraggableListeners(newTask); 
    
      
      add_task_to_storage({title, desc, 
        task_due_date,id:task_id,
        progress:"0"
    })

    btn_modal_close.click()

    // reset form inputs
    form.title.value = ""
    form.desc.value = ""
    form.task_due_date.value = null
    }
    else {
        alert("Please fill in all fields.");
      }
})



function delete_task(task, id){

    let tasks = get_tasks_from_storage().filter(task=>{
        return task.id != id
    })

    localStorage.setItem("tasks", JSON.stringify(tasks))

    task.parentNode.remove();
}

// Drag and drop 
let task_containers = document.querySelectorAll(".__card_container");

task_containers.forEach((container) => {
    container.addEventListener("dragover", dragOver);
    container.addEventListener("dragenter", dragEnter);
    container.addEventListener("dragleave", dragLeave);
    container.addEventListener("drop", dragDrop);
    
  });

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
    this.classList.add("hovered");
  }

  function dragLeave() {
    this.classList.remove("hovered");
  }

  function dragDrop(e) {
    const target_div = e.target.querySelector(".cards")
    this.classList.remove("hovered");
    let draggedTask = document.querySelector(".dragging");
    
    const new_progress = get_progress(target_div.getAttribute("id"));
    const id = draggedTask.getAttribute("task_id")

    // log(id and new_progress);
    update_storage(id, new_progress)

    target_div.appendChild(draggedTask);
  }

function addDraggableListeners(task) {
    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragend", dragEnd);
  }


  function dragStart() {
    this.classList.add("dragging");
    setTimeout(() => {
      this.style.display = "none";
    }, 0);
  }

  function dragEnd() {
    this.classList.remove("dragging");
    this.style.display = "block";
  }



function add_task_to_storage(task){

  const prev_tasks = get_tasks_from_storage()
  const tasks = [...prev_tasks, task]
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

function get_tasks_from_storage(){
    const tasks = JSON.parse(localStorage.getItem("tasks")) || []
    return tasks
}


function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36);
  }


function get_progress(id){

    switch(id){

        case "todo-cards":
            return "0"
        case "in-progress-cards":
            return "1"
        case "done-cards":
            return "2"
    }

}

function update_storage(id, progress){

    let prev_tasks = get_tasks_from_storage()

    let update_tasks = prev_tasks.map(task => {

        if(task.id != id){
            return task
        }else{
            return {...task, progress:progress}
        }
    });

    console.log(update_tasks);


    localStorage.setItem("tasks", JSON.stringify(update_tasks))

}


function load_tasks(){

    const tasks = get_tasks_from_storage()
    const to_do_tasks = tasks.filter(task=>{
        return task.progress === "0"
    })
    const in_progress_tasks = tasks.filter(task=>{
        return task.progress === "1"
    })
    const done_tasks = tasks.filter(task=>{
        return task.progress === "2"
    })

    return [to_do_tasks, in_progress_tasks, done_tasks]
}


window.onload = ()=>{

    const [to_do_tasks, in_progress_tasks, done_tasks] = load_tasks()

    // load todos

    to_do_tasks.forEach(task=>{
        generate_task(task, todo_cards_container)
    })

    // load progress

    in_progress_tasks.forEach(task=>{
        generate_task(task, progress_cards_container)
    })

    // load done tasks

    done_tasks.forEach(task=>{
        generate_task(task, done_cards_container)
    })

}


function generate_task(task, parent){


    const newTask = document.createElement("div");
        newTask.classList.add("taskParent");
        newTask.setAttribute("draggable", true)
        newTask.setAttribute("task_id", task.id)
        newTask.innerHTML = `
        <h2 class="task heading" draggable="true">${task.title}</h2>
        <div class="taskDate">${task.task_due_date}</div>
        <p>${task.desc}</p>
        <button class="deleteBtn" onclick="delete_task(this, '${task.id}')">Delete</button>
      `;


      parent.appendChild(newTask)
      addDraggableListeners(newTask); 
}