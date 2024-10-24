"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import CreateTransactionModal from '../components/CreateTransactionModel/CreateTransactionModal';
import { useAuth } from '../context/AuthContext';
import TransactionEntryCard from '../components/TransactionEntryCard/TransactionEntryCard';
import { CircularProgress } from "@nextui-org/react";


interface User {
    email: string;
    password: string;
}

interface TransactionEntry {
    id: number;
    lat: number;
    long: number;
    title: string;
    amount: number;
    user_id: number;
    created_at: string;
    description: string;
}

const Home = () => {
    const { token, userId } = useAuth(); // Use your authentication context
    const [transactionEntries, setTransactionEntries] = useState<TransactionEntry[]>([]); // State to hold transaction entries
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [isRefreshTransactionEntries, setIsRefreshTransactionEntries] = useState<boolean>(false); // State to track if button is pressed

    // Function to fetch transaction entries
    const fetchTransactionEntries = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction_entries/for_user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token if needed
                },
            });
            console.log(response)

            setTransactionEntries(response.data); // Set the state with fetched data
        } catch (error) {
            console.error("Error fetching transaction entries:", error);
            // Handle error here (e.g., show a message to the user)
        } finally {
            setLoading(false); // Set loading to false after request completion
        }
    };

    // Fetch transaction entries on component mount or userId change
    useEffect(() => {
        if (userId) {
            fetchTransactionEntries(); // Call the function to fetch entries
        }
    }, [userId]);

    useEffect(() => {
        fetchTransactionEntries();

    }, [isRefreshTransactionEntries]);

    useEffect(() => {
        setIsRefreshTransactionEntries(false)
    }, [transactionEntries]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
            <NavigationBar />
            <div className='flex justify-center mt-5'>
                <div className="flex flex-col justify-center items-center w-full max-w-[600px] mx-auto"> {/* Centered with max width */}
                    <CreateTransactionModal setIsRefreshTransactionEntries={setIsRefreshTransactionEntries} />
                    <div className='w-full mt-5 space-y-4'>
                        {loading ? ( // Show loading state
                            <div className='flex justify-center'>
                                <CircularProgress color={'secondary'} label="Loading transaction entries" />
                            </div>
                        ) : (
                            transactionEntries.map((transactionEntry) => (
                                <TransactionEntryCard key={transactionEntry.id} transactionEntry={transactionEntry} showDropDownSettings={false} setIsRefreshTransactionEntries={setIsRefreshTransactionEntries} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
