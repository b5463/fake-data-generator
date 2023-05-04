import { HTMLAttributes, useEffect, useState } from 'react'
// import Header from '../../common/Header'
import { AppBar, IconButton, toogleTheme } from 'hikari-ui'
import { FaRegMoon, FaRegSun } from 'react-icons/fa'
import classNames from 'classnames'
// import ThemeSwitch from '../../ui/forms/ThemeSwitch'
interface MainTemplateProps extends HTMLAttributes<HTMLDivElement> {}

function MainTemplate({ children, ...rest }: MainTemplateProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setTheme('dark')
    }
    localStorage.setItem('theme', 'dark')
  }, [])

  useEffect(() => {
    toogleTheme()
  }, [theme, toogleTheme])
  return (
    <div
      className={classNames(
        'relative',
        'flex flex-col',
        'min-h-screen max-w-screen',
        'overflow-x-hidden'
      )}
      {...rest}
    >
      {/* <Header />
       */}
      <AppBar>
        <AppBar.Tool className={classNames('justify-between mx-auto max-w-7xl')}>
          <h2 className={classNames('text-base sm:text-2xl text-light font-bold')}>
            Data Generator
          </h2>
          <div className="flex items-center">
            {/* <ThemeSwitch
              id="theme-ThemeSwitch"
              checked={theme === 'dark'}
              onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            /> */}
            <IconButton
              onClick={() =>
                setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
              }
              variantStyle="info-ghost"
              icon={theme === 'dark' ? <FaRegSun /> : <FaRegMoon />}
            />
          </div>
        </AppBar.Tool>
      </AppBar>
      <div
        className={classNames('flex', 'w-full h-full pt-[35px]', 'overflow-x-hidden')}
        style={{
          minHeight: 'calc(100vh - 80px)',
        }}
      >
        <div className="flex flex-col flex-1 px-7">{children}</div>
      </div>
    </div>
  )
}

export default MainTemplate
