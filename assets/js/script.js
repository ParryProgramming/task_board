document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.querySelector(".close");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskBoard = document.querySelector(".task-board");
  
    // Open modal
    openModalBtn.addEventListener("click", function () {
      modal.style.display = "block";
    });
  
    // Close modal
    closeModalBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  
    // Add task
    addTaskBtn.addEventListener("click", function () {
      const taskTitle = document.getElementById("task-input").value;
      const taskDate = document.querySelector("input[type='date']").value;
      const taskDescription = document.querySelector("textarea").value;
  
      if (taskTitle && taskDate && taskDescription) {
        const newTask = document.createElement("div");
        newTask.classList.add("taskParent");
        newTask.innerHTML = `
          <h2 class="task heading" draggable="true">${taskTitle}</h2>
          <div class="taskDate">${taskDate}</div>
          <p>${taskDescription}</p>
          <button class="deleteBtn">Delete</button>
        `;
        const todoFolder = document.getElementById("to-do");
        todoFolder.appendChild(newTask);
        addDraggableListeners(newTask); // Add draggable listeners to the new task
        modal.style.display = "none";
        // Clear input fields
        document.getElementById("task-input").value = "";
        document.querySelector("input[type='date']").value = "";
        document.querySelector("textarea").value = "";
      } else {
        alert("Please fill in all fields.");
      }
    });
  
    // Delete task
    taskBoard.addEventListener("click", function (event) {
      if (event.target.classList.contains("deleteBtn")) {
        event.target.parentNode.remove();
      }
    });
  
    // Drag and drop functionality
    const taskFolders = document.querySelectorAll(".task-folder");
  
    taskFolders.forEach((folder) => {
      folder.addEventListener("dragover", dragOver);
      folder.addEventListener("dragenter", dragEnter);
      folder.addEventListener("dragleave", dragLeave);
      folder.addEventListener("drop", dragDrop);
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
      this.classList.remove("hovered");
      const draggedTask = document.querySelector(".dragging");
      this.appendChild(draggedTask);
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
  });
  