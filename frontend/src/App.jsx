import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

// Import all of your page components
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MyProductsPage from "./pages/MyProductsPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage"; // 1. Import the new PaymentPage

// Import the Navbar component
import Navbar from "./components/Navbar";

function App() {
	return (
		<Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
			<Navbar />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/create' element={<CreatePage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/myproducts' element={<MyProductsPage />} />
				<Route path='/checkout/:productId' element={<CheckoutPage />} />
				<Route path='/payment/:orderId' element={<PaymentPage />} /> {/* 2. Add the new payment route */}
			</Routes>
		</Box>
	);
}

export default App;
