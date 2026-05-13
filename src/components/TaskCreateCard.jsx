function TaskCreateCard({
                            showCreateForm,
                            editingTaskId,
                            onToggle,
                            onClose,
                            formData,
                            onInputChange,
                            onSubmit,
                            onReset,
                            isSubmitting,
                        }) {
    const isEditMode = Boolean(editingTaskId);

    return (
        <section className="dashboard-section">
            <div className="dashboard-action-bar">
                <div className="dashboard-action-bar-text">
          <span className="dashboard-action-bar-label">
            {isEditMode ? "Edit Task" : "Quick Action"}
          </span>

                    <p>
                        {isEditMode
                            ? "Update the selected task without leaving your current workflow."
                            : "Create a new task without leaving your current workflow."}
                    </p>
                </div>

                <button
                    type="button"
                    className="dashboard-primary-action"
                    onClick={onToggle}
                >
                    {showCreateForm
                        ? isEditMode
                            ? "Cancel Editing"
                            : "Close Task Form"
                        : "+ New Task"}
                </button>
            </div>

            {showCreateForm && (
                <div className="dashboard-form-card">
                    <form className="task-create-form" onSubmit={onSubmit}>
                        <div className="task-create-grid">
                            <div className="task-form-field task-form-field-wide">
                                <label className="label" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    className="input"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={onInputChange}
                                    placeholder="Enter task title"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>

                            <div className="task-form-field task-form-field-wide">
                                <label className="label" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    className="textarea"
                                    name="description"
                                    value={formData.description}
                                    onChange={onInputChange}
                                    placeholder="Enter task details"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>

                            <div className="task-form-field">
                                <label className="label" htmlFor="status">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    className="select"
                                    name="status"
                                    value={formData.status}
                                    onChange={onInputChange}
                                    disabled={isSubmitting}
                                >
                                    <option value="TODO">Todo</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Done</option>
                                </select>
                            </div>

                            <div className="task-form-field">
                                <label className="label" htmlFor="priority">
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    className="select"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={onInputChange}
                                    disabled={isSubmitting}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>

                            <div className="task-form-field">
                                <label className="label" htmlFor="dueDate">
                                    Due Date
                                </label>
                                <input
                                    id="dueDate"
                                    className="input"
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={onInputChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="task-form-actions">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? isEditMode
                                        ? "Updating..."
                                        : "Creating..."
                                    : isEditMode
                                        ? "Update Task"
                                        : "Create Task"}
                            </button>

                            {isEditMode ? (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onReset}
                                    disabled={isSubmitting}
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}

export default TaskCreateCard;