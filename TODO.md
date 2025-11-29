# TODO: Fix Login Error and Add User Roles

## Current Issue
- Error: "Cannot read properties of undefined (reading 'user')" during login
- Cause: Server returns {user, token} but client expects {success: true, data: {token, user}}

## Tasks
- [ ] Update server response format in authController.js
- [ ] Add role field to User model (default: "user")
- [ ] Update client interfaces to include role
- [ ] Test login functionality

## Files to Edit
- server/models/User.js
- server/controllers/authController.js
- client/src/services/api.ts
- client/src/contexts/AuthContext.tsx
