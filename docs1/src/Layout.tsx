import React from 'react'
import { Sidebar } from './components';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='flex h-screen bg-white'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto'>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout