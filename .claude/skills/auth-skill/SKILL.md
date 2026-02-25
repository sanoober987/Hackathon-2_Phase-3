---
name: auth-skill
description: Build secure authentication systems including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Auth Skill

## Instructions

1. **Signup & Signin Flow**
   - Create secure user registration
   - Handle login with credential verification
   - Normalize and sanitize user input
   - Prevent duplicate accounts

2. **Password Security**
   - Hash passwords using modern algorithms (bcrypt, argon2, or scrypt)
   - Compare hashes safely
   - Never store plaintext passwords
   - Enforce strong password policies

3. **JWT Token Handling**
   - Generate access and refresh tokens
   - Sign tokens with secure secrets
   - Validate and decode JWTs
   - Handle token expiration and rotation

4. **Session & Route Protection**
   - Protect private routes and APIs
   - Implement role-based access control
   - Attach identity to requests safely
   - Handle logout and token invalidation

5. **Better Auth Integration**
   - Integrate Better Auth provider
   - Configure identity strategies
   - Sync external identities with local users
   - Handle provider callbacks securely

---

## Best Practices

- Never expose secrets in code
- Use HTTPS for all auth traffic
- Validate all inputs before processing
- Rate-limit authentication endpoints
- Avoid leaking auth errors
- Use environment variables for keys
- Rotate tokens regularly

---

## Example Structure

```js
// Signup Example
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 12);

  const user = await createUser({ email, password: hashed });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  res.json({ user, token });
}
