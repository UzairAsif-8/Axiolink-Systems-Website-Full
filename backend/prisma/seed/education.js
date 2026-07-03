import {
  ASSETS,
  slugify,
  daysAgo,
  monthsAgo,
  dateInMonth,
  pick,
  PAKISTANI_NAMES,
} from "./helpers.js";

const COURSE_DEFINITIONS = [
  {
    title: "Web Development Bootcamp",
    category: "Development",
    duration: "12 weeks",
    level: "Beginner",
    price: 15000,
    instructor: 0,
  },
  {
    title: "Python Programming",
    category: "Development",
    duration: "8 weeks",
    level: "Beginner",
    price: 12000,
    instructor: 1,
  },
  {
    title: "Cybersecurity Fundamentals",
    category: "Security",
    duration: "10 weeks",
    level: "Intermediate",
    price: 18000,
    instructor: 2,
  },
  {
    title: "Freelancing Masterclass",
    category: "Career",
    duration: "6 weeks",
    level: "All Levels",
    price: 8000,
    instructor: 3,
  },
  {
    title: "AI Foundations",
    category: "AI & Data",
    duration: "10 weeks",
    level: "Intermediate",
    price: 20000,
    instructor: 4,
  },
  {
    title: "UI/UX Design",
    category: "Design",
    duration: "8 weeks",
    level: "Beginner",
    price: 14000,
    instructor: 5,
  },
  {
    title: "Graphic Design",
    category: "Design",
    duration: "6 weeks",
    level: "Beginner",
    price: 10000,
    instructor: 5,
  },
  {
    title: "Leadership & Communication",
    category: "Soft Skills",
    duration: "4 weeks",
    level: "All Levels",
    price: 9000,
    instructor: 3,
  },
  {
    title: "Digital Marketing",
    category: "Marketing",
    duration: "8 weeks",
    level: "Beginner",
    price: 11000,
    instructor: 6,
  },
  {
    title: "Career Development",
    category: "Career",
    duration: "5 weeks",
    level: "All Levels",
    price: 7500,
    instructor: 3,
  },
];

const INSTRUCTOR_DEFINITIONS = [
  { name: "Hamza Sheikh", bio: "Senior frontend engineer with 8+ years building enterprise React applications." },
  { name: "Dr. Nida Qureshi", bio: "AI researcher and educator specializing in practical machine learning for students." },
  { name: "Imran Siddiqui", bio: "Cybersecurity consultant and certified ethical hacker with industry training experience." },
  { name: "Ayesha Malik", bio: "Leadership coach helping professionals communicate and grow their careers." },
  { name: "Saad Iqbal", bio: "ML engineer teaching applied AI with real-world project workflows." },
  { name: "Hira Ahmed", bio: "Product designer mentoring students in UI/UX and design systems." },
  { name: "Waqas Butt", bio: "Digital marketing strategist with experience across B2B and education brands." },
];

const ENROLLMENT_MONTH_COUNTS = [10, 15, 20, 25, 28, 22];

