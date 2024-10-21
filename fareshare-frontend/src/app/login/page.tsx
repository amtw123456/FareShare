"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';


interface User {
    email: string;
    password: string;
}

const Login = () => {
    const { token, userId, userEmail, tokenExpiry, setToken, setUserId, setUserEmail, setTokenExpiry } = useAuth();
    const router = useRouter(); // Initialize router

    const [user, setUser] = useState<User>({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission behavior
        console.log('purple')
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}`)
        console.log('yellow')
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
                user: {  // Wrap the email and password in a user object
                    email: user.email,
                    password: user.password,
                }
            });

            // Handle successful login here (e.g., save token, redirect user)

            setToken(response.data.token);  // Replace with actual token
            setUserId(response.data.user_id)
            setUserEmail(response.data.email);  // Replace with actual email
            setTokenExpiry(response.data.expires_at);  // Replace with actual email

            router.push('/home'); // Change to your profile route

        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.error || 'Login failed');
            } else {
                console.log(err)
                setError('An unexpected error occurred');
            }
        }
    };

    useEffect(() => {
        // console.log(token)
        // console.log(userId)
        // console.log(userEmail)
        // console.log(tokenExpiry)
    }, [token, userId, userEmail, tokenExpiry]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div>
                        <img
                            src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
                            className="w-32 mx-auto"
                            alt="logo"
                        />
                    </div>
                    <div className="mt-12 flex flex-col items-center">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">
                            Login to Link
                        </h1>
                        <div className="w-full flex-1 mt-8">
                            {error && <div className="text-red-500">{error}</div>}

                            <div className="my-12 border-b text-center">
                                <div
                                    className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                    Or login with e-mail
                                </div>
                            </div>

                            <form onSubmit={handleLogin} className="mx-auto max-w-xs">
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={user.email}
                                    onChange={handleInputChange}
                                />
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    value={user.password}
                                    onChange={handleInputChange}
                                />
                                <button
                                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                    type="submit"
                                >
                                    <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg>
                                    <span className="ml-3">Login</span>
                                </button>
                            </form>

                            <div className="my-12 border-b text-center">
                                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                    Don't have an account&nbsp;
                                    <a href="signup" className="text-blue-500 hover:underline">Register</a>
                                </div>
                            </div>

                            <p className="mt-6 text-xs text-gray-600 text-center">
                                I agree to abide by templatana's
                                <a href="#" className="border-b border-gray-500 border-dotted">Terms of Service</a>
                                and its
                                <a href="#" className="border-b border-gray-500 border-dotted">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
