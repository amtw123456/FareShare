"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import CreateTransactionModal from '../components/CreateTransactionModel/CreateTransactionModal';
import { useAuth } from '../context/AuthContext';
import TransactionEntryCard from '../components/TransactionEntryCard/TransactionEntryCard';

interface User {
    email: string;
    password: string;
}

interface TransactionEntry {
    id: number;
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

    // Function to fetch transaction entries
    const fetchTransactionEntries = async () => {
        console.log(userId)
        try {
            const response = await axios.get(`http://localhost:3000/transaction_entries/for_user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token if needed
                },
            });
            console.log(response.data)
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

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
            <NavigationBar />
            <div className='flex justify-center mt-5'>
                <div className='flex flex-col justify-center items-center'>
                    <CreateTransactionModal />
                    <div className='mt-5 space-y-4'>
                        {loading ? ( // Show loading state
                            <p>Loading transaction entries...</p>
                        ) : (
                            transactionEntries.map((transactionEntry) => (
                                <TransactionEntryCard key={transactionEntry.id} transactionEntry={transactionEntry} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
