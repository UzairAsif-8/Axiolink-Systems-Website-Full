import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import {
  displayCertificateCode,
  formatCertificateCode,
  stripCertificateCode,
} from "../utils/certificateCode.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "../../data/demo-data.json");

let store = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function loadDemoData() {
  if (!store) {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    store = JSON.parse(raw);
    ensureApplicationMeta(store);
    ensureEnrollmentMeta(store);
  }
  return store;
}

function ensureEnrollmentMeta(data) {
  for (const e of data.enrollments || []) {
    if (e.certificateIssued === undefined) e.certificateIssued = false;
    if (!e.status) {
      if (e.progress >= 100) e.status = "COMPLETED";
      else if (e.paymentStatus === "PENDING") e.status = "NEW";
      else e.status = "ACTIVE";
    }
    if (!e.statusHistory) {
      e.statusHistory = [
        {
          id: randomUUID(),
          fromStatus: null,
          toStatus: e.status,
          changedBy: "System",
          note: "Enrollment created",
          changedAt: e.enrollmentDate || e.createdAt || new Date().toISOString(),
        },
      ];
    }
  }
}

function ensureApplicationMeta(data) {
  for (const app of data.applications || []) {
    if (!app.notes) app.notes = [];
    if (!app.statusHistory) {
      app.statusHistory = [
        {
          id: randomUUID(),
          fromStatus: null,
          toStatus: app.status,
          changedBy: "System",
          note: "Application submitted",
          changedAt: app.createdAt || new Date().toISOString(),
        },
      ];
    }
  }
  for (const blog of data.blogs || []) {
    if (!blog.content) blog.content = blog.excerpt || "";
  }
}

export function persistDemoData() {
  fs.writeFileSync(DATA_PATH, JSON.stringify(loadDemoData(), null, 2));
}

export function resetDemoData() {
  store = null;
  return loadDemoData();
}

export function paginate(items, page = 1, limit = 20) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  const skip = (safePage - 1) * safeLimit;
  const data = items.slice(skip, skip + safeLimit);
  return {
    data,
    meta: {
      page: safePage,
      limit: safeLimit,
      total: items.length,
      pages: Math.ceil(items.length / safeLimit) || 1,
    },
  };
}

export function findById(collection, id) {
  return loadDemoData()[collection]?.find((item) => item.id === id) ?? null;
}

export function getDashboard() {
  return clone(loadDemoData().dashboard);
}

export function listInternships(query = {}) {
  let items = [...loadDemoData().internships];
  if (query.status) items = items.filter((i) => i.status === query.status.toUpperCase());
  if (query.search) {
    const q = query.search.toLowerCase();
    items = items.filter(
      (i) => i.title.toLowerCase().includes(q) || i.slug.toLowerCase().includes(q)
    );
  }
  return paginate(items, parseInt(query.page || "1", 10), parseInt(query.limit || "20", 10));
}

export function getInternship(id) {
  return clone(findById("internships", id));
}

export function saveInternship(body, id = null) {
  const data = loadDemoData();
  if (id) {
    const idx = data.internships.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    data.internships[idx] = { ...data.internships[idx], ...body, id, updatedAt: new Date().toISOString() };
    persistDemoData();
    return clone(data.internships[idx]);
  }
  const item = {
    id: randomUUID(),
    status: "DRAFT",
    applicationsOpen: false,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...body,
  };
  data.internships.unshift(item);
  persistDemoData();
  return clone(item);
}

function enrichApplication(app, internships) {
  const internship = internships?.find((i) => i.id === app.internshipId);
  return clone({
    ...app,
    certificateIssued: !!app.certificateIssued,
    internshipDepartment: internship?.department || null,
    internshipDuration: internship?.duration || null,
    internshipWorkMode: internship?.workMode || null,
  });
}

export function listApplications(query = {}) {
  const data = loadDemoData();
  let items = data.applications.map((a) => enrichApplication(a, data.internships));
  if (query.status) items = items.filter((a) => a.status === query.status.toUpperCase());
  if (query.internshipId) items = items.filter((a) => a.internshipId === query.internshipId);
  const limit = parseInt(query.limit || "20", 10);
  return paginate(items, parseInt(query.page || "1", 10), limit);
}

