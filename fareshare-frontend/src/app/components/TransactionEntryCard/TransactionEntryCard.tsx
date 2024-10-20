import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Link,

    Avatar,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    RadioGroup,
    Radio
} from "@nextui-org/react";
import React from "react";

export default function TransactionEntryCard() {


    return (
        <Card className="max-w-[500px]">
            <CardHeader className="flex gap-3">
                <Avatar showFallback src='https://images.unsplash.com/broken' />
                <div className="flex flex-col">
                    <p className="text-md">Ronel Dylan Joshua Aguiero Dolor</p>
                    <p className="text-small text-default-500">Enchanted Kingdom Trip</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="px-0 flex flex-col">
                <p>Make beautiful websites regardless of your design experience.</p>
                <Divider />
                <div className="px-2 py-2">
                    <Table
                        removeWrapper
                        color={"secondary"}
                        selectionMode="single"
                        defaultSelectedKeys={["2"]}
                        aria-label="Example static collection table"
                    >
                        <TableHeader>
                            <TableColumn>Email</TableColumn>
                            <TableColumn>Amount</TableColumn>
                            <TableColumn>Paid</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>Tony Reichert</TableCell>
                                <TableCell>200</TableCell>
                                <TableCell>Yes</TableCell>
                            </TableRow>
                            <TableRow key="2">
                                <TableCell>Zoey Lang</TableCell>
                                <TableCell>100</TableCell>
                                <TableCell>No</TableCell>
                            </TableRow>
                            <TableRow key="3">
                                <TableCell>Jane Fisher</TableCell>
                                <TableCell>100</TableCell>
                                <TableCell>No</TableCell>
                            </TableRow>
                            <TableRow key="4">
                                <TableCell>William Howard</TableCell>
                                <TableCell>100</TableCell>
                                <TableCell>Yes</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

            </CardBody>
            <Divider />
            <CardFooter className="px-2 flex justify-center">

                <p className="flex justify-center items-center">Total Transaction Amount: 50</p>
            </CardFooter>
        </Card >
    );
}