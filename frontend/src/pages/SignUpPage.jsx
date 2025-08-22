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

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const toast = useToast();
	const navigate = useNavigate();
	const { login } = useAuthStore();

	const handleSignUp = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/users/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
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
					<Heading size={{ base: "md", md: "lg" }}>Create an account</Heading>
					<Text>
						Already have an account?{" "}
						<Link to={"/login"}>
							<Text as='span' color='blue.500'>
								Log in
							</Text>
						</Link>
					</Text>
				</Stack>

				<form onSubmit={handleSignUp}>
					<Stack spacing='6'>
						<FormControl isRequired>
							<FormLabel>Full Name</FormLabel>
							<Input type='text' value={name} onChange={(e) => setName(e.target.value)} />
						</FormControl>

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
							Sign up
						</Button>
					</Stack>
				</form>
			</Stack>
		</Container>
	);
};

export default SignUpPage;
