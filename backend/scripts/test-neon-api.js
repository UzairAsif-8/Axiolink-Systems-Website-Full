/**
 * Smoke-test all major API modules against Neon PostgreSQL.
 * Usage: node scripts/test-neon-api.js [baseUrl]
 */
const BASE = process.argv[2] || "http://localhost:4000";

const SUPER_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@axiolinksystems.com";
const SUPER_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456";

const results = [];

async function req(method, path, { body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  const payload = data?.data !== undefined ? data.data : data;
  return { status: res.status, ok: res.ok, data, payload };
}

function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  console.log(`\nTesting API at ${BASE}\n`);

  const health = await req("GET", "/api/health");
  record("Health", health.ok, health.data?.status);

  const internships = await req("GET", "/api/internships");
  const internCount = Array.isArray(internships.payload) ? internships.payload.length : 0;
  record("GET /api/internships", internships.ok, `${internCount} items`);

  const blogs = await req("GET", "/api/blogs");
  record("GET /api/blogs", blogs.ok);

  const courses = await req("GET", "/api/courses");
  record("GET /api/courses", courses.ok);

  const settings = await req("GET", "/api/settings");
  record("GET /api/settings", settings.ok);

  const hrLogin = await req("POST", "/api/auth/login", {
    body: { email: "hr@axiolinksystems.com", password: "Demo@12345" },
  });
  record("POST /api/auth/login (HR blocked)", hrLogin.status === 401, `status ${hrLogin.status}`);

  const superLogin = await req("POST", "/api/auth/login", {
    body: { email: SUPER_ADMIN_EMAIL, password: SUPER_ADMIN_PASSWORD },
  });
  record("POST /api/auth/login (Super Admin)", superLogin.ok, superLogin.payload?.user?.role);
  const token = superLogin.payload?.accessToken;

  if (!token) {
    console.log("\nAdmin tests skipped — Super Admin login failed.\n");
    printSummary();
    process.exit(1);
  }

  const me = await req("GET", "/api/auth/me", { token });
  record("GET /api/auth/me", me.ok);

  const changePw = await req("POST", "/api/auth/change-password", {
    token,
    body: {
      currentPassword: SUPER_ADMIN_PASSWORD,
      newPassword: SUPER_ADMIN_PASSWORD,
    },
  });
  record("POST /api/auth/change-password", changePw.ok);

  const dash = await req("GET", "/api/admin/dashboard/stats", { token });
  record("GET /api/admin/dashboard/stats", dash.ok);

  const adminInternships = await req("GET", "/api/admin/internships", { token });
  record("GET /api/admin/internships", adminInternships.ok);

  const applications = await req("GET", "/api/admin/applications", { token });
  record("GET /api/admin/applications", applications.ok);

  const employees = await req("GET", "/api/admin/employees", { token });
  record("GET /api/admin/employees", employees.ok);

  const adminCourses = await req("GET", "/api/admin/courses", { token });
  record("GET /api/admin/courses", adminCourses.ok);

  const enrollments = await req("GET", "/api/admin/courses/enrollments/list", { token });
  record("GET /api/admin/courses/enrollments/list", enrollments.ok);

  const certs = await req("GET", "/api/admin/certificates", { token });
  record("GET /api/admin/certificates", certs.ok);

  const adminBlogs = await req("GET", "/api/admin/blogs", { token });
  record("GET /api/admin/blogs", adminBlogs.ok);

  const messages = await req("GET", "/api/admin/messages", { token });
  record("GET /api/admin/messages", messages.ok);

  const interns = await req("GET", "/api/admin/interns", { token });
  record("GET /api/admin/interns", interns.ok);

  printSummary();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
}

function printSummary() {
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.log("Failed:", failed.map((f) => f.name).join(", "));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
