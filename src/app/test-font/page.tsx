import { fonts } from '@/lib/fonts'

export default function TestFontPage() {
  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1>Font Testing Page</h1>
      
      <div className="mt-8 space-y-4">
        <p>fonts.display value: <code className="bg-gray-800 p-1">{fonts.display}</code></p>
        
        <h2 className={fonts.display}>Test with fonts.display directly</h2>
        
        <h2 className={`${fonts.display} text-4xl`}>Test with template literal</h2>
        
        <h2 className="display-font text-4xl">Test with display-font class</h2>
        
        <h2 style={{ fontFamily: 'Keania One' }} className="text-4xl">Test with inline style</h2>
      </div>
    </div>
  )
}