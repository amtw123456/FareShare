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
    TableCell
} from "@nextui-org/react";
import axios from "axios";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";

interface TransactionEntry {
    id: number;
    title: string;
    description: string;
    amount: number;
    created_at: string;
    user_id: number;
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
}

const TransactionEntryCard: React.FC<TransactionEntryCardProps> = ({ transactionEntry }) => {
    const { token } = useAuth();
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

    useEffect(() => {
        const fetchRelatedUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/transaction_related_users/transaction/${transactionEntry.id}`,
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
                // Make a GET request to the API with the IDs
                const response = await axios.get(`http://localhost:3000/find_by_userIds`, {
                    params: {
                        ids: ids.join(','), // Convert array of IDs to a comma-separated string
                    },
                    headers: {
                        Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
                    },
                });
                setUsersDetails(response.data); // Return the data received from the API
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
        console.log(ownerOfTransactionCard)
        setTransactionCardOwnerName(ownerOfTransactionCard.length > 0 ? ownerOfTransactionCard[0] : null);

    }, [usersDetails]);

    return (
        <>
            {transactionCardOwnerName && ( // Check if transactionCardOwnerName is set
                <Card className="w-[500px]">
                    <CardHeader className="flex gap-3">
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
                    </CardHeader>
                    <Divider />
                    <CardBody className="px-0 flex flex-col">
                        <div className="text-center font-bold text-xl">
                            <p className="px-2">{transactionEntry.title}</p>
                        </div>
                        <p className="px-2 text-justify">{transactionEntry.description}</p>
                        <Divider />
                        <div className="bg-white-700 px-2 mx-auto my-5 w-[98%] h-[280px]">
                            <Map posix={[14.598202469575067, 120.97252843149849]} />
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
                                                <TableCell >{user.email}</TableCell>
                                                <TableCell >{user.user_name}</TableCell>
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
            )}
        </>
    );
};

export default TransactionEntryCard;
