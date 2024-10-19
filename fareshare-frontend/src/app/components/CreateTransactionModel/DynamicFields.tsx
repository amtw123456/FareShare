// components/DynamicFields.tsx
import React, { useState } from 'react';
import { Button, Input } from "@nextui-org/react";
import { XIcon } from './base/XIcon';

import TaggingComponent from "./TaggingComponent";

interface Field {
    id: number;
    email: string;
    amount: string;
}

const DynamicFields: React.FC = () => {
    const [fields, setFields] = useState<Field[]>([{ id: Date.now(), email: "", amount: "" }]);

    const addField = () => {
        setFields([...fields, { id: Date.now(), email: "", amount: "" }]); // Add a new field
    };

    const handleChange = (id: number, field: 'email' | 'amount', value: string) => {
        const newFields = fields.map((f) => {
            if (f.id === id) {
                return { ...f, [field]: value }; // Update the specific field value
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
            Related Users
            {fields.map((field) => (
                <div key={field.id} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className='flex flex-row space-x-2'>
                        <div className='w-4/6'>
                            <TaggingComponent />
                        </div>
                        <div className='w-2/6'>
                            <Input
                                placeholder="Enter amount"
                                value={field.amount}
                                onChange={(event) => handleChange(field.id, 'amount', event.target.value)}
                                variant="bordered"
                            />
                        </div>
                        <Button onClick={() => removeField(field.id)} isIconOnly color="danger" aria-label="Take a photo">
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
