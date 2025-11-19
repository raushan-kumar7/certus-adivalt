import type React from 'react';
import { Link } from 'react-router-dom';

export interface SidebarItemType {
  title: string;
  path?: string;
  type: 'single' | 'group' | 'subgroup';
  children?: SidebarItemType[];
}

interface SidebarItemProps {
  item: SidebarItemType;
  level: number;
  openSections: Record<string, boolean>;
  toggleSection: (title: string) => void;
  currentPath: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  level,
  openSections,
  toggleSection,
  currentPath
}) => {
  const isActive = currentPath === item.path;
  const isOpen = openSections[item.title];
  const hasChildren = item.children && item.children.length > 0;

  const paddingLeft = {
    0: 'pl-4',
    1: 'pl-8',
    2: 'pl-12',
    3: 'pl-16'
  }[level] || 'pl-4';

  if (item.type === 'single') {
    return (
      <li>
        <Link
          to={item.path || '#'}
          className={`${paddingLeft} flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${isActive
              ? 'bg-blue-100 text-blue-700 font-medium border-r-2 border-blue-500'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
          {item.title}
        </Link>
      </li>
    );
  }

  if (item.type === 'group' || item.type === 'subgroup') {
    return (
      <li>
        {/* Group Header */}
        <button
          onClick={() => toggleSection(item.title)}
          className={`${paddingLeft} w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-900 text-gray-700 font-medium`}
        >
          <span>{item.title}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Children */}
        {isOpen && hasChildren && (
          <ul className="mt-1 space-y-1">
            {item.children!.map((child) => (
              <SidebarItem
                key={child.title || child.path}
                item={child}
                level={level + 1}
                openSections={openSections}
                toggleSection={toggleSection}
                currentPath={currentPath}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return null;
};

export default SidebarItem;