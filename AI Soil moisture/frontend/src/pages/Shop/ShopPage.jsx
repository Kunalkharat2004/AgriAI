import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Button,
  Paper,
  Badge,
  Chip,
  Pagination,
  Stack,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedIcon from "@mui/icons-material/Verified";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/shop/ProductCard";
import agricultureProducts from "../../data/agricultureProducts";
import { useCart } from "../../context/CartContext";
import AmazonProductsSection from "../../components/shop/AmazonProductsSection";

const categories = [
  { id: "all", label: "All Products" },
  { id: "seeds", label: "Seeds" },
  { id: "fertilizers", label: "Fertilizers" },
  { id: "tools", label: "Tools & Equipment" },
  { id: "pesticides", label: "Pesticides" },
  { id: "harvested", label: "Harvested Products" },
];

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(agricultureProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [showAmazonProducts, setShowAmazonProducts] = useState(false);
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const { cart } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    filterProducts();
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCategory, searchQuery]);

  const filterProducts = () => {
    let filtered = agricultureProducts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );

      // Save the search term for potential Amazon fallback
      setLastSearchTerm(searchQuery);

      // If no products found and search query exists, show Amazon products
      setShowAmazonProducts(filtered.length === 0 && query.length > 0);
    } else {
      // If search query is empty, don't show Amazon products
      setShowAmazonProducts(false);
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleViewCart = () => {
    navigate("/shop/cart");
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top of products when page changes
    document
      .getElementById("products-grid")
      .scrollIntoView({ behavior: "smooth" });
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa', minHeight: "100vh" }}>
      {/* Curved Bottom Hero Header */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#0a1f14' : '#1a5d3a',
          color: "white",
          pt: { xs: 4, md: 6 },
          pb: { xs: 6, md: 8 },
          borderBottomLeftRadius: "50% 40px",
          borderBottomRightRadius: "50% 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <StorefrontIcon sx={{ fontSize: { xs: 40, md: 50 } }} />
              <Box>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.75rem", md: "2.5rem" },
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Farmers Agricultural Shop
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    opacity: 0.95,
                    mt: 0.5,
                  }}
                >
                  Quality farming supplies with options to buy or rent equipment
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={handleViewCart}
              startIcon={<ShoppingBagIcon />}
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? '#2d2d2d' : 'white',
                color: theme.palette.mode === 'dark' ? '#4ade80' : '#1a5d3a',
                borderRadius: "8px",
                px: 3,
                py: 1.5,
                fontWeight: 600,
                fontSize: "0.95rem",
                boxShadow: theme.palette.mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.15)',
                "&:hover": {
                  bgcolor: theme.palette.mode === 'dark' ? '#3d3d3d' : '#f8f9fa',
                  transform: "translateY(-2px)",
                  boxShadow: theme.palette.mode === 'dark' ? '0 6px 16px rgba(0,0,0,0.6)' : '0 6px 16px rgba(0,0,0,0.2)',
                },
                transition: "all 0.3s ease",
                display: { xs: "none", sm: "flex" },
              }}
            >
              <Badge badgeContent={cart.totalItems} color="error">
                <Box component="span" sx={{ ml: 0.5 }}>
                  Cart
                </Box>
              </Badge>
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -4, position: "relative", zIndex: 2 }}>
        {/* Search and Filter Card - Floating */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: "20px",
            boxShadow: theme.palette.mode === 'dark' ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.08)',
            bgcolor: theme.palette.mode === 'dark' ? '#2d2d2d' : 'white',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search products..."
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#198754" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "8px",
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
                    border: theme.palette.mode === 'dark' ? '1px solid #3d3d3d' : '1px solid #dee2e6',
                    color: theme.palette.mode === 'dark' ? '#e0e0e0' : 'inherit',
                    "&:hover": {
                      bgcolor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#ffffff',
                    },
                    "&.Mui-focused": {
                      bgcolor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#ffffff',
                      borderColor: theme.palette.mode === 'dark' ? '#4ade80' : '#198754',
                      boxShadow: theme.palette.mode === 'dark' ? '0 0 0 4px rgba(74, 222, 128, 0.2)' : '0 0 0 4px rgba(25, 135, 84, 0.1)',
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FilterListIcon sx={{ color: "#198754", fontSize: 24 }} />
                <Tabs
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    minHeight: 40,
                    flex: 1,
                    ".MuiTabs-indicator": {
                      backgroundColor: "#198754",
                      height: 3,
                      borderRadius: "3px 3px 0 0",
                    },
                    ".MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 500,
                      fontFamily: "'Outfit', sans-serif",
                      minWidth: "auto",
                      minHeight: 40,
                      px: 2,
                      py: 1,
                      fontSize: "0.9rem",
                      color: "#6c757d",
                      "&.Mui-selected": {
                        color: "#198754",
                        fontWeight: 600,
                      },
                      "&:hover": {
                        color: "#198754",
                        bgcolor: "rgba(25, 135, 84, 0.05)",
                      },
                    },
                  }}
                >
                  {categories.map((category) => (
                    <Tab
                      key={category.id}
                      label={category.label}
                      value={category.id}
                    />
                  ))}
                </Tabs>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Feature Highlights */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "20px",
                border: theme.palette.mode === 'dark' ? '1px solid #3d3d3d' : '1px solid #dee2e6',
                bgcolor: theme.palette.mode === 'dark' ? '#2d2d2d' : 'white',
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.palette.mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)',
                  borderColor: theme.palette.mode === 'dark' ? '#4ade80' : '#198754',
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1.5,
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(25, 135, 84, 0.1)',
                    borderRadius: "12px",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 28, color: theme.palette.mode === 'dark' ? '#4ade80' : '#198754' }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "1.1rem",
                    color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#212529',
                  }}
                >
                  Quality Products
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === 'dark' ? '#a0a0a0' : '#6c757d',
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                All products tested for performance in local farming conditions
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "20px",
                border: theme.palette.mode === 'dark' ? '1px solid #3d3d3d' : '1px solid #dee2e6',
                bgcolor: theme.palette.mode === 'dark' ? '#2d2d2d' : 'white',
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.palette.mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)',
                  borderColor: theme.palette.mode === 'dark' ? '#4ade80' : '#198754',
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1.5,
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(25, 135, 84, 0.1)',
                    borderRadius: "12px",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocalShippingIcon sx={{ fontSize: 28, color: "#198754" }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "1.1rem",
                    color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#212529',
                  }}
                >
                  Village Delivery
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === 'dark' ? '#a0a0a0' : '#6c757d',
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                Free delivery to your village on orders above ₹1,000
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "20px",
                border: theme.palette.mode === 'dark' ? '1px solid #3d3d3d' : '1px solid #dee2e6',
                bgcolor: theme.palette.mode === 'dark' ? '#2d2d2d' : 'white',
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.palette.mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)',
                  borderColor: theme.palette.mode === 'dark' ? '#4ade80' : '#198754',
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1.5,
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(25, 135, 84, 0.1)',
                    borderRadius: "12px",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SupportAgentIcon sx={{ fontSize: 28, color: "#198754" }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "1.1rem",
                    color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#212529',
                  }}
                >
                  Farmer Support
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === 'dark' ? '#a0a0a0' : '#6c757d',
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                Call our agriculture experts for guidance in your local language
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Results Count and Pagination Controls */}
        {filteredProducts.length > 0 && (
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#212529',
                  fontWeight: 500,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {filteredProducts.length} products found
              </Typography>
              <Chip
                label={
                  categories.find((cat) => cat.id === selectedCategory)
                    ?.label || "All Products"
                }
                sx={{
                  bgcolor: "#198754",
                  color: "white",
                  fontWeight: 500,
                  borderRadius: "50px",
                  height: 28,
                }}
              />
            </Box>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel
                id="products-per-page-label"
                sx={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Show
              </InputLabel>
              <Select
                labelId="products-per-page-label"
                value={productsPerPage}
                label="Show"
                onChange={handleProductsPerPageChange}
                sx={{
                  borderRadius: "8px",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 500,
                }}
              >
                <MenuItem value={12}>12 per page</MenuItem>
                <MenuItem value={24}>24 per page</MenuItem>
                <MenuItem value={36}>36 per page</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Products Grid */}
        <div id="products-grid">
          {filteredProducts.length > 0 ? (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {currentProducts.map((product) => (
                  <Grid
                    item
                    key={product.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <Box sx={{ width: "100%", height: "100%" }}>
                      <ProductCard product={product} />
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  sx={{ my: 5 }}
                >
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 500,
                        "&.Mui-selected": {
                          bgcolor: "#198754",
                          color: "white",
                          "&:hover": {
                            bgcolor: "#143d2e",
                          },
                        },
                      },
                    }}
                    showFirstButton
                    showLastButton
                    shape="rounded"
                    size="large"
                  />
                </Stack>
              )}
            </>
          ) : (
            <>
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  textAlign: "center",
                  borderRadius: "20px",
                  border: theme.palette.mode === 'dark' ? '1px solid #3d3d3d' : '1px solid #dee2e6',
                  bgcolor: theme.palette.mode === 'dark' ? '#2d2d2d' : 'white',
                  mb: 4,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#212529',
                    fontWeight: 600,
                    fontFamily: "'Outfit', sans-serif",
                    mb: 1,
                  }}
                >
                  No products found in our store
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: theme.palette.mode === 'dark' ? '#a0a0a0' : '#6c757d', mb: 3, fontWeight: 300 }}
                >
                  {searchQuery
                    ? `We couldn't find any products matching "${searchQuery}" in our store.`
                    : "Try changing your search or filter to find products"}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  sx={{
                    bgcolor: theme.palette.mode === 'dark' ? '#4ade80' : '#1a5d3a',
                    color: theme.palette.mode === 'dark' ? '#0a1f14' : 'white',
                    borderRadius: "8px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 500,
                    fontFamily: "'Outfit', sans-serif",
                    "&:hover": {
                      bgcolor: theme.palette.mode === 'dark' ? '#22c55e' : '#143d2e',
                    },
                  }}
                >
                  Show All Products
                </Button>
              </Paper>

              {/* Amazon Products Section */}
              {showAmazonProducts && (
                <AmazonProductsSection searchTerm={lastSearchTerm} />
              )}
            </>
          )}
        </div>

        {/* Call-to-action */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "20px",
            bgcolor: theme.palette.mode === 'dark' ? '#0a1f14' : '#1a5d3a',
            color: "white",
            mb: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                mb: 1.5,
              }}
            >
              Need help choosing the right farming products?
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 3, opacity: 0.95, fontWeight: 300, maxWidth: 600 }}
            >
              Our team of agriculture experts is available to provide guidance
              based on your specific farming needs
            </Typography>
            <Button
              variant="contained"
              startIcon={<SupportAgentIcon />}
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? '#4ade80' : 'white',
                color: theme.palette.mode === 'dark' ? '#0a1f14' : '#1a5d3a',
                borderRadius: "8px",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                "&:hover": {
                  bgcolor: theme.palette.mode === 'dark' ? '#22c55e' : '#f8f9fa',
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Call Helpline: 1800-XXX-XXXX
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ShopPage;

