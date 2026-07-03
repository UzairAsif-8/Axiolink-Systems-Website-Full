import article01 from "./article-01-agentic-ai.js";
import article02 from "./article-02-saas-pricing.js";
import article03 from "./article-03-ai-agents.js";
import article04 from "./article-04-cybersecurity.js";
import article05 from "./article-05-cloud-native.js";
import article06 from "./article-06-digital-transformation.js";
import article07 from "./article-07-mern-nextjs.js";
import article08 from "./article-08-vertical-ai.js";
import article09 from "./article-09-devops.js";
import article10 from "./article-10-geo.js";

export const blogArticles = [
  article01,
  article02,
  article03,
  article04,
  article05,
  article06,
  article07,
  article08,
  article09,
  article10,
].sort((a, b) => b.publishedAtOffsetDays - a.publishedAtOffsetDays);
