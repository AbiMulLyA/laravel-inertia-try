<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Task Model
 * 
 * Example model for full CRUD with progress tracking.
 * Demonstrates: status management, progress percentage, rich metadata.
 */
class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tasks';

    protected $fillable = [
        'project_id',
        'code',
        'name',
        'description',
        'location',
        'target',
        'achieved',
        'unit',
        'budget',
        'spent',
        'status',
        'progress',
        'priority',
        'start_date',
        'end_date',
        'notes',
    ];

    protected $casts = [
        'target' => 'decimal:2',
        'achieved' => 'decimal:2',
        'budget' => 'decimal:2',
        'spent' => 'decimal:2',
        'progress' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_ON_HOLD = 'on_hold';

    public const STATUSES = [
        self::STATUS_PENDING => 'Pending',
        self::STATUS_IN_PROGRESS => 'In Progress',
        self::STATUS_COMPLETED => 'Completed',
        self::STATUS_ON_HOLD => 'On Hold',
    ];

    // Priority constants
    public const PRIORITY_LOW = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH = 'high';

    public const PRIORITIES = [
        self::PRIORITY_LOW => 'Low',
        self::PRIORITY_MEDIUM => 'Medium',
        self::PRIORITY_HIGH => 'High',
    ];

    // ============================================
    // Relationships
    // ============================================

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    // Accessor to get category through project
    public function getCategoryAttribute()
    {
        return $this->project?->category;
    }

    // ============================================
    // Scopes
    // ============================================

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', self::STATUS_IN_PROGRESS);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopePriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    // ============================================
    // Accessors
    // ============================================

    public function getAchievedPercentageAttribute(): float
    {
        if ($this->target == 0) {
            return 0;
        }
        return round(($this->achieved / $this->target) * 100, 2);
    }

    public function getSpentPercentageAttribute(): float
    {
        if ($this->budget == 0) {
            return 0;
        }
        return round(($this->spent / $this->budget) * 100, 2);
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function getPriorityLabelAttribute(): string
    {
        return self::PRIORITIES[$this->priority] ?? $this->priority;
    }
}