export async function seedEducation(prisma) {
  console.log("\n🎓 Buland Parwaz — courses, students & certificates");

  const instructors = [];
  for (let i = 0; i < INSTRUCTOR_DEFINITIONS.length; i++) {
    const row = INSTRUCTOR_DEFINITIONS[i];
    const slug = slugify(row.name);
    const instructor = await prisma.instructor.create({
      data: {
        fullName: row.name,
        email: `${slug}@axiolinksystems.com`,
        bio: row.bio,
        photoUrl: ASSETS.avatar(`instructor-${i}`),
        linkedin: `https://linkedin.com/in/${slug}`,
        status: "PUBLISHED",
      },
    });
    instructors.push(instructor);
  }
  console.log(`  ✓ ${instructors.length} instructors`);

  const courses = [];
  for (let i = 0; i < COURSE_DEFINITIONS.length; i++) {
    const row = COURSE_DEFINITIONS[i];
    const slug = slugify(row.title);
    const isDraft = i === 9;

    const course = await prisma.course.create({
      data: {
        title: row.title,
        slug,
        description: `${row.title} is part of the Buland Parwaz program by Axiolink Systems (Pvt) Ltd. — a mentor-led course combining theory, hands-on labs, and career guidance for students across Pakistan.`,
        category: row.category,
        instructorId: instructors[row.instructor].id,
        duration: row.duration,
        level: row.level,
        price: row.price,
        discount: i % 4 === 0 ? 10 : null,
        thumbnailUrl: ASSETS.courseThumb(slug),
        bannerUrl: ASSETS.courseBanner(slug),
        learningOutcomes: [
          "Understand core concepts through guided projects",
          "Build portfolio-ready work with mentor feedback",
          "Receive a verifiable certificate upon completion",
        ],
        requirements: ["Basic computer literacy", "Commitment to weekly assignments"],
        curriculum: {
          modules: [
            { title: "Foundations", weeks: 2 },
            { title: "Applied Projects", weeks: 4 },
            { title: "Capstone & Career Prep", weeks: 2 },
          ],
        },
        certificateAvailable: true,
        enrollmentOpen: !isDraft,
        status: isDraft ? "DRAFT" : "PUBLISHED",
        seoTitle: `${row.title} | Buland Parwaz | Axiolink Systems (Pvt) Ltd.`,
        seoDescription: `Enroll in ${row.title} — Buland Parwaz training program by Axiolink Systems (Pvt) Ltd.`,
        createdAt: monthsAgo(5, 10 + i),
      },
    });
    courses.push(course);
  }
  console.log(`  ✓ ${courses.length} courses`);

  const students = [];
  const allNames = [...PAKISTANI_NAMES.male, ...PAKISTANI_NAMES.female];

  for (let i = 0; i < 120; i++) {
    const fullName = `${pick(allNames, i)} ${pick(["Khan", "Ali", "Ahmed", "Malik", "Hussain"], i)}`;
    const slug = slugify(fullName);
    const student = await prisma.student.create({
      data: {
        fullName,
        email: `${slug}${i}@student.axiolink.com`,
        phone: `+92 3${String(30 + (i % 60)).padStart(2, "0")} ${String(4000000 + i * 3571).slice(0, 7)}`,
        photoUrl: ASSETS.avatar(`student-${i}`),
        createdAt: monthsAgo(6 - (i % 6), (i % 28) + 1),
      },
    });
    students.push(student);
  }
  console.log(`  ✓ ${students.length} students`);

  const enrollments = [];
  const year = new Date().getFullYear();
  let studentIdx = 0;

  ENROLLMENT_MONTH_COUNTS.forEach((count, monthOffset) => {
    const month = new Date().getMonth() - (5 - monthOffset);
    const adjustedMonth = month < 0 ? month + 12 : month;
    const adjustedYear = month < 0 ? year - 1 : year;

    for (let i = 0; i < count && studentIdx < students.length; i++, studentIdx++) {
      const student = students[studentIdx];
      const course = courses[studentIdx % courses.length];
      const progress = 20 + ((studentIdx * 7) % 81);
      const attendance = Math.min(100, progress + 5 + (studentIdx % 10));

      enrollments.push(
        prisma.enrollment.create({
          data: {
            studentId: student.id,
            fullName: student.fullName,
            email: student.email,
            phone: student.phone,
            courseId: course.id,
            enrollmentDate: dateInMonth(adjustedYear, adjustedMonth, 3 + (i % 25), 10),
            paymentStatus: progress > 50 ? "PAID" : pick(["PAID", "PARTIAL", "PENDING"], studentIdx),
            attendance,
            progress,
            notes: progress >= 80 ? "Eligible for certificate" : "In progress",
            createdAt: dateInMonth(adjustedYear, adjustedMonth, 3 + (i % 25), 10),
          },
        })
      );
    }
  });

  const enrollmentRecords = await Promise.all(enrollments);
  console.log(`  ✓ ${enrollmentRecords.length} enrollments`);

  const certificates = [];
  const certEligible = enrollmentRecords
    .filter((e) => e.progress >= 75)
    .slice(0, 60);

  for (let i = 0; i < certEligible.length; i++) {
    const enrollment = certEligible[i];
    const course = courses.find((c) => c.id === enrollment.courseId);
    const code = `BP-2026-${String(1001 + i).padStart(4, "0")}`;

    const certificate = await prisma.certificate.create({
      data: {
        certificateCode: code,
        studentName: enrollment.fullName,
        courseName: course?.title || "Buland Parwaz Course",
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        enrollmentId: enrollment.id,
        issueDate: daysAgo(60 - i),
        verificationUrl: `/verify-certificate/${code}`,
        pdfUrl: `https://placehold.co/1200x850/1e3a8a/ffffff?text=Certificate+${code}`,
        isValid: i !== 59,
        createdAt: daysAgo(60 - i),
      },
    });
    certificates.push(certificate);
  }
  console.log(`  ✓ ${certificates.length} certificates`);

  return { instructors, courses, students, enrollmentRecords, certificates };
}
