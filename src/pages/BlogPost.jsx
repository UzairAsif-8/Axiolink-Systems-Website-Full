import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, Clock, ArrowLeft, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import ReadingProgress from "../components/blog/ReadingProgress";
import BlogBreadcrumbs from "../components/blog/BlogBreadcrumbs";
import SocialShare from "../components/blog/SocialShare";
import { stockImages } from "../data/stockImages";
import { fetchPublicBlogBySlug, fetchPublicBlogs } from "../api/public";
import { usePageMeta } from "../hooks/usePageMeta";
import { useJsonLd } from "../hooks/useJsonLd";
import {
  estimateReadTime,
  blogCanonical,
  buildArticleSchema,
  extractFaqsFromHtml,
  buildFaqSchema,
  scoreRelatedPost,
  processInternalLinks,
} from "../utils/blogSeo";

const BlogPost = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);

    Promise.all([fetchPublicBlogBySlug(slug), fetchPublicBlogs()])
      .then(([blog, blogs]) => {
        setPost(blog);
        setAllPosts(Array.isArray(blogs) ? blogs : []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const readTime = useMemo(
    () => (post ? estimateReadTime(post.content) : ""),
    [post]
  );

  const canonical = post ? blogCanonical(post.slug) : undefined;

  usePageMeta({
    title: post
      ? `${post.seoTitle || post.title} | Axiolink Systems Blog`
      : "Blog | Axiolink Systems",
    description: post?.seoDescription || post?.excerpt,
    ogTitle: post?.seoTitle || post?.title,
    ogDescription: post?.seoDescription || post?.excerpt,
    ogImage: post?.featuredImage,
    ogType: "article",
    canonical,
  });

  const faqs = useMemo(
    () => (post ? extractFaqsFromHtml(post.content) : []),
    [post]
  );

  const schemas = useMemo(() => {
    if (!post) return [];
    const article = buildArticleSchema(post);
    const faq = buildFaqSchema(faqs);
    return faq ? [article, faq] : [article];
  }, [post, faqs]);

  useJsonLd(schemas);

  const { prevPost, nextPost, related } = useMemo(() => {
    if (!post || !allPosts.length) {
      return { prevPost: null, nextPost: null, related: [] };
    }
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
    );
    const idx = sorted.findIndex((p) => p.slug === post.slug);
    const prevPost = idx > 0 ? sorted[idx - 1] : null;
    const nextPost = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

    const related = sorted
      .filter((p) => p.slug !== post.slug)
      .map((p) => ({ ...p, score: scoreRelatedPost(p, post) }))
      .sort((a, b) => b.score - a.score || new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 3);

    return { prevPost, nextPost, related };
  }, [post, allPosts]);

  const articleHtml = useMemo(
    () => (post ? processInternalLinks(post.content) : ""),
    [post]
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-4">
        <p className="text-neutral-600 mb-4">Article not found.</p>
        <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
      </div>
    );
  }

  const category = (post.category || "technology").toLowerCase();
  const tags = post.tags || [];
  const authorName = post.author || "Axiolink Team";
  const image = post.featuredImage || stockImages.cloudComputing;
  const date = post.publishedAt || post.createdAt;
  const isCeo = authorName.includes("Uzair");

  return (
    <div className="min-h-screen pt-20">
      <ReadingProgress />

      <section className="section-padding bg-gradient-to-br from-primary-50 to-navy-50 pb-10 md:pb-14">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <BlogBreadcrumbs
              items={[
                { label: "Blog", href: "/blog" },
                { label: category, href: `/blog/category/${category}` },
                { label: post.title },
              ]}
            />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Link to={`/blog/category/${category}`}>
                <Badge variant="primary" size="lg" className="mb-5 capitalize">
                  {category}
                </Badge>
              </Link>

              <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-display font-bold text-neutral-900 mb-5 leading-[1.15] tracking-tight text-balance">
                {post.title}
              </h1>

              <p className="text-lg md:text-xl text-neutral-600 mb-7 leading-relaxed text-balance">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500 mb-5">
                <span className="flex items-center"><User className="w-4 h-4 mr-2 shrink-0" />{authorName}</span>
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 shrink-0" />{formatDate(date)}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-2 shrink-0" />{readTime}</span>
              </div>

              <SocialShare title={post.title} url={canonical} />

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {tags.map((tag) => (
                    <Link key={tag} to={`/blog/tag/${encodeURIComponent(tag)}`}>
                      <Badge variant="secondary" size="sm">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="container-custom max-w-4xl mx-auto px-4 sm:px-6">
          <img
            src={image}
            alt={post.title}
            loading="eager"
            className="w-full h-56 sm:h-72 md:h-80 object-cover rounded-2xl shadow-large"
          />
        </div>
      </section>

      <section className="pb-16 md:pb-20 pt-2">
        <div className="container-custom max-w-6xl mx-auto px-4 sm:px-6">
          <div className="lg:flex lg:items-start lg:gap-12 xl:gap-16">
            <article
              className="blog-prose prose prose-blog max-w-none flex-1 min-w-0 max-w-[720px]"
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />

            <aside className="lg:w-64 xl:w-72 shrink-0 mt-10 lg:mt-0 lg:sticky lg:top-28 space-y-5">
              {tags.length > 0 && (
                <Card className="!p-5">
                  <h3 className="text-base font-semibold text-neutral-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link key={tag} to={`/blog/tag/${encodeURIComponent(tag)}`}>
                        <Badge variant="secondary" size="sm">{tag}</Badge>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
              <Card className="!p-5">
                <h3 className="text-base font-semibold text-neutral-900 mb-2">Need expert help?</h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  Axiolink Systems builds AI, cloud, and enterprise software for growing businesses.
                </p>
                <Button size="sm" className="w-full" onClick={() => navigate("/contact")}>
                  Contact us
                </Button>
              </Card>
            </aside>
          </div>

          <Card className="mt-14 !p-6 md:!p-8 max-w-[720px]">
            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={isCeo ? stockImages.professionalMan : stockImages.cloudComputing}
                alt={authorName}
                loading="lazy"
                className="w-16 h-16 rounded-full object-cover shrink-0"
              />
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{authorName}</h3>
                <p className="text-primary-600 text-sm font-medium mb-2">
                  {isCeo
                    ? "Founder & CEO, Axiolink Systems (Pvt) Ltd."
                    : "Axiolink Systems (Pvt) Ltd."}
                </p>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {isCeo
                    ? "Building software, AI products, and developer education in Lahore, Pakistan."
                    : "Research-backed insights on technology, business, and digital transformation."}
                </p>
              </div>
            </div>
          </Card>

          {(prevPost || nextPost) && (
            <div className="grid sm:grid-cols-2 gap-4 mt-10 pt-8 border-t border-neutral-200 max-w-[720px]">
              {prevPost ? (
                <button
                  type="button"
                  onClick={() => navigate(`/blog/${prevPost.slug}`)}
                  className="text-left p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors"
                >
                  <span className="text-xs text-neutral-500 flex items-center mb-1">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </span>
                  <span className="font-medium text-neutral-900 line-clamp-2">{prevPost.title}</span>
                </button>
              ) : <div />}
              {nextPost && (
                <button
                  type="button"
                  onClick={() => navigate(`/blog/${nextPost.slug}`)}
                  className="text-left p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors sm:ml-auto"
                >
                  <span className="text-xs text-neutral-500 flex items-center justify-end mb-1">
                    Next <ChevronRight className="w-4 h-4" />
                  </span>
                  <span className="font-medium text-neutral-900 line-clamp-2">{nextPost.title}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-padding bg-neutral-50 border-t border-neutral-100">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-10">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {related.map((r) => (
                <Card key={r.slug} hover className="h-full !p-5">
                  <img
                    src={r.featuredImage || stockImages.cloudComputing}
                    alt={r.title}
                    loading="lazy"
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                  <h3 className="blog-card-title mb-2 line-clamp-2">{r.title}</h3>
                  <p className="blog-card-excerpt mb-4 line-clamp-3">{r.excerpt}</p>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/blog/${r.slug}`)}>
                    Read More
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
