import { dashboardSVG, documentsSVG, imagesSVG, othersSVG, videoSVG } from "@/assets";

const navItems = [
  {
    name: "Dashboard",
    icon: dashboardSVG,
    url: "/",
  },
  {
    name: "Documents",
    icon: documentsSVG,
    url: "/documents",
  },
  {
    name: "Images",
    icon: imagesSVG,
    url: "/images",
  },
  {
    name: "Media",
    icon: videoSVG,
    url: "/media",
  },
  {
    name: "Others",
    icon: othersSVG,
    url: "/others",
  },
];

export default navItems;
