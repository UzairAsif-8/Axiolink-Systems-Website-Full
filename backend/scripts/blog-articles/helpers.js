/** Shared HTML blocks for blog articles */

export const ctaBlock = `
<div class="blog-cta">
<p>Ready to build with confidence?</p>
<p>Axiolink Systems (Pvt) Ltd. helps enterprises and startups design, build, and scale software—from AI agents and cloud-native SaaS to secure web platforms. Talk to our team about your next project.</p>
<p><strong><a href="https://axiolinksystems.com/contact">Contact Axiolink Systems →</a></strong> · <a href="https://axiolinksystems.com/services">Explore our services</a></p>
</div>`;

export const tocBlock = (items) => `
<nav aria-label="Table of contents">
<p>Table of Contents</p>
<ol>
${items.map((item) => `<li><a href="#${item.id}">${item.label}</a></li>`).join("\n")}
</ol>
</nav>`;

export const faqBlock = (faqs) => `
<h2 id="faqs">Frequently Asked Questions</h2>
${faqs
  .map(
    (f) => `
<h3>${f.q}</h3>
<p>${f.a}</p>`
  )
  .join("\n")}`;

export const UNSPLASH = {
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  saas: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
  agents: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
  security: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
  cloud: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  transform: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  webdev: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  vertical: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
  devops: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80",
  geo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
};
