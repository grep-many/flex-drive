import { deleteSVG, downloadSVG, editSVG, infoSVG, shareSVG } from "@/assets";

const actionsDropdownItems = [
  {
    label: "Rename",
    icon: editSVG,
    value: "rename",
  },
  {
    label: "Details",
    icon: infoSVG,
    value: "details",
  },
  {
    label: "Share",
    icon: shareSVG,
    value: "share",
  },
  {
    label: "Download",
    icon: downloadSVG,
    value: "download",
  },
  {
    label: "Delete",
    icon: deleteSVG,
    value: "delete",
  },
];

export default actionsDropdownItems;
