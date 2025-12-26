import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
  if (!isOpen) return null;

  const appUrl = 'https://pit-box.com';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invite Your Crew!
          </h2>
          <p className="text-gray-600 mb-6">
            Have a friend scan this QR code to join PitBox
          </p>

          <div className="bg-white p-6 rounded-lg shadow-inner mb-6 flex justify-center">
            <QRCodeSVG
              value={appUrl}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Or share this link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={appUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(appUrl);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
