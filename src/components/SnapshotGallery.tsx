import React from 'react'
import { useAppContext } from '../context/AppContext'

const SnapshotsGallery: React.FC = () => {
  const { snapshots } = useAppContext()

  return (
    <div className="mt-6 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Gallery</h3>

      {snapshots.length === 0 ? (
        <div className="flex items-center justify-center h-24 rounded-md border border-dashed border-gray-300 text-gray-500 bg-gray-50">
          No images found
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-3 p-2 rounded-md border border-gray-200 bg-white shadow-inner scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {snapshots.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Snapshot ${idx + 1}`}
              className="w-16 h-12 rounded-lg border border-gray-300 shadow-md hover:scale-105 transition-transform duration-200"
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SnapshotsGallery
