import { ExternalLink, FileImage, FileText } from "lucide-react";

function isPdfUrl(url = "") {
  return /\.pdf($|\?)/i.test(url) || url.toLowerCase().includes("application/pdf");
}

function isImageUrl(url = "") {
  return /\.(jpe?g|png|webp|gif)($|\?)/i.test(url);
}

const PaymentSlipPreview = ({ url, compact = false }) => {
  if (!url) {
    return (
      <p className="text-sm text-slate-500">
        No payment slip uploaded for this enrollment.
      </p>
    );
  }

  const pdf = isPdfUrl(url);
  const image = !pdf && isImageUrl(url);

  if (compact) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
      >
        <FileImage className="w-3.5 h-3.5" />
        View slip
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
        >
          {pdf ? <FileText className="w-4 h-4" /> : <FileImage className="w-4 h-4" />}
          Open full size
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {image && (
        <a href={url} target="_blank" rel="noreferrer" className="block">
          <img
            src={url}
            alt="Payment slip"
            className="max-h-96 w-full rounded-xl border border-slate-200 object-contain bg-slate-50"
          />
        </a>
      )}

      {pdf && (
        <iframe
          title="Payment slip PDF"
          src={url}
          className="w-full h-[min(70vh,520px)] rounded-xl border border-slate-200 bg-white"
        />
      )}

      {!image && !pdf && (
        <p className="text-sm text-slate-600">
          Preview not available for this file type. Use &ldquo;Open full size&rdquo; to view the
          uploaded slip.
        </p>
      )}
    </div>
  );
};

export default PaymentSlipPreview;
