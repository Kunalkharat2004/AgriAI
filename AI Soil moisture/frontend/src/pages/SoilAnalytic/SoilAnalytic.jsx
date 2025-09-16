import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { FaTractor } from "react-icons/fa";
import { GiReceiveMoney, GiBookshelf } from "react-icons/gi";
import SideBar from "../../components/common/Sidebar";
import UserSoilReport from "./SideNavs/UserSoilReport";
import Schemes from "./SideNavs/SoilReport";
import Education from "./SideNavs/Education";

const FinancialSupport = () => {
  // State to track the currently selected component
  const [activeComponent, setActiveComponent] = useState("Schemes");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Schemes");

  // Function to render the component based on the selected item
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Schemes":
        return <Schemes />;
      case "Loan":
        return <UserSoilReport />;
      case "Education":
        return <Education />;
      default:
        return <Schemes />;
    }
  };

  // Define menu items for the sidebar
  const menuItems = [
    {
      id: "Schemes",
      label: "Government Schemes",
      icon: (
        <FaTractor className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />
      ),
    },
    {
      id: "Loan",
      label: "Loans",
      icon: (
        <GiReceiveMoney className="h-5 w-5 text-green-600 dark:text-green-400" />
      ),
    },
    {
      id: "Education",
      label: "Farmer Education",
      icon: (
        <GiBookshelf className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
        sidebarTitle="Soil Analytics"
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

export default FinancialSupport;
