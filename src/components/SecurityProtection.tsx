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
        return false
      }

      // Disable Alt+PrintScreen
      if (e.altKey && e.key === 'PrintScreen') {
        e.preventDefault()
        return false
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

    // Blur content when window loses focus (potential screenshot attempt)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.style.filter = 'blur(10px)'
      } else {
        document.body.style.filter = 'none'
      }
    }

    // Detect developer tools
    const detectDevTools = () => {
      const threshold = 160
      setInterval(() => {
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          // Developer tools might be open
          document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; font-size: 24px;">Developer tools detected. Please close them to continue.</div>'
        }
      }, 500)
    }

    // Add event listeners
    document.addEventListener('contextmenu', disableRightClick)
    document.addEventListener('keydown', disableKeyboardShortcuts)
    document.addEventListener('dragstart', disableDragDrop)
    document.addEventListener('drop', disableDragDrop)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Apply styles
    disableSelection()
    
    // Start dev tools detection
    detectDevTools()

    // Add CSS to prevent highlighting and selection
    const style = document.createElement('style')
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
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
      }

      @media print {
        body {
          display: none !important;
        }
      }
    `
    document.head.appendChild(style)

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', disableRightClick)
      document.removeEventListener('keydown', disableKeyboardShortcuts)
      document.removeEventListener('dragstart', disableDragDrop)
      document.removeEventListener('drop', disableDragDrop)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.head.removeChild(style)
      document.body.style.filter = 'none'
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
      document.body.style.mozUserSelect = ''
      document.body.style.msUserSelect = ''
    }
  }, [])

  return null
}