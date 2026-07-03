import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ label, value, icon: Icon, change, changeType = "up", sublabel, href, accent = "blue" }) => {
  const accents = {
    blue: "from-blue-500 to-blue-600",
    indigo: "from-indigo-500 to-indigo-600",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    violet: "from-violet-500 to-violet-600",
    rose: "from-rose-500 to-rose-600",
  };

  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group relative bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 truncate">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {value ?? "—"}
          </p>
          {sublabel && (
            <p className="mt-1 text-xs text-slate-400">{sublabel}</p>
          )}
          {change !== undefined && (
            <div className="mt-3 flex items-center gap-1.5">
              {changeType === "up" ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  changeType === "up" ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {change}
              </span>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${accents[accent]} shadow-sm`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </Wrapper>
  );
};

export default StatCard;
