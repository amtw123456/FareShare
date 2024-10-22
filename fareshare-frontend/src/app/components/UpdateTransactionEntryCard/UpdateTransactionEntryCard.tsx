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
    Switch,
    Card,
    Spinner,
} from "@nextui-org/react";
import axios from 'axios';
import { XIcon } from './base/XIcon';
import { useAuth } from '@/app/context/AuthContext';
import dynamic from 'next/dynamic';
import { LatLngExpression, LatLngTuple } from 'leaflet';

// interface TransactionEntry {
//     title: string;
//     description: string;
//     amount: number;
//     user_id: number;
// }

interface User {
    id: number;
    email: string;
    user_name: string;
}


interface TransactionEntry {
    id: number;
    title: string;
    description: string;
    amount: number;
    created_at: string;
    user_id: number;
    lat: number;
    long: number;
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

interface UpdateTransactionEntryCardProps {
    transactionEntryProps: TransactionEntry
    isEditBooleanProps: Boolean
    isSetEditBooleanProps: (value: boolean) => void;
    transactionRelatedUser: TransactionRelatedUser[];
    users: User[]
    setIsRefreshTransactionEntries: (value: boolean) => void;
    setIsRefreshRelatedUser: (value: boolean) => void; // Prop to track button pressed

}

const UpdateTransactionEntryCard: React.FC<UpdateTransactionEntryCardProps> =
    ({
        transactionEntryProps,
        isEditBooleanProps,
        isSetEditBooleanProps,
        transactionRelatedUser,
        users,
        setIsRefreshTransactionEntries,
        setIsRefreshRelatedUser
    }) => {

        const { token, userId, userEmail, tokenExpiry, setToken, setUserId, setUserEmail, setTokenExpiry } = useAuth();
        const [mapPosition, setMapPosition] = useState<[number, number]>([14.598202469575067, 120.97252843149849]);
        const [newUsersDetails, setnewUsersDetails] = useState<User[] | null>(users);
        const [focusedFieldId, setFocusedFieldId] = useState<number | null>(null);
        const [originalUserCounter, setOriginalUserCounter] = useState<number | null>(users.length);
        const [relatedUserIdsToDelete, setRelatedUserIdsToDelete] = useState<number[]>([]);
        const [hasComponentRendered, setHasComponentRendered] = useState<Boolean>(false);
        const [loading, setLoading] = useState<boolean>(false); // Loading state
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const handleEditClick = (value: boolean) => {
            isSetEditBooleanProps(value); // Set isEdit to true when the button is clicked
        };

        const [transaction, setTransaction] = useState<TransactionEntry>({
            id: transactionEntryProps.id,
            title: transactionEntryProps.title,
            description: transactionEntryProps.description,
            amount: transactionEntryProps.amount,
            user_id: transactionEntryProps.user_id, // Initialize with a default value
            created_at: transactionEntryProps.created_at,
            lat: transactionEntryProps.lat,
            long: transactionEntryProps.long
        });

        const [transactionRelatedUserFields, setTransactionRelatedUserFields] = useState<TransactionRelatedUser[]>(() => {
            return transactionRelatedUser.map(transactionRelatedUser => {
                const user = users.find(user => user.id === transactionRelatedUser.user_id);
                return {
                    ...transactionRelatedUser,
                    inputField: user ? user.email : null, // Initialize inputField with user email if found
                    email: user ? user.email : null
                };
            });
        });

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

        const handleChange = (id: number, field: 'email' | 'amount' | 'user_id' | 'inputField' | 'paid', value: string | number | boolean) => {
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
            setRelatedUserIdsToDelete([...relatedUserIdsToDelete, id])
            setTransactionRelatedUserFields(finalizedUserFields);
        };

        useEffect(() => {
            console.log(relatedUserIdsToDelete)
        }, [relatedUserIdsToDelete]);


        const handleUpdateSubmit = async () => {
            setLoading(true)
            try {
                const postTransactionResponse = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction_entries/${transaction.id}`, {
                    transaction_entry: {
                        title: transaction.title,
                        description: transaction.description,
                        user_id: userId,
                        amount: transaction.amount,
                        lat: mapPosition[0],
                        long: mapPosition[1]
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`  // Set the Bearer token in the Authorization header
                    }
                });

