import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, FileImage, Smartphone, Presentation, Building2 } from 'lucide-react';

export default function QRCodeDownload() {
  const appUrl = 'https://pit-box.com';
  const [selectedSize, setSelectedSize] = useState(600);

  const qrSizes = [
    { size: 300, name: 'Small', description: 'Business cards, small prints', icon: Smartphone },
    { size: 600, name: 'Medium', description: 'Flyers, social media', icon: FileImage },
    { size: 1200, name: 'Large', description: 'Banners, posters', icon: Presentation },
    { size: 2400, name: 'Extra Large', description: 'Vehicle decals, large banners', icon: Building2 },
  ];

  const downloadQRCode = (size: number) => {
    const svg = document.getElementById(`qr-${size}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `pitbox-qr-${size}x${size}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const downloadSVG = () => {
    const svg = document.getElementById('qr-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.download = 'pitbox-qr.svg';
    downloadLink.href = url;
    downloadLink.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="glass-panel p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Share2 className="w-8 h-8 text-brand-gold" />
            <h1 className="text-4xl font-bold">QR Code Downloads</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Download PitBox QR codes in various sizes for your marketing materials,
            business cards, banners, and vehicle decals.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <p className="text-gray-700 dark:text-gray-300 font-medium">Scan to visit:</p>
            <code className="px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">
              {appUrl}
            </code>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {qrSizes.map(({ size, name, description, icon: Icon }) => (
            <div
              key={size}
              className="glass-panel p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedSize(size)}
            >
              <div className="mb-4">
                <div className="mx-auto w-full aspect-square bg-white rounded-lg p-4 shadow-inner flex items-center justify-center">
                  <QRCodeSVG
                    id={`qr-${size}`}
                    value={appUrl}
                    size={size > 1200 ? 180 : size / 4}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-brand-gold" />
                <h3 className="text-xl font-bold">{name}</h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {size} x {size} pixels
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                {description}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadQRCode(size);
                }}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-br from-brand-gold/10 to-brand-gold-light/10 rounded-lg">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Vector Format (SVG)</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Perfect for professional printing at any size without quality loss
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg p-6 mb-4 flex items-center justify-center">
              <QRCodeSVG
                id="qr-svg"
                value={appUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <button
              onClick={downloadSVG}
              className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-3"
            >
              <Download className="w-5 h-5" />
              Download SVG Vector
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-6">Usage Guidelines</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Smartphone className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-1">Business Cards & Small Prints</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Use the 300x300 or 600x600 size for business cards and small printed materials.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FileImage className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-1">Flyers & Social Media</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                The 600x600 size works great for flyers, posters, and social media posts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Presentation className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-1">Banners & Large Prints</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Use 1200x1200 or larger for banners, posters, and large format printing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Building2 className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-1">Vehicle Decals & Professional Printing</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                For professional printing and vehicle decals, use the SVG format or 2400x2400 PNG for best quality.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-gold/10 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          All QR codes link to: <span className="font-semibold text-brand-gold">{appUrl}</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          High error correction level (Level H) - QR codes remain scannable even if partially damaged or obscured
        </p>
      </div>
    </div>
  );
}
