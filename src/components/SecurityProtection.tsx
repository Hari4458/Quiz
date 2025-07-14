import { useEffect } from 'react'

export default function SecurityProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    // Comprehensive keyboard blocking
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // Block ALL function keys
      if (e.key.startsWith('F') && e.key.length <= 3) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Block ALL PrintScreen variations
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard?.writeText('')
        document.body.style.display = 'none'
        setTimeout(() => {
          document.body.style.display = 'block'
        }, 1000)
        return false
      }

      // Block developer tools shortcuts
      const blockedCombinations = [
        { ctrl: true, shift: true, key: 'I' },
        { ctrl: true, shift: true, key: 'J' },
        { ctrl: true, shift: true, key: 'C' },
        { ctrl: true, key: 'u' },
        { ctrl: true, key: 'U' },
        { ctrl: true, key: 's' },
        { ctrl: true, key: 'S' },
        { ctrl: true, key: 'a' },
        { ctrl: true, key: 'A' },
        { ctrl: true, key: 'c' },
        { ctrl: true, key: 'C' },
        { ctrl: true, key: 'v' },
        { ctrl: true, key: 'V' },
        { ctrl: true, key: 'x' },
        { ctrl: true, key: 'X' },
        { ctrl: true, key: 'p' },
        { ctrl: true, key: 'P' },
        { ctrl: true, key: 'r' },
        { ctrl: true, key: 'R' },
        { alt: true, key: 'PrintScreen' },
        { meta: true, key: 'PrintScreen' },
        { ctrl: true, key: 'PrintScreen' },
        { shift: true, key: 'PrintScreen' },
      ]

      for (const combo of blockedCombinations) {
        if (
          (combo.ctrl && e.ctrlKey) ||
          (combo.shift && e.shiftKey) ||
          (combo.alt && e.altKey) ||
          (combo.meta && e.metaKey)
        ) {
          if (e.key === combo.key || e.key.toLowerCase() === combo.key.toLowerCase()) {
            e.preventDefault()
            e.stopPropagation()
            if (combo.key === 'PrintScreen') {
              navigator.clipboard?.writeText('')
              document.body.style.display = 'none'
              setTimeout(() => {
                document.body.style.display = 'block'
              }, 1000)
            }
            return false
          }
        }
      }

      // Block Windows key combinations
      if (e.metaKey || e.key === 'Meta') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      return true
    }

    // Aggressive screenshot detection
    const detectScreenshotAttempts = () => {
      let isHidden = false
      
      const hideContent = () => {
        if (!isHidden) {
          isHidden = true
          document.body.style.visibility = 'hidden'
          document.body.style.opacity = '0'
          setTimeout(() => {
            document.body.style.visibility = 'visible'
            document.body.style.opacity = '1'
            isHidden = false
          }, 2000)
        }
      }

      // Monitor window focus changes
      let focusChangeCount = 0
      let lastFocusChange = Date.now()

      const handleFocusChange = () => {
        const now = Date.now()
        if (now - lastFocusChange < 500) {
          focusChangeCount++
          if (focusChangeCount > 2) {
            hideContent()
            focusChangeCount = 0
          }
        } else {
          focusChangeCount = 0
        }
        lastFocusChange = now
      }

      // Monitor visibility changes
      const handleVisibilityChange = () => {
        if (document.hidden) {
          document.body.style.filter = 'blur(50px)'
          document.body.style.opacity = '0.1'
        } else {
          setTimeout(() => {
            document.body.style.filter = 'none'
            document.body.style.opacity = '1'
          }, 500)
        }
      }

      // Monitor mouse movements for screenshot tools
      let mouseMovements: number[] = []
      const handleMouseMove = () => {
        mouseMovements.push(Date.now())
        if (mouseMovements.length > 10) {
          mouseMovements.shift()
        }
        
        // Check for suspicious mouse patterns
        if (mouseMovements.length >= 5) {
          const intervals = mouseMovements.slice(1).map((time, i) => time - mouseMovements[i])
          const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
          if (avgInterval < 10) { // Very rapid mouse movements
            hideContent()
          }
        }
      }

      window.addEventListener('focus', handleFocusChange)
      window.addEventListener('blur', handleFocusChange)
      document.addEventListener('visibilitychange', handleVisibilityChange)
      document.addEventListener('mousemove', handleMouseMove)

      return () => {
        window.removeEventListener('focus', handleFocusChange)
        window.removeEventListener('blur', handleFocusChange)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        document.removeEventListener('mousemove', handleMouseMove)
      }
    }

    // Detect developer tools with multiple aggressive methods
    const detectDevTools = () => {
      let devToolsOpen = false

      // Method 1: Console detection
      const detectConsole = () => {
        const element = new Image()
        Object.defineProperty(element, 'id', {
          get: function() {
            devToolsOpen = true
            document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; font-size: 24px; text-align: center; font-family: Arial;">⚠️<br/>Unauthorized access detected.<br/>Please close developer tools and refresh the page.</div>'
          }
        })
        console.log('%c', element)
        console.clear()
      }

      // Method 2: Window size detection
      const checkWindowSize = () => {
        const threshold = 160
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          if (!devToolsOpen) {
            devToolsOpen = true
            document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; font-size: 24px; text-align: center; font-family: Arial;">⚠️<br/>Developer tools detected.<br/>Please close them and refresh the page.</div>'
          }
        }
      }

      // Method 3: Debugger detection
      const detectDebugger = () => {
        setInterval(() => {
          const start = performance.now()
          debugger
          const end = performance.now()
          if (end - start > 100) {
            document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; font-size: 24px; text-align: center; font-family: Arial;">⚠️<br/>Debugging detected.<br/>Access denied.</div>'
          }
        }, 1000)
      }

      // Method 4: Performance monitoring
      const monitorPerformance = () => {
        setInterval(() => {
          const start = performance.now()
          console.log('')
          const end = performance.now()
          if (end - start > 5) {
            document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; font-size: 24px; text-align: center; font-family: Arial;">⚠️<br/>Console monitoring detected.<br/>Access denied.</div>'
          }
        }, 500)
      }

      setInterval(checkWindowSize, 100)
      setInterval(detectConsole, 1000)
      detectDebugger()
      monitorPerformance()
    }

    // Disable text selection completely
    const disableSelection = () => {
      const style = document.createElement('style')
      style.textContent = `
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
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
          -webkit-touch-callout: none !important;
        }

        /* Prevent screenshot overlays and tools */
        body::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: transparent;
          z-index: 999999;
          pointer-events: none;
          mix-blend-mode: difference;
        }

        /* Hide content when printing */
        @media print {
          * {
            visibility: hidden !important;
            display: none !important;
          }
          body::before {
            content: "Screenshot/Print Protection Active" !important;
            visibility: visible !important;
            display: block !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            font-size: 48px !important;
            color: black !important;
            background: white !important;
            padding: 50px !important;
            border: 5px solid black !important;
          }
        }

        /* Prevent image saving and dragging */
        img {
          -webkit-user-drag: none !important;
          -khtml-user-drag: none !important;
          -moz-user-drag: none !important;
          -o-user-drag: none !important;
          user-drag: none !important;
          pointer-events: none !important;
        }

        /* Additional protection */
        * {
          -webkit-app-region: no-drag !important;
          app-region: no-drag !important;
        }
      `
      document.head.appendChild(style)
      return style
    }

    // Monitor clipboard aggressively
    const monitorClipboard = () => {
      const clearClipboard = async () => {
        try {
          await navigator.clipboard.writeText('')
        } catch (e) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea')
          textArea.value = ''
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
        }
      }

      // Clear clipboard every second
      const clipboardInterval = setInterval(clearClipboard, 1000)

      // Monitor clipboard changes
      const monitorChanges = async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.readText) {
            const text = await navigator.clipboard.readText()
            if (text.length > 10) {
              await clearClipboard()
              document.body.style.display = 'none'
              setTimeout(() => {
                document.body.style.display = 'block'
              }, 1000)
            }
          }
        } catch (e) {
          // Expected - clipboard access denied is good for security
        }
      }

      const monitorInterval = setInterval(monitorChanges, 500)

      return () => {
        clearInterval(clipboardInterval)
        clearInterval(monitorInterval)
      }
    }

    // Disable drag and drop completely
    const disableDragDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    // Block common screenshot shortcuts at system level
    const blockSystemShortcuts = (e: KeyboardEvent) => {
      // Windows shortcuts
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault()
        e.stopPropagation()
        document.body.style.visibility = 'hidden'
        setTimeout(() => {
          document.body.style.visibility = 'visible'
        }, 2000)
        return false
      }

      // Mac shortcuts
      if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
        e.preventDefault()
        e.stopPropagation()
        document.body.style.visibility = 'hidden'
        setTimeout(() => {
          document.body.style.visibility = 'visible'
        }, 2000)
        return false
      }

      return true
    }

    // Add all event listeners
    document.addEventListener('contextmenu', disableRightClick, { capture: true })
    document.addEventListener('keydown', disableKeyboardShortcuts, { capture: true })
    document.addEventListener('keyup', disableKeyboardShortcuts, { capture: true })
    document.addEventListener('keypress', blockSystemShortcuts, { capture: true })
    document.addEventListener('dragstart', disableDragDrop, { capture: true })
    document.addEventListener('drop', disableDragDrop, { capture: true })
    document.addEventListener('dragover', disableDragDrop, { capture: true })
    document.addEventListener('selectstart', (e) => e.preventDefault(), { capture: true })
    
    // Apply protections
    const styleElement = disableSelection()
    const cleanupScreenshotDetection = detectScreenshotAttempts()
    const cleanupClipboardMonitoring = monitorClipboard()
    detectDevTools()

    // Prevent image context menu and dragging
    const protectImages = () => {
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        img.addEventListener('contextmenu', (e) => e.preventDefault())
        img.addEventListener('dragstart', (e) => e.preventDefault())
        img.style.pointerEvents = 'none'
        img.style.userSelect = 'none'
      })
    }

    protectImages()

    // Monitor for new images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLImageElement) {
            node.addEventListener('contextmenu', (e) => e.preventDefault())
            node.addEventListener('dragstart', (e) => e.preventDefault())
            node.style.pointerEvents = 'none'
            node.style.userSelect = 'none'
          }
        })
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // Aggressive window monitoring
    let windowCheckInterval = setInterval(() => {
      // Check if window is being manipulated
      if (window.outerWidth - window.innerWidth > 200 || 
          window.outerHeight - window.innerHeight > 200) {
        document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; font-size: 24px; text-align: center; font-family: Arial;">⚠️<br/>Unauthorized window manipulation detected.<br/>Please refresh the page.</div>'
      }
    }, 100)

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', disableRightClick, { capture: true })
      document.removeEventListener('keydown', disableKeyboardShortcuts, { capture: true })
      document.removeEventListener('keyup', disableKeyboardShortcuts, { capture: true })
      document.removeEventListener('keypress', blockSystemShortcuts, { capture: true })
      document.removeEventListener('dragstart', disableDragDrop, { capture: true })
      document.removeEventListener('drop', disableDragDrop, { capture: true })
      document.removeEventListener('dragover', disableDragDrop, { capture: true })
      
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
      
      cleanupScreenshotDetection()
      cleanupClipboardMonitoring()
      observer.disconnect()
      clearInterval(windowCheckInterval)
      
      // Reset styles
      document.body.style.filter = 'none'
      document.body.style.opacity = '1'
      document.body.style.visibility = 'visible'
      document.body.style.display = 'block'
    }
  }, [])

  return null
}