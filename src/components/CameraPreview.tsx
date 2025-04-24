import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { Camera } from 'lucide-react'

const CameraPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hasCamera, setHasCamera] = useState(true)

  const { addSnapshot } = useAppContext()

  

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('Camera access error:', error)
        setHasCamera(false)
      }
    }
    

    initCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const captureSnapshot = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        )

        const dataURL = canvasRef.current.toDataURL('image/png')

        addSnapshot(dataURL)
        try {
          // Save via Electron main process
          const savedPath: string = await (window as any).electronAPI.saveImage(dataURL)
        } catch (error) {
          console.error('Failed to save image:', error)
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center px-4 py-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-300 mb-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        ></video>

        {!hasCamera && (
          <div className=" inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-lg font-semibold">
            Unable to access camera
          </div>
        )}
      </div>

      <button
        onClick={captureSnapshot}
        className="button flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
      >
        Take Snapshot
      </button>
<div style={{ display: 'none' }}>

      <canvas ref={canvasRef} width={640} height={480} className="hidden"></canvas>
</div>
    </div>
  )
}

export default CameraPreview
