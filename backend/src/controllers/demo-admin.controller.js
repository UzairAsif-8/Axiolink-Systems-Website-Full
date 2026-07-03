import { asyncHandler, success, paginated, ApiError } from "../utils/helpers.js";
import * as demo from "../services/demo-data.service.js";

export const getStats = asyncHandler(async (_req, res) => {
  const { stats, recentApplications, recentEnrollments, recentMessages } = demo.getDashboard();
  success(res, { stats, recentApplications, recentEnrollments, recentMessages });
});

export const globalSearch = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim();
  if (!q || q.length < 2) {
    return success(res, { internships: [], applications: [], courses: [], messages: [], blogs: [] });
  }
  success(res, demo.globalSearch(q));
});

export const getNotifications = asyncHandler(async (_req, res) => {
  success(res, demo.getNotifications());
});

export const listInternships = asyncHandler(async (req, res) => {
  const { data, meta } = demo.listInternships(req.query);
  paginated(res, data, meta);
});

export const getInternship = asyncHandler(async (req, res) => {
  const item = demo.getInternship(req.params.id);
  if (!item) throw new ApiError(404, "Internship not found");
  success(res, item);
});

export const createInternship = asyncHandler(async (req, res) => {
  const item = demo.saveInternship(req.body);
  success(res, item, 201);
});

export const updateInternship = asyncHandler(async (req, res) => {
  const item = demo.saveInternship(req.body, req.params.id);
  if (!item) throw new ApiError(404, "Internship not found");
  success(res, item);
});

export const deleteInternship = asyncHandler(async (req, res) => {
  if (!demo.deleteInternship(req.params.id)) throw new ApiError(404, "Internship not found");
  success(res, { message: "Internship deleted" });
});

export const duplicateInternship = asyncHandler(async (req, res) => {
  const item = demo.duplicateInternship(req.params.id);
  if (!item) throw new ApiError(404, "Internship not found");
  success(res, item, 201);
});

export const listApplications = asyncHandler(async (req, res) => {
  const { data, meta } = demo.listApplications(req.query);
  paginated(res, data, meta);
});

export const getApplication = asyncHandler(async (req, res) => {
  const item = demo.getApplication(req.params.id);
  if (!item) throw new ApiError(404, "Application not found");
  success(res, item);
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  if (!status) throw new ApiError(400, "Status is required");
  const item = demo.updateApplicationStatus(
    req.params.id,
    status.toUpperCase(),
    req.user?.name || "Admin",
    note
  );
  if (!item) throw new ApiError(404, "Application not found");
  success(res, item);
});

export const markApplicationCertificate = asyncHandler(async (req, res) => {
  const issued = req.body.issued !== false;
  const item = demo.markApplicationCertificateIssued(
    req.params.id,
    issued,
    req.user?.name || "Admin"
  );
  if (!item) throw new ApiError(400, "Certificate can only be issued for completed internships");
  success(res, item);
});

export const addApplicationNote = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) throw new ApiError(400, "Note content is required");
  const note = demo.addApplicationNote(req.params.id, content.trim(), req.user?.name || "Admin");
  if (!note) throw new ApiError(404, "Application not found");
  success(res, note, 201);
});

export const deleteApplication = asyncHandler(async (req, res) => {
  if (!demo.deleteApplication(req.params.id)) throw new ApiError(404, "Application not found");
  success(res, { message: "Application deleted" });
});

export const exportApplicationsCsv = asyncHandler(async (_req, res) => {
  const csv = demo.exportApplicationsCsv();
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=applications.csv");
  res.send(csv);
});

export const listCourses = asyncHandler(async (req, res) => {
  const { data, meta } = demo.listCourses(req.query);
  paginated(res, data, meta);
});

export const getCourse = asyncHandler(async (req, res) => {
  const item = demo.getCourse(req.params.id);
  if (!item) throw new ApiError(404, "Course not found");
  success(res, item);
});

export const createCourse = asyncHandler(async (req, res) => {
  const item = demo.saveCourse(req.body);
  success(res, item, 201);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const item = demo.saveCourse(req.body, req.params.id);
  if (!item) throw new ApiError(404, "Course not found");
  success(res, item);
});

export const deleteCourse = asyncHandler(async (req, res) => {
  if (!demo.deleteCourse(req.params.id)) throw new ApiError(404, "Course not found");
  success(res, { message: "Course deleted" });
});

export const listEnrollments = asyncHandler(async (req, res) => {
  const { data, meta } = demo.listEnrollments(req.query);
  paginated(res, data, meta);
});

export const getEnrollment = asyncHandler(async (req, res) => {
  const item = demo.getEnrollment(req.params.id);
  if (!item) throw new ApiError(404, "Enrollment not found");
  success(res, item);
});

export const updateEnrollment = asyncHandler(async (req, res) => {
  const item = demo.updateEnrollment(req.params.id, req.body);
  if (!item) throw new ApiError(404, "Enrollment not found");
  success(res, item);
});

