"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface User {
    email: string;
    password: string;
}

const Home = () => {
    const [user, setUser] = useState<User>({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission behavior
        console.log(user)
        try {
            const response = await axios.post('http://localhost:3000/login', {
                user: {  // Wrap the email and password in a user object
                    email: user.email,
                    password: user.password,
                }
            });

            // Handle successful login here (e.g., save token, redirect user)
            console.log('Login successful:', response.data);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.error || 'Login failed');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            Home
        </div>
    );
};

export default Home;
