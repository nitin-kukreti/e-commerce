// app/layout.tsx
import { ReactNode } from 'react'
import './globals.css'

const Layout = ({ children }: { children: ReactNode }) => (
  <html>
    <body>{children}</body>
  </html>
)

export default Layout
