function TaskToolbar({
                         searchKeyword,
                         statusFilter,
                         priorityFilter,
                         sortOption,
                         onSearchChange,
                         onStatusChange,
                         onPriorityChange,
                         onSortChange,
                         onApply,
                         onReset,
                     }) {
    return (
        <section className="dashboard-toolbar-card">
            <div className="dashboard-toolbar-grid">
                <input
                    className="input"
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search..."
                />

                <select
                    className="select"
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                >
                    <option value="">Status</option>
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>

                <select
                    className="select"
                    value={priorityFilter}
                    onChange={(e) => onPriorityChange(e.target.value)}
                >
                    <option value="">Priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>

                <select
                    className="select"
                    value={sortOption}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="id-desc">Sort</option>
                    <option value="id-desc">Latest</option>
                    <option value="id-asc">Oldest</option>
                    <option value="title-asc">Title A-Z</option>
                    <option value="title-desc">Title Z-A</option>
                    <option value="dueDate-asc">Due Date ↑</option>
                    <option value="dueDate-desc">Due Date ↓</option>
                </select>

                <button type="button" className="btn btn-primary" onClick={onApply}>
                    Apply
                </button>

                <button type="button" className="btn btn-secondary" onClick={onReset}>
                    Reset
                </button>
            </div>
        </section>
    );
}

export default TaskToolbar;