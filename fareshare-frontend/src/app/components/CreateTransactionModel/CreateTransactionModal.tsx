import React, { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Textarea,
} from "@nextui-org/react";

import DynamicFields from "./DynamicFields";
import axios from 'axios';

interface TransactionEntry {
    title: string;
    description: string;
    amount: number;
    user_id: number; // Assuming user_id is to be provided elsewhere
}

export default function CreateTransactionModal() {
    const [transaction, setTransaction] = useState<TransactionEntry>({
        title: '',
        description: '',
        amount: 0,
        user_id: 3, // Initialize with a default value
    });
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [error, setError] = useState<string | null>(null); // State for error handling

    const handleInputChange = (field: keyof TransactionEntry, value: string | number) => {
        setTransaction(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/transaction_entries', {
                transaction_entry: {  // Wrap the email and password in a user object
                    title: transaction.title, // Assuming title holds email for login
                    description: transaction.description, // Assuming description holds password
                    user_id: transaction.user_id,
                    amount: transaction.amount
                },
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

        // Clear the form after submission (optional)
        setTransaction({
            title: '',
            description: '',
            amount: 0,
            user_id: 0, // Reset user_id if necessary
        });
    };

    return (
        <>
            <Button onPress={onOpen} color="primary">
                Create Transaction
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Create a Transaction Entry
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    placeholder="Enter your transaction entry title"
                                    variant="bordered"
                                    value={transaction.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                />
                                <Textarea
                                    variant="bordered"
                                    labelPlacement="outside"
                                    placeholder="Enter your transaction entry description"
                                    value={transaction.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="max-w"
                                />
                                <Input
                                    type="number"
                                    placeholder="Enter your transaction entry amount"
                                    variant="bordered"
                                    value={transaction.amount.toString()}
                                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                                />

                                {/* Dropdown for selecting a category or type of transaction */}
                                <DynamicFields />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={handleSubmit}>
                                    Create
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
