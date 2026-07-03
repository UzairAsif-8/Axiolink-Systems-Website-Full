import { Linkedin, Link2, Twitter } from "lucide-react";
import Button from "../ui/Button";

const SocialShare = ({ title, url }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Share on LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Share on X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-neutral-600 mr-1">Share:</span>
      {shareLinks.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors"
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className="!px-2"
      >
        <Link2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SocialShare;
