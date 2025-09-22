interface EKGDividerProps {
  color?: 'default' | 'red';
}

const EKGDivider = ({ color = 'default' }: EKGDividerProps = {}) => {
  const gradientId = color === 'red' ? 'ekgGradientRed' : 'ekgGradient';
  const strokeColor = color === 'red' ? '#ff0000' : '#c0c0c0';

  return (
    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1200 160">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="20%" stopColor={strokeColor} stopOpacity="0.4" />
          <stop offset="50%" stopColor={strokeColor} stopOpacity="0.8" />
          <stop offset="80%" stopColor={strokeColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      
      <path 
        d="M 0,80 
           L 400,80
           L 500,80
           L 520,78
           L 540,82
           L 560,75
           L 570,85
           L 580,70
           L 590,90
           L 595,60
           L 598,30
           L 600,-20
           L 602,180
           L 604,140
           L 607,90
           L 610,85
           L 620,70
           L 630,90
           L 640,75
           L 650,85
           L 670,82
           L 690,78
           L 710,80
           L 800,80
           L 1200,80" 
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  )
}

export default EKGDivider