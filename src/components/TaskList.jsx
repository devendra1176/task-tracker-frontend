function formatStatus(status) {
    if (status === "IN_PROGRESS") return "In Progress";
    if (status === "TODO") return "Todo";
    if (status === "DONE") return "Done";
    return status;
}

function formatPriority(priority) {
    if (priority === "LOW") return "Low";
    if (priority === "MEDIUM") return "Medium";
    if (priority === "HIGH") return "High";
    return priority;
}

function formatDueDate(dueDate) {
    if (!dueDate) return "-";
    return new Date(dueDate).toLocaleDateString();
}

function getStatusClass(status) {
    if (status === "TODO") return "task-chip task-chip-todo";
    if (status === "IN_PROGRESS") return "task-chip task-chip-progress";
    if (status === "DONE") return "task-chip task-chip-done";
    return "task-chip";
}

function getPriorityClass(priority) {
    if (priority === "LOW") return "task-chip task-chip-low";
    if (priority === "MEDIUM") return "task-chip task-chip-medium";
    if (priority === "HIGH") return "task-chip task-chip-high";
    return "task-chip";
}

function TaskList({
                      tasks,
                      isFetching,
                      actionTaskId,
                      expandedTaskId,
                      onToggleExpand,
                      selectedStatuses,
                      onStatusChange,
                      onUpdateStatus,
                      onDeleteTask,
                      page,
                      totalPages,
                      isLastPage,
                      onPrevPage,
                      onNextPage,
                  }) {
    return (
        <section className="dashboard-task-table-card">
            <div className="dashboard-task-table-header">
                <div className="dashboard-task-table-title">Tasks</div>
            </div>

            <div className="dashboard-task-table-head">
                <div>Title</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Due</div>
                <div className="task-row-action-head">View</div>
            </div>

            {isFetching ? (
                <div className="dashboard-empty-state">Loading tasks...</div>
            ) : tasks.length === 0 ? (
                <div className="dashboard-empty-state">No tasks yet.</div>
            ) : (
                <div className="dashboard-task-table-body">
                    {tasks.map((task) => {
                        const isExpanded = expandedTaskId === task.id;
                        const selectedStatus = selectedStatuses[task.id] || task.status;
                        const isBusy = actionTaskId === task.id;

                        return (
                            <div key={task.id} className="dashboard-task-row-wrapper">
                                <div className="dashboard-task-row">
                                    <div className="task-row-title-cell">{task.title}</div>

                                    <div>
                    <span className={getStatusClass(task.status)}>
                      {formatStatus(task.status)}
                    </span>
                                    </div>

                                    <div>
                    <span className={getPriorityClass(task.priority)}>
                      {formatPriority(task.priority)}
                    </span>
                                    </div>

                                    <div className="task-row-due-cell">{formatDueDate(task.dueDate)}</div>

                                    <div className="task-row-action-cell">
                                        <button
                                            type="button"
                                            className="task-row-toggle"
                                            onClick={() => onToggleExpand(task.id)}
                                        >
                                            {isExpanded ? "˅" : ">"}
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="dashboard-task-row-expand">
                                        <div className="task-expand-description">
                                            {task.description || "No description"}
                                        </div>

                                        <div className="task-expand-actions">
                                            <div className="task-expand-control">
                                                <label className="task-expand-label">Update Status</label>
                                                <select
                                                    className="select"
                                                    value={selectedStatus}
                                                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                                                    disabled={isBusy}
                                                >
                                                    <option value="TODO">Todo</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="DONE">Done</option>
                                                </select>
                                            </div>

                                            <div className="task-expand-buttons">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => onUpdateStatus(task.id, task.status)}
                                                    disabled={isBusy || selectedStatus === task.status}
                                                >
                                                    {isBusy ? "Saving..." : "Update"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => onDeleteTask(task.id)}
                                                    disabled={isBusy}
                                                >
                                                    {isBusy ? "Please wait..." : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {totalPages > 1 && (
                <div className="dashboard-pagination">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={page === 0}
                        onClick={onPrevPage}
                    >
                        Previous
                    </button>

                    <span className="dashboard-pagination-info">
            Page {page + 1} of {totalPages}
          </span>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={isLastPage || totalPages === 0}
                        onClick={onNextPage}
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}

export default TaskList;