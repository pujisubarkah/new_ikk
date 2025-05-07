"use client";

import React, { useState } from 'react';
import Sidebar from "@/components/sidebar-verif"

interface Enumerator {
    id: number;
    name: string;
    email: string;
}

const UpdateEnumeratorPage: React.FC = () => {
    const [enumerator, setEnumerator] = useState<Enumerator>({
        id: 1,
        name: '',
        email: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEnumerator((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Updated Enumerator:', enumerator);
        // Add logic to update enumerator (e.g., API call)
    };

    return (
        <Sidebar>
      <div className="w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-semibold text-gray-800">Ubah Analis Instansi</h1>
        </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nama:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={enumerator.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={enumerator.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Simpan Perubahan</button>
            </form>
        </div>
        </Sidebar>
    );
};

export default UpdateEnumeratorPage;
