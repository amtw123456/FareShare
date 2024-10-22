"use client"

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { AcmeLogo } from '../components/NavigationBar/AcmeLogo';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '@nextui-org/react';

interface User {
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    password: string;
}

const Signup = () => {
    const { token, userId, userEmail, tokenExpiry, setToken, setUserId, setUserEmail, setTokenExpiry } = useAuth();
    const [user, setUser] = useState<User>({ email: '', password: '', first_name: '', last_name: '', user_name: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const router = useRouter(); // Initialize router

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setLoading(true)
        try {
            const RegisterResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
                user: {  // Wrap the email and password in a user object
                    first_name: user.first_name,
                    last_name: user.last_name,
                    user_name: user.user_name,
                    email: user.email,
                    password: user.password,
                }
            });

            if (RegisterResponse) {
                const LoginResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
                    user: {  // Wrap the email and password in a user object
                        email: user.email,
                        password: user.password,
                    }
                });
                setToken(LoginResponse.data.token);  // Replace with actual token
                setUserId(LoginResponse.data.user_id);
                setUserEmail(LoginResponse.data.email);  // Replace with actual email
                setTokenExpiry(LoginResponse.data.expires_at);  // Replace with actual expiry time
            }

            router.push('/home'); // Change to your profile route
        } catch (err) {
            setLoading(false)
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.error || 'Login failed');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className='flex justify-center items-center'>
                        {/* <img
                            src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
                            className="w-32 mx-auto"
                            alt="logo"
                        /> */}
                        <AcmeLogo />
                        <p className="font-bold text-inherit">FareShare</p>
                    </div>
                    <div className="mt-12 flex flex-col items-center">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
                        <div className="w-full flex-1 mt-8">
                            <div className="flex flex-col items-center">
                                {/* Google and GitHub signup buttons... */}
                            </div>

                            <div className="my-12 border-b text-center">
                                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                    Or sign up with e-mail
                                </div>
                            </div>

                            <form onSubmit={handleRegister} className="mx-auto max-w-xs">
                                <div className='flex flex-row space-x-4'>
                                    <input
                                        name="first_name"
                                        onChange={handleInputChange}
                                        value={user.first_name}
                                        className="w-1/2 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                        type="text" placeholder="First name" required
                                    />

                                    <input
                                        name="last_name"
                                        onChange={handleInputChange}
                                        value={user.last_name}
                                        className="w-1/2 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                        type="text" placeholder="Last name" required
                                    />
                                </div>

                                <input
                                    name="user_name"
                                    onChange={handleInputChange}
                                    value={user.user_name}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type="text" placeholder="Username" required
                                />

                                <input
                                    name="email"
                                    onChange={handleInputChange}
                                    value={user.email}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type="email" placeholder="Email" required
                                />

                                <input
                                    name="password"
                                    onChange={handleInputChange}
                                    value={user.password}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type={showPassword ? 'text' : 'password'} placeholder="Password" required
                                />
                                <button
                                    type="submit"
                                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                                    {/* <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg> */}
                                    <div className="flex items-center justify-center h-full">
                                        {loading ? ( // Show loading state
                                            <Spinner size={'sm'} color={'warning'} />
                                        ) : (
                                            <span>Sign up</span>
                                        )}
                                    </div>
                                </button>
                                {/* Additional UI elements... */}
                            </form>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
