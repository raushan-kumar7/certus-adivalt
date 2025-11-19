import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import type { SidebarItemType } from './SidebarItem';

const Sidebar = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems: SidebarItemType[] = [
    {
      title: 'Introduction',
      path: '/introduction',
      type: 'single'
    },
    {
      title: 'Types',
      type: 'group',
      children: [
        { title: 'Common', path: '/types/common', type: 'single' },
        { title: 'Errors', path: '/types/errors', type: 'single' },
        { title: 'Logger', path: '/types/logger', type: 'single' },
        { title: 'Responses', path: '/types/responses', type: 'single' }
      ]
    },
    {
      title: 'Constants',
      type: 'group',
      children: [
        { title: 'Error Code', path: '/constants/error-code', type: 'single' },
        { title: 'HTTP Status', path: '/constants/http-status', type: 'single' },
        { title: 'Messages', path: '/constants/messages', type: 'single' }
      ]
    },
    {
      title: 'ADI',
      type: 'group',
      children: [
        { title: 'Config', path: '/adi/config', type: 'single' },
        { title: 'Utils', path: '/adi/utils', type: 'single' }
      ]
    },
    {
      title: 'Certus',
      type: 'group',
      children: [
        { title: 'Errors', path: '/certus/errors', type: 'single' },
        { title: 'Guards', path: '/certus/guards', type: 'single' },
        { title: 'Utils', path: '/certus/utils', type: 'single' }
      ]
    },
    {
      title: 'Responses',
      type: 'group',
      children: [
        { title: 'Builder', path: '/responses/builder', type: 'single' },
        { title: 'Formatter', path: '/responses/formatter', type: 'single' },
        { title: 'Guards', path: '/responses/guards', type: 'single' }
      ]
    },
    {
      title: 'Valt',
      type: 'group',
      children: [
        {
          title: 'Logger',
          type: 'subgroup',
          children: [
            {
              title: 'Formats',
              type: 'subgroup',
              children: [
                { title: 'JSON', path: '/valt/logger/formats/json', type: 'single' },
                { title: 'Pretty', path: '/valt/logger/formats/pretty', type: 'single' }
              ]
            },
            { title: 'Valt Logger', path: '/valt/logger/valt-logger', type: 'single' }
          ]
        },
        { title: 'Middleware', path: '/valt/middleware', type: 'single' },
        { title: 'Security', path: '/valt/security', type: 'single' }
      ]
    }
  ];

  return (
    <div className="w-80 h-screen bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-semibold text-gray-800">Documentation</h2>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.title}
              item={item}
              level={0}
              openSections={openSections}
              toggleSection={toggleSection}
              currentPath={location.pathname}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;