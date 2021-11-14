const useSwitchMode = () => {
  const themeMode = document.body.getAttribute('theme-mode') || 'light'
  const switchMode = () => {
    const body = document.body
    if (body.hasAttribute('theme-mode')) {
      body.removeAttribute('theme-mode')
    } else {
      body.setAttribute('theme-mode', 'dark')
    }
  }
  return {
    switchMode,
    themeMode,
  }
}

export default useSwitchMode
