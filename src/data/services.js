import { stockImages } from "./stockImages";

export const serviceCategories = [
  { id: "all", name: "All Services" },
  { id: "development", name: "Development" },
  { id: "design", name: "Design" },
  { id: "ai", name: "AI & ML" },
  { id: "gaming", name: "Gaming" },
  { id: "data", name: "Data" },
  { id: "cloud", name: "Cloud & DevOps" },
  { id: "security", name: "Security" },
  { id: "testing", name: "Testing & QA" },
];

export const categoryLabels = {
  development: "Development",
  design: "Design",
  ai: "AI & ML",
  gaming: "Gaming",
  data: "Data",
  cloud: "Cloud",
  security: "Security",
  testing: "Testing",
};

const defaultProcess = [
  {
    step: 1,
    icon: "search",
    title: "Discovery & Scope Definition",
    description:
      "We run structured workshops with your stakeholders to capture business goals, user journeys, integrations, and compliance needs — establishing a shared definition of success before development begins.",
    deliverables: [
      "Signed scope & requirements document",
      "Technical feasibility assessment",
      "Milestone roadmap & project plan",
    ],
  },
  {
    step: 2,
    icon: "layers",
    title: "Solution Design & Architecture",
    description:
      "Our architects produce system designs, data models, and UX flows aligned to your stack and scale requirements — reviewed and approved by your team before any build work starts.",
    deliverables: [
      "Architecture diagram & tech stack plan",
      "Wireframes or UI prototypes",
      "Security & scalability review",
    ],
  },
  {
    step: 3,
    icon: "code",
    title: "Agile Build & Quality Assurance",
    description:
      "Development proceeds in agile sprints with demo sessions, code reviews, and automated testing at every stage — giving you full visibility into progress and quality.",
    deliverables: [
      "Sprint demos & release notes",
      "Automated test coverage reports",
      "Staging environment for review",
    ],
  },
  {
    step: 4,
    icon: "shield",
    title: "Security Review & UAT",
    description:
      "Before go-live, we conduct security hardening, performance testing, and a formal user acceptance cycle — ensuring the solution meets your standards and sign-off criteria.",
    deliverables: [
      "UAT checklist & sign-off document",
      "Performance & load test results",
      "Deployment runbook",
    ],
  },
  {
    step: 5,
    icon: "rocket",
    title: "Launch & Ongoing Partnership",
    description:
      "We manage production deployment, monitoring setup, and team handover — then remain available for maintenance, enhancements, and SLA-backed support as your needs evolve.",
    deliverables: [
      "Production deployment & monitoring",
      "Documentation & knowledge transfer",
      "Support & maintenance agreement",
    ],
  },
];

const defaultTestimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart",
    content:
      "Axiolink Systems (Pvt) Ltd. delivered beyond our expectations — professional, responsive, and technically excellent.",
    rating: 5,
    avatar: stockImages.professionalWoman,
  },
  {
    name: "Michael Chen",
    role: "CTO, InnovateCorp",
    content:
      "Their team understood our vision quickly and shipped a polished product on schedule.",
    rating: 5,
    avatar: stockImages.professionalMan,
  },
];

