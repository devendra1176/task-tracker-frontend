import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllTasks,
  getFilteredTasks,
  searchTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../services/taskService";
import TaskCreateCard from "../components/TaskCreateCard";
import TaskToolbar from "../components/TaskToolbar";
import TaskList from "../components/TaskList";
import AiAssistantPanel from "../components/AiAssistantPanel";

// =========================
// CONSTANTS & DEFAULTS
// =========================
const DEFAULT_FORM = {
  title: "",
  description: "",
  status: "TODO",
  priority: "LOW",
  dueDate: "",
  dueTime: "",
};

// Backend ke saath sync: Default sorting by Due Date (Ascending)
const DEFAULT_SORT = "dueDateTime-asc";
// Backend ke saath sync: Default page size 10
const PAGE_SIZE = 10;

// =========================
// HELPER FUNCTIONS
// =========================
function parseSortOption(sortOption) {
  const [sortBy = "id", direction = "desc"] = sortOption.split("-");
  return { sortBy, direction };
}

function getFormattedDate(daysToAdd = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
}

// =========================
// DASHBOARD COMPONENT
// =========================
function DashboardPage({ onLogout }) {
  // --- State: Tasks & Pagination ---
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    last: true,
  });
  const [isFetching, setIsFetching] = useState(false);

  // --- State: Form & UI ---
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionTaskId, setActionTaskId] = useState(null); // For inline status updates
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [statusDrafts, setStatusDrafts] = useState({});

  // --- State: Filters & Search ---
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortOption, setSortOption] = useState(DEFAULT_SORT);

  // Applied Filters (Actual values used for API call)
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedPriority, setAppliedPriority] = useState("");
  const [appliedSortOption, setAppliedSortOption] = useState(DEFAULT_SORT);

  // --- State: Feedback ---
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- Memoized Values ---
  const todayDate = useMemo(() => getFormattedDate(0), []);
  const tomorrowDate = useMemo(() => getFormattedDate(1), []);

  const stats = useMemo(() => ({
    total: pageInfo.totalElements || 0,
    todo: tasks.filter((t) => t.status === "TODO").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    done: tasks.filter((t) => t.status === "DONE").length,
  }), [tasks, pageInfo.totalElements]);

  // =========================
  // DATA FETCHING
  // =========================
  const fetchTasks = useCallback(async () => {
    try {
      setIsFetching(true);
      setError("");

      const { sortBy, direction } = parseSortOption(appliedSortOption);
      let result;

      if (appliedSearch.trim()) {
        result = await searchTasks({
          keyword: appliedSearch.trim(),
          page,
          size: PAGE_SIZE,
          sortBy,
          direction,
        });
      } else if (appliedStatus || appliedPriority) {
        result = await getFilteredTasks({
          page,
          size: PAGE_SIZE,
          sortBy,
          direction,
          status: appliedStatus || undefined,
          priority: appliedPriority || undefined,
        });
      } else {
        result = await getAllTasks({
          page,
          size: PAGE_SIZE,
          sortBy,
          direction,
        });
      }

      const paged = result?.data || {};
      setTasks(paged.content || []);
      setPageInfo({
        totalElements: paged.totalElements || 0,
        totalPages: paged.totalPages || 0,
        last: paged.last ?? true,
      });
    } catch (err) {
      setTasks([]);
      setPageInfo({ totalElements: 0, totalPages: 0, last: true });
      setError(err?.message || "Failed to load tasks.");
    } finally {
      setIsFetching(false);
    }
  }, [page, appliedSearch, appliedStatus, appliedPriority, appliedSortOption]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Auto-clear messages
  useEffect(() => {
    if (!error && !success) return;
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3500);
    return () => clearTimeout(timer);
  }, [error, success]);

  // =========================
  // HANDLERS
  // =========================
  
  // --- Form Handlers ---
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleQuickDate(dateValue) {
    setFormData((prev) => ({ ...prev, dueDate: dateValue }));
  }

  function resetForm() {
    setFormData(DEFAULT_FORM);
  }

  function handleOpenCreateTask() {
    setEditingTaskId(null);
    setFormData(DEFAULT_FORM);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCloseTaskForm() {
    setShowCreateForm(false);
    setEditingTaskId(null);
    setFormData(DEFAULT_FORM);
  }

  function handleEditTask(task) {
    setEditingTaskId(task.id);
    setShowCreateForm(true);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "TODO",
      priority: task.priority || "LOW",
      dueDate: task.dueDate || "",
      dueTime: task.dueTime ? task.dueTime.slice(0, 5) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleTaskSubmit(e) {
    e.preventDefault();
    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      setError("Title and description are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const payload = {
        title: trimmedTitle,
        description: trimmedDescription,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        dueTime: formData.dueTime || null,
      };

      if (editingTaskId) {
        await updateTask(editingTaskId, payload);
        setSuccess("Task updated successfully.");
      } else {
        await createTask(payload);
        setSuccess("Task created successfully.");
      }

      setFormData(DEFAULT_FORM);
      setEditingTaskId(null);
      setShowCreateForm(false);

      // If new task created on page > 0, go to page 0 to see it
      if (!editingTaskId && page !== 0) {
        setPage(0);
      } else {
        await fetchTasks();
      }
    } catch (err) {
      setError(err?.message || (editingTaskId ? "Failed to update task." : "Failed to create task."));
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- Toolbar Handlers ---
  function handleApplyToolbar() {
    setPage(0);
    setAppliedSearch(searchKeyword.trim());
    setAppliedStatus(statusFilter);
    setAppliedPriority(priorityFilter);
    setAppliedSortOption(sortOption);
  }

  function handleResetToolbar() {
    setSearchKeyword("");
    setStatusFilter("");
    setPriorityFilter("");
    setSortOption(DEFAULT_SORT);
    setPage(0);
    setAppliedSearch("");
    setAppliedStatus("");
    setAppliedPriority("");
    setAppliedSortOption(DEFAULT_SORT);
  }

  // --- Task Actions ---
  function handleStatusChange(taskId, value) {
    setStatusDrafts((prev) => ({ ...prev, [taskId]: value }));
  }

  async function handleUpdateStatus(taskId, currentStatus) {
    const newStatus = statusDrafts[taskId] || currentStatus;
    if (newStatus === currentStatus) return;

    try {
      setActionTaskId(taskId);
      setError("");
      await updateTaskStatus(taskId, newStatus);
      
      setStatusDrafts((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
      
      setSuccess("Task status updated.");
      await fetchTasks();
    } catch (err) {
      setError(err?.message || "Failed to update task status.");
    } finally {
      setActionTaskId(null);
    }
  }

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) return;

    try {
      setActionTaskId(taskId);
      setError("");
      await deleteTask(taskId);
      setSuccess("Task deleted successfully.");

      if (expandedTaskId === taskId) setExpandedTaskId(null);
      
      // If last task on page deleted, go back
      if (tasks.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      } else {
        await fetchTasks();
      }
    } catch (err) {
      setError(err?.message || "Failed to delete task.");
    } finally {
      setActionTaskId(null);
    }
  }

  function handleToggleExpand(taskId) {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  }

  // =========================
  // RENDER
  // =========================
  return (
  <div className="dashboard-page">
      <div className="dashboard-container dashboard-layout">
        <main className="dashboard-main">
          {/* Header */}
          <header className="dashboard-header">
             {/* ... Title and Logout ... */}
             <div className="dashboard-header-main">
               <h1 className="dashboard-title">Task Dashboard</h1>
               <p className="dashboard-subtitle">Track work, update progress, stay consistent.</p>
             </div>
             <div className="dashboard-header-actions">
               <button type="button" className="dashboard-pill-button" onClick={onLogout}>Logout</button>
             </div>
          </header>

          {/* 2. Messages */}
          {error && <div className="message message-error">{error}</div>}
          {success && <div className="message message-success">{success}</div>}

          {/* 3. Stats Grid */}
          <section className="dashboard-stats-grid">
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">Total</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">Todo</span>
              <strong>{stats.todo}</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">In Progress</span>
              <strong>{stats.inProgress}</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">Done</span>
              <strong>{stats.done}</strong>
            </div>
          </section>

          {/* 4. Task Create Form */}
          <TaskCreateCard
            showCreateForm={showCreateForm}
            editingTaskId={editingTaskId}
            // onToggle now only handles closing to avoid duplication with Toolbar button
            onToggle={handleCloseTaskForm} 
            onClose={handleCloseTaskForm}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleTaskSubmit}
            onReset={resetForm}
            isSubmitting={isSubmitting}
            onQuickDate={handleQuickDate}
            todayDate={todayDate}
            tomorrowDate={tomorrowDate}
          />

          {/* 5. Modern Toolbar (Includes New Task Button) */}
          <TaskToolbar
            searchKeyword={searchKeyword}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            sortOption={sortOption}
            onSearchChange={setSearchKeyword}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onSortChange={setSortOption}
            onApply={handleApplyToolbar}
            onReset={handleResetToolbar}
            onNewTask={handleOpenCreateTask} // 🔥 PASSED HERE
          />

          {/* 6. Task List */}
          <TaskList
            tasks={tasks}
            isFetching={isFetching}
            actionTaskId={actionTaskId}
            expandedTaskId={expandedTaskId}
            onToggleExpand={handleToggleExpand}
            statusDrafts={statusDrafts}
            onStatusChange={handleStatusChange}
            onUpdateStatus={handleUpdateStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            page={page}
            totalPages={pageInfo.totalPages}
            isLastPage={pageInfo.last}
            onPrevPage={() => setPage((prev) => Math.max(prev - 1, 0))}
            onNextPage={() => setPage((prev) => prev + 1)}
          />
        </main>

        {/* 7. AI Assistant Panel */}
        <AiAssistantPanel onUnauthorized={onLogout} />
      </div>
    </div>
  );
}

export default DashboardPage;