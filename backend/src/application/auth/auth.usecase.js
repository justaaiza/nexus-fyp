/**
 * DEPRECATED — This monolithic use case file is no longer used.
 *
 * Authentication use cases have been split into separate, DI-compliant files:
 *   - login.usecase.js     → handles login + JWT issuance
 *   - register.usecase.js  → handles user registration
 *   - getMe.usecase.js     → handles fetching the current user
 *
 * All three accept a `userRepo` parameter (dependency injection).
 * They are wired in AuthController.js.
 *
 * This file is kept to avoid breaking any accidental imports.
 * It exports empty stubs so nothing crashes if it is required.
 */
module.exports = {};
