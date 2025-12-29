<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Appearance Settings Page
     * Allows users to configure theme (light/dark/system)
     */
    public function appearance()
    {
        return Inertia::render('Settings/Appearance');
    }
}
