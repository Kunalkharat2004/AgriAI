import { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Sprout, TreePalm } from "lucide-react";
import SideBar from "../../components/common/Sidebar";
import CropRecommendationOne from "./SideNavs/CropRecommendationOne";
import CropRecommendationTwo from "./SideNavs/CropRecommendationTwo";

const CropRecommendationPage = () => {
  // State to track the currently selected component
  const [activeComponent, setActiveComponent] = useState("CropRecommendationOne");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("CropRecommendationOne");
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      // Auto-close sidebar on mobile
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
      case "CropRecommendationOne":
        return <CropRecommendationOne />;
      case "CropRecommendationTwo":
        return <CropRecommendationTwo />;
      default:
        return <CropRecommendationOne />;
    }
  };

  // Define menu items for the sidebar
  const menuItems = [
    {
      id: "CropRecommendationOne",
      label: "With NPK values",
      icon: (
        <Sprout className="h-5 w-5 text-blue-gray-900 dark:text-gray-300" />
      ),
    },
    {
      id: "CropRecommendationTwo",
      label: "With Soil Parameter",
      icon: (
        <TreePalm className="h-5 w-5 text-blue-gray-900 dark:text-gray-300" />
      ),
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
        <div className={`
          fixed left-0 top-0 h-full z-30
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          transition-transform duration-300 ease-in-out
        `}>
          <SideBar
            setActiveComponent={handleMenuItemClick}
            sidebarOpen={sidebarOpen}
            setActiveItem={setActiveItem}
            activeItem={activeItem}
            sidebarTitle="Crop Recommendation"
            menuItems={menuItems}
            isMobile={isMobile}
          />
        </div>
      ) : (
        // Desktop: Static sidebar that pushes content with smooth transition
        <div className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${sidebarOpen ? 'w-80' : 'w-0'}
        `}>
          <div className="w-80">
            <SideBar
              setActiveComponent={handleMenuItemClick}
              sidebarOpen={sidebarOpen}
              setActiveItem={setActiveItem}
              activeItem={activeItem}
              sidebarTitle="Crop Recommendation"
              menuItems={menuItems}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}

      {/* Toggle button - positioned relative to sidebar */}
      <button
        className={`
          fixed top-24 z-40 p-2 bg-blue-500 text-white rounded-full 
          focus:outline-none hover:bg-blue-600 transition-all duration-300 ease-in-out
          shadow-lg hover:shadow-xl transform hover:scale-105
          ${isMobile 
            ? (sidebarOpen ? 'left-[17rem]' : 'left-4')
            : (sidebarOpen ? 'left-[17rem]' : 'left-4')
          }
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
        {/* Content area */}
        <div className="min-h-screen overflow-auto">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default CropRecommendationPage;