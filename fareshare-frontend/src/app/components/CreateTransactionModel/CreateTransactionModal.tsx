import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Select,
    Textarea,
} from "@nextui-org/react";

import DynamicFields from "./DynamicFields";

export default function CreateTransactionModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                                <Input
                                    placeholder="Enter your transaction entry title"
                                    variant="bordered"
                                />
                                <Textarea
                                    variant="bordered"
                                    labelPlacement="outside"
                                    placeholder="Enter your transaction entry description"
                                    defaultValue=""
                                    className="max-w"
                                />
                                <Input
                                    placeholder="Enter your transaction entry amount"
                                    variant="bordered"
                                />

                                {/* Dropdown for selecting a category or type of transaction */}
                                <DynamicFields />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
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
