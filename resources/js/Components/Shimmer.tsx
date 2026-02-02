// Shimmer/Skeleton Loading Components

/**
 * Shimmer/Skeleton Loading Components
 * 
 * Universal loading placeholders with animated shimmer effect.
 * Used with Inertia.js Deferred component for lazy loading data.
 */

interface ShimmerBaseProps {
    className?: string;
}

interface ShimmerLineProps extends ShimmerBaseProps {
    width?: string;
}

interface ShimmerBlockProps extends ShimmerBaseProps {
    height?: string;
    width?: string;
}

interface ShimmerTableProps extends ShimmerBaseProps {
    rows?: number;
    cols?: number;
}

interface ShimmerCardProps extends ShimmerBaseProps {
    hasImage?: boolean;
}

interface ShimmerStatsCardsProps extends ShimmerBaseProps {
    count?: number;
}

// Base shimmer animation styles
const shimmerBase = `
    relative overflow-hidden
    bg-gray-200 dark:bg-gray-700
    before:absolute before:inset-0
    before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
    before:animate-[shimmer_1.5s_infinite]
`;

/**
 * Single line shimmer
 */
function Line({ width = 'w-full', className = '' }: ShimmerLineProps) {
    return (
        <div className={`${shimmerBase} h-4 rounded ${width} ${className}`} />
    );
}

/**
 * Block/Rectangle shimmer
 */
function Block({ height = 'h-24', width = 'w-full', className = '' }: ShimmerBlockProps) {
    return (
        <div className={`${shimmerBase} rounded-lg ${height} ${width} ${className}`} />
    );
}

/**
 * Circle shimmer (for avatars)
 */
function Circle({ className = '' }: ShimmerBaseProps) {
    return (
        <div className={`${shimmerBase} w-10 h-10 rounded-full ${className}`} />
    );
}

/**
 * Table skeleton with rows and columns
 */
function Table({ rows = 5, cols = 4, className = '' }: ShimmerTableProps) {
    return (
        <div className={`overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
                {Array.from({ length: cols }).map((_, i) => (
                    <div key={`header-${i}`} className={`${shimmerBase} h-4 rounded flex-1`} />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div
                    key={`row-${rowIndex}`}
                    className="flex gap-4 p-4 border-b border-gray-50 dark:border-gray-800/50"
                >
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <div
                            key={`cell-${rowIndex}-${colIndex}`}
                            className={`${shimmerBase} h-4 rounded flex-1`}
                            style={{ 
                                animationDelay: `${(rowIndex * cols + colIndex) * 50}ms` 
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

/**
 * Card skeleton with optional image
 */
function Card({ hasImage = false, className = '' }: ShimmerCardProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm ${className}`}>
            {hasImage && (
                <div className={`${shimmerBase} h-40 rounded-lg mb-4`} />
            )}
            <div className="space-y-3">
                <div className={`${shimmerBase} h-5 rounded w-3/4`} />
                <div className={`${shimmerBase} h-4 rounded w-full`} />
                <div className={`${shimmerBase} h-4 rounded w-2/3`} />
            </div>
        </div>
    );
}

/**
 * Stats cards grid skeleton (matches StatsCard layout)
 */
function StatsCards({ count = 4, className = '' }: ShimmerStatsCardsProps) {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={`stats-${i}`}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        {/* Icon placeholder */}
                        <div className={`${shimmerBase} w-12 h-12 rounded-xl`} />
                        <div className="flex-1 space-y-2">
                            {/* Title */}
                            <div className={`${shimmerBase} h-3 rounded w-20`} />
                            {/* Value */}
                            <div className={`${shimmerBase} h-6 rounded w-16`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Budget overview skeleton (matches Dashboard budget card)
 */
function BudgetOverview({ className = '' }: ShimmerBaseProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm ${className}`}>
            <div className={`${shimmerBase} h-5 rounded w-32 mb-6`} />
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <div className={`${shimmerBase} h-3 rounded w-20`} />
                    <div className={`${shimmerBase} h-7 rounded w-28`} />
                </div>
                <div className="space-y-2">
                    <div className={`${shimmerBase} h-3 rounded w-16`} />
                    <div className={`${shimmerBase} h-7 rounded w-24`} />
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <div className={`${shimmerBase} h-3 rounded w-16`} />
                    <div className={`${shimmerBase} h-3 rounded w-10`} />
                </div>
                <div className={`${shimmerBase} h-3 rounded-full w-full`} />
            </div>
        </div>
    );
}

/**
 * List skeleton
 */
function List({ items = 5, className = '' }: { items?: number; className?: string }) {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: items }).map((_, i) => (
                <div key={`list-${i}`} className="flex items-center gap-3 p-3">
                    <div className={`${shimmerBase} w-3 h-3 rounded-full flex-shrink-0`} />
                    <div className="flex-1 space-y-2">
                        <div className={`${shimmerBase} h-4 rounded w-3/4`} />
                        <div className={`${shimmerBase} h-3 rounded w-1/2`} />
                    </div>
                    <div className={`${shimmerBase} h-4 rounded w-12`} />
                </div>
            ))}
        </div>
    );
}

// Export as namespace-like object
export const Shimmer = {
    Line,
    Block,
    Circle,
    Table,
    Card,
    StatsCards,
    BudgetOverview,
    List,
};

export default Shimmer;
