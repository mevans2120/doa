interface ViewfinderCornersProps {
  pattern?: 'left-right' | 'right-left';
}

const ViewfinderCorners = ({ pattern = 'left-right' }: ViewfinderCornersProps) => {
  if (pattern === 'left-right') {
    return (
      <>
        {/* Top Left Corner */}
        <div className="absolute top-6 left-6 w-24 h-24 pointer-events-none z-20">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fadeMaskTL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white"/>
                <stop offset="40%" stopColor="rgb(200, 200, 200)"/>
                <stop offset="70%" stopColor="rgb(100, 100, 100)"/>
                <stop offset="100%" stopColor="transparent"/>
              </linearGradient>
              <mask id="maskTL">
                <path d="M0 40V0H40" stroke="url(#fadeMaskTL)" strokeWidth="3" fill="none"/>
              </mask>
            </defs>
            <rect x="0" y="0" width="96" height="96" fill="none"/>
            <path d="M0 40V0H40" stroke="rgba(220, 38, 38, 0.6)" strokeWidth="2.5" fill="none" mask="url(#maskTL)"/>
          </svg>
        </div>

        {/* Bottom Right Corner */}
        <div className="absolute bottom-6 right-6 w-24 h-24 pointer-events-none z-20">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fadeMaskBR" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="white"/>
                <stop offset="40%" stopColor="rgb(200, 200, 200)"/>
                <stop offset="70%" stopColor="rgb(100, 100, 100)"/>
                <stop offset="100%" stopColor="transparent"/>
              </linearGradient>
              <mask id="maskBR">
                <path d="M96 56V96H56" stroke="url(#fadeMaskBR)" strokeWidth="3" fill="none"/>
              </mask>
            </defs>
            <rect x="0" y="0" width="96" height="96" fill="none"/>
            <path d="M96 56V96H56" stroke="rgba(220, 38, 38, 0.6)" strokeWidth="2.5" fill="none" mask="url(#maskBR)"/>
          </svg>
        </div>
      </>
    )
  } else {
    return (
      <>
        {/* Top Right Corner */}
        <div className="absolute top-6 right-6 w-24 h-24 pointer-events-none z-20">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fadeMaskTR" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="white"/>
                <stop offset="40%" stopColor="rgb(200, 200, 200)"/>
                <stop offset="70%" stopColor="rgb(100, 100, 100)"/>
                <stop offset="100%" stopColor="transparent"/>
              </linearGradient>
              <mask id="maskTR">
                <path d="M96 40V0H56" stroke="url(#fadeMaskTR)" strokeWidth="3" fill="none"/>
              </mask>
            </defs>
            <rect x="0" y="0" width="96" height="96" fill="none"/>
            <path d="M96 40V0H56" stroke="rgba(220, 38, 38, 0.6)" strokeWidth="2.5" fill="none" mask="url(#maskTR)"/>
          </svg>
        </div>

        {/* Bottom Left Corner */}
        <div className="absolute bottom-6 left-6 w-24 h-24 pointer-events-none z-20">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fadeMaskBL" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white"/>
                <stop offset="40%" stopColor="rgb(200, 200, 200)"/>
                <stop offset="70%" stopColor="rgb(100, 100, 100)"/>
                <stop offset="100%" stopColor="transparent"/>
              </linearGradient>
              <mask id="maskBL">
                <path d="M0 56V96H40" stroke="url(#fadeMaskBL)" strokeWidth="3" fill="none"/>
              </mask>
            </defs>
            <rect x="0" y="0" width="96" height="96" fill="none"/>
            <path d="M0 56V96H40" stroke="rgba(220, 38, 38, 0.6)" strokeWidth="2.5" fill="none" mask="url(#maskBL)"/>
          </svg>
        </div>
      </>
    )
  }
}

export default ViewfinderCorners