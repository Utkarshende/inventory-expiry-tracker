// frontend/src/components/modals/CameraScannerModal.jsx
import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, RefreshCw } from 'lucide-react';

const CameraScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError('');
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraError('Could not access device camera. Please check system permissions.');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  // Mock processing simulation for scanning visual frames
  const handleCaptureFrame = () => {
    if (!scanning) return;
    
    // Simulate real-time computer vision detection speed lag
    setTimeout(() => {
      // Generate a mock barcode string format for development testing workflows
      const mockDetectedBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      onScanSuccess(mockDetectedBarcode);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
            <Camera size={16} className="text-gray-700" />
            Live Hardware Barcode Scanner
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition">
            <X size={16} />
          </button>
        </div>

        {/* Video Camera Lens Frame Port */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <p className="text-xs text-red-400 px-6 text-center font-medium">{cameraError}</p>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover scale-x-[-1]"
              />
              
              {/* Visual Scanning Viewfinder Overlay Target Box */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-32 border-2 border-dashed border-emerald-400 bg-emerald-500/10 rounded-lg relative">
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 shadow-md animate-bounce" />
                </div>
              </div>
              
              <div className="absolute bottom-3 left-3 bg-black/70 px-2 py-1 rounded text-[10px] text-emerald-400 font-mono tracking-wider flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                CAMERA FEED ACTIVE
              </div>
            </>
          )}
        </div>

        {/* Action Button Strip Footer */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={startCamera}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold bg-white hover:bg-gray-100 transition"
          >
            <RefreshCw size={12} /> Reset Feed
          </button>
          
          <button
            type="button"
            onClick={handleCaptureFrame}
            disabled={!scanning}
            className="flex-1 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Analyze Frame Box
          </button>
        </div>

      </div>
    </div>
  );
};

export default CameraScannerModal;
