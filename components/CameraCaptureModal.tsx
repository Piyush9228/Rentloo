
import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, RefreshCw, Check, Scan, Crop, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { detectObjectInImage } from '../services/geminiService';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

type DragHandle = 'move' | 'tl' | 'tr' | 'bl' | 'br' | null;

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  
  // States
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Bounding Box Logic
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
  const [dragHandle, setDragHandle] = useState<DragHandle>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Start Camera
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, facingMode, capturedImage]);

  const startCamera = async () => {
    try {
      setError(null);
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Flip horizontally if user facing
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(imageUrl);
        stopCamera();
        
        // Initialize bounding box to a default center area for cropping mode
        setBoundingBox({
            x: canvas.width * 0.1,
            y: canvas.height * 0.1,
            w: canvas.width * 0.8,
            h: canvas.height * 0.8
        });
      }
    }
  };

  const handleUsePhoto = () => {
      if (capturedImage) {
          onCapture(capturedImage);
          handleClose();
      }
  };

  const startCropMode = () => {
      setIsCropping(true);
  };

  const runAutoDetect = async () => {
      if (!capturedImage) return;
      setIsProcessing(true);
      const detection = await detectObjectInImage(capturedImage);
      setIsProcessing(false);

      if (detection && canvasRef.current) {
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        setBoundingBox({
          x: (detection.xmin / 100) * w,
          y: (detection.ymin / 100) * h,
          w: ((detection.xmax - detection.xmin) / 100) * w,
          h: ((detection.ymax - detection.ymin) / 100) * h
        });
      }
  };

  const confirmCrop = () => {
    if (canvasRef.current && capturedImage && boundingBox) {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      const sourceCanvas = canvasRef.current; 
      
      const sourceX = Math.max(0, boundingBox.x);
      const sourceY = Math.max(0, boundingBox.y);
      const sourceW = Math.min(sourceCanvas.width - sourceX, boundingBox.w);
      const sourceH = Math.min(sourceCanvas.height - sourceY, boundingBox.h);

      tempCanvas.width = sourceW;
      tempCanvas.height = sourceH;

      if (tempCtx) {
        tempCtx.drawImage(
          sourceCanvas,
          sourceX, sourceY, sourceW, sourceH, 
          0, 0, sourceW, sourceH
        );
        
        const finalUrl = tempCanvas.toDataURL('image/jpeg', 0.9);
        onCapture(finalUrl);
        handleClose();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsCropping(false);
    setBoundingBox(null);
    startCamera();
  };

  const handleClose = () => {
    setCapturedImage(null);
    setIsCropping(false);
    setBoundingBox(null);
    onClose();
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // --- Bounding Box Interaction ---

  const getScaleFactors = () => {
    if (!canvasRef.current || !containerRef.current) return { x: 1, y: 1, scale: 1, offsetX: 0, offsetY: 0 };
    const displayW = containerRef.current.clientWidth;
    const displayH = containerRef.current.clientHeight;
    const actualW = canvasRef.current.width;
    const actualH = canvasRef.current.height;
    
    const imageRatio = actualW / actualH;
    const displayRatio = displayW / displayH;
    
    let renderedW, renderedH, offsetX, offsetY;

    if (imageRatio > displayRatio) {
      renderedW = displayW;
      renderedH = displayW / imageRatio;
      offsetX = 0;
      offsetY = (displayH - renderedH) / 2;
    } else {
      renderedH = displayH;
      renderedW = displayH * imageRatio;
      offsetY = 0;
      offsetX = (displayW - renderedW) / 2;
    }

    return { 
      scale: actualW / renderedW, 
      offsetX, 
      offsetY 
    };
  };

  const handleMouseDown = (e: React.MouseEvent, handle: DragHandle) => {
    e.stopPropagation();
    setDragHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragHandle || !boundingBox || !canvasRef.current) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const { scale } = getScaleFactors();
    
    const actualDx = dx * scale;
    const actualDy = dy * scale;
    const maxW = canvasRef.current.width;
    const maxH = canvasRef.current.height;

    setBoundingBox(prev => {
      if (!prev) return null;
      let newBox = { ...prev };

      switch (dragHandle) {
        case 'move':
          newBox.x = Math.max(0, Math.min(maxW - prev.w, prev.x + actualDx));
          newBox.y = Math.max(0, Math.min(maxH - prev.h, prev.y + actualDy));
          break;
        case 'tl':
          // x changes, w changes, y changes, h changes
          const newX_tl = Math.max(0, Math.min(prev.x + prev.w - 50, prev.x + actualDx));
          const newY_tl = Math.max(0, Math.min(prev.y + prev.h - 50, prev.y + actualDy));
          newBox.w = prev.w + (prev.x - newX_tl);
          newBox.h = prev.h + (prev.y - newY_tl);
          newBox.x = newX_tl;
          newBox.y = newY_tl;
          break;
        case 'tr':
          // y changes, h changes, w changes
          const newY_tr = Math.max(0, Math.min(prev.y + prev.h - 50, prev.y + actualDy));
          newBox.w = Math.max(50, Math.min(maxW - prev.x, prev.w + actualDx));
          newBox.h = prev.h + (prev.y - newY_tr);
          newBox.y = newY_tr;
          break;
        case 'bl':
           // x changes, w changes, h changes
           const newX_bl = Math.max(0, Math.min(prev.x + prev.w - 50, prev.x + actualDx));
           newBox.w = prev.w + (prev.x - newX_bl);
           newBox.h = Math.max(50, Math.min(maxH - prev.y, prev.h + actualDy));
           newBox.x = newX_bl;
           break;
        case 'br':
           // w changes, h changes
           newBox.w = Math.max(50, Math.min(maxW - prev.x, prev.w + actualDx));
           newBox.h = Math.max(50, Math.min(maxH - prev.y, prev.h + actualDy));
           break;
      }
      return newBox;
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragHandle(null);
  };

  const getBoxStyle = () => {
    if (!boundingBox || !containerRef.current || !canvasRef.current) return { display: 'none' };
    const { scale, offsetX, offsetY } = getScaleFactors();

    return {
      left: (boundingBox.x / scale) + offsetX,
      top: (boundingBox.y / scale) + offsetY,
      width: boundingBox.w / scale,
      height: boundingBox.h / scale,
      position: 'absolute' as 'absolute',
    };
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <h3 className="text-white font-semibold flex items-center gap-2">
           {isCropping ? "Crop & Detect" : capturedImage ? "Review Photo" : "Take Photo"}
        </h3>
        <button onClick={handleClose} className="bg-white/20 p-2 rounded-full text-white backdrop-blur-sm hover:bg-white/30">
          <X size={24} />
        </button>
      </div>

      {/* Main View Area */}
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden"
      >
        {error ? (
          <div className="text-center px-4">
             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera size={32} />
             </div>
             <p className="text-white text-lg font-medium">{error}</p>
             <button onClick={onClose} className="mt-4 text-gray-400 underline">Close</button>
          </div>
        ) : !capturedImage ? (
          // Camera Stream
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-contain"
          />
        ) : (
          // Review / Crop Image
          <>
            <img 
              src={capturedImage} 
              alt="Capture" 
              className="w-full h-full object-contain pointer-events-none"
            />
            
            {/* Cropping Overlay */}
            {isCropping && boundingBox && !isProcessing && (
              <>
                 {/* Darkened background outside box - purely visual hack using huge borders */}
                 <div 
                    style={{
                        ...getBoxStyle(), 
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
                        border: '2px solid white'
                    }}
                    className="cursor-move z-10"
                    onMouseDown={(e) => handleMouseDown(e, 'move')}
                 >
                    {/* Handles */}
                    <div 
                        className="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full shadow-md cursor-nw-resize z-20 border-2 border-[#805AD5]"
                        onMouseDown={(e) => handleMouseDown(e, 'tl')}
                    />
                    <div 
                        className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full shadow-md cursor-ne-resize z-20 border-2 border-[#805AD5]"
                        onMouseDown={(e) => handleMouseDown(e, 'tr')}
                    />
                    <div 
                        className="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full shadow-md cursor-sw-resize z-20 border-2 border-[#805AD5]"
                        onMouseDown={(e) => handleMouseDown(e, 'bl')}
                    />
                    <div 
                        className="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full shadow-md cursor-se-resize z-20 border-2 border-[#805AD5]"
                        onMouseDown={(e) => handleMouseDown(e, 'br')}
                    />

                    {/* Guidelines */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-50">
                       <div className="border-r border-b border-white/30"></div>
                       <div className="border-r border-b border-white/30"></div>
                       <div className="border-b border-white/30"></div>
                       <div className="border-r border-b border-white/30"></div>
                       <div className="border-r border-b border-white/30"></div>
                       <div className="border-b border-white/30"></div>
                       <div className="border-r border-white/30"></div>
                       <div className="border-r border-white/30"></div>
                       <div></div>
                    </div>
                 </div>
              </>
            )}
            
            {/* Loading */}
            {isProcessing && (
               <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/50">
                 <Loader2 size={48} className="text-[#805AD5] animate-spin mb-4" />
                 <p className="text-white font-medium bg-black/60 px-4 py-2 rounded-full backdrop-blur-md">Detecting object...</p>
               </div>
            )}
          </>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Footer Controls */}
      {!error && (
        <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-black/95 to-transparent z-20">
           {!capturedImage ? (
             <div className="flex justify-between items-center">
               <button onClick={toggleCamera} className="text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md">
                 <RefreshCw size={24} />
               </button>

               <button 
                 onClick={handleCapture}
                 className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group"
               >
                 <div className="w-16 h-16 bg-white rounded-full transition-transform group-active:scale-90"></div>
               </button>

               <div className="w-12"></div>
             </div>
           ) : !isCropping ? (
             // Review Mode Controls
             <div className="flex justify-between items-center gap-4">
                <button onClick={handleRetake} className="text-white flex flex-col items-center gap-1 opacity-80 hover:opacity-100">
                   <RefreshCw size={20} />
                   <span className="text-[10px]">Retake</span>
                </button>
                
                <button 
                  onClick={startCropMode}
                  className="bg-white/20 text-white hover:bg-white/30 px-6 py-3 rounded-xl font-bold backdrop-blur-md flex items-center gap-2"
                >
                  <Crop size={18} /> Crop / Smart Detect
                </button>

                <button 
                  onClick={handleUsePhoto}
                  className="bg-[#68D391] text-green-900 px-6 py-3 rounded-xl font-bold hover:bg-[#5bc283] flex items-center gap-2"
                >
                  <Check size={18} /> Use Photo
                </button>
             </div>
           ) : (
             // Crop Mode Controls
             <div className="flex justify-between items-center gap-2">
                <button onClick={() => setIsCropping(false)} className="text-white p-3 rounded-full bg-white/10 hover:bg-white/20">
                   <ArrowLeft size={24} />
                </button>

                <button 
                  onClick={runAutoDetect}
                  className="bg-[#805AD5] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#6B46C1] flex items-center gap-2 flex-1 justify-center"
                >
                  <Sparkles size={18} /> Detect Object
                </button>

                <button 
                  onClick={confirmCrop}
                  className="bg-[#68D391] text-green-900 px-4 py-3 rounded-xl font-bold hover:bg-[#5bc283] flex items-center gap-2 flex-1 justify-center"
                >
                  <Check size={18} /> Done
                </button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default CameraCaptureModal;
