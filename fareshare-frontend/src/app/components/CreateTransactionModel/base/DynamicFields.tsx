// components/DynamicFields.tsx
import React, { useState } from 'react';
import { Button, Input } from "@nextui-org/react";
import { XIcon } from './XIcon';
import TaggingComponent from "./TaggingComponent";

interface TransactionRelatedUser {
    id: number; // Add id field for identification
    transaction_entry_id: number;
    user_id: number;
    email: string;
    amount: number;
}

const DynamicFields: React.FC = () => {
    const [fields, setFields] = useState<TransactionRelatedUser[]>([
        { id: Date.now(), user_id: 0, transaction_entry_id: 0, email: "", amount: 0 }
    ]);

    const addField = () => {
        setFields([...fields, { id: Date.now(), user_id: 0, transaction_entry_id: 0, email: "", amount: 0 }]); // Add a new field with a unique id
    };

    const handleChange = (id: number, field: 'email' | 'amount' | 'user_id', value: string | number) => {
        const newFields = fields.map((f) => {
            if (f.id === id) {
                return { ...f, [field]: field === 'amount' ? Number(value) : value }; // Update the specific field value, converting amount to number
            }
            return f;
        });
        setFields(newFields);
    };

    const removeField = (id: number) => {
        const newFields = fields.filter((f) => f.id !== id); // Remove the field by id
        setFields(newFields);
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <span>Related Users</span>
            {fields.map((field) => (
                <div key={field.id} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className='flex flex-row space-x-2'>
                        <div className='w-4/6'>
                            <TaggingComponent />
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
            <Button onClick={addField} color="primary">+</Button>
        </div>
    );
};

export default DynamicFields;
