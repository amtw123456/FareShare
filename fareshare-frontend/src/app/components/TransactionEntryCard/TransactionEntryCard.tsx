import { useAuth } from "@/app/context/AuthContext";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Avatar,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    cn,
    Skeleton
} from "@nextui-org/react";
import axios from "axios";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { EllipsisIcon } from "./base/EllipsisIcon";

import { DeleteDocumentIcon } from "./base/DeleteDocumentIcon";
import { EditDocumentIcon } from "./base/EditDocumentIcon";

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
    user_id: number;
    email: string;
    amount: number;
    paid: boolean;
}

interface User {
    id: number;
    email: string;
    user_name: string;
}

interface TransactionEntryCardProps {
    transactionEntry: TransactionEntry;
    showDropDownSettings: boolean;
}

const TransactionEntryCard: React.FC<TransactionEntryCardProps> = ({ transactionEntry, showDropDownSettings }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [relatedUsers, setRelatedUsers] = useState<TransactionRelatedUser[]>([]);
    const [usersDetails, setUsersDetails] = useState<User[]>([]);
    const [transactionCardOwnerName, setTransactionCardOwnerName] = useState<String | null>();


    const Map = useMemo(() => dynamic(
        () => import('../Maps/MapsUnClickable'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), []);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const deleteTransactionEntry = async () => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction_entries/${transactionEntry.id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Set the Bearer token in the Authorization header
                }
            });

            if (response.status === 200) {
                console.log("Transaction entry deleted successfully:", response.data);
                return response.data; // Optionally return the response data if needed
            }
        } catch (error) {
            console.error("Error deleting transaction entry:", error);
        }
    };

    useEffect(() => {
        const fetchRelatedUsers = async () => {
            await delay(1000); // Delay between each API request

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction_related_users/transaction/${transactionEntry.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`  // Set the Bearer token in the Authorization header
                        }
                    });


                setRelatedUsers(response.data); // Set the related users state
            } catch (error) {
                console.error("Error fetching related users:", error);
            }
        };

        fetchRelatedUsers();
    }, [transactionEntry.id]);

    useEffect(() => {
        const userIds = relatedUsers.map(user => {
            return user.user_id; // Return the userId to the new array
        });

        const fetchUsersByIds = async (ids: number[]) => {
            try {
                await delay(1000); // Delay between each API request

                // Make a GET request to the API with the IDs
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/find_by_userIds`, {
                    params: {
                        ids: ids.join(','), // Convert array of IDs to a comma-separated string
                    },
                    headers: {
                        Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
                    },
                });

                setUsersDetails(response.data); // Return the data received from the API
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users by IDs:', error);
                throw error; // Throw the error for further handling if needed
            }
        };
        if (relatedUsers.length !== 0) {
            fetchUsersByIds(userIds);
        }
    }, [relatedUsers]);

    useEffect(() => {
        const ownerOfTransactionCard = usersDetails.map(user => {
            if (user.id === transactionEntry.user_id) {
                return user.email; // Return the email if the user ID matches
            }
            return null; // Return null for non-matching users
        }).filter(email => email !== null)
        setTransactionCardOwnerName(ownerOfTransactionCard.length > 0 ? ownerOfTransactionCard[0] : null);

    }, [usersDetails]);

    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";


    return (
        loading ? ( // Show skeleton while loading
            <Skeleton className="w-[500px] h-[400px]" /> // Adjust dimensions as necessary
        ) : (
            transactionCardOwnerName && ( // Check if transactionCardOwnerName is set
                <Card className="w-[500px]">
                    <CardHeader className="flex justify-between items-center gap-3">
                        <div className="flex gap-3 items-center">
                            <Avatar showFallback src='https://images.unsplash.com/broken' />
                            <div className="flex flex-col">
                                <p className="text-md">{transactionCardOwnerName}</p>
                                <p className="text-small text-default-500">
                                    {new Date(transactionEntry.created_at).toLocaleString('default', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true // Set to false for 24-hour format
                                    })}
                                </p>
                            </div>
                        </div>
                        <div>
                            {showDropDownSettings && (
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button isIconOnly className="bg-color-white">
                                            <EllipsisIcon size={undefined} height={undefined} width={undefined} label={undefined} />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
                                        <DropdownItem
                                            key="edit"
                                            startContent={<EditDocumentIcon className={iconClasses} />}
                                        >
                                            Edit file
                                        </DropdownItem>
                                        <DropdownItem
                                            key="delete"
                                            className="text-danger"
                                            startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                                            onClick={deleteTransactionEntry}
                                        >
                                            Delete file
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            )}
                        </div>
                    </CardHeader>

                    <Divider />
                    <CardBody className="px-0 flex flex-col">
                        <div className="text-center font-bold text-xl">
                            <p className="px-2">{transactionEntry.title}</p>
                        </div>
                        <p className="px-2 text-justify">{transactionEntry.description}</p>
                        <Divider />
                        <div className="bg-white-700 px-2 mx-auto my-5 w-[98%] h-[280px]">
                            <Map posix={[transactionEntry.lat, transactionEntry.long]} />
                        </div>
                        <Divider />
                        <div className="px-2 py-2">
                            {relatedUsers.length > 0 ? ( // Check if relatedUsers is not empty
                                <Table
                                    removeWrapper
                                    color={"secondary"}
                                    selectionMode="single"
                                    aria-label="Transaction users table"
                                >
                                    <TableHeader>
                                        <TableColumn>Email</TableColumn>
                                        <TableColumn>Username</TableColumn>
                                        <TableColumn>Amount</TableColumn>
                                        <TableColumn>Paid</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {usersDetails.map((user, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.user_name}</TableCell>
                                                <TableCell>{parseFloat(String(relatedUsers[index].amount)).toFixed(2)}</TableCell>
                                                <TableCell>{relatedUsers[index].paid ? "Yes" : "No"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p>No related users found.</p> // Message when there are no related users
                            )}
                        </div>
                    </CardBody>
                    <Divider />
                    <CardFooter className="px-2 flex justify-center">
                        <p className="flex justify-center items-center">
                            Total Transaction Amount: ₱{parseFloat(String(transactionEntry.amount)).toFixed(2)}
                        </p>
                    </CardFooter>
                </Card>
            )
        )
    );

};

export default TransactionEntryCard;