export const updateEnrollmentStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  if (!status) throw new ApiError(400, "Status is required");
  const item = demo.updateEnrollmentStatus(
    req.params.id,
    status.toUpperCase(),
    req.user?.name || "Admin",
    note
  );
  if (!item) throw new ApiError(404, "Enrollment not found");
  success(res, item);
});

export const markEnrollmentCertificate = asyncHandler(async (req, res) => {
  const issued = req.body.issued !== false;
  const item = demo.markEnrollmentCertificateIssued(
    req.params.id,
    issued,
    req.user?.name || "Admin"
  );
  if (!item) throw new ApiError(400, "Certificate can only be issued for completed enrollments");
  success(res, item);
});

export const deleteEnrollment = asyncHandler(async (req, res) => {
  if (!demo.deleteEnrollment(req.params.id)) throw new ApiError(404, "Enrollment not found");
  success(res, { message: "Enrollment removed" });
});

export const listCertificates = asyncHandler(async (req, res) => {
  const { data, meta } = demo.listCertificates(req.query);
  paginated(res, data, meta);
});

export const createCertificate = asyncHandler(async (req, res) => {
  const item = demo.createCertificate(req.body);
  success(res, item, 201);
});

export const updateCertificate = asyncHandler(async (req, res) => {
  const item = demo.updateCertificate(req.params.id, req.body);
  if (!item) throw new ApiError(404, "Certificate not found");
  success(res, item);
});

export const revokeCertificate = asyncHandler(async (req, res) => {
  const item = demo.revokeCertificate(req.params.id);
  if (!item) throw new ApiError(404, "Certificate not found");
  success(res, item);
});

export const deleteCertificate = asyncHandler(async (req, res) => {
  if (!demo.deleteCertificate(req.params.id)) throw new ApiError(404, "Certificate not found");
  success(res, { message: "Certificate deleted" });
});

export const verifyCertificate = asyncHandler(async (req, res) => {
  const code = req.params.code?.trim();
  const cert = demo.verifyCertificate(code);
  if (!cert) {
    return res.status(404).json({
      valid: false,
      message: "The certificate code entered does not match any record in our system.",
    });
  }
  res.json({
    valid: true,
    certificate: {
      certificateCode: cert.certificateCode,
      studentName: cert.studentName,
      courseName: cert.courseName,
      issueDate: cert.issueDate,
    },
  });
});

export const listMessages = asyncHandler(async (_req, res) => {
  const { data, meta } = demo.listMessages();
  paginated(res, data, meta);
});

export const getMessage = asyncHandler(async (req, res) => {
  const item = demo.getMessage(req.params.id);
  if (!item) throw new ApiError(404, "Message not found");
  success(res, item);
});

export const updateMessage = asyncHandler(async (req, res) => {
  const item = demo.updateMessage(req.params.id, req.body);
  if (!item) throw new ApiError(404, "Message not found");
  success(res, item);
});

export const deleteMessage = asyncHandler(async (req, res) => {
  if (!demo.deleteMessage(req.params.id)) throw new ApiError(404, "Message not found");
  success(res, { message: "Message deleted" });
});

export const listBlogs = asyncHandler(async (_req, res) => {
  const { data, meta } = demo.listBlogs();
  paginated(res, data, meta);
});

export const getBlog = asyncHandler(async (req, res) => {
  const item = demo.getBlog(req.params.id);
  if (!item) throw new ApiError(404, "Blog post not found");
  success(res, item);
});

export const createBlog = asyncHandler(async (req, res) => {
  const item = demo.saveBlog(req.body);
  success(res, item, 201);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const item = demo.saveBlog(req.body, req.params.id);
  if (!item) throw new ApiError(404, "Blog post not found");
  success(res, item);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  if (!demo.deleteBlog(req.params.id)) throw new ApiError(404, "Blog post not found");
  success(res, { message: "Blog post deleted" });
});

export const getSettings = asyncHandler(async (_req, res) => {
  success(res, demo.getSettings());
});

export const bulkUpdateSettings = asyncHandler(async (req, res) => {
  success(res, demo.bulkUpdateSettings(req.body));
});

export const listPublicInternships = asyncHandler(async (_req, res) => {
  success(res, demo.listPublicInternships());
});

export const getPublicInternshipBySlug = asyncHandler(async (req, res) => {
  const item = demo.getPublicInternshipBySlug(req.params.slug);
  if (!item) throw new ApiError(404, "Internship not found");
  success(res, item);
});

export const listPublicCourses = asyncHandler(async (_req, res) => {
  success(res, demo.listPublicCourses());
});

export const getPublicCourseBySlug = asyncHandler(async (req, res) => {
  const item = demo.getPublicCourseBySlug(req.params.slug);
  if (!item) throw new ApiError(404, "Course not found");
  success(res, item);
});

export const listPublicBlogs = asyncHandler(async (_req, res) => {
  success(res, demo.listPublicBlogs());
});

export const getPublicBlogBySlug = asyncHandler(async (req, res) => {
  const item = demo.getPublicBlogBySlug(req.params.slug);
  if (!item) throw new ApiError(404, "Blog post not found");
  success(res, item);
});

export const getPublicSettings = asyncHandler(async (_req, res) => {
  success(res, demo.getPublicSettings());
});
