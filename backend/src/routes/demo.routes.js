import { Router } from "express";
import * as demo from "../controllers/demo-admin.controller.js";
import { authenticate } from "../middleware/auth.js";
import { canAccessAdmin } from "../middleware/roles.js";
import { uploadDocument } from "../middleware/upload.js";

const admin = Router();
admin.use(authenticate, canAccessAdmin);

admin.get("/dashboard/stats", demo.getStats);
admin.get("/dashboard/search", demo.globalSearch);
admin.get("/dashboard/notifications", demo.getNotifications);

admin.get("/internships", demo.listInternships);
admin.get("/internships/:id", demo.getInternship);
admin.post("/internships", demo.createInternship);
admin.put("/internships/:id", demo.updateInternship);
admin.delete("/internships/:id", demo.deleteInternship);
admin.post("/internships/:id/duplicate", demo.duplicateInternship);

admin.get("/applications", demo.listApplications);
admin.get("/applications/export/csv", demo.exportApplicationsCsv);
admin.get("/applications/:id", demo.getApplication);
admin.patch("/applications/:id/status", demo.updateApplicationStatus);
admin.patch("/applications/:id/certificate", demo.markApplicationCertificate);
admin.post("/applications/:id/notes", demo.addApplicationNote);
admin.delete("/applications/:id", demo.deleteApplication);

admin.get("/courses", demo.listCourses);
admin.get("/courses/enrollments/list", demo.listEnrollments);
admin.get("/courses/enrollments/:id", demo.getEnrollment);
admin.patch("/courses/enrollments/:id", demo.updateEnrollment);
admin.patch("/courses/enrollments/:id/status", demo.updateEnrollmentStatus);
admin.patch("/courses/enrollments/:id/certificate", demo.markEnrollmentCertificate);
admin.delete("/courses/enrollments/:id", demo.deleteEnrollment);
admin.get("/courses/:id", demo.getCourse);
admin.post("/courses", demo.createCourse);
admin.put("/courses/:id", demo.updateCourse);
admin.delete("/courses/:id", demo.deleteCourse);

admin.get("/certificates", demo.listCertificates);
admin.post("/certificates", demo.createCertificate);
admin.put("/certificates/:id", demo.updateCertificate);
admin.post("/certificates/:id/revoke", demo.revokeCertificate);
admin.delete("/certificates/:id", demo.deleteCertificate);

admin.get("/messages", demo.listMessages);
admin.get("/messages/:id", demo.getMessage);
admin.patch("/messages/:id", demo.updateMessage);
admin.delete("/messages/:id", demo.deleteMessage);

admin.get("/blogs", demo.listBlogs);
admin.get("/blogs/:id", demo.getBlog);
admin.post("/blogs", demo.createBlog);
admin.put("/blogs/:id", demo.updateBlog);
admin.delete("/blogs/:id", demo.deleteBlog);

admin.get("/settings", demo.getSettings);
admin.put("/settings/bulk", demo.bulkUpdateSettings);

export const demoPublicRoutes = {
  internships: (() => {
    const r = Router();
    r.get("/", demo.listPublicInternships);
    r.get("/:slug", demo.getPublicInternshipBySlug);
    return r;
  })(),
  courses: (() => {
    const r = Router();
    r.get("/", demo.listPublicCourses);
    r.get("/previous", demo.listPublicPreviousCourses);
    r.post("/enroll", uploadDocument, demo.enrollPublic);
    r.get("/:slug", demo.getPublicCourseBySlug);
    return r;
  })(),
  blogs: (() => {
    const r = Router();
    r.get("/", demo.listPublicBlogs);
    r.get("/:slug", demo.getPublicBlogBySlug);
    return r;
  })(),
  certificate: (() => {
    const r = Router();
    r.get("/verify/:code", demo.verifyCertificate);
    return r;
  })(),
  settings: (() => {
    const r = Router();
    r.get("/", demo.getPublicSettings);
    return r;
  })(),
};

export default admin;
