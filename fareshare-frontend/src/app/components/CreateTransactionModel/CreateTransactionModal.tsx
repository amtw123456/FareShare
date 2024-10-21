import React, { useEffect, useMemo, useState } from 'react';
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
import { useAuth } from '@/app/context/AuthContext';
import dynamic from 'next/dynamic';

interface TransactionEntry {
    title: string;
    description: string;
    amount: number;
    user_id: number;
}

interface User {
    id: number;
    email: string;
    user_name: string;
}

interface TransactionRelatedUser {
    id: number;
    paid: boolean;
    email: string | null;
    amount: number;
    inputField: string | null
    user_id: number | null;
    transaction_entry_id: number | null;

}

export default function CreateTransactionModal() {
    const { token, userId, userEmail, tokenExpiry, setToken, setUserId, setUserEmail, setTokenExpiry } = useAuth();
    const [focusedFieldId, setFocusedFieldId] = useState<number | null>(null);

    const [transaction, setTransaction] = useState<TransactionEntry>({
        title: '',
        description: '',
        amount: 0,
        user_id: 0, // Initialize with a default value
    });

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [transactionRelatedUserFields, setTransactionRelatedUserFields] = useState<TransactionRelatedUser[]>([
        { inputField: userEmail, id: Date.now(), user_id: userId, transaction_entry_id: null, paid: false, amount: transaction.amount, email: userEmail }
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
        // Create a new related user field to add
        const newRelatedUserField = {
            inputField: "",
            id: Date.now(),
            user_id: 0,
            transaction_entry_id: 0,
            paid: false,
            amount: transaction.amount / (transactionRelatedUserFields.length + 1), // Set initial amount for the new field
            email: ""
        };

        // Create an array of all related user fields including the new one
        const allRelatedUserFields = [...transactionRelatedUserFields, newRelatedUserField];

        // Calculate the new amount to be assigned to each field
        const updatedAmount = transaction.amount / allRelatedUserFields.length;

        // Update all fields with the new amount
        const finalizedUserFields = allRelatedUserFields.map(relatedUserField => ({
            ...relatedUserField,
            amount: updatedAmount, // Set each field's amount to the new calculated amount
        }));

        // Set the state with the updated user fields
        setTransactionRelatedUserFields(finalizedUserFields);
    };

    const handleChange = (id: number, field: 'email' | 'amount' | 'user_id' | 'inputField', value: string | number) => {
        const newFields = transactionRelatedUserFields.map((f) => {
            if (f.id === id) {
                return { ...f, [field]: field === 'amount' ? Number(value) : value }; // Update specific field
            }
            return f;
        });
        setTransactionRelatedUserFields(newFields);
    };

    const handleInputChangeSearch = (e: React.ChangeEvent<HTMLInputElement>, id: number): void => {
        setQuery(e.target.value);
        setIsSuggestionClicked(false); // Reset flag on normal input change
        setFocusedFieldId(id);

    };

    const handleInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>, id: number): void => {
        handleChange(id, 'inputField', e.target.value)
    }

    const removeTransactionRelatedUserField = (id: number) => {
        // Filter out the field to be removed
        const newTransactionRelatedUserFields = transactionRelatedUserFields.filter((f) => f.id !== id);

        // Calculate the new amount for each remaining field
        const updatedAmount = transaction.amount / newTransactionRelatedUserFields.length;

        // Update each field's amount
        const finalizedUserFields = newTransactionRelatedUserFields.map(relatedUserField => ({
            ...relatedUserField,
            amount: updatedAmount, // Set each field's amount to the new calculated amount
        }));

        // Set the state with the updated user fields
        setTransactionRelatedUserFields(finalizedUserFields);
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
                        const filteredSuggestions = response.data.filter((suggestion: User) =>
                            !transactionRelatedUserFields.some(field => field.email === suggestion.email)
                        );

                        setSuggestions(filteredSuggestions);
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

    useEffect(() => {
        const updatedAmount = transaction.amount / transactionRelatedUserFields.length;

        // Update all fields with the new amount
        const finalizedUserFields = transactionRelatedUserFields.map(relatedUserField => ({
            ...relatedUserField,
            amount: updatedAmount, // Set each field's amount to the new calculated amount
        }));

        // Set the state with the updated user fields
        setTransactionRelatedUserFields(finalizedUserFields);
    }, [transaction.amount]);

    const Map = useMemo(() => dynamic(
        () => import('../Maps/MapsClickable'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), []);

    return (
        <>
            <Button onPress={onOpen} color="primary">
                Create Transaction
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                size={"lg"}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Create a Transaction Entry
                            </ModalHeader>
                            <ModalBody style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                {/* Transaction Entry Inputs */}
                                <Input
                                    placeholder="Enter your transaction entry title"
                                    label="Title"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    value={transaction.title}
                                    onChange={(e) => handleInputChangeTransactionEntry('title', e.target.value)}
                                />
                                <Textarea
                                    variant="bordered"
                                    label="Description"
                                    labelPlacement="outside"
                                    placeholder="Enter your transaction entry description"
                                    value={transaction.description}
                                    onChange={(e) => handleInputChangeTransactionEntry('description', e.target.value)}
                                    className="max-w"
                                />
                                <div className="mx-auto my-5 w-[98%] h-[250px] shrink-0">
                                    <Map posix={[14.598202469575067, 120.97252843149849]} />
                                </div>

                                <div className='flex flex-row space-x-2'>
                                    <Input
                                        type="number"
                                        label="Amount:"
                                        labelPlacement="outside-left"
                                        placeholder="Enter your transaction entry amount"
                                        variant="bordered"
                                        value={transaction.amount.toString()}
                                        onChange={(e) => handleInputChangeTransactionEntry('amount', parseFloat(e.target.value) || 0)}
                                    />
                                    <Input
                                        type="number"
                                        isReadOnly={true}
                                        label="Participants:"
                                        labelPlacement="outside-left"
                                        placeholder="Number of related Users"
                                        variant="bordered"
                                        value={String(transactionRelatedUserFields.length)}
                                        onChange={(e) => handleInputChangeTransactionEntry('amount', parseFloat(e.target.value) || 0)}
                                        className='focus:outline-none'
                                    />
                                </div>

                                {/* Related Users Section */}
                                <div className='flex flex-col justify-center items-center'>
                                    <span className='mb-4'>Related Users</span>
                                    {transactionRelatedUserFields.map((transactionRelatedUserField, index) => (
                                        <div key={transactionRelatedUserField.id} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div className='flex flex-row space-x-1'>
                                                <div className='w-5/6'>
                                                    <div>
                                                        <Input
                                                            placeholder="Enter an email"
                                                            label="Email:"
                                                            labelPlacement="outside-left"
                                                            value={transactionRelatedUserField.inputField!}
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
                                                <div className='w-3/6'>
                                                    <Input
                                                        type="number"
                                                        label="Share:"
                                                        labelPlacement="outside-left"
                                                        value={transactionRelatedUserField.amount.toString()} // Ensure value is a string for the input
                                                        onChange={(event) => handleChange(transactionRelatedUserField.id, 'amount', event.target.value)}
                                                        variant="bordered"
                                                    />
                                                </div>
                                                <Button
                                                    onClick={() => removeTransactionRelatedUserField(transactionRelatedUserField.id)}
                                                    isIconOnly
                                                    color={index === 0 ? "default" : "danger"} // Change color based on index
                                                    aria-label="Remove User"
                                                    disabled={index === 0} // Disable the button if it's the first field
                                                >
                                                    <XIcon size={undefined} height={undefined} width={undefined} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button onClick={addTransactionRelatedUserField} color="primary">+</Button>
                                </div>
                                <div className='text-center text-xl'>
                                    Total share per user: {transaction.amount / transactionRelatedUserFields.length}
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