                relatedUserIdsToDelete.map(async (relatedUserId) => {
                    try {
                        const deletedTransactionRelatedUsersResponse = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction_related_users/${relatedUserId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`  // Set the Bearer token in the Authorization header
                                }
                            });

                        console.log('Transaction related user deleted:', deletedTransactionRelatedUsersResponse.data);
                    } catch (error) {
                        console.error('Error deleting transaction related user:', error);
                    }
                })

                const transactionId = transaction.id

                transactionRelatedUserFields.map(async (transactionRelatedUserField) => {
                    await delay(1000);
                    try {
                        const putTransactionRelatedUsersResponse = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction_related_users/${transactionRelatedUserField.id}`, {
                            transaction_related_user: {
                                amount: transactionRelatedUserField.amount, // Assuming each field has an amount property
                                user_id: transactionRelatedUserField.user_id, // Assuming each field has a user_id property
                                transaction_entry_id: transactionId,
                                paid: transactionRelatedUserField.paid
                            }
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`  // Set the Bearer token in the Authorization header
                            }
                        });

                        setIsRefreshTransactionEntries(true)
                        setIsRefreshRelatedUser(true)
                        handleEditClick(false)
                        setLoading(false)
                        console.log('Transaction Updated', putTransactionRelatedUsersResponse.data);
                    } catch (error) {
                        console.error('Error updating transaction transaction must not exist:');
                        await delay(1000);
                        try {
                            const postTransactionRelatedUsersResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction_related_users`, {
                                transaction_related_user: {
                                    amount: transactionRelatedUserField.amount, // Assuming each field has an amount property
                                    user_id: transactionRelatedUserField.user_id, // Assuming each field has a user_id property
                                    transaction_entry_id: transactionId,
                                    paid: transactionRelatedUserField.paid
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
            // setTransaction({ title: '', description: '', amount: 0, user_id: 0 });
        };

        // Fetch user suggestions based on the query
        useEffect(() => {
            if (query && !isSuggestionClicked) {
                const fetchSuggestions = async () => {
                    try {
                        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search?query=${query}`, {
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
        }, [query, isSuggestionClicked, 3000]);

        useEffect(() => {
            if (hasComponentRendered) {
                const updatedAmount = transaction.amount / transactionRelatedUserFields.length;

                // Update all fields with the new amount
                const finalizedUserFields = transactionRelatedUserFields.map(relatedUserField => ({
                    ...relatedUserField,
                    amount: updatedAmount, // Set each field's amount to the new calculated amount
                }));

                // Set the state with the updated user fields
                setTransactionRelatedUserFields(finalizedUserFields);

            }
            setHasComponentRendered(true)
        }, [transaction.amount]);

        const Map = useMemo(() => dynamic(
            () => import('../Maps/MapsClickable'),
            {
                loading: () => <p>A map is loading</p>,
                ssr: false
            }
        ), []);

        useEffect(() => {
            console.log(transactionRelatedUserFields)
        }, [transactionRelatedUserFields]);

        const handlePositionChange = (newPosition: LatLngTuple) => {
            const [lat, lng] = newPosition;
            setMapPosition([lat, lng]);
        };

        return (
            <Card className="bg-white max-[700px] px-4 py-2">
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
                    <Map posix={[transactionEntryProps.lat, transactionEntryProps.long]} onPositionChange={handlePositionChange} />
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
                <div className='flex flex-col justify-center items-center'>
                    <span className='mb-4'>Related Users</span>
                    {transactionRelatedUserFields.map((transactionRelatedUserField, index) => (
                        <div key={transactionRelatedUserField.id} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className='flex row space-x-1'>
                                <div className='w-3/6'>
                                    <Input
                                        label="Email:"
                                        readOnly={transactionRelatedUserField.id < (Date.now() - 100000000) ? true : false} // Set isReadOnly based on index
                                        labelPlacement="outside-left"
                                        value={transactionRelatedUserField.inputField!}
                                        onChange={(e) => { handleInputChangeSearch(e, transactionRelatedUserField.id); handleInputFieldChange(e, transactionRelatedUserField.id) }}
                                        size='sm'
                                    />
                                    {suggestions.length > 0 && focusedFieldId === transactionRelatedUserField.id && ( // Show suggestions only for the focused field
                                        <ul className="max-w-4/6 mt-2 bg-white border border-gray-300 rounded">
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
                                <div className='w-2/6'>
                                    <Input
                                        size='sm'
                                        label="Share:"
                                        labelPlacement="outside-left"
                                        value={transactionRelatedUserField.amount.toString()} // Ensure value is a string for the input
                                        onChange={(event) => handleChange(transactionRelatedUserField.id, 'amount', event.target.value)}
                                        variant="bordered"
                                    />
                                </div>

                                <div style={{ alignItems: 'center' }}>
                                    <div className='flex flex-row justify-center items-center'>
                                        <span className="text-sm" style={{ marginRight: '8px' }}>Paid:</span>
                                        <Switch isSelected={transactionRelatedUserField.paid} onValueChange={() => handleChange(transactionRelatedUserField.id, 'paid', !transactionRelatedUserField.paid)} defaultSelected color="secondary" />
                                    </div>
                                </div>
                                <div className='items-center justify-center'>
                                    <Button
                                        onClick={() => removeTransactionRelatedUserField(transactionRelatedUserField.id)}
                                        isIconOnly
                                        aria-label="Remove User"
                                        disabled={index === 0} // Disable the button if it's the first field
                                        style={{ backgroundColor: 'white', border: 'none', padding: "0px" }} // Set background color to white
                                        size='sm'

                                    >
                                        <XIcon className={index === 0 ? "text-gray-400" : "text-red-400"} size={18} height={undefined} width={undefined} />

                                    </Button>
                                </div>

                            </div>
                        </div>
                    ))}
                    <Button
                        size="md"
                        onClick={addTransactionRelatedUserField}
                        color="secondary"
                        className="p-0 m-0"
                    >
                        +
                    </Button>

                </div>
                <div className='text-center text-xl'>
                    Total share per user: {transaction.amount / transactionRelatedUserFields.length}
                </div>
                <div className='flex flex-row space-x-4 justify-center'>
                    <Button
                        size="md"
                        onClick={() => handleEditClick(false)}
                        color="secondary"
                        className="p-0 m-0"
                    >
                        Cancel
                    </Button>

                    <Button
                        size="md"
                        // onClick={handleUpdateSubmit}
                        onClick={() => { handleUpdateSubmit() }}
                        color="warning"
                        className="p-0 m-0"
                    >
                        {loading ? ( // Show loading state
                            <Spinner size={'sm'} color={'warning'} />
                        ) : (
                            <span>Update</span>
                        )}
                    </Button>
                </div>
            </Card>
        );
    }

export default UpdateTransactionEntryCard