export function getApplication(id) {
  const data = loadDemoData();
  const app = findById("applications", id);
  return app ? enrichApplication(app, data.internships) : null;
}

export function listCourses(query = {}) {
  return paginate(loadDemoData().courses, parseInt(query.page || "1", 10), parseInt(query.limit || "20", 10));
}

export function listEnrollments(query = {}) {
  const data = loadDemoData();
  let items = data.enrollments.map((e) => enrichEnrollment(e, data.courses));
  if (query.courseId) items = items.filter((e) => e.courseId === query.courseId);
  if (query.status) items = items.filter((e) => e.status === query.status.toUpperCase());
  const limit = parseInt(query.limit || "50", 10);
  return paginate(items, parseInt(query.page || "1", 10), limit);
}

function enrichEnrollment(enrollment, courses) {
  const course = courses?.find((c) => c.id === enrollment.courseId);
  return clone({
    ...enrollment,
    certificateIssued: !!enrollment.certificateIssued,
    course: enrollment.course || (course ? { title: course.title, slug: course.slug } : null),
    courseCategory: course?.category || null,
    courseDuration: course?.duration || null,
    courseLevel: course?.level || null,
    coursePrice: course?.price ?? null,
  });
}

export function listCertificates(query = {}) {
  const result = paginate(
    loadDemoData().certificates,
    parseInt(query.page || "1", 10),
    parseInt(query.limit || "20", 10)
  );
  result.data = result.data.map((c) => ({
    ...c,
    certificateCode: displayCertificateCode(c.certificateCode),
  }));
  return result;
}

export function createCertificate(body) {
  const data = loadDemoData();
  const fallback = `BP26${String(2000 + data.certificates.length).padStart(13, "0")}`.slice(0, 17);
  const code =
    formatCertificateCode(body.certificateCode || fallback) ||
    formatCertificateCode(fallback);
  const item = {
    id: randomUUID(),
    certificateCode: code,
    studentName: body.studentName,
    courseName: body.courseName,
    issueDate: body.issueDate || new Date().toISOString(),
    verificationUrl: `/verify-certificate/${code}`,
    isValid: true,
    createdAt: new Date().toISOString(),
  };
  data.certificates.unshift(item);
  persistDemoData();
  return clone(item);
}

export function verifyCertificate(code) {
  const incoming = String(code || "").trim();
  const formatted = formatCertificateCode(incoming);
  const raw = stripCertificateCode(incoming, { maxLength: null });
  const cert = loadDemoData().certificates.find((c) => {
    if (!c.isValid) return false;
    const storedRaw = stripCertificateCode(c.certificateCode, { maxLength: null });
    return (
      c.certificateCode === formatted ||
      c.certificateCode === incoming.toUpperCase() ||
      storedRaw === raw
    );
  });
  if (!cert) return null;
  const cloned = clone(cert);
  cloned.certificateCode = displayCertificateCode(cloned.certificateCode);
  return cloned;
}

export function listMessages() {
  return paginate(loadDemoData().messages, 1, 50);
}

export function listBlogs() {
  return paginate(loadDemoData().blogs, 1, 50);
}

export function getSettings() {
  return clone(loadDemoData().settings);
}

export function bulkUpdateSettings(updates) {
  const data = loadDemoData();
  for (const [key, value] of Object.entries(updates)) {
    const idx = data.settings.findIndex((s) => s.key === key);
    if (idx >= 0) data.settings[idx].value = value;
    else data.settings.push({ key, value });
  }
  persistDemoData();
  return { message: "Settings updated" };
}

