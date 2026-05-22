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
    <section className="modern-toolbar-container">
      <div className="modern-toolbar">
        {/* 1. Search Bar (Takes remaining space) */}
        <div className="toolbar-search-wrapper">
          <svg className="toolbar-icon search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="toolbar-input"
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
          />
        </div>

        {/* 2. Filters & Sort (Fixed width, no shrink) */}
        <div className="toolbar-actions-group">
          <div className="toolbar-dropdown-wrapper">
            <select className="toolbar-select toolbar-select-status" value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}>
              <option value="">All Status</option>
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            <svg className="toolbar-icon dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>

          <div className="toolbar-dropdown-wrapper">
            <select className="toolbar-select toolbar-select-priority" value={priorityFilter} onChange={(e) => onPriorityChange(e.target.value)}>
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <svg className="toolbar-icon dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>

          <div className="toolbar-dropdown-wrapper">
            <select className="toolbar-select toolbar-select-sort" value={sortOption} onChange={(e) => onSortChange(e.target.value)}>
              <option value="dueDateTime-asc">Sort: Due Date</option>
              <option value="id-desc">Latest</option>
              <option value="id-asc">Oldest</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="dueDateTime-desc">Due Date Desc</option>
            </select>
            <svg className="toolbar-icon dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </div>
        </div>

        {/* 3. Apply & Refresh (Fixed width) */}
        <div className="toolbar-btn-group">
          <button type="button" className="toolbar-btn toolbar-btn-apply" onClick={onApply}>
            Apply
          </button>
          <button type="button" className="toolbar-btn toolbar-btn-reset" onClick={onReset} title="Refresh Filters">
            <svg className="toolbar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
export default TaskToolbar;