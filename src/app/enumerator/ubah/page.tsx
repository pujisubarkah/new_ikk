import React, { useState } from 'react';

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
        <div>
            <h1>Ubah Analis Instansi</h1>
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
    );
};

export default UpdateEnumeratorPage;