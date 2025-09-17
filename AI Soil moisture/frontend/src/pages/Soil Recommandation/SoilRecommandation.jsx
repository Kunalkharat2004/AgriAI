import { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  MdWaterDrop,
  MdOutlineSecurity,
  MdAgriculture,
} from "react-icons/md";
import { GiWateringCan, GiFarmer } from "react-icons/gi";
import { FaMapMarkedAlt } from "react-icons/fa";
import SideBar from "../../components/common/Sidebar";

import Intrusion from "./SideNavs/Intrusion";
import GeoFencing from "../WeatherGeoFencing/SideNavs/GeoFencing";
import SoilReport from "./SideNavs/SoilReport";
import SoilReportByLocation from "./SideNavs/SoilReportByLocation";
import SoilAnalytic from "./SideNavs/Fertilizer";

const SoilRecommandation = () => {
  // State to track the currently selected component
  const [activeComponent, setActiveComponent] = useState("SoilReport");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("SoilReport");
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size (matches CropSwapping logic)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fallback placeholder components for views not provided
  const CropRecommandationComp = () => (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">Crop Recommendation</h2>
      <p className="text-sm text-muted-foreground">
        UI for "Crop by NPK" will render here.
      </p>
    </div>
  );

  const CropSoilComp = () => (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">Crop by Soil</h2>
      <p className="text-sm text-muted-foreground">
        UI for "Crop by Soil" will render here.
      </p>
    </div>
  );

  // Function to render the component based on the selected item
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "SoilReport":
        return <SoilReport />;
      case "SoilReportByLocation":
        return <SoilReportByLocation />;
      case "SoilAnalytic":
        return <SoilAnalytic />;
      case "CropRecommandation":
        return <CropRecommandationComp />;
      case "CropSoil":
        return <CropSoilComp />;
      default:
        return <SoilReport />;
    }
  };

  // Define menu items for the sidebar (icons styled like CropSwapping)
  const menuItems = [
    {
      id: "SoilReport",
      label: "User Soil Report",
      icon: <MdWaterDrop className="h-6 w-6 text-blue-500 dark:text-blue-300" />,
    },
    {
      id: "SoilReportByLocation",
      label: "Soil Report By Location",
      icon: <FaMapMarkedAlt className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      id: "SoilAnalytic",
      label: "Fertilizer",
      icon: <GiWateringCan className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />,
    },
    {
      id: "CropRecommandation",
      label: "Crop by NPK",
      icon: <GiFarmer className="h-6 w-6 text-green-600 dark:text-green-400" />,
    },
    {
      id: "CropSoil",
      label: "Crop by Soil",
      icon: <MdOutlineSecurity className="h-6 w-6 text-gray-600 dark:text-gray-300" />,
    },
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuItemClick = (componentId) => {
    setActiveComponent(componentId);
    setActiveItem(componentId);

    // Auto-close sidebar on mobile after selection
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="relative flex">
      {/* Overlay backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {isMobile ? (
        // Mobile: Fixed overlay sidebar
        <div
          className={`
            fixed left-0 top-0 h-full z-30
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            transition-transform duration-300 ease-in-out
          `}
        >
          <SideBar
            setActiveComponent={handleMenuItemClick}
            sidebarOpen={sidebarOpen}
            setActiveItem={setActiveItem}
            activeItem={activeItem}
            sidebarTitle="Soil & Fertilizer"
            menuItems={menuItems}
            isMobile={isMobile}
          />
        </div>
      ) : (
        // Desktop: Static sidebar that pushes content with smooth transition
        <div
          className={`
            transition-all duration-300 ease-in-out overflow-hidden
            ${sidebarOpen ? "w-80" : "w-0"}
          `}
        >
          <div className="w-80">
            <SideBar
              setActiveComponent={handleMenuItemClick}
              sidebarOpen={sidebarOpen}
              setActiveItem={setActiveItem}
              activeItem={activeItem}
              sidebarTitle="Soil & Fertilizer"
              menuItems={menuItems}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}

      {/* Toggle button - positioned relative to sidebar (same look as CropSwapping) */}
      <button
        className={`
          fixed top-24 z-40 p-2 bg-blue-500 text-white rounded-full
          focus:outline-none hover:bg-blue-600 transition-all duration-300 ease-in-out
          shadow-lg hover:shadow-xl transform hover:scale-105
          ${isMobile ? (sidebarOpen ? "left-[17rem]" : "left-4") : (sidebarOpen ? "left-[17rem]" : "left-4")}
        `}
        onClick={handleSidebarToggle}
      >
        {sidebarOpen ? (
          <XMarkIcon className="h-6 w-6 transition-transform duration-200" />
        ) : (
          <IoIosArrowForward className="h-6 w-6 transition-transform duration-200" />
        )}
      </button>

      {/* Main content */}
      <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
        <div className="min-h-screen overflow-auto">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default SoilRecommandation;
