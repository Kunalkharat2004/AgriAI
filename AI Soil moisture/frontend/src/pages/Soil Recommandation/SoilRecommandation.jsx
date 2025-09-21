import { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  MdWaterDrop,
  MdOutlineSecurity,
  MdAttachMoney,
} from "react-icons/md";
import { GiWateringCan, GiFarmer } from "react-icons/gi";
import { FaMapMarkedAlt } from "react-icons/fa";
import SideBar from "../../components/common/Sidebar";
import SoilReport from "./SideNavs/SoilReport";
import SoilReportByLocation from "./SideNavs/SoilReportByLocation";
import Fertilizer from "./SideNavs/Fertilizer";
import CropByNPK from "./SideNavs/CropByNPK";
import CropBySoli from "./SideNavs/CropBySoli";
import CropPricePrediction from "./SideNavs/CropPricePrediction";

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

  // Function to render the component based on the selected item
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "SoilReport":
        return <SoilReport />;
      case "SoilReportByLocation":
        return <SoilReportByLocation />;
      case "Fertilizer Recommendation":
        return <Fertilizer />;
      case "Crop Price Prediction":
        return <CropPricePrediction />;
      case "CropByNPK":
        return <CropByNPK />;
      case "CropSoil":
        return <CropBySoli />;
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
      id: "Fertilizer Recommendation",
      label: "Fertilizer",
      icon: <GiWateringCan className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />,
    },
    {
      id: "Crop Price Prediction",
      label: "Crop Price Prediction",
      icon: <MdAttachMoney className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />,
    },
    {
      id: "CropByNPK",
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
