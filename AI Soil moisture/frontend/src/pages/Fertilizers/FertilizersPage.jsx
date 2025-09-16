import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { MdWaterDrop, MdOutlineSecurity } from "react-icons/md";
import { GiWateringCan, GiFarmer } from "react-icons/gi";
import { FaMapMarkedAlt } from "react-icons/fa";
import SideBar from "../../components/common/Sidebar";
import PumpStatus from "./SideNavs/PumpStatus";
import WaterRequirement from "./SideNavs/WaterRequirement";
import Fertilizer from "./SideNavs/Fertilizer";
import Weather from "./SideNavs/Fertilizer";
import Intrusion from "./SideNavs/Intrusion";
import GeoFencing from "../WeatherGeoFencing/SideNavs/GeoFencing";

const FarmMonitoring = () => {
  // State to track the currently selected component
  const [activeComponent, setActiveComponent] = useState("WaterRequirement");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("WaterRequirement");

  // Function to render the component based on the selected item
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "WaterRequirement":
        return <WaterRequirement />;
      case "PumpStatus":
        return <PumpStatus />;
      case "Weather":
        return <Weather />;
      case "Intrusion":
        return <Intrusion />;
      case "GeoFencing":
        return <GeoFencing />;
      default:
        return <WaterRequirement />;
    }
  };

  // Define menu items for the sidebar
  const menuItems = [
    {
      id: "WaterRequirement",
      label: "Water Requirement",
      icon: (
        <GiWateringCan className="h-6 w-6 text-green-600 dark:text-green-400" />
      ),
    },
    {
      id: "PumpStatus",
      label: "Pump Status",
      icon: (
        <MdWaterDrop className="h-6 w-6 text-blue-500 dark:text-blue-300" />
      ),
    },
    {
      id: "Weather",
      label: "Weather",
      icon: (
        <GiFarmer className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
      ),
    },
    {
      id: "Intrusion",
      label: "Intrusion",
      icon: (
        <MdOutlineSecurity className="h-6 w-6 text-red-600 dark:text-red-400" />
      ),
    },
    {
      id: "GeoFencing",
      label: "Geo Fencing",
      icon: (
        <FaMapMarkedAlt className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
        sidebarTitle="Farm Monitoring"
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

export default FarmMonitoring;
