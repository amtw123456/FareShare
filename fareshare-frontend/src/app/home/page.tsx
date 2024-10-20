"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import CreateTransactionModal from '../components/CreateTransactionModel/CreateTransactionModal';

interface User {
    email: string;
    password: string;
}

const Home = () => {
    const [user, setUser] = useState<User>({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
            <NavigationBar />
            <div className='flex justify-center mt-5'>
                <CreateTransactionModal />
            </div>
        </div >
    );
};

export default Home;
