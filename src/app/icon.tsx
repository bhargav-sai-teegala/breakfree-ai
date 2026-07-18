import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 4L12 28"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M28 8L20 32"
            stroke="#a1a1aa"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M12 0L4 24"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </div>
    ),
    { ...size }
  )
}
