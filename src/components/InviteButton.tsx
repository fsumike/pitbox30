import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import InviteModal from './InviteModal';

export default function InviteButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-32 right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-40"
        aria-label="Invite friends"
      >
        <UserPlus className="w-6 h-6" />
      </button>

      <InviteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