export const services = [
  {
    id: 1,
    slug: "mobile-development",
    title: "Mobile Development",
    description:
      "Native and cross-platform mobile applications for iOS and Android with high performance and scalability.",
    category: "development",
    features: [
      "Native iOS & Android development",
      "React Native & Flutter apps",
      "App Store deployment & ASO",
      "Push notifications & analytics",
      "Offline-first architecture",
      "Performance optimization",
    ],
    featureTags: ["iOS & Android", "React Native", "Flutter", "Native Apps"],
    image: stockImages.mobileDevelopment,
    isLatest: false,
    benefits: [
      {
        title: "Faster Time to Market",
        description: "Ship to both app stores with a proven cross-platform workflow.",
        icon: "rocket",
      },
      {
        title: "Premium User Experience",
        description: "Polished interfaces built for performance and retention.",
        icon: "smartphone",
      },
      {
        title: "Scalable Architecture",
        description: "Codebases designed to grow with your user base.",
        icon: "trending",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 2,
    slug: "web-development",
    title: "Web Development",
    description:
      "Modern web apps, dashboards, e-commerce platforms, and scalable full-stack systems.",
    category: "development",
    features: [
      "React, Next.js & Vue applications",
      "Node.js & REST/GraphQL APIs",
      "E-commerce & admin dashboards",
      "SEO-optimized SSR/SSG",
      "Authentication & payments",
      "Cloud deployment & CI/CD",
    ],
    featureTags: ["React", "Next.js", "Node.js", "Full-Stack"],
    image: stockImages.webDevelopment,
    isLatest: false,
    benefits: [
      {
        title: "Modern Tech Stack",
        description: "Built with industry-leading frameworks and best practices.",
        icon: "rocket",
      },
      {
        title: "Performance First",
        description: "Fast load times, Core Web Vitals, and responsive layouts.",
        icon: "trending",
      },
      {
        title: "Secure by Design",
        description: "Auth, validation, and security baked in from day one.",
        icon: "shield",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 3,
    slug: "ui-ux-design",
    title: "UI/UX Design",
    description:
      "Human-centered design systems focused on usability, conversion, and brand consistency.",
    category: "design",
    features: [
      "User research & persona development",
      "Wireframes & interactive prototypes",
      "Design systems & component libraries",
      "Usability testing & iteration",
      "Mobile & web interface design",
      "Handoff to development teams",
    ],
    featureTags: ["Research", "Wireframing", "Prototyping", "Design Systems"],
    image: stockImages.uiUxDesign,
    isLatest: false,
    benefits: [
      {
        title: "User-Centered",
        description: "Designs grounded in research, not assumptions.",
        icon: "target",
      },
      {
        title: "Higher Conversion",
        description: "Interfaces optimized for clarity and action.",
        icon: "trending",
      },
      {
        title: "Consistent Brand",
        description: "Scalable design systems across all touchpoints.",
        icon: "award",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 4,
    slug: "graphic-design",
    title: "Graphic Design",
    description:
      "Creative visual solutions for branding, marketing, and digital campaigns.",
    category: "design",
    features: [
      "Brand identity & logo design",
      "Marketing collateral & social assets",
      "Pitch decks & presentation design",
      "Iconography & illustration",
      "Print & digital media kits",
      "Brand guideline documentation",
    ],
    featureTags: ["Brand Identity", "Marketing", "Digital Graphics", "Logos"],
    image: stockImages.graphicDesign,
    isLatest: false,
    benefits: [
      {
        title: "Memorable Branding",
        description: "Visual identities that stand out in competitive markets.",
        icon: "award",
      },
      {
        title: "Campaign-Ready Assets",
        description: "Deliverables formatted for every channel you need.",
        icon: "rocket",
      },
      {
        title: "Cohesive Visual Language",
        description: "Consistent look and feel across all materials.",
        icon: "target",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 5,
    slug: "generative-ai-solutions",
    title: "Generative AI Solutions",
    description:
      "Custom LLM integrations, AI content pipelines, and intelligent automation for modern businesses.",
    category: "ai",
    features: [
      "GPT & Claude API integration",
      "RAG & knowledge-base systems",
      "AI content generation workflows",
      "Document analysis & summarization",
      "Custom fine-tuning strategies",
      "Enterprise AI governance",
    ],
    featureTags: ["LLM Integration", "RAG", "Automation", "GenAI"],
    image: stockImages.generativeAi,
    isLatest: true,
    benefits: [
      {
        title: "Cutting-Edge AI",
        description: "Leverage the latest generative models for real business value.",
        icon: "rocket",
      },
      {
        title: "Secure & Compliant",
        description: "Private deployments and data handling best practices.",
        icon: "shield",
      },
      {
        title: "Workflow Automation",
        description: "Reduce manual work with intelligent AI pipelines.",
        icon: "trending",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 6,
    slug: "ai-machine-learning",
    title: "AI & Machine Learning",
    description:
      "Custom ML models, prediction systems, and intelligent automation tailored to your data.",
    category: "ai",
    features: [
      "Predictive analytics models",
      "Computer vision & NLP",
      "Recommendation engines",
      "Model training & evaluation",
      "MLOps & model deployment",
      "Real-time inference pipelines",
    ],
    featureTags: ["ML Models", "NLP", "Computer Vision", "MLOps"],
    image: stockImages.aiAnalytics,
    isLatest: true,
    benefits: [
      {
        title: "Data-Driven Decisions",
        description: "Turn raw data into actionable intelligence.",
        icon: "trending",
      },
      {
        title: "Custom Models",
        description: "Solutions trained on your domain-specific data.",
        icon: "target",
      },
      {
        title: "Production Ready",
        description: "Deployed models with monitoring and retraining plans.",
        icon: "rocket",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 7,
    slug: "ai-chatbots",
    title: "AI Chatbot Development",
    description:
      "Intelligent chatbots for websites, apps, and customer support automation.",
    category: "ai",
    features: [
      "GPT-powered conversational agents",
      "Multi-channel deployment (web, WhatsApp)",
      "CRM & helpdesk integrations",
      "Intent recognition & fallback flows",
      "Analytics & conversation logging",
      "24/7 automated support",
    ],
    featureTags: ["GPT Bots", "Support Automation", "NLP", "Integrations"],
    image: stockImages.aiChatbot,
    isLatest: true,
    benefits: [
      {
        title: "24/7 Support",
        description: "Instant responses that scale without extra headcount.",
        icon: "rocket",
      },
      {
        title: "Higher Satisfaction",
        description: "Fast, accurate answers improve customer experience.",
        icon: "target",
      },
      {
        title: "Easy Integration",
        description: "Plugs into your existing site, app, or CRM.",
        icon: "smartphone",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 8,
    slug: "ai-agents",
    title: "AI Agent Development",
    description:
      "Autonomous AI agents that plan, execute tasks, and integrate with your tools and APIs.",
    category: "ai",
    features: [
      "Multi-step autonomous agents",
      "Tool & API orchestration",
      "Workflow automation agents",
      "Memory & context management",
      "Human-in-the-loop controls",
      "Custom agent frameworks",
    ],
    featureTags: ["AI Agents", "Automation", "API Tools", "Workflows"],
    image: stockImages.aiAgents,
    isLatest: true,
    benefits: [
      {
        title: "Autonomous Execution",
        description: "Agents that handle complex multi-step tasks end-to-end.",
        icon: "rocket",
      },
      {
        title: "Tool Integration",
        description: "Connect to your CRM, databases, and internal APIs.",
        icon: "smartphone",
      },
      {
        title: "Enterprise Control",
        description: "Guardrails, logging, and approval flows built in.",
        icon: "shield",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 9,
    slug: "game-development",
    title: "Game Development",
    description:
      "Full-cycle game development with Unity and Unreal — from concept to launch on PC, console, and web.",
    category: "gaming",
    features: [
      "Unity & Unreal Engine development",
      "2D & 3D game mechanics",
      "Character design & animation integration",
      "Level design & world building",
      "Physics & gameplay systems",
      "Steam, Epic & platform publishing",
    ],
    featureTags: ["Unity", "Unreal", "2D/3D", "PC & Console"],
    image: stockImages.gameDevelopment,
    isLatest: true,
    benefits: [
      {
        title: "Engaging Gameplay",
        description: "Mechanics and loops designed to keep players coming back.",
        icon: "rocket",
      },
      {
        title: "Cross-Platform",
        description: "Ship to PC, mobile, console, or web from one codebase.",
        icon: "smartphone",
      },
      {
        title: "Polished Experience",
        description: "Performance optimization and QA for smooth gameplay.",
        icon: "award",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 10,
    slug: "mobile-game-development",
    title: "Mobile Game Development",
    description:
      "Hyper-casual to mid-core mobile games for iOS and Android with monetization and live ops.",
    category: "gaming",
    features: [
      "iOS & Android game builds",
      "In-app purchases & ad monetization",
      "Leaderboards & achievements",
      "Push notifications & retention loops",
      "Analytics & A/B testing",
      "App Store & Play Store optimization",
    ],
    featureTags: ["iOS & Android", "Monetization", "Live Ops", "Analytics"],
    image: stockImages.mobileGameDev,
    isLatest: true,
    benefits: [
      {
        title: "Monetization Ready",
        description: "IAP, ads, and subscription models integrated from launch.",
        icon: "trending",
      },
      {
        title: "Retention Focused",
        description: "Daily rewards, events, and push strategies built in.",
        icon: "target",
      },
      {
        title: "Store Optimized",
        description: "ASO and store listing assets for maximum visibility.",
        icon: "rocket",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 11,
    slug: "gaming-backend-multiplayer",
    title: "Gaming Backend & Multiplayer",
    description:
      "Scalable multiplayer infrastructure, matchmaking, leaderboards, and real-time game servers.",
    category: "gaming",
    features: [
      "Real-time multiplayer networking",
      "Matchmaking & lobby systems",
      "Leaderboards & player profiles",
      "Anti-cheat & fair play systems",
      "Cloud game server hosting",
      "Cross-platform account sync",
    ],
    featureTags: ["Multiplayer", "Matchmaking", "Cloud Servers", "Leaderboards"],
    image: stockImages.gamingMultiplayer,
    isLatest: false,
    benefits: [
      {
        title: "Low Latency",
        description: "Optimized networking for smooth competitive play.",
        icon: "rocket",
      },
      {
        title: "Scalable Infrastructure",
        description: "Handle thousands of concurrent players effortlessly.",
        icon: "trending",
      },
      {
        title: "Fair & Secure",
        description: "Anti-cheat and validation to protect your community.",
        icon: "shield",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 12,
    slug: "ar-vr-gaming",
    title: "AR/VR Gaming Experiences",
    description:
      "Immersive augmented and virtual reality games and interactive experiences for headsets and mobile AR.",
    category: "gaming",
    features: [
      "VR experiences for Quest & PC VR",
      "Mobile AR games & filters",
      "3D spatial interaction design",
      "Motion tracking & hand controllers",
      "Immersive audio integration",
      "Location-based AR experiences",
    ],
    featureTags: ["VR", "AR", "Immersive", "Spatial"],
    image: stockImages.arVrGaming,
    isLatest: true,
    benefits: [
      {
        title: "Immersive Worlds",
        description: "Experiences that transport players into new realities.",
        icon: "rocket",
      },
      {
        title: "Cross-Device AR",
        description: "Reach users on headsets, phones, and tablets.",
        icon: "smartphone",
      },
      {
        title: "Future-Ready",
        description: "Built for the growing XR and metaverse ecosystem.",
        icon: "trending",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 13,
    slug: "data-science",
    title: "Data Science & Analytics",
    description:
      "Turn raw data into insights with dashboards, analytics, and predictive models.",
    category: "data",
    features: [
      "Business intelligence dashboards",
      "Predictive modeling & forecasting",
      "ETL pipelines & data warehousing",
      "KPI tracking & reporting",
      "A/B test analysis",
      "Custom data visualizations",
    ],
    featureTags: ["Analytics", "Dashboards", "Predictive Models", "BI"],
    image: stockImages.dataScience,
    isLatest: false,
    benefits: [
      {
        title: "Actionable Insights",
        description: "Dashboards that drive decisions, not just display data.",
        icon: "trending",
      },
      {
        title: "Predictive Power",
        description: "Forecast trends before they happen.",
        icon: "target",
      },
      {
        title: "Unified Data",
        description: "Single source of truth across your organization.",
        icon: "award",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 14,
    slug: "saas-development",
    title: "SaaS Development",
    description:
      "Scalable SaaS platforms with subscription billing, multi-tenancy, and cloud-native architecture.",
    category: "development",
    features: [
      "Multi-tenant architecture",
      "Subscription & billing integration",
      "Role-based access control",
      "API-first design",
      "Usage metering & analytics",
      "White-label options",
    ],
    featureTags: ["Cloud Architecture", "APIs", "Subscriptions", "Multi-Tenant"],
    image: stockImages.saasDevelopment,
    isLatest: false,
    benefits: [
      {
        title: "Recurring Revenue",
        description: "Subscription models built for predictable growth.",
        icon: "trending",
      },
      {
        title: "Enterprise Scale",
        description: "Architecture that handles growth without rewrites.",
        icon: "rocket",
      },
      {
        title: "Secure Tenancy",
        description: "Isolated data and permissions per customer.",
        icon: "shield",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 15,
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    description:
      "Deployment, scaling, CI/CD pipelines, and cloud infrastructure management.",
    category: "cloud",
    features: [
      "AWS, Azure & GCP deployment",
      "Docker & Kubernetes orchestration",
      "CI/CD pipeline setup",
      "Infrastructure as Code (Terraform)",
      "Monitoring & alerting",
      "Cost optimization",
    ],
    featureTags: ["AWS", "Docker", "CI/CD", "Kubernetes"],
    image: stockImages.devOps,
    isLatest: false,
    benefits: [
      {
        title: "Faster Releases",
        description: "Automated pipelines ship code safely and quickly.",
        icon: "rocket",
      },
      {
        title: "High Availability",
        description: "Resilient infrastructure with failover and scaling.",
        icon: "shield",
      },
      {
        title: "Cost Efficient",
        description: "Right-sized resources and ongoing optimization.",
        icon: "trending",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 16,
    slug: "cybersecurity",
    title: "Cybersecurity Solutions",
    description:
      "Protect your applications and infrastructure with audits, penetration testing, and security hardening.",
    category: "security",
    features: [
      "Security audits & assessments",
      "Penetration testing",
      "OWASP compliance reviews",
      "Zero-trust architecture design",
      "Incident response planning",
      "Security training for teams",
    ],
    featureTags: ["Audits", "Pen Testing", "Compliance", "Zero Trust"],
    image: stockImages.cybersecurity,
    isLatest: true,
    benefits: [
      {
        title: "Threat Protection",
        description: "Identify and fix vulnerabilities before attackers do.",
        icon: "shield",
      },
      {
        title: "Compliance Ready",
        description: "Meet industry standards and regulatory requirements.",
        icon: "award",
      },
      {
        title: "Peace of Mind",
        description: "Continuous monitoring and incident response plans.",
        icon: "target",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 17,
    slug: "blockchain-web3",
    title: "Blockchain & Web3",
    description:
      "Smart contracts, dApps, NFT platforms, and decentralized application development.",
    category: "development",
    features: [
      "Smart contract development (Solidity)",
      "dApp frontend & wallet integration",
      "NFT marketplace development",
      "Token economics design",
      "Web3 authentication (WalletConnect)",
      "Blockchain audit preparation",
    ],
    featureTags: ["Smart Contracts", "dApps", "NFTs", "Web3"],
    image: stockImages.blockchain,
    isLatest: true,
    benefits: [
      {
        title: "Decentralized Apps",
        description: "Build trustless applications on leading blockchains.",
        icon: "rocket",
      },
      {
        title: "Secure Contracts",
        description: "Audited, gas-optimized smart contract development.",
        icon: "shield",
      },
      {
        title: "Web3 UX",
        description: "Seamless wallet connections and onboarding flows.",
        icon: "smartphone",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 18,
    slug: "iot-smart-devices",
    title: "IoT & Smart Devices",
    description:
      "Connected device firmware, cloud backends, and mobile apps for IoT product ecosystems.",
    category: "development",
    features: [
      "Embedded firmware development",
      "MQTT & IoT cloud platforms",
      "Device provisioning & OTA updates",
      "Sensor data pipelines",
      "Mobile companion apps",
      "Edge computing integration",
    ],
    featureTags: ["Firmware", "MQTT", "Edge", "Companion Apps"],
    image: stockImages.iot,
    isLatest: true,
    benefits: [
      {
        title: "Connected Products",
        description: "End-to-end hardware-to-cloud solutions.",
        icon: "rocket",
      },
      {
        title: "Real-Time Data",
        description: "Live sensor streams and actionable dashboards.",
        icon: "trending",
      },
      {
        title: "Secure Devices",
        description: "Encrypted communication and secure OTA updates.",
        icon: "shield",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
  {
    id: 19,
    slug: "testing-qa",
    title: "Testing & QA",
    description:
      "End-to-end testing ensuring performance, security, and stability across web and mobile.",
    category: "testing",
    features: [
      "Automated test suites (Cypress, Playwright)",
      "Performance & load testing",
      "Security vulnerability scanning",
      "Manual exploratory testing",
      "Regression & smoke testing",
      "CI-integrated QA pipelines",
    ],
    featureTags: ["Automation", "Performance", "Security", "Manual QA"],
    image: stockImages.testingQa,
    isLatest: false,
    benefits: [
      {
        title: "Fewer Bugs",
        description: "Catch issues before they reach your users.",
        icon: "shield",
      },
      {
        title: "Faster Releases",
        description: "Automated tests enable confident continuous delivery.",
        icon: "rocket",
      },
      {
        title: "Quality Assurance",
        description: "Documented test coverage and release sign-off.",
        icon: "award",
      },
    ],
    process: defaultProcess,
    testimonials: defaultTestimonials,
  },
];

/** Most requested first — lower index = more common */
const popularityOrder = [
  "web-development",
  "mobile-development",
  "ui-ux-design",
  "saas-development",
  "ai-chatbots",
  "cloud-devops",
  "generative-ai-solutions",
  "testing-qa",
  "data-science",
  "graphic-design",
  "ai-machine-learning",
  "cybersecurity",
  "game-development",
  "mobile-game-development",
  "gaming-backend-multiplayer",
  "ai-agents",
  "blockchain-web3",
  "iot-smart-devices",
  "ar-vr-gaming",
];

export const getServiceBySlug = (slug) =>
  services.find((service) => service.slug === slug);

export const getServicesByPopularity = () =>
  [...services].sort(
    (a, b) =>
      popularityOrder.indexOf(a.slug) - popularityOrder.indexOf(b.slug)
  );

export const getLatestServices = () =>
  services.filter((service) => service.isLatest);

export const getHomeServices = () =>
  getServicesByPopularity().slice(0, 6);

export const toProductCard = (service) => ({
  id: service.id,
  title: service.title,
  description: service.description,
  features: service.featureTags,
  image: service.image,
  href: `/services/${service.slug}`,
  category: categoryLabels[service.category] || service.category,
});
