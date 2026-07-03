function renderMarkdown(text = "") {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/^### (.+)$/gm, "<h3 class=\"text-lg font-semibold mt-4 mb-2\">$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2 class=\"text-xl font-semibold mt-5 mb-2\">$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1 class=\"text-2xl font-bold mt-6 mb-3\">$1</h1>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code class=\"px-1 py-0.5 bg-slate-100 rounded text-sm\">$1</code>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href=\"$2\" class=\"text-blue-600 hover:underline\" target=\"_blank\" rel=\"noreferrer\">$1</a>");
  html = html.replace(/^- (.+)$/gm, "<li class=\"ml-4 list-disc\">$1</li>");
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (m) => `<ul class="my-2 space-y-1">${m}</ul>`);
  html = html.replace(/\n\n/g, "</p><p class=\"my-3 text-slate-700 leading-relaxed\">");
  html = `<p class="my-3 text-slate-700 leading-relaxed">${html}</p>`;

  return html;
}

const MarkdownPreview = ({ content, className = "" }) => (
  <div
    className={`prose prose-slate max-w-none text-sm ${className}`}
    dangerouslySetInnerHTML={{ __html: renderMarkdown(content || "") }}
  />
);

export default MarkdownPreview;
