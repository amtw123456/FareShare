import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import axios from 'axios';

interface User {
    id: number;
    email: string;
    user_name: string;
}

const TaggingComponent: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<User[]>([]);

    useEffect(() => {
        if (query) {
            axios.get(`http://localhost:3000/search?query=${query}`)
                .then(response => setSuggestions(response.data))
                .catch(err => console.error("Error fetching suggestions", err));
        } else {
            setSuggestions([]); // Clear suggestions when query is empty
        }
    }, [query]);

    // Function to handle when a suggestion is clicked
    const handleSuggestionClick = (user: User) => {
        setQuery(user.user_name); // Set the input value to the selected user's name or email
        setSuggestions([]); // Clear suggestions after selection
    };

    return (
        <div>
            <Input
                placeholder="Enter an email or username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {suggestions.length > 0 && (
                <ul className="list-none p-0 mt-2 bg-white border border-gray-300 rounded">
                    {suggestions.map((user) => (
                        <li
                            key={user.id}
                            className="p-2 cursor-pointer border-b border-gray-200 transition-colors duration-200 hover:bg-gray-100"
                            onClick={() => handleSuggestionClick(user)}
                        >
                            {user.email}
                        </li>
                    ))}
                </ul>

            )}
        </div>
    );
};

export default TaggingComponent;
