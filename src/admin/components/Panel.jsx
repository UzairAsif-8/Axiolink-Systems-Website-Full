const Panel = ({ title, description, action, children, className = "" }) => (
  <div
    className={`bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden ${className}`}
  >
    {(title || action) && (
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          {title && (
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export default Panel;
