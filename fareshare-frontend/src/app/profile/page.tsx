"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import CreateTransactionModal from "../components/CreateTransactionModel/CreateTransactionModal"
import axios from 'axios';

interface User {
    email: string;
    password: string;
}

const Profile = () => {


    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <CreateTransactionModal />
        </div>
    );
};

export default Profile;
