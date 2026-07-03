import { ASSETS, daysAgo } from "./helpers.js";
import { DEPT_LABELS } from "./reference.js";

const EMPLOYEE_ROSTER = [
  { name: "Usman Tariq", dept: "management", title: "Chief Executive Officer", status: "ACTIVE", days: 820 },
  { name: "Ayesha Malik", dept: "management", title: "Chief Operating Officer", status: "ACTIVE", days: 650 },
  { name: "Sara Ahmed", dept: "hr", title: "People Operations Manager", status: "ACTIVE", days: 540 },
  { name: "Bilal Hussain", dept: "hr", title: "Operations Executive", status: "ACTIVE", days: 210 },
  { name: "Hamza Sheikh", dept: "frontend", title: "Senior Frontend Engineer", status: "ACTIVE", days: 480 },
  { name: "Fatima Ali", dept: "frontend", title: "Frontend Developer", status: "ACTIVE", days: 320 },
  { name: "Ahmed Khan", dept: "frontend", title: "React Developer", status: "ON_LEAVE", days: 180 },
  { name: "Hassan Raza", dept: "backend", title: "Backend Lead", status: "ACTIVE", days: 600 },
  { name: "Zain Malik", dept: "backend", title: "Node.js Developer", status: "ACTIVE", days: 290 },
  { name: "Omar Farooq", dept: "backend", title: "API Engineer", status: "ACTIVE", days: 150 },
  { name: "Dr. Nida Qureshi", dept: "ai", title: "AI Research Lead", status: "ACTIVE", days: 400 },
  { name: "Saad Iqbal", dept: "ai", title: "ML Engineer", status: "ACTIVE", days: 220 },
  { name: "Imran Siddiqui", dept: "cybersecurity", title: "Security Analyst", status: "ACTIVE", days: 360 },
  { name: "Maryam Raza", dept: "cybersecurity", title: "SOC Specialist", status: "ACTIVE", days: 190 },
  { name: "Hira Ahmed", dept: "ui-ux", title: "Lead Product Designer", status: "ACTIVE", days: 450 },
  { name: "Laiba Butt", dept: "ui-ux", title: "UI/UX Designer", status: "ACTIVE", days: 240 },
  { name: "Waqas Butt", dept: "marketing", title: "Marketing Manager", status: "ACTIVE", days: 380 },
  { name: "Rabia Iqbal", dept: "marketing", title: "Content Strategist", status: "ACTIVE", days: 160 },
  { name: "Asad Javed", dept: "sales", title: "Business Development Lead", status: "ACTIVE", days: 420 },
  { name: "Nabeel Qureshi", dept: "operations", title: "Operations Manager", status: "TERMINATED", days: 900 },
];

export async function seedEmployees(prisma) {
  console.log("\n👥 Employees");

  const employees = [];

  for (let i = 0; i < EMPLOYEE_ROSTER.length; i++) {
    const row = EMPLOYEE_ROSTER[i];
    const code = `AXL-${String(i + 1).padStart(4, "0")}`;
    const slug = row.name.toLowerCase().replace(/\s+/g, ".");

    const employee = await prisma.employee.create({
      data: {
        employeeCode: code,
        fullName: row.name,
        email: `${slug}@axiolinksystems.com`,
        phone: `+92 3${String(10 + (i % 89)).padStart(2, "0")} ${String(1000000 + i * 12345).slice(0, 7)}`,
        jobTitle: row.title,
        department: DEPT_LABELS[row.dept] || row.dept,
        photoUrl: ASSETS.avatar(`emp-${code}`),
        status: row.status,
        hireDate: daysAgo(row.days),
        createdAt: daysAgo(row.days),
      },
    });

    employees.push(employee);

    if (i % 4 === 0) {
      await prisma.employeeDocument.create({
        data: {
          employeeId: employee.id,
          title: "Employment Contract",
          documentType: "CONTRACT",
          fileUrl: `https://placehold.co/600x800/e2e8f0/64748b?text=Contract+${code}`,
          mimeType: "application/pdf",
        },
      });
    }
  }

  console.log(`  ✓ ${employees.length} employees`);
  return employees;
}
