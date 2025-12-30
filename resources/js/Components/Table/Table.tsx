import React from 'react';

interface TableProps {
    children: React.ReactNode;
    className?: string;
}

const TableContext = React.createContext<{}>({});

export function Table({ children, className = '' }: TableProps) {
    return (
        <TableContext.Provider value={{}}>
            <div className={`overflow-x-auto ${className}`}>
                <table className="w-full text-left border-collapse">
                    {children}
                </table>
            </div>
        </TableContext.Provider>
    );
}

function Thead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <thead className={`bg-gray-50 dark:bg-[#1a2744] border-b border-gray-100 dark:border-[#1e3a5f] ${className}`}>
            {children}
        </thead>
    );
}

function Tbody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <tbody className={`divide-y divide-gray-100 dark:divide-[#1e3a5f] ${className}`}>
            {children}
        </tbody>
    );
}

function Tr({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
    return (
        <tr 
            className={`transition-colors hover:bg-gray-50 dark:hover:bg-[#1a2744] ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </tr>
    );
}

function Th({ children, className = '', align = 'left' }: { children: React.ReactNode; className?: string; align?: 'left' | 'center' | 'right' }) {
    const alignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    }[align];

    return (
        <th className={`px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${alignClass} ${className}`}>
            {children}
        </th>
    );
}

function Td({ children, className = '', align = 'left' }: { children: React.ReactNode; className?: string; align?: 'left' | 'center' | 'right' }) {
    const alignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    }[align];

    return (
        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white ${alignClass} ${className}`}>
            {children}
        </td>
    );
}

// Compound components
Table.Thead = Thead;
Table.Tbody = Tbody;
Table.Tr = Tr;
Table.Th = Th;
Table.Td = Td;

export default Table;
