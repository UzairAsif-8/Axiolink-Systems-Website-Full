import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Calendar, User, ArrowRight, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import BlogBreadcrumbs from "../components/blog/BlogBreadcrumbs";
import { stockImages } from "../data/stockImages";
import { fetchPublicBlogs } from "../api/public";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  BLOG_CATEGORIES,
  POSTS_PER_PAGE,
  estimateReadTime,
} from "../utils/blogSeo";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const BlogArchive = ({ filterType = null }) => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const filterValue = filterType === "category" ? params.category : filterType === "tag" ? params.tag : null;
  const decodedFilter = filterValue ? decodeURIComponent(filterValue) : null;

  useEffect(() => {
    setPage(1);
  }, [filterType, decodedFilter, searchTerm]);

  useEffect(() => {
    const query = {};
    if (filterType === "category" && decodedFilter) query.category = decodedFilter;
    if (filterType === "tag" && decodedFilter) query.tag = decodedFilter;

    setLoading(true);
    fetchPublicBlogs(query)
      .then((data) => {
        const mapped = (Array.isArray(data) ? data : []).map((p) => ({
          id: p.id,
          title: p.title,
          excerpt: p.excerpt || "",
          author: p.author || "Axiolink Team",
          date: p.publishedAt || p.createdAt,
          category: (p.category || "technology").toLowerCase(),
          readTime: estimateReadTime(p.content || p.excerpt),
          image: p.featuredImage || stockImages.cloudComputing,
          tags: p.tags || [],
          slug: p.slug,
        }));
        setPosts(mapped);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [filterType, decodedFilter]);

  const filteredPosts = posts.filter((post) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const showFeatured =
    !filterType && !loading && !searchTerm && filteredPosts.length > 0;
  const featuredPost = showFeatured ? filteredPosts[0] : null;
  const gridSource =
    featuredPost
      ? filteredPosts.filter((p) => p.id !== featuredPost.id)
      : filteredPosts;

  const totalPages = Math.max(1, Math.ceil(gridSource.length / POSTS_PER_PAGE));
  const paginatedPosts = gridSource.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  const pageTitle = useMemo(() => {
    if (filterType === "category" && decodedFilter) {
      const cat = BLOG_CATEGORIES.find((c) => c.id === decodedFilter.toLowerCase());
      return cat?.name || decodedFilter;
    }
    if (filterType === "tag" && decodedFilter) return `#${decodedFilter}`;
    return "Blog";
  }, [filterType, decodedFilter]);

  usePageMeta({
    title:
      filterType === "category"
        ? `${pageTitle} Articles | Axiolink Systems Blog`
        : filterType === "tag"
          ? `${decodedFilter} | Axiolink Systems Blog`
          : "Enterprise Technology Insights | Axiolink Systems Blog",
    description:
      filterType === "category"
        ? `Browse ${pageTitle.toLowerCase()} articles on AI, software engineering, and digital transformation from Axiolink Systems.`
        : filterType === "tag"
          ? `Articles tagged "${decodedFilter}" from the Axiolink Systems technology blog.`
          : "Expert insights on AI, cloud, cybersecurity, SaaS, and enterprise software from Axiolink Systems (Pvt) Ltd.",
    canonical:
      filterType === "category"
        ? `https://axiolinksystems.com/blog/category/${decodedFilter}`
        : filterType === "tag"
          ? `https://axiolinksystems.com/blog/tag/${encodeURIComponent(decodedFilter)}`
          : "https://axiolinksystems.com/blog",
  });

  const breadcrumbs = [{ label: "Blog", href: "/blog" }];
  if (filterType === "category") {
    breadcrumbs.push({ label: pageTitle });
  } else if (filterType === "tag") {
    breadcrumbs.push({ label: decodedFilter });
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="section-padding bg-gradient-to-br from-primary-50 to-navy-50 pb-12 md:pb-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <BlogBreadcrumbs items={breadcrumbs} />
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="primary" size="lg" className="mb-5">
                {filterType ? "Filtered" : "Insights & Updates"}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-5 leading-tight tracking-tight">
                {filterType ? (
                  <span className="capitalize">{pageTitle}</span>
                ) : (
                  <>Enterprise Technology <span className="gradient-text">Insights</span></>
                )}
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl">
                {filterType === "category"
                  ? `All articles in ${pageTitle.toLowerCase()}.`
                  : filterType === "tag"
                    ? `Articles tagged with "${decodedFilter}".`
                    : "Research-backed insights on AI, cloud, security, and software engineering."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-neutral-100">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>
            {!filterType && (
              <select
                className="px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                onChange={(e) => {
                  if (e.target.value !== "all") navigate(`/blog/category/${e.target.value}`);
                }}
                defaultValue="all"
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
          <p className="text-neutral-600 text-sm">
            Showing {paginatedPosts.length} of {gridSource.length} articles
            {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
          </p>
        </div>
      </section>

      {featuredPost && (
        <section className="section-padding pb-0">
          <div className="container-custom">
            <h2 className="text-2xl font-display font-bold text-center mb-8">Featured Article</h2>
            <Card hover padding="none" className="overflow-hidden max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2">
                <div className="relative overflow-hidden min-h-[14rem] sm:min-h-[16rem] lg:min-h-[320px]">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                  <Badge variant="primary" className="w-fit mb-4">Featured</Badge>
                  <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-display font-bold text-neutral-900 mb-4 leading-snug">
                    <Link to={`/blog/${featuredPost.slug}`} className="hover:text-primary-600 transition-colors">
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="blog-card-excerpt mb-6 line-clamp-4">{featuredPost.excerpt}</p>
                  <Button onClick={() => navigate(`/blog/${featuredPost.slug}`)}>
                    Read Article <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : paginatedPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card hover className="h-full">
                      <div className="flex flex-col h-full p-5 md:p-6">
                        <div className="relative overflow-hidden rounded-xl mb-5">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-44 object-cover"
                          />
                          <Link
                            to={`/blog/category/${post.category}`}
                            className="absolute top-3 right-3"
                          >
                            <Badge variant="primary" size="sm" className="capitalize">
                              {post.category}
                            </Badge>
                          </Link>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 mb-3">
                          <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" />{post.author}</span>
                          <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{formatDate(post.date)}</span>
                        </div>
                        <h2 className="blog-card-title mb-3">
                          <Link to={`/blog/${post.slug}`} className="hover:text-primary-600 transition-colors">
                            {post.title}
                          </Link>
                        </h2>
                        <p className="blog-card-excerpt mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Link key={tag} to={`/blog/tag/${encodeURIComponent(tag)}`}>
                              <Badge variant="secondary" size="sm">{tag}</Badge>
                            </Link>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                          <span className="text-xs text-neutral-500">{post.readTime}</span>
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/blog/${post.slug}`)}>
                            Read More <ArrowRight className="ml-1 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                  </Button>
                  <span className="text-sm text-neutral-600">Page {page} of {totalPages}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Tag className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No articles found</h3>
              <Button onClick={() => navigate("/blog")}>View all articles</Button>
            </div>
          )}
        </div>
      </section>

      {!filterType && (
        <section className="section-padding bg-white border-t border-neutral-100">
          <div className="container-custom max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-display font-bold mb-4">Browse by Category</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {BLOG_CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                <Link key={c.id} to={`/blog/category/${c.id}`}>
                  <Badge variant="secondary" size="lg">{c.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-gradient-to-br from-primary-600 to-navy-600">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-primary-100 mb-6">
            Get enterprise technology insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" className="flex-1" />
            <Button className="bg-white text-primary-600 hover:bg-primary-50">Subscribe</Button>
          </div>
          <p className="text-sm text-primary-200 mt-3">
            RSS: <a href="/api/blogs/feed/rss.xml" className="underline">Subscribe via RSS</a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default BlogArchive;
