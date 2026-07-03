import { motion } from "framer-motion";
import {
  SiReact,
  SiNodedotjs,
  SiPython,
  SiJavascript,
  SiFigma,
  SiDocker,
  SiGooglecloud,
  SiTensorflow,
  SiBlender,
} from "react-icons/si";
import {
  FaShieldAlt,
  FaChartBar,
  FaMobileAlt,
  FaPenFancy,
  FaSearch,
  FaBriefcase,
  FaUsers,
  FaDollarSign,
  FaVideo,
  FaCube,
  FaLightbulb,
  FaTasks,
  FaJava,
} from "react-icons/fa";
import { HiOutlineCodeBracket } from "react-icons/hi2";

export const internshipIconMap = {
  frontend: SiReact,
  backend: SiNodedotjs,
  fullstack: HiOutlineCodeBracket,
  ai: SiTensorflow,
  data: FaChartBar,
  security: FaShieldAlt,
  uiux: SiFigma,
  graphic: FaPenFancy,
  mobile: FaMobileAlt,
  cloud: SiGooglecloud,
  devops: SiDocker,
  qa: FaTasks,
  python: SiPython,
  java: FaJava,
  marketing: FaBriefcase,
  seo: FaSearch,
  writing: FaPenFancy,
  business: FaBriefcase,
  pm: FaTasks,
  hr: FaUsers,
  sales: FaDollarSign,
  finance: FaDollarSign,
  video: FaVideo,
  "3d": SiBlender,
  product: FaLightbulb,
  research: FaLightbulb,
};

export const floatingTechIcons = [
  SiReact,
  SiNodedotjs,
  SiPython,
  SiJavascript,
  SiFigma,
  SiDocker,
  SiGooglecloud,
  SiTensorflow,
];

export const getInternshipIcon = (iconKey) =>
  internshipIconMap[iconKey] || HiOutlineCodeBracket;
