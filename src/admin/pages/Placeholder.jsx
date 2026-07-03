const PlaceholderPage = ({ title, description }) => (
  <div className="max-w-lg p-8 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-center">
    <h1 className="text-xl font-display font-bold mb-2">{title}</h1>
    <p className="text-sm text-neutral-500">
      {description || "This module is scaffolded and ready for backend integration."}
    </p>
  </div>
);

export default PlaceholderPage;
