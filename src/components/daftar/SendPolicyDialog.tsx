'use client';
import React, { useState } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


interface SendPolicyDialogProps {
    children: React.ReactNode;
    onSend: () => void;
}

export default function SendPolicyDialog({ children, onSend }: SendPolicyDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        onSend();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kirim Kebijakan ke Pusat</DialogTitle>
                    <DialogDescription>Apakah Anda yakin ingin mengirim semua kebijakan?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>Batal</Button>
                    <Button onClick={handleConfirm}>Ya, Kirim</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}