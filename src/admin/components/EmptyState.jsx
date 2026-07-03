import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

const EmptyState = ({ title, description, actionLabel, actionTo, onAction, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-xl border border-slate-200/80 shadow-sm">
    {Icon && (
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-slate-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-sm text-slate-500 max-w-sm">{description}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo} className="mt-6">
        <Button>{actionLabel}</Button>
      </Link>
    )}
    {actionLabel && onAction && !actionTo && (
      <Button onClick={onAction} className="mt-6">{actionLabel}</Button>
    )}
  </div>
);

export default EmptyState;
