import { fonts } from '@/lib/fonts'

export default function TestFontPage() {
  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-5xl mb-8">Font Testing Page</h1>
      
      <div className="mt-8 space-y-8">
        <div className="border-b border-gray-700 pb-4">
          <h2 className="text-2xl mb-2 text-gray-400">Display Font (Keania One)</h2>
          <p>fonts.display value: <code className="bg-gray-800 p-1">{fonts.display}</code></p>
          <h3 className={fonts.display + " text-4xl"}>Test with fonts.display directly</h3>
          <h3 className="display-font text-4xl">Test with display-font class</h3>
        </div>

        <div className="border-b border-gray-700 pb-4">
          <h2 className="text-2xl mb-2 text-gray-400">Heading Font (PT Sans)</h2>
          <h3 className="heading-font text-4xl">Test with heading-font class</h3>
          <h3 className="font-heading text-4xl">Test with font-heading (Tailwind)</h3>
          <h3 style={{ fontFamily: 'var(--font-pt-sans)' }} className="text-4xl">Test with CSS variable</h3>
          <h3 style={{ fontFamily: 'PT Sans, sans-serif' }} className="text-4xl">Test with direct PT Sans</h3>
        </div>

        <div className="border-b border-gray-700 pb-4">
          <h2 className="text-2xl mb-2 text-gray-400">Comparison</h2>
          <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif' }} className="text-4xl">Helvetica/Arial (old heading)</h3>
          <h3 className="heading-font text-4xl">PT Sans (new heading via class)</h3>
          <h3 className={fonts.display + " text-4xl"}>Keania One (display font)</h3>
        </div>

        <div>
          <h2 className="text-2xl mb-2 text-gray-400">CSS Variables Check</h2>
          <div className="font-mono text-sm bg-gray-800 p-4 rounded">
            <p>Check these CSS variables in DevTools:</p>
            <p>--font-keania (should show Keania One font)</p>
            <p>--font-pt-sans (should show PT Sans font)</p>
            <p>--font-garamond (should show EB Garamond font)</p>
          </div>
        </div>
      </div>
    </div>
  )
}