import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, type LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface NavigationItem {
    name: string;
    href?: string;
    icon?: LucideIcon;
    badge?: number | string;
    children?: NavigationItem[];
}

interface NavItemProps {
    item: NavigationItem;
    depth?: number;
    collapsed?: boolean;
}

/**
 * Recursive Navigation Item Component
 * 
 * Renders navigation items with support for unlimited nesting levels.
 * Features:
 * - Recursive tree rendering
 * - Expand/collapse state persisted in localStorage
 * - Indentation based on depth
 * - Active state highlighting
 * - Dark mode support
 */
export default function NavItem({ item, depth = 0, collapsed = false }: NavItemProps) {
    const { url } = usePage();
    const hasChildren = item.children && item.children.length > 0;
    
    // Get stored expand state or default to false
    const storageKey = `nav-expand-${item.name.toLowerCase().replace(/\s/g, '-')}`;
    const [isExpanded, setIsExpanded] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(storageKey);
            return stored === 'true';
        }
        return false;
    });

    // Check if current item or any child is active
    const isActive = item.href ? url.startsWith(item.href) : false;
    const hasActiveChild = item.children?.some(child => 
        child.href ? url.startsWith(child.href) : false
    ) || false;

    // Auto-expand if has active child
    useEffect(() => {
        if (hasActiveChild && !isExpanded) {
            setIsExpanded(true);
        }
    }, [hasActiveChild]);

    // Persist expand state
    const toggleExpand = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, String(newState));
        }
    };

    // Calculate padding based on depth
    const paddingLeft = collapsed ? 12 : 12 + (depth * 16);

    // Base classes for active/inactive states with dark mode
    const activeClasses = 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300';
    const inactiveClasses = 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100';
    const iconActiveClasses = 'text-primary-600 dark:text-primary-400';
    const iconInactiveClasses = 'text-gray-400 dark:text-gray-500';

    // If collapsed sidebar and has children, render with tooltip
    if (collapsed && depth === 0) {
        return (
            <div className="relative group">
                {item.href ? (
                    <Link
                        href={item.href}
                        className={`
                            flex items-center justify-center w-10 h-10 mx-auto rounded-lg
                            transition-all duration-200
                            ${isActive ? activeClasses : inactiveClasses}
                        `}
                    >
                        {item.icon && (
                            <item.icon className={`w-5 h-5 ${isActive ? iconActiveClasses : iconInactiveClasses}`} />
                        )}
                    </Link>
                ) : (
                    <button
                        onClick={toggleExpand}
                        className={`
                            flex items-center justify-center w-10 h-10 mx-auto rounded-lg
                            transition-all duration-200
                            ${hasActiveChild ? activeClasses : inactiveClasses}
                        `}
                    >
                        {item.icon && (
                            <item.icon className={`w-5 h-5 ${hasActiveChild ? iconActiveClasses : iconInactiveClasses}`} />
                        )}
                    </button>
                )}
                {/* Tooltip */}
                <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                        {item.name}
                        {item.badge && (
                            <span className="ml-2 px-1.5 py-0.5 bg-primary-500 rounded text-xs">
                                {item.badge}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {hasChildren ? (
                // Group item (expandable)
                <button
                    onClick={toggleExpand}
                    className={`
                        w-full flex items-center gap-3 py-2 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${hasActiveChild ? activeClasses : inactiveClasses}
                    `}
                    style={{ paddingLeft: `${paddingLeft}px`, paddingRight: '12px' }}
                >
                    {depth === 0 && item.icon && (
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${hasActiveChild ? iconActiveClasses : iconInactiveClasses}`} />
                    )}
                    <span className="flex-1 text-left sidebar-text truncate">{item.name}</span>
                    {item.badge && (
                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium sidebar-text">
                            {item.badge}
                        </span>
                    )}
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    )}
                </button>
            ) : (
                // Leaf item (link)
                <Link
                    href={item.href || '#'}
                    className={`
                        flex items-center gap-3 py-2 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${isActive ? activeClasses : inactiveClasses}
                    `}
                    style={{ paddingLeft: `${paddingLeft}px`, paddingRight: '12px' }}
                >
                    {depth === 0 && item.icon && (
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? iconActiveClasses : iconInactiveClasses}`} />
                    )}
                    <span className="flex-1 sidebar-text truncate">{item.name}</span>
                    {item.badge && (
                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium sidebar-text">
                            {item.badge}
                        </span>
                    )}
                </Link>
            )}

            {/* Children (recursive) */}
            {hasChildren && isExpanded && (
                <div className="mt-1 space-y-1">
                    {item.children!.map((child, index) => (
                        <NavItem 
                            key={`${child.name}-${index}`} 
                            item={child} 
                            depth={depth + 1}
                            collapsed={collapsed}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
