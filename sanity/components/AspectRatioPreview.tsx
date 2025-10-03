import React from 'react'
import imageUrlBuilder from '@sanity/image-url'
import {SanityImageSource} from '@sanity/image-url/lib/types/types'

interface AspectRatioPreviewProps {
  value?: any
  aspectRatios?: {label: string; ratio: number}[]
}

// Simple image builder for preview (will use client from context in production)
const getImageUrl = (source: SanityImageSource, width: number, height: number) => {
  if (!source || !(source as any).asset) return ''

  // For now, just return the asset URL if available
  // In production, this would use the proper Sanity client
  const asset = (source as any).asset
  if (asset.url) return asset.url
  if (asset._ref) {
    // Return a placeholder URL structure
    return `https://cdn.sanity.io/images/PROJECT_ID/production/${asset._ref}-${width}x${height}.jpg`
  }
  return ''
}

export function AspectRatioPreview({
  value,
  aspectRatios = [
    {label: 'Landscape (16:9)', ratio: 16 / 9},
    {label: 'Portrait (4:5)', ratio: 4 / 5},
    {label: 'Square (1:1)', ratio: 1},
  ],
}: AspectRatioPreviewProps) {
  if (!value?.asset) {
    return <div style={{padding: '1rem', color: '#999'}}>No image selected</div>
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px', padding: '1rem'}}>
      <p style={{fontSize: '12px', color: '#666', margin: '0 0 8px 0'}}>
        Preview how this image will be cropped at different aspect ratios:
      </p>
      {aspectRatios.map(({label, ratio}) => {
        const width = 400
        const height = Math.round(width / ratio)
        const imageUrl = getImageUrl(value, width, height)

        return (
          <div key={label}>
            <h4 style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: 500}}>
              {label}
            </h4>
            <div
              style={{
                aspectRatio: ratio.toString(),
                width: '100%',
                maxWidth: '400px',
                overflow: 'hidden',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
              }}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={label}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: value.hotspot
                      ? `${value.hotspot.x * 100}% ${value.hotspot.y * 100}%`
                      : 'center',
                  }}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
