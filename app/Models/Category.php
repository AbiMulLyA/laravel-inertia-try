<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Category Model
 * 
 * Example model for master data / lookup tables.
 * Use this as a template for creating similar models.
 */
class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'categories';

    protected $fillable = [
        'code',
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ============================================
    // Relationships
    // ============================================

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    // ============================================
    // Scopes
    // ============================================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // ============================================
    // Accessors
    // ============================================

    public function getTotalProjectsAttribute(): int
    {
        return $this->projects()->count();
    }

    public function getTotalBudgetAttribute(): float
    {
        return $this->projects()->sum('budget');
    }
}
