import { useEffect, useMemo, useState } from "react";
import {
  getAllTasks,
  getFilteredTasks,
  searchTasks,
  createTask,
  deleteTask,
  updateTaskStatus,
} from "../services/taskService";
import TaskCreateCard from "../components/TaskCreateCard";
import TaskToolbar from "../components/TaskToolbar";
import TaskList from "../components/TaskList";

const DEFAULT_FORM = {
  title: "",
  description: "",
  status: "TODO",
  priority: "LOW",
  dueDate: "",
};

const DEFAULT_SORT = "id-desc";

function parseSortOption(sortOption) {
  const [sortBy = "id", direction = "desc"] = sortOption.split("-");
  return { sortBy, direction };
}

function DashboardPage({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortOption, setSortOption] = useState(DEFAULT_SORT);

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedPriority, setAppliedPriority] = useState("");
  const [appliedSortOption, setAppliedSortOption] = useState(DEFAULT_SORT);

  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const [page, setPage] = useState(0);
  const pageSize = 5;

  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    last: true,
  });

  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [actionTaskId, setActionTaskId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [page, appliedSearch, appliedStatus, appliedPriority, appliedSortOption]);

  useEffect(() => {
    if (!error && !success) return;

    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [error, success]);

  async function fetchTasks() {
    try {
      setIsFetching(true);
      setError("");

      const { sortBy, direction } = parseSortOption(appliedSortOption);

      let result;

      if (appliedSearch.trim()) {
        result = await searchTasks({
          keyword: appliedSearch.trim(),
          page,
          size: pageSize,
          sortBy,
          direction,
        });
      } else if (appliedStatus || appliedPriority) {
        result = await getFilteredTasks({
          page,
          size: pageSize,
          sortBy,
          direction,
          status: appliedStatus || undefined,
          priority: appliedPriority || undefined,
        });
      } else {
        result = await getAllTasks({
          page,
          size: pageSize,
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
      setPageInfo({
        totalElements: 0,
        totalPages: 0,
        last: true,
      });
      setError(err?.message || "Failed to load tasks.");
    } finally {
      setIsFetching(false);
    }
  }

  const stats = useMemo(() => {
    return {
      total: pageInfo.totalElements || 0,
      todo: tasks.filter((task) => task.status === "TODO").length,
      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      done: tasks.filter((task) => task.status === "DONE").length,
    };
  }, [tasks, pageInfo.totalElements]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setFormData(DEFAULT_FORM);
  }

  async function handleCreateTask(e) {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      setError("Title and description are required.");
      return;
    }

    try {
      setIsCreating(true);
      setError("");

      await createTask({
        title: trimmedTitle,
        description: trimmedDescription,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
      });

      setSuccess("Task created successfully.");
      resetForm();
      setShowCreateForm(false);

      if (page === 0) {
        await fetchTasks();
      } else {
        setPage(0);
      }
    } catch (err) {
      setError(err?.message || "Failed to create task.");
    } finally {
      setIsCreating(false);
    }
  }

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

  function handleStatusChange(taskId, value) {
    setSelectedStatuses((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  }

  async function handleUpdateStatus(taskId, currentStatus) {
    const newStatus = selectedStatuses[taskId] || currentStatus;

    if (newStatus === currentStatus) return;

    try {
      setActionTaskId(taskId);
      setError("");

      await updateTaskStatus(taskId, newStatus);

      setSelectedStatuses((prev) => {
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

  return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div className="dashboard-header-main">
              <h1 className="dashboard-title">Task Dashboard</h1>
              <p className="dashboard-subtitle">
                Track work, update progress, stay consistent.
              </p>
            </div>

            <div className="dashboard-header-actions">
              <button type="button" className="dashboard-pill-button" onClick={onLogout}>
                Logout
              </button>
            </div>
          </header>

          {error && <div className="message message-error">{error}</div>}
          {success && <div className="message message-success">{success}</div>}

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

          <TaskCreateCard
              showCreateForm={showCreateForm}
              onToggle={() => setShowCreateForm((prev) => !prev)}
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleCreateTask}
              onReset={resetForm}
              isCreating={isCreating}
          />

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
          />

          <TaskList
              tasks={tasks}
              isFetching={isFetching}
              actionTaskId={actionTaskId}
              expandedTaskId={expandedTaskId}
              onToggleExpand={handleToggleExpand}
              selectedStatuses={selectedStatuses}
              onStatusChange={handleStatusChange}
              onUpdateStatus={handleUpdateStatus}
              onDeleteTask={handleDeleteTask}
              page={page}
              totalPages={pageInfo.totalPages}
              isLastPage={pageInfo.last}
              onPrevPage={() => setPage((prev) => prev - 1)}
              onNextPage={() => setPage((prev) => prev + 1)}
          />
        </div>
      </div>
  );
}

export default DashboardPage;
