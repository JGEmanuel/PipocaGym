import fs from 'fs'
import path from 'path'

const publicDir = path.join(process.cwd(), 'public')
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

// Minimal valid PNG: 1x1 pixel amber color (#f59e0b)
// This is a valid PNG header + minimal image data for a placeholder
// In production, replace with proper icon generation or SVG icons

const createMinimalPNG = (size) => {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // For MVP, create a simple gradient SVG as PNG fallback
  // We'll write SVG versions and let browsers handle them
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <defs>
      <style>
        @media (prefers-color-scheme: dark) {
          .bg { fill: #1f2937; } .icon { fill: #f59e0b; }
        }
      </style>
    </defs>
    <rect class="bg" width="${size}" height="${size}" fill="#f59e0b"/>
    <text class="icon" x="${size/2}" y="${size/2}" font-size="${size*0.6}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">🐾</text>
  </svg>`

  return Buffer.from(svg)
}

// For now, create SVG versions of the icons
const sizes = [192, 512]
const variants = [
  { name: 'pwa', bg: '#f59e0b', fg: 'white', maskable: false },
  { name: 'pwa-maskable', bg: '#f59e0b', fg: 'white', maskable: true },
]

variants.forEach(({ name, bg, fg, maskable }) => {
  sizes.forEach((size) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="${bg}"/>
      <text x="${size/2}" y="${size/2}" font-size="${Math.round(size*0.6)}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${fg}" font-family="Arial">🐾</text>
    </svg>`

    const filename = `${name}-${size}.svg`
    fs.writeFileSync(path.join(publicDir, filename), svg)
    console.log(`✓ Generated ${filename}`)
  })
})

// Create a simple screenshot (will be served as-is)
const screenshotSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 720" width="540" height="720">
  <rect width="540" height="720" fill="#ffffff"/>
  <rect width="540" height="120" fill="#f59e0b"/>
  <text x="270" y="60" font-size="48" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">Pipoca Gym</text>
  <text x="270" y="200" font-size="72" text-anchor="middle" fill="#f59e0b">🏋️</text>
  <text x="270" y="350" font-size="36" text-anchor="middle" fill="#1f2937">Seu app de treino</text>
</svg>`
fs.writeFileSync(path.join(publicDir, 'screenshot-1.svg'), screenshotSvg)
console.log('✓ Generated screenshot-1.svg')

console.log('✓ All PWA assets generated')
