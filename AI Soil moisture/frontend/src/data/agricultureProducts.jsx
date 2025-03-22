const agricultureProducts = [
  {
    id: 1,
    name: "High-Yield Hybrid Rice Seeds",
    category: "seeds",
    price: 1250,
    unit: "per 5kg bag",
    inStock: true,
    rating: 4.7,
    image: "https://panseeds.in/wp-content/uploads/2023/02/Pan_2423.png",
    description:
      "Premium quality rice seeds with high germination rate and yield potential",
    features: [
      "130-day maturity",
      "Disease resistant",
      "High yield potential (65-75 quintals/hectare)",
    ],
  },
  {
    id: 2,
    name: "Organic Tomato Seeds (GS-12)",
    category: "seeds",
    price: 350,
    unit: "per 100g pack",
    inStock: true,
    rating: 4.5,
    image:
      "https://5.imimg.com/data5/WS/XT/QD/SELLER-40998616/tomato-seeds-500x500.jpg",
    description:
      "Certified organic tomato seeds ideal for commercial cultivation",
    features: [
      "High disease resistance",
      "Heavy fruiting",
      "85-90 days to maturity",
    ],
  },
  {
    id: 3,
    name: "Premium NPK Complex Fertilizer (19-19-19)",
    category: "fertilizers",
    price: 1150,
    unit: "per 50kg bag",
    inStock: true,
    rating: 4.8,
    image: "https://m.media-amazon.com/images/I/612LJ7lHWTS._SL1181_.jpg",
    description:
      "Balanced NPK fertilizer for all-round crop development and higher yields",
    features: [
      "Water soluble",
      "Suitable for all crops",
      "Balanced nutrient ratio",
    ],
  },
  {
    id: 4,
    name: "Organic Vermicompost",
    category: "fertilizers",
    price: 899,
    unit: "per 50kg bag",
    inStock: true,
    rating: 4.6,
    image:
      "https://5.imimg.com/data5/ES/XM/KJ/SELLER-42795699/1kg-organic-vermicompost-500x500.jpg",
    description:
      "100% organic soil amendment produced by earthworms to improve soil fertility",
    features: [
      "Improves soil structure",
      "Contains beneficial microorganisms",
      "Enhances water retention",
    ],
  },
  {
    id: 5,
    name: "Professional Battery Pruning Shears",
    category: "tools",
    price: 4500,
    unit: "per piece",
    inStock: true,
    rating: 4.7,
    image: "https://m.media-amazon.com/images/I/61p2go7wQYL.jpg",
    description:
      "Rechargeable battery-powered pruning shears for effortless cutting",
    features: [
      "Lithium-ion battery",
      "Up to 6 hours runtime",
      "25mm cutting capacity",
    ],
  },
  {
    id: 6,
    name: "Neem-Based Natural Pest Control",
    category: "pesticides",
    price: 599,
    unit: "per 5L container",
    inStock: true,
    rating: 4.4,
    image: "https://m.media-amazon.com/images/I/71CMEY9x-FL._SL1500_.jpg",
    description:
      "Organic neem oil formulation for controlling a wide range of pests",
    features: [
      "Organic certified",
      "Safe for beneficial insects",
      "Broad-spectrum protection",
    ],
  },
  {
    id: 7,
    name: "Smart Soil Moisture Sensor Kit",
    category: "tools",
    price: 2499,
    unit: "per kit",
    inStock: true,
    rating: 4.6,
    image:
      "https://image.made-in-china.com/2f0j00nSqbuYRFwNkm/Tuya-Smart-Soil-NPK-Sensor-Wireless-WiFi-Zigbee-Temperature-Humidity-Sensors-Soil-Hygrometer-Moisture-Sensor-Detector-Tester.webp",
    description:
      "IoT-enabled soil moisture monitoring system for precision irrigation",
    features: [
      "Battery-powered",
      "Mobile app connectivity",
      "Real-time alerts",
      "Water-saving technology",
    ],
  },
  {
    id: 8,
    name: "Solar-Powered Mini Water Pump",
    category: "tools",
    price: 3999,
    unit: "per unit",
    inStock: true,
    rating: 4.5,
    image:
      "https://tse3.mm.bing.net/th?id=OIP.Kge-NNY01ginGwAM86RP6AHaGW&pid=Api&P=0&h=180",
    description:
      "Eco-friendly solar-powered water pump for small-scale irrigation",
    features: [
      "No electricity needed",
      "5-year warranty",
      "Portable design",
      "Adjustable flow rate",
    ],
  },
  {
    id: 9,
    name: "Micronutrient Fertilizer Mix",
    category: "fertilizers",
    price: 780,
    unit: "per 10kg bag",
    inStock: true,
    rating: 4.3,
    image:
      "https://5.imimg.com/data5/SELLER/Default/2022/9/VE/NY/PE/25464873/mix-micronutrient-liquid-1000x1000.jpg",
    description:
      "Specialized micronutrient blend to correct deficiencies and boost crop health",
    features: [
      "Chelated formulation",
      "Easy to apply",
      "Contains Zn, Fe, Mn, Cu, B",
    ],
  },
  {
    id: 10,
    name: "Drip Irrigation Starter Kit",
    category: "tools",
    price: 1999,
    unit: "per kit",
    inStock: true,
    rating: 4.8,
    image:
      "https://tse4.mm.bing.net/th?id=OIP.uNbuV9ZYuqjzR8HmkYCwOQHaHa&pid=Api&P=0&h=180",
    description:
      "Complete drip irrigation system for efficient water usage in small farms",
    features: [
      "Water-efficient",
      "Easy installation",
      "Covers 1/4 acre",
      "Includes all connectors",
    ],
  },
  {
    id: 11,
    name: "Systemic Fungicide (Propiconazole 25% EC)",
    category: "pesticides",
    price: 899,
    unit: "per 1L bottle",
    inStock: true,
    rating: 4.2,
    image:
      "https://5.imimg.com/data5/SELLER/Default/2022/2/ZJ/GM/JF/21021813/propiconazole-25-ec-systemic-fungicide-1000x1000.jpg",
    description:
      "Effective systemic fungicide for controlling a wide range of fungal diseases",
    features: [
      "Systemic action",
      "Preventive & curative",
      "Low application rate",
    ],
  },
  {
    id: 12,
    name: "Weather-Resistant Crop Cover Sheets",
    category: "tools",
    price: 1299,
    unit: "per 10m×10m",
    inStock: true,
    rating: 4.4,
    image:
      "https://tse3.mm.bing.net/th?id=OIP.tQzr5uSiseHkZu4Xs0kMTQHaF2&pid=Api&P=0&h=180",
    description:
      "Protective covers to shield crops from extreme weather conditions",
    features: ["UV-resistant", "Frost protection", "Reusable for 3-5 seasons"],
  },
  {
    id: 13,
    name: "Insect Trap with Pheromone Lures",
    category: "pesticides",
    price: 650,
    unit: "per set of 5",
    inStock: false,
    rating: 4.1,
    image: "https://m.media-amazon.com/images/I/71XFCuT0B+L._SL1500_.jpg",
    description:
      "Eco-friendly insect traps with specific pheromones for pest monitoring",
    features: [
      "Chemical-free",
      "Species-specific lures",
      "Early warning system",
    ],
  },
  {
    id: 14,
    name: "Premium Wheat Seeds (HD-3226)",
    category: "seeds",
    price: 1850,
    unit: "per 40kg bag",
    inStock: true,
    rating: 4.9,
    image: "https://m.media-amazon.com/images/I/610qCoSrIjL._AC_.jpg",
    description:
      "High-yielding wheat variety suitable for varied agro-climatic zones",
    features: [
      "Early maturing (120-125 days)",
      "Rust resistant",
      "High protein content",
    ],
  },
  {
    id: 15,
    name: "Manual Seed Planter",
    category: "tools",
    price: 2699,
    unit: "per unit",
    inStock: true,
    rating: 4.3,
    image:
      "https://tse2.mm.bing.net/th?id=OIP.N6uztRgyNURcfKqGy3EZ5QHaE8&pid=Api&P=0&h=180",
    description: "Precision seed planter for small-scale farmers",
    features: [
      "Adjustable seed spacing",
      "Multiple seed plates",
      "Easy operation",
    ],
  },
  {
    id: 16,
    name: "Organic Sugarcane (CO-86032)",
    category: "harvested",
    price: 2500,
    unit: "per tonne",
    inStock: true,
    rating: 4.7,
    image:
      "https://5.imimg.com/data5/ANDROID/Default/2024/1/381403745/OW/SC/NZ/158665744/product-jpeg-500x500.jpg",
    description:
      "Freshly harvested organic sugarcane variety with high sugar content",
    features: [
      "Chemical-free cultivation",
      "Sweet taste",
      "High juice content",
    ],
  },
  {
    id: 17,
    name: "Mango (Alphonso) Premium Grade",
    category: "harvested",
    price: 5500,
    unit: "per 20kg crate",
    inStock: true,
    rating: 4.9,
    image:
      "https://tse1.mm.bing.net/th?id=OIP.zJS29qmMPlMDvQxWO2X_9wHaHa&pid=Api&P=0&h=180",
    description:
      "Premium grade Alphonso mangoes known for exceptional flavor and aroma",
    features: ["Direct from farm", "Ripened naturally", "Export quality"],
  },
  {
    id: 18,
    name: "Soil Testing Kit (Advanced)",
    category: "tools",
    price: 1450,
    unit: "per kit",
    inStock: true,
    rating: 4.5,
    image:
      "https://tse2.mm.bing.net/th?id=OIP.GvIZX9b6q0UQ7UeVXN6XggHaFW&pid=Api&P=0&h=180",
    description:
      "Comprehensive soil testing kit for analyzing major nutrients and pH",
    features: ["Tests N, P, K & pH", "60 tests capacity", "Detailed guidebook"],
  },
  {
    id: 19,
    name: "Shade Net (50%)",
    category: "tools",
    price: 4500,
    unit: "per 100m²",
    inStock: true,
    rating: 4.4,
    image: "https://m.media-amazon.com/images/I/713mT7R5sML._SX679_.jpg",
    description:
      "UV-stabilized shade net for protecting crops from excessive sunlight",
    features: [
      "50% shade factor",
      "UV resistant",
      "Long-lasting",
      "Reduces water requirement",
    ],
  },
  {
    id: 20,
    name: "Potassium Humate Soil Conditioner",
    category: "fertilizers",
    price: 850,
    unit: "per 5kg pack",
    inStock: true,
    rating: 4.6,
    image:
      "https://www.rainbowbrown.co.nz/image/cache/catalog/Products/BioTreat%20K-MATE/K-MATE-Pot%20Humate-BioGro-25kg-Label-v2-1100x1100h.png",
    description:
      "Natural soil conditioner to improve soil structure and fertility",
    features: [
      "Improves nutrient uptake",
      "Enhances root development",
      "Eco-friendly",
    ],
  },
  {
    id: 21,
    name: "Mustard Seeds (Pusa Bold)",
    category: "seeds",
    price: 850,
    unit: "per 5kg bag",
    inStock: true,
    rating: 4.5,
    image:
      "https://tse2.mm.bing.net/th?id=OIP.BjKTSHUvVecEWL52oMB60QHaHa&pid=Api&P=0&h=180",
    description:
      "High-yielding variety of mustard seeds with oil content of 38-40%",
    features: [
      "Early maturing (110-115 days)",
      "Drought tolerant",
      "Yellow flowers",
    ],
  },
  {
    id: 22,
    name: "Bajra/Pearl Millet Seeds (HHB-67)",
    category: "seeds",
    price: 675,
    unit: "per 10kg bag",
    inStock: true,
    rating: 4.3,
    image:
      "https://tse3.mm.bing.net/th?id=OIP.FnCRHuewcPZd3MgjEiTADQHaJI&pid=Api&P=0&h=180",
    description:
      "Drought-resistant pearl millet variety suitable for arid and semi-arid regions",
    features: [
      "65-70 days to maturity",
      "Downy mildew resistant",
      "Good for low rainfall areas",
    ],
  },
  {
    id: 23,
    name: "Green Gram/Moong Seeds (IPM 02-3)",
    category: "seeds",
    price: 950,
    unit: "per 8kg pack",
    inStock: true,
    rating: 4.6,
    image:
      "https://5.imimg.com/data5/XB/WX/FJ/SELLER-5061788/wheat-seeds-500x500.jpeg",
    description:
      "Short duration green gram variety with uniform maturity and high yield potential",
    features: [
      "65-70 days duration",
      "Yellow mosaic resistant",
      "High protein content (24-26%)",
    ],
  },
  {
    id: 24,
    name: "Biofertilizer Consortium",
    category: "fertilizers",
    price: 420,
    unit: "per 1kg pack",
    inStock: true,
    rating: 4.4,
    image:
      "https://5.imimg.com/data5/SELLER/Default/2023/3/296691383/UO/FE/YE/4281347/pinak-biofertilizer-consortium-liquid-npk-biofertilizer-500x500.jpg",
    description:
      "Multi-strain biofertilizer with nitrogen fixers, phosphate & potash solubilizers",
    features: [
      "100% organic",
      "Improves soil health",
      "Reduces chemical fertilizer requirement by 25%",
    ],
  },
  {
    id: 25,
    name: "Zinc Sulphate (21% Zn)",
    category: "fertilizers",
    price: 550,
    unit: "per 10kg bag",
    inStock: true,
    rating: 4.2,
    image:
      "https://tse3.mm.bing.net/th?id=OIP.Lg7SjyXHZ1KXJhuK8bksLQHaFj&pid=Api&P=0&h=180",
    description:
      "Essential micronutrient for correcting zinc deficiency in soils and crops",
    features: [
      "Water soluble",
      "Boosts yield & quality",
      "Increases disease resistance",
    ],
  },
  {
    id: 26,
    name: "Calcium Nitrate Fertilizer",
    category: "fertilizers",
    price: 780,
    unit: "per 25kg bag",
    inStock: true,
    rating: 4.7,
    image:
      "https://tse1.mm.bing.net/th?id=OIP.GDhYYVYfm10mHh4_kipcNgHaLG&pid=Api&P=0&h=180",
    description:
      "Highly water-soluble calcium and nitrogen fertilizer for fruits and vegetables",
    features: [
      "15.5% nitrogen",
      "26% calcium",
      "Prevents blossom end rot",
      "Ideal for drip irrigation",
    ],
  },
  {
    id: 27,
    name: "Imidacloprid 17.8% SL Insecticide",
    category: "pesticides",
    price: 750,
    unit: "per 1L bottle",
    inStock: true,
    rating: 4.5,
    image: "https://m.media-amazon.com/images/I/61asZeGkBFL._SL1500_.jpg",
    description:
      "Systemic insecticide effective against sucking pests like aphids, jassids, and whiteflies",
    features: [
      "Systemic action",
      "Low dosage required",
      "Long-lasting protection",
    ],
  },
  {
    id: 28,
    name: "Mancozeb 75% WP Fungicide",
    category: "pesticides",
    price: 480,
    unit: "per 1kg pack",
    inStock: true,
    rating: 4.3,
    image:
      "https://tse4.mm.bing.net/th?id=OIP.G28DWXUDzU2Ry0abYrn36wHaIb&pid=Api&P=0&h=180",
    description:
      "Broad-spectrum contact fungicide for controlling various fungal diseases",
    features: [
      "Protectant fungicide",
      "Controls multiple diseases",
      "Compatible with most pesticides",
    ],
  },
  {
    id: 29,
    name: "Glyphosate 41% SL Herbicide",
    category: "pesticides",
    price: 570,
    unit: "per 1L bottle",
    inStock: false,
    rating: 4.0,
    image:
      "https://5.imimg.com/data5/SELLER/Default/2021/7/EZ/II/CF/46937857/glyphosate-41-sl-herbicides-1000x1000.jpg",
    description:
      "Non-selective systemic herbicide for controlling annual and perennial weeds",
    features: [
      "Broad-spectrum action",
      "Rainproof in 2 hours",
      "Works through foliage & roots",
    ],
  },
  {
    id: 30,
    name: "Manual Push Weeder",
    category: "tools",
    price: 1850,
    unit: "per piece",
    inStock: true,
    rating: 4.6,
    image:
      "https://tse4.mm.bing.net/th?id=OIP.o8b7y5A7KhhCdxawQPg6dAHaHa&pid=Api&P=0&h=180",
    description:
      "Ergonomic manual push weeder for effective weed control without chemicals",
    features: [
      "Durable steel construction",
      "Adjustable working width",
      "Reduces back strain",
    ],
  },
  {
    id: 31,
    name: "High-Pressure Knapsack Sprayer (16L)",
    category: "tools",
    price: 1999,
    unit: "per unit",
    inStock: true,
    rating: 4.7,
    image:
      "https://microless.com/cdn/products/739e5ee0b6a1039045d3411050b6e91e-hi.jpg",
    description:
      "Professional grade manual sprayer with adjustable pressure for pesticide application",
    features: [
      "16L capacity",
      "Multiple nozzle options",
      "Pressure up to 6 bar",
      "Shoulder straps included",
    ],
  },
  {
    id: 32,
    name: "Grafting Knife Set",
    category: "tools",
    price: 1250,
    unit: "per set",
    inStock: true,
    rating: 4.5,
    image:
      "https://tse1.mm.bing.net/th?id=OIP.gJK5pHmJgL1L6qnlwnyA1wHaHa&pid=Api&P=0&h=180",
    description:
      "Professional grafting and budding knife set with stainless steel blades",
    features: [
      "3 specialized knives",
      "Sharp stainless steel",
      "Ergonomic handle",
      "Protective case",
    ],
  },
  {
    id: 33,
    name: "Harvest Sickle (Premium)",
    category: "tools",
    price: 450,
    unit: "per piece",
    inStock: true,
    rating: 4.8,
    image:
      "https://tse4.mm.bing.net/th?id=OIP.LUluOCI13Dirc6vp9IJYpgHaHa&pid=Api&P=0&h=180",
    description:
      "Traditional harvesting sickle with premium carbon steel blade",
    features: [
      "Hand-forged blade",
      "Wooden handle",
      "Serrated edge option",
      "Leather sheath included",
    ],
  },
  {
    id: 34,
    name: "Onion (Red) Seeds (Agrifound Light Red)",
    category: "seeds",
    price: 1250,
    unit: "per 500g pack",
    inStock: true,
    rating: 4.6,
    image:
      "https://tse4.mm.bing.net/th?id=OIP.qdH8aotMuhhRruxE8h8AzAHaHa&pid=Api&P=0&h=180",
    description:
      "High-yielding red onion variety with extended shelf life and excellent market demand",
    features: [
      "95-110 days to maturity",
      "Yield potential: 250-300 q/ha",
      "Resistant to purple blotch",
    ],
  },
  {
    id: 35,
    name: "Bamboo Garden Stakes (4ft)",
    category: "tools",
    price: 599,
    unit: "pack of 25",
    inStock: true,
    rating: 4.2,
    image:
      "https://tse2.mm.bing.net/th?id=OIP.EXE3UUF3ZIiwgf4En-QtbAHaFN&pid=Api&P=0&h=180",
    description:
      "Natural bamboo stakes for supporting climbing plants and vegetables",
    features: [
      "Eco-friendly",
      "Weather resistant",
      "Reusable for multiple seasons",
      "4ft height",
    ],
  },
  {
    id: 36,
    name: "Foldable Garden Stool with Tool Bag",
    category: "tools",
    price: 950,
    unit: "per piece",
    inStock: true,
    rating: 4.4,
    image: "https://m.media-amazon.com/images/I/81gh5uyt1zL.jpg",
    description:
      "Multifunctional garden stool with attached tool bag for comfortable gardening",
    features: [
      "Supports up to 150kg",
      "Detachable tool bag",
      "Foldable design",
      "EVA padded seat",
    ],
  },
  {
    id: 37,
    name: "Calcium Ammonium Nitrate (CAN)",
    category: "fertilizers",
    price: 950,
    unit: "per 50kg bag",
    inStock: true,
    rating: 4.3,
    image:
      "https://tse1.mm.bing.net/th?id=OIP.9K737BEB2XSAaZeA70FkMwHaE3&pid=Api&P=0&h=180",
    description:
      "Fast-acting nitrogen fertilizer with calcium for acidic soils",
    features: [
      "25% nitrogen",
      "8% calcium",
      "pH balanced",
      "Low volatilization",
    ],
  },
  {
    id: 38,
    name: "Bacillus thuringiensis (Bt) Biopesticide",
    category: "pesticides",
    price: 580,
    unit: "per 500g pack",
    inStock: true,
    rating: 4.5,
    image:
      "https://tse3.mm.bing.net/th?id=OIP.wTqnLvoCI8VHgVUJZdIL-gHaHa&pid=Api&P=0&h=180",
    description:
      "Organic pesticide effective against caterpillars and various lepidopteran pests",
    features: [
      "OMRI listed organic",
      "Safe for beneficial insects",
      "No chemical residue",
    ],
  },
  {
    id: 39,
    name: "Lady's Finger/Okra Seeds (Arka Anamika)",
    category: "seeds",
    price: 399,
    unit: "per 100g pack",
    inStock: true,
    rating: 4.7,
    image:
      "https://www.sybazzar.com/public/files/2D95E5DC3DD4594-f81ec8bd01e5e4cea2cbf95f8fe95c2b.jpg",
    description:
      "High-yielding okra variety resistant to Yellow Vein Mosaic Virus",
    features: [
      "45-50 days to first harvest",
      "Tender, dark green fruits",
      "Long harvesting period",
    ],
  },
  {
    id: 40,
    name: "Silage Wrap Film",
    category: "tools",
    price: 3500,
    unit: "per roll (750mm×1500m)",
    inStock: true,
    rating: 4.4,
    image:
      "https://tse1.mm.bing.net/th?id=OIP.rrrkbDDQyGpoMRn2ut4sywHaHa&pid=Api&P=0&h=180",
    description:
      "High-quality UV-resistant film for silage bale wrapping and preservation",
    features: [
      "UV stabilized for 12 months",
      "Superior oxygen barrier",
      "Puncture resistant",
      "Stretch film",
    ],
  },
];

export default agricultureProducts;