export function globalSearch(q) {
  const query = q.toLowerCase();
  const data = loadDemoData();
  return {
    internships: data.internships
      .filter((i) => i.title.toLowerCase().includes(query))
      .slice(0, 5)
      .map(({ id, title, slug }) => ({ id, title, slug })),
    applications: data.applications
      .filter((a) => a.fullName.toLowerCase().includes(query) || a.email.toLowerCase().includes(query))
      .slice(0, 5)
      .map(({ id, fullName, email, status }) => ({ id, fullName, email, status })),
    courses: data.courses
      .filter((c) => c.title.toLowerCase().includes(query))
      .slice(0, 5)
      .map(({ id, title, slug }) => ({ id, title, slug })),
    messages: data.messages
      .filter((m) => m.name.toLowerCase().includes(query) || m.email.toLowerCase().includes(query))
      .slice(0, 5)
      .map(({ id, name, email, subject }) => ({ id, name, email, subject })),
    blogs: data.blogs
      .filter((b) => b.title.toLowerCase().includes(query))
      .slice(0, 5)
      .map(({ id, title, slug }) => ({ id, title, slug })),
  };
}

export function getNotifications() {
  const notifications = loadDemoData().dashboard.notifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return { notifications: clone(notifications), unreadCount };
}

export function listPublicInternships() {
  return clone(
    loadDemoData().internships.filter((i) => i.status === "PUBLISHED" && i.applicationsOpen !== false)
  );
}

export function getPublicInternshipBySlug(slug) {
  const item = loadDemoData().internships.find((i) => i.slug === slug && i.status === "PUBLISHED");
  return item ? clone(item) : null;
}

export function listPublicCourses() {
  return clone(loadDemoData().courses.filter((c) => c.status === "PUBLISHED" && c.enrollmentOpen !== false));
}

export function getPublicCourseBySlug(slug) {
  const item = loadDemoData().courses.find(
    (c) => (c.slug === slug || c.id === slug) && c.status === "PUBLISHED"
  );
  return item ? clone(item) : null;
}

export function listPublicBlogs() {
  return clone(
    loadDemoData().blogs.filter((b) => b.status === "PUBLISHED").map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      featuredImage: b.featuredImage,
      category: b.category,
      tags: b.tags || [],
      author: b.author,
      publishedAt: b.publishedAt,
    }))
  );
}

export function getPublicBlogBySlug(slug) {
  const item = loadDemoData().blogs.find((b) => b.slug === slug && b.status === "PUBLISHED");
  return item ? clone(item) : null;
}

