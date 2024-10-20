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
import { GiConsoleController } from 'react-icons/gi';
import { useAuth } from '@/app/context/AuthContext';

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
    inputField: string
    id: number; // Unique identifier for each related user
    transaction_entry_id: number | null;
    user_id: number | null;
    paid: boolean;
    amount: number;
    email: string;
}

export default function CreateTransactionModal() {
    const { token, userId, userEmail, tokenExpiry, setToken, setUserId, setUserEmail, setTokenExpiry } = useAuth();
    const [focusedFieldId, setFocusedFieldId] = useState<number | null>(null);

    const handleBlur = () => {
        // Reset the focusedFieldId when the input field loses focus
        setFocusedFieldId(null);
    };

    const [transaction, setTransaction] = useState<TransactionEntry>({
        title: '',
        description: '',
        amount: 0,
        user_id: 0, // Initialize with a default value
    });

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [transactionRelatedUserFields, setTransactionRelatedUserFields] = useState<TransactionRelatedUser[]>([
        { inputField: "", id: Date.now(), user_id: null, transaction_entry_id: null, paid: false, amount: 0, email: "" }
    ]);
    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [isSuggestionClicked, setIsSuggestionClicked] = useState<boolean>(false); // Track clicks on suggestions

    // Handlers
    const handleInputChangeTransactionEntry = (field: keyof TransactionEntry, value: string | number) => {
        setTransaction(prev => ({ ...prev, [field]: value }));
    };

    const handleSuggestionClick = (user: User, id: number) => {
        // setQuery(user.email); // Set query to the selected user's email
        const updatedFields = transactionRelatedUserFields.map((f) => {
            if (f.id === id) {
                return {
                    ...f,
                    email: user.email,  // Update the email field
                    user_id: user.id,    // Update the user_id field
                    inputField: user.email
                };
            }
            return f;
        });

        // Update the state with both changes at once

        setSuggestions([]); // Clear suggestions
        setIsSuggestionClicked(true); // Set flag to indicate suggestion click
        setTransactionRelatedUserFields(updatedFields);
    };

    const addTransactionRelatedUserField = () => {
        setTransactionRelatedUserFields([...transactionRelatedUserFields, { inputField: "", id: Date.now(), user_id: 0, transaction_entry_id: 0, paid: false, amount: 0, email: "" }]);
    };

    const handleChange = (id: number, field: 'email' | 'amount' | 'user_id' | 'inputField', value: string | number) => {
        console.log(value)
        const newFields = transactionRelatedUserFields.map((f) => {
            if (f.id === id) {
                return { ...f, [field]: field === 'amount' ? Number(value) : value }; // Update specific field
            }
            return f;
        });
        setTransactionRelatedUserFields(newFields);
    };

    useEffect(() => {
        console.log(transactionRelatedUserFields)
    }, [transactionRelatedUserFields]);

    const handleInputChangeSearch = (e: React.ChangeEvent<HTMLInputElement>, id: number): void => {
        setQuery(e.target.value);
        setIsSuggestionClicked(false); // Reset flag on normal input change
        setFocusedFieldId(id);

    };

    const handleInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>, id: number): void => {
        handleChange(id, 'inputField', e.target.value)
    }


    const removeTransactionRelatedUserField = (id: number) => {
        setTransactionRelatedUserFields(transactionRelatedUserFields.filter((f) => f.id !== id)); // Remove field by id
    };

    const handleSubmit = async () => {
        try {
            const postTransactionResponse = await axios.post('http://localhost:3000/transaction_entries', {
                transaction_entry: {
                    title: transaction.title,
                    description: transaction.description,
                    user_id: userId,
                    amount: transaction.amount
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`  // Set the Bearer token in the Authorization header
                }
            });

            const transactionIdGenerated = postTransactionResponse.data.id
            console.log(transactionRelatedUserFields.length)
            console.log(transactionRelatedUserFields[0])
            console.log(transactionRelatedUserFields)
            transactionRelatedUserFields.map(async (transactionRelatedUserField) => {
                try {
                    const postTransactionRelatedUsersResponse = await axios.post('http://localhost:3000/transaction_related_users', {
                        transaction_related_user: {
                            amount: transactionRelatedUserField.amount, // Assuming each field has an amount property
                            user_id: transactionRelatedUserField.user_id, // Assuming each field has a user_id property
                            transaction_entry_id: transactionIdGenerated
                        }
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`  // Set the Bearer token in the Authorization header
                        }
                    });

                    console.log('Transaction related user created:', postTransactionRelatedUsersResponse.data);
                } catch (error) {
                    console.error('Error creating transaction related user:', error);
                }
            })

        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                console.log(err.response.data.error || 'Transaction creation failed');
            } else {
                console.log('An unexpected error occurred');
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
                    const response = await axios.get(`http://localhost:3000/search?query=${query}`, {
                        headers: {
                            Authorization: `Bearer ${token}`  // Set the Bearer token in the Authorization header
                        }
                    });
                    if (response.data.decode_error) {
                        console.log("Authentication Error")
                    }
                    else {
                        setSuggestions(response.data);
                    }

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
                                    {transactionRelatedUserFields.map((transactionRelatedUserField, index) => (
                                        <div key={transactionRelatedUserField.id} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div className='flex flex-row space-x-2'>
                                                <div className='w-4/6'>
                                                    <div>
                                                        <Input
                                                            placeholder="Enter an email or username..."
                                                            value={transactionRelatedUserField.inputField}
                                                            onChange={(e) => { handleInputChangeSearch(e, transactionRelatedUserField.id); handleInputFieldChange(e, transactionRelatedUserField.id) }}
                                                        />
                                                        {suggestions.length > 0 && focusedFieldId === transactionRelatedUserField.id && ( // Show suggestions only for the focused field
                                                            <ul className="mt-2 bg-white border border-gray-300 rounded">
                                                                {suggestions.map((user) => (
                                                                    <li
                                                                        key={user.id}
                                                                        className="p-2 cursor-pointer border-b border-gray-200 hover:bg-gray-100"
                                                                        onClick={() => handleSuggestionClick(user, transactionRelatedUserField.id)}
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
                                                        value={transactionRelatedUserField.amount.toString()} // Ensure value is a string for the input
                                                        onChange={(event) => handleChange(transactionRelatedUserField.id, 'amount', event.target.value)}
                                                        variant="bordered"
                                                    />
                                                </div>
                                                <Button onClick={() => removeTransactionRelatedUserField(transactionRelatedUserField.id)} isIconOnly color="danger" aria-label="Remove User">
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
            </Modal >
        </>
    );
}
