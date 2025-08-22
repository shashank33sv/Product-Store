import {
	Button,
	Container,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const toast = useToast();
	const navigate = useNavigate();
	const { login } = useAuthStore();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/users/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			login(data);
			navigate("/");
		} catch (error) {
			toast({
				title: "An error occurred.",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Container maxW='lg' py={{ base: "12", md: "24" }} px={{ base: "0", sm: "8" }}>
			<Stack spacing='8'>
				<Stack spacing='6' textAlign={"center"}>
					<Heading size={{ base: "md", md: "lg" }}>Log in to your account</Heading>
					<Text>
						Don't have an account?{" "}
						<Link to={"/signup"}>
							<Text as='span' color='blue.500'>
								Sign up
							</Text>
						</Link>
					</Text>
				</Stack>

				<form onSubmit={handleLogin}>
					<Stack spacing='6'>
						<FormControl isRequired>
							<FormLabel>Email</FormLabel>
							<Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
						</FormControl>

						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<Input
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</FormControl>

						<Button type='submit' colorScheme='blue' size='lg' fontSize='md'>
							Sign in
						</Button>
					</Stack>
				</form>
			</Stack>
		</Container>
	);
};

export default LoginPage;
