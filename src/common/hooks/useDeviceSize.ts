import { useCallback, useEffect, useState } from 'react'

enum Breakpoint {
  MOBILE = 375,
  TABLET = 768,
  TABLET_XL = 1024,
  DESKTOP = 1366,
  DESKTOP_XL = 1920,
}

export const useDeviceSize = () => {
  const [
    width,
    setWidth,
  ] = useState(0)  
  const [
    height,
    setHeight,
  ] = useState(0)

  const handleWindowResize = useCallback(() => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }, [])

  useEffect(() => {
    handleWindowResize()
    window.addEventListener(`resize`, handleWindowResize)

    return () => window.removeEventListener(`resize`, handleWindowResize)
  }, [])

  return {
    width,
    height,
    isMobile: width < Breakpoint.TABLET,
    isTablet: width >= Breakpoint.TABLET && width < Breakpoint.TABLET_XL,
    isTabletXl: width >= Breakpoint.TABLET_XL && width < Breakpoint.DESKTOP,
    isDesktop: width >= Breakpoint.DESKTOP && width < Breakpoint.DESKTOP_XL,
    isDesktopXL: width >= Breakpoint.DESKTOP_XL,
  }
}
