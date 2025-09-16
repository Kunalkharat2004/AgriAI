/* eslint-disable react/prop-types */
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";

export default function SideBar({
  setActiveComponent,
  sidebarOpen,
  activeItem,
  setActiveItem,
  sidebarTitle = "Sidebar",
  menuItems = [],
}) {
  return (
    <Card
      className={`h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 dark:bg-gray-800 dark:shadow-none transition-all duration-300 ${
        sidebarOpen ? "w-[20rem]" : "w-0 hidden transition-all overflow-hidden"
      }`}
    >
      <div className="mb-2 p-4">
        <Typography
          variant="h5"
          className="text-blue-gray-900 dark:text-gray-300"
        >
          {sidebarTitle}
        </Typography>
      </div>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
              activeItem === item.id ? "bg-blue-100 dark:bg-gray-700" : ""
            }`}
            onClick={() => {
              setActiveComponent(item.id);
              setActiveItem(item.id);
            }}
          >
            <ListItemPrefix>{item.icon}</ListItemPrefix>
            <span className="text-blue-gray-900 dark:text-gray-300">
              {item.label}
            </span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
