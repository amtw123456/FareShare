"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import CreateTransactionModal from "../components/CreateTransactionModel/CreateTransactionModal"
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NavigationBar from '../components/NavigationBar/NavigationBar';

interface User {
    email: string;
    password: string;
}

const Profile = () => {
    const { token, userId, userEmail, tokenExpiry, setToken, setUserId, setUserEmail, setTokenExpiry } = useAuth();

    useEffect(() => {
        // console.log(token)
        // console.log(userId)
        // console.log(userEmail)
        // console.log(tokenExpiry)
    }, [token, userId, userEmail, tokenExpiry]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
            <NavigationBar />
            <div className='flex justify-center'>
                <CreateTransactionModal />
                Profile
            </div>
        </div >
    );
};

export default Profile;
