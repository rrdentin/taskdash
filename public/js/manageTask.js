document.addEventListener("DOMContentLoaded", () => {
  const storedUsername = localStorage.getItem('usernameLoggedIn');
  const sessionUsername = sessionStorage.getItem('usernameLoggedIn');

  if (!storedUsername && !sessionUsername) {
    window.location.href = 'index.html';
  }

  function capitalizeFirstChar(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatDate(userFriendlyDate) {
    const date = new Date(userFriendlyDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }

  const usernameLoggedIn = localStorage.getItem("usernameLoggedIn") || sessionUsername || "Guest";
  const usernameElement = document.getElementById("usernameLoggedIn");
  if (usernameElement) usernameElement.textContent = usernameLoggedIn;

  const myTasks = new Task();
  const taskWrapper = document.getElementById("taskWrapper");
  const taskWrapperEmpty = document.getElementById("taskWrapperEmpty");
  const searchInput = document.querySelector('input[name="name"]');
  const sortSelect = document.getElementById("sortSelect");

  // NEW: checkbox handle
  const toggleCompleted = document.getElementById("toggleCompleted");

  // UI state
  let currentSearch = "";
  let currentSort = (sortSelect && sortSelect.value) ? sortSelect.value : "date_desc";

  // NEW: persisted toggle state (default true)
  let showCompleted = (localStorage.getItem("showCompleted") ?? "true") === "true";
  if (toggleCompleted) toggleCompleted.checked = showCompleted;

  function filterTasks(tasks, term) {
    if (!term) return tasks;
    const t = term.toLowerCase();
    return tasks.filter(task =>
      String(task.taskName || "").toLowerCase().includes(t)
    );
  }

  function sortTasks(tasks, sortKey) {
    const priorityRank = { high: 3, medium: 2, low: 1 };

    const timeOf = (t) => {
      const ms = Date.parse(t.createdAt); // supports ISO or "YYYY-MM-DD"
      return Number.isFinite(ms) ? ms : 0;
    };

    // Compare ids numerically if possible; otherwise lexicographically
    const idNum = (t) => {
      const n = Number(t.id);
      return Number.isFinite(n) ? n : null;
    };
    const cmpIdAsc = (a, b) => {
      const na = idNum(a), nb = idNum(b);
      if (na !== null && nb !== null) return na - nb;
      return String(a.id ?? "").localeCompare(String(b.id ?? ""));
    };
    const cmpIdDesc = (a, b) => -cmpIdAsc(a, b);

    const arr = [...tasks];

    switch (sortKey) {
      case "date_asc":
        arr.sort((a, b) => {
          const ta = timeOf(a), tb = timeOf(b);
          if (ta !== tb) return ta - tb; // older first
          return cmpIdAsc(a, b); // smaller id first
        });
        break;

      case "date_desc":
        arr.sort((a, b) => {
          const ta = timeOf(a), tb = timeOf(b);
          if (ta !== tb) return tb - ta; // newer first
          return cmpIdDesc(a, b); // larger id first
        });
        break;

      case "priority_asc":
        arr.sort((a, b) => {
          const pa = priorityRank[String(a.taskPriority || "").toLowerCase()] || 0;
          const pb = priorityRank[String(b.taskPriority || "").toLowerCase()] || 0;
          if (pa !== pb) return pa - pb; // low -> high
          const ta = timeOf(a), tb = timeOf(b);
          if (ta !== tb) return ta - tb; // older first
          return cmpIdAsc(a, b); // smaller id first
        });
        break;

      case "priority_desc":
        arr.sort((a, b) => {
          const pa = priorityRank[String(a.taskPriority || "").toLowerCase()] || 0;
          const pb = priorityRank[String(b.taskPriority || "").toLowerCase()] || 0;
          if (pa !== pb) return pb - pa; // high -> low
          const ta = timeOf(a), tb = timeOf(b);
          if (ta !== tb) return tb - ta; // newer first
          return cmpIdDesc(a, b); // larger id first
        });
        break;

      default:
        // fallback: newest first with id tie-breaker
        arr.sort((a, b) => {
          const ta = timeOf(a), tb = timeOf(b);
          if (ta !== tb) return tb - ta;
          return cmpIdDesc(a, b);
        });
    }

    return arr;
  }

  function normalizePriority(p) {
    return String(p || "").trim().toLowerCase();
  }

  function getPriorityAvatarBg(priority, useOrangeForHigh = false) {
    switch (normalizePriority(priority)) {
      case "low":
        return { cls: "bg-blue-100", hex: "#BDEBFF", text: "#6d9de6ff", img: "ghost" }; // blue
      case "medium":
        return { cls: "bg-purple-100", hex: "#EEE5FF", text: "#b386edff", img: "crown-purple" }; // purple
      case "high":
        return { cls: "bg-red-100", hex: "#FFE5E5", text: "#e66d6dff", img: "clock-red" }; // red
      default:
        return { cls: "bg-gray-100", hex: "#F3F4F6" }; // fallback
    }
  }
  // Rendering pipeline: always pull fresh tasks from storage
  function computeAndRender() {
    const all = myTasks.getTasks();
    const filteredBySearch = filterTasks(all, currentSearch);

    // NEW: apply completed filter
    const visibilityFiltered = showCompleted
      ? filteredBySearch
      : filteredBySearch.filter(t => !t.isCompleted);

    const sorted = sortTasks(visibilityFiltered, currentSort);
    displayAllTasks(sorted);
  }

  function displayAllTasks(tasks) {
    taskWrapper.innerHTML = '';
    if (!tasks || tasks.length === 0) {
      taskWrapperEmpty.className = 'flex justify-center items-center h-[420px] mx-auto';
      taskWrapper.className = "hidden";
      return;
    }

    taskWrapperEmpty.className = "hidden";
    taskWrapper.className = 'flex flex-col gap-6';

    tasks.forEach((task) => {
      const userFriendlyDate = formatDate(task.createdAt);
      const itemTask = document.createElement("div");
      itemTask.className = "flex justify-between bg-white p-5 w-full rounded-3xl";

      // NEW: get bg color based on priority
      const bg = getPriorityAvatarBg(task.taskPriority, /* useOrangeForHigh */ false);

      itemTask.innerHTML = `
<div class="task-card flex flex-col gap-5">
    <div class="flex gap-3 items-center">
        <div class="w-[50px] h-[50px] flex shrink-0 items-center justify-center rounded-full ${bg.cls}"
            style="background-color: ${bg.hex}">
            <img src="/public/img/icons/${bg.img}.svg" alt="icon">
        </div>
        <div class="flex flex-col">
            <p class="font-bold text-lg leading-[27px]">${capitalizeFirstChar(task.taskName)}</p>
            <p class="text-sm leading-[21px] text-taskia-grey">Created at ${userFriendlyDate}</p>
        </div>
    </div>

    <div class="flex gap-4 font-semibold text-sm leading-[21px]">
        <div class="flex gap-1 items-center">
            <div class="flex shrink-0 w-5 h-5">
                <img src="/public/img/icons/layer.svg" alt="icon">
            </div>
            <p style="color: ${bg.text}">${task.taskPriority}</p>
        </div>
        ${task.isCompleted === false
          ? `<div class="flex gap-1 items-center">
            <div class="flex shrink-0 w-5 h-5">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.29163 2.16663V18.8333" stroke="currentColor" stroke-width="2" stroke-miterlimit="10"
                        stroke-linecap="round" stroke-linejoin="round" />
                    <path
                        d="M4.29163 3.83337H13.625C15.875 3.83337 16.375 5.08337 14.7916 6.66671L13.7916 7.66671C13.125 8.33337 13.125 9.41671 13.7916 10L14.7916 11C16.375 12.5834 15.7916 13.8334 13.625 13.8334H4.29163"
                        stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <p>In Progress</p>
        </div>`
          : `<div class="flex gap-1 items-center text-taskia-green">
            <div class="flex shrink-0 w-5 h-5">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.29163 2.16663V18.8333" stroke="currentColor" stroke-width="2" stroke-miterlimit="10"
                        stroke-linecap="round" stroke-linejoin="round" />
                    <path
                        d="M4.29163 3.83337H13.625C15.875 3.83337 16.375 5.08337 14.7916 6.66671L13.7916 7.66671C13.125 8.33337 13.125 9.41671 13.7916 10L14.7916 11C16.375 12.5834 15.7916 13.8334 13.625 13.8334H4.29163"
                        stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <p>Completed</p>
        </div>`
        }
    </div>
</div>

<div class="flex flex-row items-center gap-x-3">
    <a href="#" id="deleteTask-${task.id}"
        class="my-auto font-semibold text-taskia-red border border-taskia-red p-[12px_20px] h-12 rounded-full">Delete</a>
    ${task.isCompleted === false
          ? `<a href="#" id="completeTask-${task.id}"
        class="flex gap-[10px] justify-center items-center text-white p-[12px_20px] h-12 font-semibold bg-gradient-to-b from-[#977FFF] to-[#6F4FFF] rounded-full w-full border border-taskia-background-grey">Complete</a>`
          : `<a href="#" id="completeTask-${task.id}" class="hidden">Complete</a>`
        }
</div>
`;

      taskWrapper.appendChild(itemTask);

      const completeBtn = itemTask.querySelector(`#completeTask-${task.id}`);
      if (completeBtn) {
        completeBtn.addEventListener("click", function (event) {
          event.preventDefault();

          // SweetAlert confirmation for task completion
          Swal.fire({
            title: "Are you sure?",
            text: "Do you want to mark this task as completed?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, complete it!",
            cancelButtonText: "No, keep it as is",
            background: "#e4dafaff", // Set a light background for the modal
          }).then((result) => {
            if (result.isConfirmed) {
              myTasks.completeTask(task.id);
              computeAndRender();
            }
          });
        });
      }

      itemTask
        .querySelector(`#deleteTask-${task.id}`)
        .addEventListener("click", function (event) {
          event.preventDefault();
          // SweetAlert confirmation for task deletion
          Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this task?",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
            background: "#fadadaff",
          }).then((result) => {
            if (result.isConfirmed) {
              myTasks.deleteTask(task.id);
              computeAndRender();
            }
          });
        });

    });


  }

  // Wire search
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      currentSearch = searchInput.value.trim();
      computeAndRender();
    });
  }

  // Wire sort
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      currentSort = sortSelect.value;
      computeAndRender();
    });
  }

  // NEW: Wire toggle
  if (toggleCompleted) {
    toggleCompleted.addEventListener("change", function () {
      showCompleted = toggleCompleted.checked;
      localStorage.setItem("showCompleted", String(showCompleted));
      computeAndRender();
    });
  }

  // Initial render
  computeAndRender();
});
