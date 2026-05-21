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
                            onQuickDate,
                            todayDate,
                            tomorrowDate,
                        }) {
    const isEditMode = Boolean(editingTaskId);

    return (
        <section className="dashboard-section">
            {showCreateForm && (
                <div className="dashboard-form-card unified-card">

                    {/* --- Card Header --- */}
                    <div className="card-header">
                        <div className="header-text">
                            <span className="header-label">
                                {isEditMode ? "Edit Task" : "QUICK ACTION"}
                            </span>
                            <p>
                                {isEditMode
                                    ? "Update the selected task without leaving your current workflow."
                                    : "Create a new task without leaving your current workflow."}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="close-btn"
                            onClick={onToggle}
                            disabled={isSubmitting}
                        >
                            {isEditMode ? "Cancel Editing" : "Close Task Form"}
                        </button>
                    </div>

                    {/* --- Form Body --- */}
                    <form className="task-create-form" onSubmit={onSubmit}>

                        {/* Title Field */}
                        <div className="form-group">
                            <label className="field-label" htmlFor="title">Title</label>
                            <input
                                id="title"
                                className="form-input"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={onInputChange}
                                placeholder="Enter task title"
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Description Field */}
                        <div className="form-group">
                            <label className="field-label" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                className="form-textarea"
                                name="description"
                                value={formData.description}
                                onChange={onInputChange}
                                placeholder="Enter task details"
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Row: Status, Priority, Due Date + Time */}
                        <div className="form-row-three-col">

                            {/* Status */}
                            <div className="form-col">
                                <label className="field-label" htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    className="form-select"
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

                            {/* Priority */}
                            <div className="form-col">
                                <label className="field-label" htmlFor="priority">Priority</label>
                                <select
                                    id="priority"
                                    className="form-select"
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

                            {/* Date & Time + Quick Suggestions */}
                            <div className="form-col date-col">
                                <label className="field-label">Due Date & Time</label>

                                <div className="date-time-row">
                                    <input
                                        id="dueDate"
                                        className="form-input date-input"
                                        type="date"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={onInputChange}
                                        disabled={isSubmitting}
                                    />
                                    <input
                                        id="dueTime"
                                        className="form-input time-input"
                                        type="time"
                                        name="dueTime"
                                        value={formData.dueTime}
                                        onChange={onInputChange}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Clickable Pills (Quick Set) */}
                                <div className="quick-set-pills">
                                    <button
                                        type="button"
                                        className="quick-pill-btn today-pill"
                                        onClick={() => onQuickDate(todayDate)}
                                        disabled={isSubmitting}
                                    >
                                        Today
                                    </button>
                                    <button
                                        type="button"
                                        className="quick-pill-btn tomorrow-pill"
                                        onClick={() => onQuickDate(tomorrowDate)}
                                        disabled={isSubmitting}
                                    >
                                        Tomorrow
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-create"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? isEditMode ? "Updating..." : "Creating..."
                                    : isEditMode ? "Update Task" : "Create Task"}
                            </button>

                            <button
                                type="button"
                                className="btn-reset"
                                onClick={isEditMode ? onClose : onReset}
                                disabled={isSubmitting}
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