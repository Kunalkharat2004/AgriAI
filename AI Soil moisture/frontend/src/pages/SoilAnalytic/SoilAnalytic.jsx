import { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { FaTractor } from "react-icons/fa";
import { GiReceiveMoney, GiBookshelf } from "react-icons/gi";
import SideBar from "../../components/common/Sidebar";
import UserSoilReport from "./SideNavs/UserSoilReport";
import Schemes from "./SideNavs/SoilReport";
import Education from "./SideNavs/Education";

const FinancialSupport = () => {
  // State
  const [activeComponent, setActiveComponent] = useState("Schemes");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Schemes");
  const [isMobile, setIsMobile] = useState(false);

  // Responsive / auto-close logic (matches CropSwapping)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Render view
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

  const menuItems = [
    {
      id: "Schemes",
      label: "Government Schemes",
      icon: <FaTractor className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />,
    },
    {
      id: "Loan",
      label: "Loans",
      icon: <GiReceiveMoney className="h-5 w-5 text-green-600 dark:text-green-400" />,
    },
    {
      id: "Education",
      label: "Farmer Education",
      icon: <GiBookshelf className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    },
  ];

  const handleMenuItemClick = (componentId) => {
    setActiveComponent(componentId);
    setActiveItem(componentId);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="relative flex">
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {isMobile ? (
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
            sidebarTitle="Financial Support"
            menuItems={menuItems}
            isMobile={isMobile}
          />
        </div>
      ) : (
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
              sidebarTitle="Financial Support"
              menuItems={menuItems}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        className={`
          fixed top-24 z-40 p-2 bg-blue-500 text-white rounded-full
          focus:outline-none hover:bg-blue-600 transition-all duration-300 ease-in-out
          shadow-lg hover:shadow-xl transform hover:scale-105
          ${isMobile ? (sidebarOpen ? "left-[17rem]" : "left-4") : (sidebarOpen ? "left-[17rem]" : "left-4")}
        `}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <XMarkIcon className="h-6 w-6 transition-transform duration-200" />
        ) : (
          <IoIosArrowForward className="h-6 w-6 transition-transform duration-200" />
        )}
      </button>

      {/* Main content */}
      <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
        <div className="min-h-screen max-h-[calc(100vh-2rem)] overflow-auto">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default FinancialSupport;
