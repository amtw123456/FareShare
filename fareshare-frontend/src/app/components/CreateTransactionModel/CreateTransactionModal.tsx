import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import { XIcon } from './base/XIcon';

interface TransactionEntry {
    title: string;
    description: string;
    amount: number;
    user_id: number; // Assuming user_id is to be provided elsewhere
}

interface User {
    id: number;
    email: string;
    user_name: string;
}

interface TransactionRelatedUser {
    id: number; // Unique identifier for each related user
    transaction_entry_id: number;
    user_id: number;
    email: string;
    amount: number;
}

export default function CreateTransactionModal() {
    const [transaction, setTransaction] = useState<TransactionEntry>({
        title: '',
        description: '',
        amount: 0,
        user_id: 3, // Initialize with a default value
    });

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [transactionRelatedUserFields, setTransactionRelatedUserFields] = useState<TransactionRelatedUser[]>([
        { id: Date.now(), user_id: 0, transaction_entry_id: 0, email: "", amount: 0 }
    ]);
    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [isSuggestionClicked, setIsSuggestionClicked] = useState<boolean>(false); // Track clicks on suggestions

    // Handlers
    const handleInputChangeTransactionEntry = (field: keyof TransactionEntry, value: string | number) => {
        setTransaction(prev => ({ ...prev, [field]: value }));
    };

    const handleInputChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsSuggestionClicked(false); // Reset flag on normal input change
    };

    const handleSuggestionClick = (user: User) => {
        setQuery(user.email); // Set query to the selected user's email
        setSuggestions([]); // Clear suggestions
        setIsSuggestionClicked(true); // Set flag to indicate suggestion click
    };

    const addTransactionRelatedUserField = () => {
        setTransactionRelatedUserFields([...transactionRelatedUserFields, { id: Date.now(), user_id: 0, transaction_entry_id: 0, email: "", amount: 0 }]);
    };

    const handleChange = (id: number, field: 'email' | 'amount' | 'user_id', value: string | number) => {
        const newFields = transactionRelatedUserFields.map((f) => {
            if (f.id === id) {
                return { ...f, [field]: field === 'amount' ? Number(value) : value }; // Update specific field
            }
            return f;
        });
        setTransactionRelatedUserFields(newFields);
    };

    const removeField = (id: number) => {
        setTransactionRelatedUserFields(transactionRelatedUserFields.filter((f) => f.id !== id)); // Remove field by id
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/transaction_entries', {
                transaction_entry: {
                    title: transaction.title,
                    description: transaction.description,
                    user_id: transaction.user_id,
                    amount: transaction.amount
                },
            });
            console.log('Transaction entry created:', response.data);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                console.error(err.response.data.error || 'Transaction creation failed');
            } else {
                console.error('An unexpected error occurred');
            }
        }
        // Clear the form after submission
        setTransaction({ title: '', description: '', amount: 0, user_id: 0 });
    };

    // Fetch user suggestions based on the query
    useEffect(() => {
        if (query && !isSuggestionClicked) {
            const fetchSuggestions = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/search?query=${query}`);
                    setSuggestions(response.data);
                } catch (err) {
                    console.error("Error fetching suggestions", err);
                }
            };
            fetchSuggestions();
        } else {
            setSuggestions([]); // Reset suggestions when query is empty or suggestion is clicked
        }
    }, [query, isSuggestionClicked]);

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
                                {/* Transaction Entry Inputs */}
                                <Input
                                    placeholder="Enter your transaction entry title"
                                    variant="bordered"
                                    value={transaction.title}
                                    onChange={(e) => handleInputChangeTransactionEntry('title', e.target.value)}
                                />
                                <Textarea
                                    variant="bordered"
                                    labelPlacement="outside"
                                    placeholder="Enter your transaction entry description"
                                    value={transaction.description}
                                    onChange={(e) => handleInputChangeTransactionEntry('description', e.target.value)}
                                    className="max-w"
                                />
                                <Input
                                    type="number"
                                    placeholder="Enter your transaction entry amount"
                                    variant="bordered"
                                    value={transaction.amount.toString()}
                                    onChange={(e) => handleInputChangeTransactionEntry('amount', parseFloat(e.target.value) || 0)}
                                />

                                {/* Related Users Section */}
                                <div className='flex flex-col justify-center items-center'>
                                    <span>Related Users</span>
                                    {transactionRelatedUserFields.map((field) => (
                                        <div key={field.id} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div className='flex flex-row space-x-2'>
                                                <div className='w-4/6'>
                                                    <div>
                                                        <Input
                                                            placeholder="Enter an email or username..."
                                                            value={query}
                                                            onChange={handleInputChangeSearch}
                                                        />
                                                        {suggestions.length > 0 && (
                                                            <ul className="mt-2 bg-white border border-gray-300 rounded">
                                                                {suggestions.map((user) => (
                                                                    <li
                                                                        key={user.id}
                                                                        className="p-2 cursor-pointer border-b border-gray-200 hover:bg-gray-100"
                                                                        onClick={() => handleSuggestionClick(user)}
                                                                    >
                                                                        {user.email}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='w-2/6'>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter amount"
                                                        value={field.amount.toString()} // Ensure value is a string for the input
                                                        onChange={(event) => handleChange(field.id, 'amount', event.target.value)}
                                                        variant="bordered"
                                                    />
                                                </div>
                                                <Button onClick={() => removeField(field.id)} isIconOnly color="danger" aria-label="Remove User">
                                                    <XIcon size={undefined} height={undefined} width={undefined} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button onClick={addTransactionRelatedUserField} color="primary">+</Button>
                                </div>
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
