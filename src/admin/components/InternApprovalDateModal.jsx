import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

const inputClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400";

const InternApprovalDateModal = ({
  open,
  applicantName,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStartDate("");
      setEndDate("");
      setError("");
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError("Please enter both start and end dates.");
      return;
    }
    if (endDate < startDate) {
      setError("End date must be on or after the start date.");
      return;
    }
    setError("");
    onConfirm({ startDate, endDate });
  };

  return (
    <Modal
      isOpen={open}
      onClose={onCancel}
      title="Approve intern"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-sm text-slate-600">
          Set the internship period for{" "}
          <span className="font-semibold text-slate-900">{applicantName}</span>{" "}
          before approving.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="intern-start-date" className="block text-sm font-medium text-slate-700 mb-2">
              Starting date *
            </label>
            <input
              id="intern-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="intern-end-date" className="block text-sm font-medium text-slate-700 mb-2">
              Ending date *
            </label>
            <input
              id="intern-end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex flex-wrap gap-3 pt-1">
          <Button type="submit" loading={loading}>
            Approve intern
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InternApprovalDateModal;
