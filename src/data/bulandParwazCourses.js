import { stockImages } from "../data/stockImages";

export const courses = [
  {
    id: "frontend-development-bootcamp",
    title: "Frontend Development Bootcamp (Latest)",
    image: stockImages.frontendCourse,
    shortDescription:
      "Master modern frontend development from HTML to React in an intensive, project-driven bootcamp.",
    fullDescription:
      "Our flagship Frontend Development Bootcamp is a comprehensive, instructor-led program designed to take you from foundational web concepts to job-ready frontend development. Over 12 weeks, you'll work through structured modules covering HTML, CSS, JavaScript, and React — building real projects at every stage. Each week combines live sessions, guided labs, code reviews, and portfolio assignments so you graduate with demonstrable skills employers expect.",
    status: "closed",
    duration: "12 weeks",
    level: "Beginner to Intermediate",
    format: "Live sessions, hands-on labs, weekly projects",
    schedule: "3 sessions per week (evenings)",
    prerequisites: [
      "Basic computer literacy",
      "Willingness to commit 15–20 hours per week",
      "No prior coding experience required",
    ],
    outcomes: [
      "Build responsive, accessible web interfaces from scratch",
      "Write clean, modern JavaScript (ES6+)",
      "Develop interactive applications with React.js",
      "Integrate REST APIs and handle async data flows",
      "Deploy a capstone project to production",
      "Prepare a professional frontend portfolio",
    ],
    modules: [
      {
        title: "Web Foundations & HTML5",
        topics: [
          "How the web works (HTTP, browsers, DNS)",
          "Semantic HTML5 structure and best practices",
          "Forms, inputs, and validation basics",
          "SEO-friendly markup and meta tags",
          "Accessibility fundamentals (WCAG intro)",
        ],
      },
      {
        title: "CSS3 & Responsive Layout",
        topics: [
          "Selectors, specificity, and the box model",
          "Flexbox and CSS Grid for modern layouts",
          "Typography, color systems, and spacing scales",
          "Mobile-first responsive design",
          "CSS transitions and basic animations",
          "Tailwind CSS / utility-first workflow intro",
        ],
      },
      {
        title: "JavaScript ES6+ Core",
        topics: [
          "Variables, data types, and operators",
          "Functions, arrow functions, and scope",
          "Arrays, objects, and destructuring",
          "DOM manipulation and event handling",
          "Fetch API, promises, and async/await",
          "Error handling and debugging techniques",
        ],
      },
      {
        title: "React.js Fundamentals",
        topics: [
          "Component architecture and JSX",
          "Props, state, and one-way data flow",
          "Hooks: useState, useEffect, useRef",
          "Conditional rendering and list rendering",
          "Forms and controlled components",
          "Component composition patterns",
        ],
      },
      {
        title: "Advanced React & State",
        topics: [
          "Context API and custom hooks",
          "React Router for SPA navigation",
          "Performance optimization basics",
          "Third-party UI libraries overview",
          "Environment variables and project structure",
        ],
      },
      {
        title: "API Integration & Capstone",
        topics: [
          "REST API consumption and JSON handling",
          "Loading, error, and empty states in UI",
          "Authentication concepts (JWT overview)",
          "Capstone project planning and build",
          "Code review, deployment, and portfolio prep",
          "Interview prep and career guidance session",
        ],
      },
    ],
    isLatest: true,
  },
  {
    id: "react-js-crash-course",
    title: "React.js Crash Course",
    image: stockImages.reactCourse,
    shortDescription:
      "Fast-track your React skills with hands-on components, hooks, and real-world patterns.",
    fullDescription:
      "A focused 4-week program for developers who already know JavaScript and want to quickly become productive with React. You'll move from first component to a deployed mini-application, learning the patterns used in professional teams. Every session is project-based — you'll build, refactor, and ship code rather than watch passive lectures.",
    status: "closed",
    duration: "4 weeks",
    level: "Intermediate",
    format: "Live workshops + coding sprints",
    schedule: "2 sessions per week",
    prerequisites: [
      "Solid JavaScript fundamentals (ES6+)",
      "Basic HTML/CSS knowledge",
      "Familiarity with npm and the command line",
    ],
    outcomes: [
      "Architect reusable React component trees",
      "Manage state with hooks and context effectively",
      "Implement client-side routing",
      "Connect React apps to backend APIs",
      "Build, test, and deploy a React application",
    ],
    modules: [
      {
        title: "React Essentials",
        topics: [
          "Create React App / Vite setup",
          "JSX syntax and rendering logic",
          "Functional components vs. class overview",
          "Props drilling and component contracts",
          "Styling strategies in React projects",
        ],
      },
      {
        title: "State & Hooks Deep Dive",
        topics: [
          "useState and state update patterns",
          "useEffect lifecycle and dependencies",
          "useRef for DOM and mutable values",
          "Custom hooks for reusable logic",
          "Context API for global state",
        ],
      },
      {
        title: "Routing & Data Fetching",
        topics: [
          "React Router v6 setup and nested routes",
          "URL params and programmatic navigation",
          "Fetching data with fetch / axios",
          "Handling loading and error UI states",
          "Protected routes concept",
        ],
      },
      {
        title: "Build & Deploy Mini-Project",
        topics: [
          "Project structure and folder conventions",
          "Form handling and validation patterns",
          "Environment configuration",
          "Production build optimization basics",
          "Deploy to Vercel / Netlify",
          "Final code review and Q&A",
        ],
      },
    ],
  },
  {
    id: "javascript-fundamentals-workshop",
    title: "JavaScript Fundamentals Workshop",
    image: stockImages.javascriptCourse,
    shortDescription:
      "Build a solid JavaScript foundation with practical exercises and coding challenges.",
    fullDescription:
      "Perfect for beginners and career switchers, this 2-week workshop covers core JavaScript through daily interactive labs and coding challenges. You'll learn to think programmatically, debug confidently, and write code that scales — the essential base before any framework or backend work.",
    status: "closed",
    duration: "2 weeks",
    level: "Beginner",
    format: "Workshop sessions + daily exercises",
    schedule: "4 sessions per week",
    prerequisites: [
      "No prior programming experience required",
      "Basic familiarity with using a web browser",
    ],
    outcomes: [
      "Understand JavaScript syntax and core concepts",
      "Manipulate the DOM to create interactive pages",
      "Solve problems using functions, loops, and arrays",
      "Read and debug JavaScript code independently",
      "Complete a small interactive browser project",
    ],
    modules: [
      {
        title: "JavaScript Basics",
        topics: [
          "Running JavaScript in the browser and console",
          "Variables (let, const) and data types",
          "Operators, comparisons, and type coercion",
          "Conditional statements (if/else, switch)",
          "Truthy/falsy values and short-circuit logic",
        ],
      },
      {
        title: "Functions & Scope",
        topics: [
          "Function declarations vs. expressions",
          "Parameters, return values, and default args",
          "Scope, block scope, and hoisting",
          "Arrow functions and `this` basics",
          "Callbacks and higher-order functions intro",
        ],
      },
      {
        title: "Data Structures & Loops",
        topics: [
          "Arrays: methods (map, filter, reduce intro)",
          "Objects and object destructuring",
          "for, while, and for...of loops",
          "Working with JSON data",
          "Spread and rest operators",
        ],
      },
      {
        title: "DOM & Events",
        topics: [
          "Selecting and modifying DOM elements",
          "Creating and removing elements dynamically",
          "Event listeners and event objects",
          "Event delegation pattern",
          "Building a todo list / calculator mini-project",
        ],
      },
      {
        title: "Async JavaScript Intro",
        topics: [
          "Synchronous vs. asynchronous code",
          "setTimeout and setInterval",
          "Promises and .then() chains",
          "async/await syntax",
          "Fetching data from a public API",
        ],
      },
    ],
  },
  {
    id: "soft-skills-mastery",
    title: "Soft Skills Mastery",
    image: stockImages.softSkillsCourse,
    shortDescription:
      "Develop communication, leadership, and professional skills essential for tech career success.",
    fullDescription:
      "Technical skills alone aren't enough to thrive in today's workplace. The Soft Skills Mastery program equips you with the interpersonal, communication, and leadership abilities that differentiate top performers. Through role-plays, group discussions, and real-world scenarios, you'll build confidence in presentations, teamwork, conflict resolution, and professional etiquette — skills that accelerate career growth in any industry.",
    status: "closed",
    duration: "3 weeks",
    level: "All levels",
    format: "Interactive workshops + group activities",
    schedule: "2 sessions per week",
    prerequisites: [
      "Open to students, professionals, and career switchers",
      "No technical background required",
      "Willingness to participate actively in group exercises",
    ],
    outcomes: [
      "Communicate ideas clearly in meetings and presentations",
      "Collaborate effectively in diverse teams",
      "Handle workplace conflict with professionalism",
      "Build a strong personal brand on LinkedIn",
      "Navigate interviews and networking with confidence",
      "Develop time management and productivity habits",
    ],
    modules: [
      {
        title: "Professional Communication",
        topics: [
          "Verbal and non-verbal communication basics",
          "Active listening and empathy in conversations",
          "Writing professional emails and messages",
          "Structuring clear, concise presentations",
          "Public speaking confidence techniques",
          "Cross-cultural communication awareness",
        ],
      },
      {
        title: "Teamwork & Collaboration",
        topics: [
          "Roles in effective teams (Belbin overview)",
          "Giving and receiving constructive feedback",
          "Collaboration tools and async communication",
          "Brainstorming and ideation frameworks",
          "Managing group projects and deadlines",
          "Building trust in remote/hybrid teams",
        ],
      },
      {
        title: "Leadership & Problem Solving",
        topics: [
          "Leadership styles and situational leadership",
          "Decision-making frameworks",
          "Critical thinking and root cause analysis",
          "Creative problem solving (design thinking intro)",
          "Taking initiative and ownership",
          "Mentoring and supporting peers",
        ],
      },
      {
        title: "Career & Personal Growth",
        topics: [
          "Personal branding and LinkedIn optimization",
          "Networking strategies for introverts and extroverts",
          "Interview communication and STAR method",
          "Negotiation basics (salary, scope, timelines)",
          "Emotional intelligence (EQ) in the workplace",
          "Time management, prioritization, and burnout prevention",
        ],
      },
      {
        title: "Workplace Etiquette & Conflict",
        topics: [
          "Professional etiquette in office and remote settings",
          "Handling difficult conversations",
          "Conflict resolution strategies",
          "Managing stress and maintaining composure",
          "Ethics, integrity, and workplace boundaries",
          "Capstone: personal development action plan",
        ],
      },
    ],
  },
];

export const getCourseById = (id) => courses.find((course) => course.id === id);

export const isEnrollmentOpen = (status) =>
  status === "upcoming" || status === "live";

export const statusLabels = {
  upcoming: "Upcoming",
  live: "Live",
  completed: "Completed",
  closed: "Closed",
};

export const statusBadgeVariant = {
  upcoming: "warning",
  live: "success",
  completed: "secondary",
  closed: "secondary",
};
