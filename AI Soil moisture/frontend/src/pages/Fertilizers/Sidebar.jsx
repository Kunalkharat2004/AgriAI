/* eslint-disable react/prop-types */
import {
	Card,
	Typography,
	List,
	ListItem,
	ListItemPrefix,
} from "@material-tailwind/react";
import { MdWaterDrop, MdOutlineSecurity } from "react-icons/md";
import { GiWateringCan, GiFertilizerBag, GiFarmer } from "react-icons/gi";
import { FaMapMarkedAlt } from "react-icons/fa";

export default function SideBar({
	setActiveComponent,
	sidebarOpen,
	activeItem,
	setActiveItem,
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
					Sidebar
				</Typography>
			</div>
			<List>
				<ListItem
					className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
						activeItem === "WaterRequirement" ? "bg-blue-100 dark:bg-gray-700" : ""
					}`}
					onClick={() => {
						setActiveComponent("WaterRequirement");
						setActiveItem("WaterRequirement");
					}}
				>
					<ListItemPrefix>
						<GiWateringCan className="h-6 w-6 text-green-600 dark:text-green-400" />
					</ListItemPrefix>
					<span className="text-blue-gray-900 dark:text-gray-300">
						Water Requirement
					</span>
				</ListItem>
				<ListItem
					className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
						activeItem === "PumpStatus"
							? "bg-blue-100 dark:bg-gray-700"
							: ""
					}`}
					onClick={() => {
						setActiveComponent("PumpStatus");
						setActiveItem("PumpStatus");
					}}
				>
					<ListItemPrefix>
						<MdWaterDrop className="h-6 w-6 text-blue-500 dark:text-blue-300" />
					</ListItemPrefix>
					<span className="text-blue-gray-900 dark:text-gray-300">
						Pump Status
					</span>
				</ListItem>

				<ListItem
					className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
						activeItem === "Weather" ? "bg-blue-100 dark:bg-gray-700" : ""
					}`}
					onClick={() => {
						setActiveComponent("Weather");
						setActiveItem("Weather");
					}}
				>
					<ListItemPrefix>
						<GiFarmer className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
					</ListItemPrefix>
					<span className="text-blue-gray-900 dark:text-gray-300">
						Weather
					</span>
				</ListItem>

				<ListItem
					className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
						activeItem === "Intrusion" ? "bg-blue-100 dark:bg-gray-700" : ""
					}`}
					onClick={() => {
						setActiveComponent("Intrusion");
						setActiveItem("Intrusion");
					}}
				>
					<ListItemPrefix>
						<MdOutlineSecurity className="h-6 w-6 text-red-600 dark:text-red-400" />
					</ListItemPrefix>
					<span className="text-blue-gray-900 dark:text-gray-300">
						Intrusion
					</span>
				</ListItem>

				<ListItem
					className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
						activeItem === "GeoFencing" ? "bg-blue-100 dark:bg-gray-700" : ""
					}`}
					onClick={() => {
						setActiveComponent("GeoFencing");
						setActiveItem("GeoFencing");
					}}
				>
					<ListItemPrefix>
						<FaMapMarkedAlt className="h-6 w-6 text-purple-600 dark:text-purple-400" />
					</ListItemPrefix>
					<span className="text-blue-gray-900 dark:text-gray-300">
						Geo Fencing
					</span>
				</ListItem>
			</List>
		</Card>
	);
}