export function getPublicSettings() {
  const settings = loadDemoData().settings;
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export function authenticateDemoAdmin(email, password) {
  const user = loadDemoData().adminUsers?.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export function getDemoAdminById(id) {
  const user = loadDemoData().adminUsers?.find((u) => u.id === id);
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function deleteInternship(id) {
  const data = loadDemoData();
  const idx = data.internships.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  data.internships.splice(idx, 1);
  persistDemoData();
  return true;
}

export function duplicateInternship(id) {
  const source = findById("internships", id);
  if (!source) return null;
  const copy = {
    ...clone(source),
    id: randomUUID(),
    title: `${source.title} (Copy)`,
    slug: `${source.slug}-copy-${Date.now()}`,
    status: "DRAFT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  loadDemoData().internships.unshift(copy);
  persistDemoData();
  return clone(copy);
}

export function updateApplicationStatus(id, status, changedBy = "Admin", note = "") {
  const data = loadDemoData();
  const idx = data.applications.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const app = data.applications[idx];
  const fromStatus = app.status;
  const now = new Date().toISOString();
  app.status = status;

  if (status === "SELECTED" && !app.activeInternAt) {
    app.activeInternAt = now;
  }
  if (status === "INTERNSHIP_COMPLETED") {
    app.completedAt = now;
  }
  if (status === "WITHDRAWN") {
    app.withdrawnAt = now;
  }
  if (status === "SELECTED") {
    app.certificateIssued = false;
  }

  if (!app.statusHistory) app.statusHistory = [];
  app.statusHistory.unshift({
    id: randomUUID(),
    fromStatus,
    toStatus: status,
    changedBy,
    note: note || `Status changed to ${status.replace(/_/g, " ")}`,
    changedAt: now,
  });
  if (!app.notes) app.notes = [];
  persistDemoData();
  return enrichApplication(app, data.internships);
}

export function markApplicationCertificateIssued(id, issued = true, changedBy = "Admin") {
  const data = loadDemoData();
  const idx = data.applications.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const app = data.applications[idx];
  if (app.status !== "INTERNSHIP_COMPLETED") {
    return null;
  }
  app.certificateIssued = !!issued;
  if (issued) {
    app.certificateIssuedAt = new Date().toISOString();
    if (!app.statusHistory) app.statusHistory = [];
    app.statusHistory.unshift({
      id: randomUUID(),
      fromStatus: app.status,
      toStatus: app.status,
      changedBy,
      note: "Certificate issued",
      changedAt: app.certificateIssuedAt,
    });
  } else {
    app.certificateIssuedAt = null;
  }
  persistDemoData();
  return enrichApplication(app, data.internships);
}

export function addApplicationNote(id, content, authorName = "Admin") {
  const data = loadDemoData();
  const idx = data.applications.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const note = {
    id: randomUUID(),
    content,
    authorName,
    createdAt: new Date().toISOString(),
  };
  if (!data.applications[idx].notes) data.applications[idx].notes = [];
  data.applications[idx].notes.unshift(note);
  persistDemoData();
  return clone(note);
}

export function deleteApplication(id) {
  const data = loadDemoData();
  const idx = data.applications.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  data.applications.splice(idx, 1);
  persistDemoData();
  return true;
}

export function exportApplicationsCsv() {
  const apps = loadDemoData().applications;
  const header = "ID,Name,Email,Phone,Status,Internship,Created\n";
  const rows = apps
    .map(
      (a) =>
        `${a.id},"${a.fullName}","${a.email}","${a.phone || ""}",${a.status},"${a.internshipTitle || ""}",${a.createdAt}`
    )
    .join("\n");
  return header + rows;
}

export function getCourse(id) {
  return clone(findById("courses", id));
}

export function saveCourse(body, id = null) {
  const data = loadDemoData();
  if (id) {
    const idx = data.courses.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    data.courses[idx] = {
      ...data.courses[idx],
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    persistDemoData();
    return clone(data.courses[idx]);
  }
  const item = {
    id: randomUUID(),
    slug: body.slug || slugify(body.title || "course"),
    status: "DRAFT",
    enrollmentOpen: false,
    certificateAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...body,
  };
  data.courses.unshift(item);
  persistDemoData();
  return clone(item);
}

export function deleteCourse(id) {
  const data = loadDemoData();
  const idx = data.courses.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  data.courses.splice(idx, 1);
  persistDemoData();
  return true;
}

export function getEnrollment(id) {
  const data = loadDemoData();
  const item = findById("enrollments", id);
  return item ? enrichEnrollment(item, data.courses) : null;
}

export function updateEnrollment(id, body) {
  const data = loadDemoData();
  const idx = data.enrollments.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  data.enrollments[idx] = { ...data.enrollments[idx], ...body, id };
  persistDemoData();
  return enrichEnrollment(data.enrollments[idx], data.courses);
}

export function updateEnrollmentStatus(id, status, changedBy = "Admin", note = "") {
  const data = loadDemoData();
  const idx = data.enrollments.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const enrollment = data.enrollments[idx];
  const fromStatus = enrollment.status || "NEW";
  const now = new Date().toISOString();
  enrollment.status = status;

  if (status === "ACTIVE" && !enrollment.activeAt) enrollment.activeAt = now;
  if (status === "COMPLETED") {
    enrollment.completedAt = now;
    enrollment.progress = Math.max(enrollment.progress || 0, 100);
  }
  if (status === "WITHDRAWN") enrollment.withdrawnAt = now;
  if (status === "ACTIVE") enrollment.certificateIssued = false;

  if (!enrollment.statusHistory) enrollment.statusHistory = [];
  enrollment.statusHistory.unshift({
    id: randomUUID(),
    fromStatus,
    toStatus: status,
    changedBy,
    note: note || `Status changed to ${status.replace(/_/g, " ")}`,
    changedAt: now,
  });
  persistDemoData();
  return enrichEnrollment(enrollment, data.courses);
}

export function markEnrollmentCertificateIssued(id, issued = true, changedBy = "Admin") {
  const data = loadDemoData();
  const idx = data.enrollments.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const enrollment = data.enrollments[idx];
  if (enrollment.status !== "COMPLETED") return null;

  enrollment.certificateIssued = !!issued;
  if (issued) {
    enrollment.certificateIssuedAt = new Date().toISOString();
    const course = data.courses.find((c) => c.id === enrollment.courseId);
    const courseName = enrollment.course?.title || course?.title || "Course";
    const existing = data.certificates.find(
      (c) => c.enrollmentId === enrollment.id || (c.studentName === enrollment.fullName && c.courseName === courseName)
    );
    if (!existing) {
      const code = formatCertificateCode(
        `BP26${String(2100 + data.certificates.length).padStart(13, "0")}`.slice(0, 17)
      );
      data.certificates.unshift({
        id: randomUUID(),
        certificateCode: code,
        studentName: enrollment.fullName,
        courseName,
        enrollmentId: enrollment.id,
        courseId: enrollment.courseId,
        issueDate: enrollment.certificateIssuedAt,
        verificationUrl: `/verify-certificate/${code}`,
        isValid: true,
        createdAt: enrollment.certificateIssuedAt,
      });
    }
    if (!enrollment.statusHistory) enrollment.statusHistory = [];
    enrollment.statusHistory.unshift({
      id: randomUUID(),
      fromStatus: enrollment.status,
      toStatus: enrollment.status,
      changedBy,
      note: "Certificate issued",
      changedAt: enrollment.certificateIssuedAt,
    });
  } else {
    enrollment.certificateIssuedAt = null;
  }
  persistDemoData();
  return enrichEnrollment(enrollment, data.courses);
}

export function deleteEnrollment(id) {
  const data = loadDemoData();
  const idx = data.enrollments.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  data.enrollments.splice(idx, 1);
  persistDemoData();
  return true;
}

export function updateCertificate(id, body) {
  const data = loadDemoData();
  const idx = data.certificates.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const next = { ...data.certificates[idx], ...body, id };
  if (body.certificateCode != null) {
    next.certificateCode = formatCertificateCode(body.certificateCode);
    next.verificationUrl = `/verify-certificate/${next.certificateCode}`;
  }
  data.certificates[idx] = next;
  persistDemoData();
  return clone(data.certificates[idx]);
}

export function revokeCertificate(id) {
  return updateCertificate(id, { isValid: false, revokedAt: new Date().toISOString() });
}

export function deleteCertificate(id) {
  const data = loadDemoData();
  const idx = data.certificates.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  data.certificates.splice(idx, 1);
  persistDemoData();
  return true;
}

export function getMessage(id) {
  return clone(findById("messages", id));
}

export function updateMessage(id, body) {
  const data = loadDemoData();
  const idx = data.messages.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  data.messages[idx] = { ...data.messages[idx], ...body, id };
  persistDemoData();
  return clone(data.messages[idx]);
}

export function deleteMessage(id) {
  const data = loadDemoData();
  const idx = data.messages.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  data.messages.splice(idx, 1);
  persistDemoData();
  return true;
}

export function getBlog(id) {
  return clone(findById("blogs", id));
}

export function saveBlog(body, id = null) {
  const data = loadDemoData();
  if (id) {
    const idx = data.blogs.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    const updated = {
      ...data.blogs[idx],
      ...body,
      id,
      updatedAt: new Date().toISOString(),
      ...(body.status === "PUBLISHED" && !data.blogs[idx].publishedAt
        ? { publishedAt: new Date().toISOString() }
        : {}),
    };
    data.blogs[idx] = updated;
    persistDemoData();
    return clone(updated);
  }
  const item = {
    id: randomUUID(),
    slug: body.slug || slugify(body.title || "post"),
    status: "DRAFT",
    author: body.author || "Axiolink Content Team",
    tags: body.tags || [],
    content: body.content || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...body,
    ...(body.status === "PUBLISHED" ? { publishedAt: new Date().toISOString() } : {}),
  };
  data.blogs.unshift(item);
  persistDemoData();
  return clone(item);
}

export function deleteBlog(id) {
  const data = loadDemoData();
  const idx = data.blogs.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  data.blogs.splice(idx, 1);
  persistDemoData();
  return true;
}
