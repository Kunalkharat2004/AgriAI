import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { FaSeedling, FaMapMarkedAlt } from "react-icons/fa";
import { GiFlyingDagger } from "react-icons/gi";
import SideBar from "../../components/common/Sidebar";
import CropDisease from "./SideNavs/CropDisease";
import PestGeoSpatial from "./SideNavs/PestGeoSpatial";
import PestOutbreak from "./SideNavs/PestOutbreak";

const DiseasePage = () => {
  // State to track the currently selected component
  const [activeComponent, setActiveComponent] = useState("CropDisease");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("CropDisease");

  // Function to render the component based on the selected item
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "CropDisease":
        return <CropDisease />;
      case "PestGeoSpatial":
        return <PestGeoSpatial />;
      case "PestOutbreak":
        return <PestOutbreak />;
      default:
        return <CropDisease />;
    }
  };

  // Define menu items for the sidebar
  const menuItems = [
    {
      id: "CropDisease",
      label: "Crop Disease Detector",
      icon: (
        <FaSeedling className="h-5 w-5 text-green-600 dark:text-green-400" />
      ),
    },
    {
      id: "PestOutbreak",
      label: "Pest Outbreak",
      icon: (
        <GiFlyingDagger className="h-5 w-5 text-red-600 dark:text-red-400" />
      ),
    },
    {
      id: "PestGeoSpatial",
      label: "Pest GeoSpatial Analysis",
      icon: (
        <FaMapMarkedAlt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      ),
    },
  ];

  return (
    <div className="flex">
      <SideBar
        setActiveComponent={setActiveComponent}
        sidebarOpen={sidebarOpen}
        setActiveItem={setActiveItem}
        activeItem={activeItem}
        sidebarTitle="Plant Disease Analysis"
        menuItems={menuItems}
      />
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "w-[calc(100%-20rem)]" : "w-full"
        }`}
      >
        <button
          className={`absolute ${
            sidebarOpen ? "top-24 left-60" : "top-20 left-2"
          }  z-10 p-2 bg-blue-500 text-white rounded-full focus:outline-none`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <IoIosArrowForward className="h-6 w-6" />
          )}
        </button>
        <div className="max-h-[calc(100vh-2rem)] overflow-auto">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default DiseasePage;
