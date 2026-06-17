<?php

it('responds to the health endpoint', function () {
    $this->get('/up')->assertOk();
});

it('renders the login page with an inertia payload', function () {
    $this->get('/login')
        ->assertOk()
        ->assertSee('data-page="app"', false)
        ->assertSee('Auth\\/Login', false);
});

it('redirects guests from the dashboard to login', function () {
    $this->get('/dashboard')
        ->assertRedirect('/login');
});
