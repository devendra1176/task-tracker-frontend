function TaskCreateCard({
                            showCreateForm,
                            onToggle,
                            formData,
                            onInputChange,
                            onSubmit,
                            onReset,
                            isCreating,
                        }) {
    return (
        <section className="dashboard-section">
            <div className="dashboard-action-bar">
                <div className="dashboard-action-bar-text">
                    <span className="dashboard-action-bar-label">Quick Action</span>
                    <p>Create a new task without leaving your current workflow.</p>
                </div>

                <button
                    type="button"
                    className="dashboard-primary-action"
                    onClick={onToggle}
                >
                    {showCreateForm ? "Close Task Form" : "+ New Task"}
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
                                    disabled={isCreating}
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
                                    disabled={isCreating}
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
                                    disabled={isCreating}
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
                                    disabled={isCreating}
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
                                    disabled={isCreating}
                                />
                            </div>
                        </div>

                        <div className="task-form-actions">
                            <button type="submit" className="btn btn-primary" disabled={isCreating}>
                                {isCreating ? "Creating..." : "Create Task"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onReset}
                                disabled={isCreating}
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}

export default TaskCreateCard;