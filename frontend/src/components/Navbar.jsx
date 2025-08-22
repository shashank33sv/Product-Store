import {
	Box,
	Button,
	Flex,
	HStack,
	IconButton,
	Text,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";

const Navbar = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const { user, logout } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await fetch("/api/users/logout", { method: "POST" });
		logout();
		navigate("/login");
	};

	return (
		<Box bg={useColorModeValue("gray.100", "gray.900")} px={4} borderBottom={"1px"} borderColor={"gray.700"}>
			<Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
				<HStack spacing={8} alignItems={"center"}>
					<Box>
						<Link to={"/"}>
							<Text fontSize={"xl"} fontWeight={"bold"}>
								Product Store
							</Text>
						</Link>
					</Box>

					{/* --- THIS IS THE NEWLY ADDED SECTION --- */}
					{user && (
						<HStack spacing={4} display={{ base: "none", md: "flex" }}>
							<Link to={"/myproducts"}>
								<Button variant='ghost' size={"sm"}>
									My Products
								</Button>
							</Link>
						</HStack>
					)}
					{/* ----------------------------------------- */}
				</HStack>

				<Flex alignItems={"center"} gap={4}>
					{user && (
						<Link to={"/create"}>
							<Button size={"sm"}>Create</Button>
						</Link>
					)}

					{user ? (
						<Button size={"sm"} onClick={handleLogout}>
							Logout
						</Button>
					) : (
						<HStack>
							<Link to={"/login"}>
								<Button size={"sm"}>Login</Button>
							</Link>
							<Link to={"/signup"}>
								<Button size={"sm"}>Sign Up</Button>
							</Link>
						</HStack>
					)}

					<IconButton
						size={"sm"}
						icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
						onClick={toggleColorMode}
					/>
				</Flex>
			</Flex>
		</Box>
	);
};

export default Navbar;
