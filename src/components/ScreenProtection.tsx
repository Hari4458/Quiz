import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Eye, AlertTriangle } from 'lucide-react'

interface ScreenProtectionProps {
  children: React.ReactNode
  watermarkText?: string
  enableWarnings?: boolean
}

export default function ScreenProtection({ 
  children, 
  watermarkText = "IIC Quiz - Protected Content",
  enableWarnings = true 
}: ScreenProtectionProps) {
  const [isBlurred, setIsBlurred] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [suspiciousActivity, setSuspiciousActivity] = useState(0)

  useEffect(() => {
    let warningTimeout: NodeJS.Timeout

    // 1. Disable right-click context menu
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (enableWarnings) {
        showWarningMessage('Right-click disabled for content protection')
      }
      return false
    }

    // 2. Disable common keyboard shortcuts
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // Screenshot shortcuts
      const screenshotShortcuts = [
        { key: 'PrintScreen' },
        { ctrl: true, shift: true, key: 'S' }, // Chrome screenshot
        { meta: true, shift: true, key: '3' }, // Mac full screen
        { meta: true, shift: true, key: '4' }, // Mac selection
        { meta: true, shift: true, key: '5' }, // Mac screenshot utility
        { alt: true, key: 'PrintScreen' },
        { ctrl: true, key: 'PrintScreen' },
      ]

      // Developer tools shortcuts
      const devToolsShortcuts = [
        { key: 'F12' },
        { ctrl: true, shift: true, key: 'I' },
        { ctrl: true, shift: true, key: 'J' },
        { ctrl: true, shift: true, key: 'C' },
        { ctrl: true, key: 'U' },
      ]

      // Other protection shortcuts
      const otherShortcuts = [
        { ctrl: true, key: 'S' }, // Save
        { ctrl: true, key: 'A' }, // Select all
        { ctrl: true, key: 'C' }, // Copy
        { ctrl: true, key: 'V' }, // Paste
        { ctrl: true, key: 'X' }, // Cut
        { ctrl: true, key: 'P' }, // Print
      ]

      const allShortcuts = [...screenshotShortcuts, ...devToolsShortcuts, ...otherShortcuts]

      for (const shortcut of allShortcuts) {
        const matchesModifiers = 
          (!shortcut.ctrl || e.ctrlKey) &&
          (!shortcut.shift || e.shiftKey) &&
          (!shortcut.alt || e.altKey) &&
          (!shortcut.meta || e.metaKey)

        if (matchesModifiers && (e.key === shortcut.key || e.code === shortcut.key)) {
          e.preventDefault()
          e.stopPropagation()
          
          // Special handling for screenshot attempts
          if (screenshotShortcuts.some(s => s.key === shortcut.key)) {
            handleScreenshotAttempt()
          } else if (enableWarnings) {
            showWarningMessage('Keyboard shortcut disabled for security')
          }
          
          return false
        }
      }
    }

    // 3. Handle screenshot attempts
    const handleScreenshotAttempt = () => {
      setSuspiciousActivity(prev => prev + 1)
      setIsBlurred(true)
      
      if (enableWarnings) {
        showWarningMessage('Screenshot attempt detected! Content temporarily hidden.')
      }

      // Clear clipboard to prevent screenshot copying
      if (navigator.clipboard) {
        navigator.clipboard.writeText('').catch(() => {})
      }

      // Hide content for 3 seconds
      setTimeout(() => {
        setIsBlurred(false)
      }, 3000)
    }

    // 4. Monitor visibility changes (tab switching, window focus)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true)
        if (enableWarnings) {
          showWarningMessage('Tab visibility changed - content protected')
        }
      } else {
        // Delay showing content when tab becomes visible again
        setTimeout(() => {
          setIsBlurred(false)
        }, 1000)
      }
    }

    // 5. Monitor window focus changes
    const handleWindowBlur = () => {
      setIsBlurred(true)
      setSuspiciousActivity(prev => prev + 1)
    }

    const handleWindowFocus = () => {
      setTimeout(() => {
        setIsBlurred(false)
      }, 500)
    }

    // 6. Detect developer tools opening
    const detectDevTools = () => {
      const threshold = 160
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        setIsBlurred(true)
        if (enableWarnings) {
          showWarningMessage('Developer tools detected! Please close them.')
        }
      }
    }

    // 7. Monitor mouse movements for screenshot tools
    let rapidMovements = 0
    const handleMouseMove = () => {
      rapidMovements++
      setTimeout(() => {
        rapidMovements--
      }, 100)

      // Detect rapid mouse movements (potential screenshot tool)
      if (rapidMovements > 10) {
        setSuspiciousActivity(prev => prev + 1)
        if (suspiciousActivity > 3) {
          setIsBlurred(true)
          if (enableWarnings) {
            showWarningMessage('Suspicious mouse activity detected')
          }
          setTimeout(() => setIsBlurred(false), 2000)
        }
      }
    }

    // 8. Prevent text selection and dragging
    const preventSelection = (e: Event) => {
      e.preventDefault()
      return false
    }

    // 9. Show warning message helper
    const showWarningMessage = (message: string) => {
      setWarningMessage(message)
      setShowWarning(true)
      
      if (warningTimeout) clearTimeout(warningTimeout)
      warningTimeout = setTimeout(() => {
        setShowWarning(false)
      }, 3000)
    }

    // 10. Add CSS for protection
    const addProtectionStyles = () => {
      const style = document.createElement('style')
      style.id = 'screen-protection-styles'
      style.textContent = `
        /* Disable text selection */
        .screen-protected * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }

        /* Allow selection in input fields */
        .screen-protected input,
        .screen-protected textarea {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }

        /* Prevent image dragging */
        .screen-protected img {
          -webkit-user-drag: none !important;
          -khtml-user-drag: none !important;
          -moz-user-drag: none !important;
          -o-user-drag: none !important;
          user-drag: none !important;
          pointer-events: none !important;
        }

        /* Print protection */
        @media print {
          .screen-protected * {
            visibility: hidden !important;
          }
          .screen-protected::before {
            content: "🔒 Protected Content - Printing Disabled" !important;
            visibility: visible !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            font-size: 24px !important;
            color: black !important;
            background: white !important;
            padding: 20px !important;
            border: 2px solid black !important;
          }
        }

        /* Watermark */
        .watermark {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9998;
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            rgba(255, 255, 255, 0.03) 100px,
            rgba(255, 255, 255, 0.03) 200px
          );
        }

        .watermark::before {
          content: "${watermarkText}";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 48px;
          color: rgba(255, 255, 255, 0.05);
          font-weight: bold;
          white-space: nowrap;
          z-index: 9999;
        }

        /* Transparent overlay */
        .protection-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: transparent;
          pointer-events: none;
          z-index: 9997;
          mix-blend-mode: difference;
        }

        /* Blur effect */
        .content-blurred {
          filter: blur(20px) !important;
          transition: filter 0.3s ease !important;
        }

        .content-normal {
          filter: none !important;
          transition: filter 0.3s ease !important;
        }
      `
      document.head.appendChild(style)
      return style
    }

    // Add event listeners
    document.addEventListener('contextmenu', disableRightClick, { capture: true })
    document.addEventListener('keydown', disableKeyboardShortcuts, { capture: true })
    document.addEventListener('keyup', disableKeyboardShortcuts, { capture: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('selectstart', preventSelection)
    document.addEventListener('dragstart', preventSelection)
    document.addEventListener('mousemove', handleMouseMove)

    // Add protection styles
    const styleElement = addProtectionStyles()

    // Monitor for developer tools
    const devToolsInterval = setInterval(detectDevTools, 1000)

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', disableRightClick, { capture: true })
      document.removeEventListener('keydown', disableKeyboardShortcuts, { capture: true })
      document.removeEventListener('keyup', disableKeyboardShortcuts, { capture: true })
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleWindowBlur)
      window.removeEventListener('focus', handleWindowFocus)
      document.removeEventListener('selectstart', preventSelection)
      document.removeEventListener('dragstart', preventSelection)
      document.removeEventListener('mousemove', handleMouseMove)
      
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
      
      clearInterval(devToolsInterval)
      if (warningTimeout) clearTimeout(warningTimeout)
    }
  }, [enableWarnings, watermarkText, suspiciousActivity])

  return (
    <div className="screen-protected">
      {/* Watermark */}
      <div className="watermark" />
      
      {/* Transparent overlay */}
      <div className="protection-overlay" />
      
      {/* Main content with blur effect */}
      <div className={isBlurred ? 'content-blurred' : 'content-normal'}>
        {children}
      </div>

      {/* Blur overlay with warning */}
      <AnimatePresence>
        {isBlurred && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-red-900/90 backdrop-blur-lg rounded-3xl p-8 max-w-md mx-4 text-center border border-red-500/30"
            >
              <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Content Protected</h2>
              <p className="text-red-200 mb-4">
                This content is temporarily hidden for security reasons.
              </p>
              <div className="flex items-center justify-center space-x-2 text-red-300">
                <Eye className="w-5 h-5" />
                <span>Monitoring active</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning messages */}
      <AnimatePresence>
        {showWarning && enableWarnings && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-yellow-900/90 backdrop-blur-lg rounded-xl p-4 max-w-sm z-50 border border-yellow-500/30"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-200 text-sm">{warningMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suspicious activity indicator */}
      {suspiciousActivity > 0 && (
        <div className="fixed bottom-4 left-4 bg-red-900/90 backdrop-blur-lg rounded-xl p-3 z-50 border border-red-500/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-200 text-sm">Security monitoring active</span>
          </div>
        </div>
      )}
    </div>
  )
}