import React, { useState, useEffect } from 'react';
import { Input } from "@nextui-org/react";
import axios from 'axios';

interface User {
    id: number;
    email: string;
    user_name: string;
}

const TaggingComponent: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [isSuggestionClicked, setIsSuggestionClicked] = useState<boolean>(false); // New state for tracking clicks

    useEffect(() => {
        if (query && !isSuggestionClicked) { // Check if not a suggestion click
            axios.get(`http://localhost:3000/search?query=${query}`)
                .then(response => setSuggestions(response.data))
                .catch(err => console.error("Error fetching suggestions", err));
        } else {
            // Reset suggestions when query is empty or suggestion is clicked
            setSuggestions([]);
        }
    }, [query, isSuggestionClicked]); // Add isSuggestionClicked as a dependency

    const handleSuggestionClick = (user: User) => {
        setQuery(user.email); // Set the query to the selected user's email
        setSuggestions([]); // Clear suggestions to avoid showing them again
        setIsSuggestionClicked(true); // Set the flag to indicate a suggestion was clicked
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsSuggestionClicked(false); // Reset the flag on normal input change
    };

    return (
        <div>
            <Input
                placeholder="Enter an email or username..."
                value={query}
                onChange={handleInputChange} // Use the new input handler
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
    );
};

export default TaggingComponent;
