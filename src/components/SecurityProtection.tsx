import { useEffect } from 'react'

export default function SecurityProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Disable common keyboard shortcuts
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // Disable F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }

      // Disable Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }

      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return false
      }

      // Disable Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        return false
      }

      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        return false
      }

      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        return false
      }

      // Disable Ctrl+A (Select All)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault()
        return false
      }

      // Disable Ctrl+C (Copy)
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault()
        return false
      }

      // Disable Ctrl+V (Paste)
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault()
        return false
      }

      // Disable Ctrl+X (Cut)
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault()
        return false
      }

      // Disable Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault()
        return false
      }

      // Disable PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        // Clear clipboard
        navigator.clipboard?.writeText('')
        return false
      }

      // Disable Alt+PrintScreen
      if (e.altKey && e.key === 'PrintScreen') {
        e.preventDefault()
        navigator.clipboard?.writeText('')
        return false
      }

      // Disable Windows+PrintScreen
      if (e.metaKey && e.key === 'PrintScreen') {
        e.preventDefault()
        navigator.clipboard?.writeText('')
        return false
      }

      // Disable Ctrl+PrintScreen
      if (e.ctrlKey && e.key === 'PrintScreen') {
        e.preventDefault()
        navigator.clipboard?.writeText('')
        return false
      }

      // Disable Shift+PrintScreen
      if (e.shiftKey && e.key === 'PrintScreen') {
        e.preventDefault()
        navigator.clipboard?.writeText('')
        return false
      }
    }

    // More aggressive screenshot detection
    const detectScreenshot = () => {
      // Monitor for rapid window focus changes (screenshot tools)
      let focusChangeCount = 0
      let lastFocusChange = Date.now()

      const handleFocusChange = () => {
        const now = Date.now()
        if (now - lastFocusChange < 1000) {
          focusChangeCount++
          if (focusChangeCount > 3) {
            // Potential screenshot activity detected
            document.body.style.display = 'none'
            setTimeout(() => {
              document.body.style.display = 'block'
            }, 2000)
            focusChangeCount = 0
          }
        } else {
          focusChangeCount = 0
        }
        lastFocusChange = now
      }

      window.addEventListener('focus', handleFocusChange)
      window.addEventListener('blur', handleFocusChange)

      return () => {
        window.removeEventListener('focus', handleFocusChange)
        window.removeEventListener('blur', handleFocusChange)
      }
    }

    // Disable text selection
    const disableSelection = () => {
      document.body.style.userSelect = 'none'
      document.body.style.webkitUserSelect = 'none'
      document.body.style.mozUserSelect = 'none'
      document.body.style.msUserSelect = 'none'
    }

    // Disable drag and drop
    const disableDragDrop = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // Enhanced visibility change handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Hide content when tab is not visible
        document.body.style.filter = 'blur(20px)'
        document.body.style.opacity = '0.1'
      } else {
        document.body.style.filter = 'none'
        document.body.style.opacity = '1'
      }
    }

    // Detect developer tools with multiple methods
    const detectDevTools = () => {
      let devtools = false

      // Method 1: Check window size differences
      const checkWindowSize = () => {
        const threshold = 160
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          if (!devtools) {
            devtools = true
            document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; font-size: 24px; text-align: center;">⚠️<br/>Developer tools detected.<br/>Please close them to continue.</div>'
          }
        }
      }

      // Method 2: Console detection
      const detectConsole = () => {
        const element = new Image()
        Object.defineProperty(element, 'id', {
          get: function() {
            devtools = true
            document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; font-size: 24px; text-align: center;">⚠️<br/>Console access detected.<br/>Please close developer tools.</div>'
          }
        })
        console.log(element)
      }

      // Method 3: Debugger detection
      const detectDebugger = () => {
        setInterval(() => {
          const start = performance.now()
          debugger
          const end = performance.now()
          if (end - start > 100) {
            document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; font-size: 24px; text-align: center;">⚠️<br/>Debugging detected.<br/>Please close developer tools.</div>'
          }
        }, 1000)
      }

      setInterval(checkWindowSize, 500)
      detectConsole()
      detectDebugger()
    }

    // Monitor for screenshot-related activities
    const monitorScreenshotActivity = () => {
      // Monitor clipboard changes
      let lastClipboardLength = 0
      
      const checkClipboard = async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.readText) {
            const text = await navigator.clipboard.readText()
            if (text.length > lastClipboardLength + 100) {
              // Potential screenshot text detected
              await navigator.clipboard.writeText('')
            }
            lastClipboardLength = text.length
          }
        } catch (e) {
          // Clipboard access denied - this is actually good for security
        }
      }

      setInterval(checkClipboard, 1000)

      // Monitor for external screenshot tools
      const monitorExternalTools = () => {
        // Check for common screenshot tool processes (limited in browser)
        const suspiciousActivity = () => {
          // Hide content briefly when suspicious activity detected
          document.body.style.visibility = 'hidden'
          setTimeout(() => {
            document.body.style.visibility = 'visible'
          }, 100)
        }

        // Monitor for rapid key combinations that might indicate screenshot tools
        let keySequence: string[] = []
        const handleKeySequence = (e: KeyboardEvent) => {
          keySequence.push(e.key)
          if (keySequence.length > 5) {
            keySequence.shift()
          }
          
          // Check for suspicious key patterns
          const sequence = keySequence.join('')
          if (sequence.includes('PrintScreen') || 
              sequence.includes('Alt') && sequence.includes('PrintScreen')) {
            suspiciousActivity()
          }
        }

        document.addEventListener('keydown', handleKeySequence)
        return () => document.removeEventListener('keydown', handleKeySequence)
      }

      return monitorExternalTools()
    }

    // Add event listeners
    document.addEventListener('contextmenu', disableRightClick)
    document.addEventListener('keydown', disableKeyboardShortcuts)
    document.addEventListener('keyup', disableKeyboardShortcuts)
    document.addEventListener('dragstart', disableDragDrop)
    document.addEventListener('drop', disableDragDrop)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Apply styles
    disableSelection()
    
    // Start monitoring
    const cleanupScreenshotDetection = detectScreenshot()
    const cleanupScreenshotMonitoring = monitorScreenshotActivity()
    detectDevTools()

    // Add comprehensive CSS protection
    const style = document.createElement('style')
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
        pointer-events: auto !important;
      }
      
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }

      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        user-select: none !important;
      }

      /* Hide content when printing */
      @media print {
        body * {
          visibility: hidden !important;
        }
        body::before {
          content: "Printing is not allowed" !important;
          visibility: visible !important;
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          font-size: 24px !important;
          color: black !important;
        }
      }

      /* Prevent screenshot overlays */
      body::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        z-index: 9999;
        pointer-events: none;
        mix-blend-mode: difference;
      }

      /* Additional protection against screenshot tools */
      @media screen {
        body {
          -webkit-app-region: no-drag;
          app-region: no-drag;
        }
      }
    `
    document.head.appendChild(style)

    // Prevent image saving
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      img.addEventListener('dragstart', (e) => e.preventDefault())
      img.addEventListener('contextmenu', (e) => e.preventDefault())
    })

    // Monitor for new images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLImageElement) {
            node.addEventListener('dragstart', (e) => e.preventDefault())
            node.addEventListener('contextmenu', (e) => e.preventDefault())
          }
        })
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', disableRightClick)
      document.removeEventListener('keydown', disableKeyboardShortcuts)
      document.removeEventListener('keyup', disableKeyboardShortcuts)
      document.removeEventListener('dragstart', disableDragDrop)
      document.removeEventListener('drop', disableDragDrop)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.head.removeChild(style)
      document.body.style.filter = 'none'
      document.body.style.opacity = '1'
      document.body.style.visibility = 'visible'
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
      document.body.style.mozUserSelect = ''
      document.body.style.msUserSelect = ''
      cleanupScreenshotDetection()
      cleanupScreenshotMonitoring()
      observer.disconnect()
    }
  }, [])

  return null
}