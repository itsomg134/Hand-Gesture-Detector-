import React, { useState, useRef, useEffect } from 'react';
import { Camera, Hand, Circle, Square, Move, ZoomIn, AlertCircle } from 'lucide-react';

export default function HandGestureDetector() {
  const [isActive, setIsActive] = useState(false);
  const [gesture, setGesture] = useState('None');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  const startDetection = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsActive(true);
          detectGesture();
        };
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopDetection = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsActive(false);
    setGesture('None');
    setConfidence(0);
  };

  const detectGesture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const processFrame = () => {
      if (!isActive) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simplified hand detection based on skin color and motion
      const detectedGesture = analyzeFrame(imageData);
      setGesture(detectedGesture.name);
      setConfidence(detectedGesture.confidence);

      animationRef.current = requestAnimationFrame(processFrame);
    };

    processFrame();
  };

  const analyzeFrame = (imageData) => {
    const data = imageData.data;
    let skinPixels = 0;
    let totalBrightness = 0;
    let centerMass = { x: 0, y: 0, count: 0 };

    // Simple skin tone detection
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Basic skin tone detection
      if (r > 95 && g > 40 && b > 20 && 
          Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
          Math.abs(r - g) > 15 && r > g && r > b) {
        skinPixels++;
        const pixelIndex = i / 4;
        const x = pixelIndex % imageData.width;
        const y = Math.floor(pixelIndex / imageData.width);
        centerMass.x += x;
        centerMass.y += y;
        centerMass.count++;
      }
      
      totalBrightness += (r + g + b) / 3;
    }

    const avgBrightness = totalBrightness / (data.length / 4);
    const skinRatio = skinPixels / (data.length / 4);

    // Gesture detection logic
    if (skinRatio < 0.05) {
      return { name: 'No Hand Detected', confidence: 0 };
    }

    if (centerMass.count > 0) {
      centerMass.x /= centerMass.count;
      centerMass.y /= centerMass.count;
    }

    // Simple heuristics for different gestures
    const gestures = [
      { name: 'Open Palm', threshold: 0.15, confidence: skinRatio > 0.15 ? 85 : 0 },
      { name: 'Fist', threshold: 0.08, confidence: skinRatio < 0.10 && skinRatio > 0.05 ? 75 : 0 },
      { name: 'Pointing', threshold: 0.06, confidence: skinRatio < 0.08 && skinRatio > 0.04 ? 70 : 0 },
      { name: 'Peace Sign', threshold: 0.10, confidence: skinRatio > 0.09 && skinRatio < 0.13 ? 65 : 0 },
      { name: 'Thumbs Up', threshold: 0.07, confidence: skinRatio > 0.06 && skinRatio < 0.09 ? 60 : 0 },
    ];

    let bestMatch = gestures[0];
    for (const g of gestures) {
      if (g.confidence > bestMatch.confidence) {
        bestMatch = g;
      }
    }

    return bestMatch.confidence > 50 ? bestMatch : { name: 'Hand Detected', confidence: Math.round(skinRatio * 100) };
  };

  const getGestureIcon = () => {
    switch (gesture) {
      case 'Open Palm': return <Hand className="w-16 h-16" />;
      case 'Fist': return <Circle className="w-16 h-16" />;
      case 'Pointing': return <Move className="w-16 h-16" />;
      case 'Peace Sign': return <Square className="w-16 h-16" />;
      case 'Thumbs Up': return <ZoomIn className="w-16 h-16" />;
      default: return <Hand className="w-16 h-16 opacity-30" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Hand className="w-12 h-12" />
            Hand Gesture Detector
          </h1>
          <p className="text-blue-200 text-lg">Real-time hand action recognition using your webcam</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Video Feed */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Camera Feed</h2>
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-20 h-20 text-gray-600" />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-500 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-300" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-4 flex gap-3">
              {!isActive ? (
                <button
                  onClick={startDetection}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Start Detection
                </button>
              ) : (
                <button
                  onClick={stopDetection}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Stop Detection
                </button>
              )}
            </div>
          </div>

          {/* Detection Results */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4">Detected Gesture</h2>
              <div className="bg-black/30 rounded-xl p-8 text-center">
                <div className="text-white mb-4 flex justify-center">
                  {getGestureIcon()}
                </div>
                <p className="text-3xl font-bold text-white mb-2">{gesture}</p>
                {confidence > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-blue-200 mb-2">
                      <span>Confidence</span>
                      <span>{confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Supported Gestures */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4">Supported Gestures</h2>
              <div className="space-y-3">
                {[
                  { name: 'Open Palm', desc: 'Show your open hand to the camera' },
                  { name: 'Fist', desc: 'Make a closed fist' },
                  { name: 'Pointing', desc: 'Point with your index finger' },
                  { name: 'Peace Sign', desc: 'Show two fingers in a V shape' },
                  { name: 'Thumbs Up', desc: 'Give a thumbs up gesture' }
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`p-3 rounded-lg transition-colors ${
                      gesture === item.name
                        ? 'bg-purple-500/30 border border-purple-400'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-blue-200">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-3">How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-200">
            <li>Click "Start Detection" to activate your webcam</li>
            <li>Position your hand clearly in front of the camera</li>
            <li>Try different hand gestures and see them detected in real-time</li>
            <li>Make sure you have good lighting for best results</li>
          </ol>
        </div>
      </div>
    </div>
  );
}