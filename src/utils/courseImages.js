import { stockImages } from "../data/stockImages";

const CATEGORY_IMAGES = {
  frontend: stockImages.frontendCourse,
  react: stockImages.reactCourse,
  javascript: stockImages.javascriptCourse,
  web: stockImages.webDevelopment,
  design: stockImages.uiUxDesign,
  ui: stockImages.uiUxDesign,
  ai: stockImages.aiAnalytics,
  data: stockImages.dataScience,
  security: stockImages.cybersecurity,
  devops: stockImages.devOps,
  mobile: stockImages.mobileDevelopment,
  game: stockImages.gameDevelopment,
  soft: stockImages.softSkillsCourse,
};

/** Resolve the best display image for a course on the public site */
export function getCourseDisplayImage(course) {
  if (course?.image) return course.image;
  if (course?.thumbnailUrl) return course.thumbnailUrl;
  if (course?.bannerUrl) return course.bannerUrl;

  const haystack = `${course?.category || ""} ${course?.title || ""} ${course?.level || ""}`.toLowerCase();
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (haystack.includes(key)) return url;
  }

  return stockImages.trainingWorkshop;
}

export function hasCustomCourseImage(course) {
  return Boolean(course?.thumbnailUrl || course?.bannerUrl || course?.image);
}
