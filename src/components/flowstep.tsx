import { motion } from 'framer-motion';
import {
  FaClipboardList,
  FaDownload,
  FaUsers,
  FaPalette,
  FaUserCheck,
  FaComments,
} from 'react-icons/fa';
import { ReactNode } from 'react';

interface Step {
  number: string;
  icon: ReactNode;
  title: string;
  subtitle?: string;
}

const steps: Step[] = [
  {
    number: '01',
    icon: <FaClipboardList />,
    title: 'Self Assessment',
    subtitle: '(Admin Instansi dan Enumerator)',
  },
  {
    number: '02',
    icon: <FaDownload />,
    title: 'Desk Analysis',
    subtitle: '(Koordinator Instansi)',
  },
  {
    number: '03',
    icon: <FaUsers />,
    title: 'Board Member Meeting I',
    subtitle: 'Forum pemaparan hasil desk analysis...',
  },
  {
    number: '04',
    icon: <FaPalette />,
    title: 'Validasi',
    subtitle: '(Koordinator Utama)',
  },
  {
    number: '05',
    icon: <FaUserCheck />,
    title: 'Board Member Meeting II',
    subtitle: 'Forum pemaparan hasil validasi final...',
  },
  {
    number: '06',
    icon: <FaComments />,
    title: 'Sharing Cerita Perubahan',
  },
];

export default function FlowSteps() {
  return (
    <div className="flex flex-col items-center gap-8 py-10 px-4">
   

      {/* Langkah-langkah proses */}
      <div className="flex flex-wrap justify-center gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex flex-col items-center text-center max-w-[200px]"
          >
            <div className="bg-[#16578D] text-white w-10 h-10 rounded-full flex items-center justify-center mb-3 font-bold">
              {step.number}
            </div>
            <div className="text-[#16578D] text-4xl mb-2" aria-hidden="true">
              {step.icon}
            </div>
            <p className="font-semibold text-[#16578D]">{step.title}</p>
            {step.subtitle && (
              <p className="text-sm text-gray-600 mt-1">{step.subtitle}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
