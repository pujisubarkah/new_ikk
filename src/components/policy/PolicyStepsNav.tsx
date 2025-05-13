'use client';
import React from 'react';

interface PolicyStepsNavProps {
    activeStep: number;
    onChangeStep: (step: number) => void;
}

const steps = [
    "1. Perencanaan Kebijakan",
    "2. Implementasi Kebijakan",
    "3. Evaluasi Keberlanjutan",
    "4. Transparansi dan Partisipasi",
];

export default function PolicyStepsNav({ activeStep, onChangeStep }: PolicyStepsNavProps) {
    return (
        <div className="overflow-x-auto pb-2">
            <ul className="flex gap-2 w-max min-w-full">
                {steps.map((step, index) => (
                    <li key={index}>
                        <button
                            onClick={() => onChangeStep(index)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all min-w-max ${
                                index === activeStep
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {step}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}