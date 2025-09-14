import React, { useRef, useState } from 'react';
import { Camera, Upload, Eye } from 'lucide-react';

function QRScanner({ onScan }) {
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Auto-process QR code from image
      setTimeout(() => {
        // Mock QR data extraction - in real implementation, use jsQR library
        const mockQRData = {
          type: 'final-product',
          batchId: `BATCH_${Date.now()}`,
          timestamp: new Date().toISOString(),
          network: 'HERBIONYX'
        };
        
        const qrDataString = JSON.stringify(mockQRData);
        setScannedResult(qrDataString);
        onScan(qrDataString);
      }, 1000);

    } catch (error) {
      console.error('QR processing error:', error);
      alert('Failed to process QR code from image');
    }
  };

  const startCameraScan = () => {
    setIsScanning(true);
    
    // Mock camera scan - in real implementation, use camera API
    setTimeout(() => {
      const mockQRData = {
        type: 'collection',
        eventId: `EVT_${Date.now()}`,
        timestamp: new Date().toISOString(),
        network: 'HERBIONYX'
      };
      
      const qrDataString = JSON.stringify(mockQRData);
      setScannedResult(qrDataString);
      onScan(qrDataString);
      setIsScanning(false);
    }, 2000);
  };

  const clearResults = () => {
    setPreview(null);
    setScannedResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="qr-scanner">
      <div className="scanner-controls">
        <button 
          onClick={startCameraScan} 
          className="scanner-btn camera-btn"
          disabled={isScanning}
        >
          <Camera size={20} />
          {isScanning ? 'Scanning...' : 'Scan with Camera'}
        </button>
        
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="scanner-btn upload-btn"
        >
          <Upload size={20} />
          Upload QR Image
        </button>

        {(preview || scannedResult) && (
          <button onClick={clearResults} className="scanner-btn clear-btn">
            Clear
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Preview Section */}
      {preview && (
        <div className="qr-preview">
          <h4><Eye size={16} /> Image Preview</h4>
          <img src={preview} alt="QR Code Preview" className="preview-image" />
        </div>
      )}

      {/* Scanning Animation */}
      {isScanning && (
        <div className="scanning-animation">
          <div className="scanner-frame">
            <div className="scanning-line"></div>
            <p>Scanning QR Code...</p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {scannedResult && (
        <div className="scan-results">
          <h4>✅ QR Code Detected</h4>
          <div className="result-preview">
            <pre>{JSON.stringify(JSON.parse(scannedResult), null, 2)}</pre>
          </div>
        </div>
      )}

      <style jsx>{`
        .qr-scanner {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .scanner-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .scanner-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          min-width: 140px;
        }

        .camera-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .camera-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          transform: translateY(-2px);
        }

        .camera-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .upload-btn:hover {
          background: linear-gradient(135deg, #059669, #10b981);
          transform: translateY(-2px);
        }

        .clear-btn {
          background: #f3f4f6;
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .clear-btn:hover {
          background: #e5e7eb;
        }

        .qr-preview {
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          text-align: center;
        }

        .qr-preview h4 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #374151;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .preview-image {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .scanning-animation {
          background: #f0f9ff;
          border: 2px solid #3b82f6;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          margin-bottom: 20px;
        }

        .scanner-frame {
          position: relative;
          width: 200px;
          height: 200px;
          border: 3px solid #3b82f6;
          border-radius: 12px;
          margin: 0 auto 20px;
          overflow: hidden;
        }

        .scanning-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
          animation: scan 2s linear infinite;
        }

        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(194px); }
        }

        .scan-results {
          background: #f0fdf4;
          border: 2px solid #22c55e;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .scan-results h4 {
          color: #166534;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .result-preview {
          background: white;
          border: 1px solid #d1fae5;
          border-radius: 8px;
          padding: 15px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #374151;
          overflow-x: auto;
        }

        .result-preview pre {
          margin: 0;
          white-space: pre-wrap;
        }

        @media (max-width: 768px) {
          .scanner-controls {
            flex-direction: column;
          }
          
          .scanner-btn {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default QRScanner;