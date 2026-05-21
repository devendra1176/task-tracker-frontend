import React from 'react';

// Helper functions for formatting status/priority text & classes
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
    statusDrafts,
    onStatusChange,
    onUpdateStatus,
    onEditTask,
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
                        const selectedStatus = statusDrafts[task.id] || task.status;
                        const isBusy = actionTaskId === task.id;
                        const hasStatusChanged = selectedStatus !== task.status;

                        return (
                            <div 
                                key={task.id} 
                                className={`dashboard-task-row-wrapper ${task.overdue ? 'overdue-row' : ''}`}
                            >
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

                                    <div className="task-row-due-cell">
                                        {task.dueDateTimeDisplay || "-"}
                                        {task.overdue && (
                                            <span className="overdue-badge">️ Overdue</span>
                                        )}
                                    </div>

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
                                        <div className="task-detail-block">
                                            <p className="task-detail-text">
                                                {task.description || "No details added for this task yet."}
                                            </p>
                                        </div>

                                        <div className="task-expanded-actions">
                                            <div className="task-status-actions">
                                                <select
                                                    className="compact-select"
                                                    value={selectedStatus}
                                                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                                                    disabled={isBusy}
                                                >
                                                    <option value="TODO">Todo</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="DONE">Done</option>
                                                </select>

                                                <button
                                                    type="button"
                                                    className={hasStatusChanged ? "small-primary-btn" : "small-idle-btn"}
                                                    onClick={() => onUpdateStatus(task.id, task.status)}
                                                    disabled={isBusy || !hasStatusChanged}
                                                >
                                                    {isBusy ? "Saving..." : "Update Status"}
                                                </button>
                                            </div>

                                            <div className="task-secondary-actions">
                                                <button
                                                    type="button"
                                                    className="small-accent-btn"
                                                    onClick={() => onEditTask(task)}
                                                    disabled={isBusy}
                                                >
                                                    Edit Task
                                                </button>

                                                <button
                                                    type="button"
                                                    className="small-danger-btn"
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