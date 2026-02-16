# 🔒 Security Documentation

## Overview

This application implements enterprise-grade security measures to protect user data and prevent common vulnerabilities.

## Security Features

### 1. Authentication & Authorization

#### JWT (JSON Web Tokens)
- **Implementation**: Stateless authentication using JWT
- **Token Expiry**: Configurable (default: 7 days)
- **Storage**: Client-side in localStorage
- **Transmission**: Authorization header with Bearer scheme
- **Secret Key**: Minimum 32 characters, stored in environment variables

#### Role-Based Access Control (RBAC)
- **Roles**: User, Admin
- **Middleware**: `protect` and `authorize` middleware
- **Enforcement**: Server-side validation on all protected routes
- **Principle**: Least privilege access

### 2. Password Security

#### Hashing
- **Algorithm**: bcrypt
- **Salt Rounds**: 12 (configurable)
- **Storage**: Never store plain text passwords
- **Comparison**: Secure timing-safe comparison

#### Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Maximum 128 characters

### 3. Email Verification

#### OTP (One-Time Password)
- **Generation**: 6-digit random number
- **Expiry**: 5 minutes (configurable)
- **Single Use**: OTP invalidated after verification
- **Attempts**: Maximum 5 attempts before requiring new OTP
- **Rate Limiting**: 1 OTP request per minute per email

#### Email Security
- **Transport**: TLS/SSL encryption
- **Validation**: Email format validation
- **Verification**: Mandatory before login

### 4. Account Protection

#### Login Security
- **Failed Attempts**: Track failed login attempts
- **Account Lockout**: Lock after 5 failed attempts
- **Lockout Duration**: 2 hours
- **Reset**: Automatic reset after successful login

#### Session Management
- **Token Expiry**: Automatic logout after token expiration
- **Logout**: Client-side token removal
- **Refresh**: No automatic token refresh (security by design)

### 5. API Security

#### Rate Limiting
```javascript
// General API: 100 requests per 15 minutes
// Auth endpoints: 10 requests per 15 minutes
// OTP resend: 1 request per minute
```

#### HTTP Security Headers (Helmet)
- Content Security Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)

#### CORS Configuration
- **Origin**: Whitelist specific domains
- **Credentials**: Enabled for authenticated requests
- **Methods**: Limited to required HTTP methods

### 6. Input Validation & Sanitization

#### Server-Side Validation
- **Library**: validator.js
- **Validation**: All user inputs validated
- **Error Messages**: Descriptive but not revealing

#### Data Sanitization
- **NoSQL Injection**: express-mongo-sanitize
- **XSS Prevention**: Input escaping and sanitization
- **Type Checking**: Mongoose schema validation

#### Client-Side Validation
- **HTML5 Validation**: Basic input validation
- **React Validation**: Form validation before submission
- **User Feedback**: Real-time validation feedback

### 7. Database Security

#### MongoDB Security
- **Connection**: Secure connection string
- **Authentication**: Database user authentication
- **Injection Prevention**: Parameterized queries via Mongoose
- **Sanitization**: express-mongo-sanitize middleware

#### Data Protection
- **Soft Deletes**: Data not permanently removed
- **Sensitive Data**: Excluded from responses (select: false)
- **Indexes**: Optimized for performance and security

### 8. Error Handling

#### Secure Error Messages
- **Production**: Generic error messages
- **Development**: Detailed error information
- **Logging**: Server-side error logging
- **No Exposure**: Never expose stack traces or sensitive data

#### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 423: Locked
- 429: Too Many Requests
- 500: Internal Server Error

## Security Best Practices

### Environment Variables
```env
# ✅ DO: Use strong, random secrets
JWT_SECRET=very-long-random-string-min-64-characters

# ❌ DON'T: Use weak or default secrets
JWT_SECRET=secret123
```

### Password Storage
```javascript
// ✅ DO: Hash passwords with bcrypt
const hashedPassword = await bcrypt.hash(password, 12);

// ❌ DON'T: Store plain text passwords
user.password = password; // NEVER DO THIS
```

### Token Handling
```javascript
// ✅ DO: Verify and validate tokens
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// ❌ DON'T: Trust client-provided user IDs
const userId = req.body.userId; // NEVER DO THIS
```

### Authorization Checks
```javascript
// ✅ DO: Check ownership and permissions
if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({ message: 'Not authorized' });
}

// ❌ DON'T: Skip authorization checks
// Assuming user has access without verification
```

## Vulnerability Prevention

### 1. SQL/NoSQL Injection
**Prevention:**
- Use Mongoose ODM with schema validation
- Sanitize inputs with express-mongo-sanitize
- Never use string concatenation for queries

### 2. Cross-Site Scripting (XSS)
**Prevention:**
- Escape user inputs
- Use Content Security Policy headers
- Sanitize HTML content
- React's built-in XSS protection

### 3. Cross-Site Request Forgery (CSRF)
**Prevention:**
- JWT tokens (not cookies)
- SameSite cookie attribute (if using cookies)
- Origin validation

### 4. Brute Force Attacks
**Prevention:**
- Rate limiting on auth endpoints
- Account lockout after failed attempts
- CAPTCHA (can be added)

### 5. Man-in-the-Middle (MITM)
**Prevention:**
- HTTPS in production
- Secure cookie flags
- HSTS headers

### 6. Session Hijacking
**Prevention:**
- Short token expiry
- Secure token storage
- HTTPS only

## Security Checklist

### Development
- [ ] Use environment variables for secrets
- [ ] Never commit `.env` files
- [ ] Implement input validation
- [ ] Use parameterized queries
- [ ] Hash passwords with bcrypt
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Validate user permissions
- [ ] Log security events
- [ ] Handle errors securely

### Production
- [ ] Enable HTTPS
- [ ] Use strong JWT secrets (64+ characters)
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable HSTS
- [ ] Implement monitoring
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Use production MongoDB
- [ ] Configure firewall rules

## Security Monitoring

### Logging
```javascript
// Log security events
console.log('Failed login attempt:', { email, ip, timestamp });
console.log('Account locked:', { userId, timestamp });
console.log('Suspicious activity:', { userId, action, timestamp });
```

### Monitoring Points
- Failed login attempts
- Account lockouts
- Rate limit violations
- Invalid token attempts
- Unauthorized access attempts
- Unusual activity patterns

## Incident Response

### If Security Breach Detected:
1. **Immediate Actions:**
   - Revoke all active tokens
   - Lock affected accounts
   - Change JWT secret
   - Notify users

2. **Investigation:**
   - Review logs
   - Identify breach source
   - Assess damage
   - Document findings

3. **Remediation:**
   - Fix vulnerability
   - Update security measures
   - Deploy patches
   - Monitor for recurrence

4. **Communication:**
   - Notify affected users
   - Provide guidance
   - Update security documentation

## Security Updates

### Regular Maintenance
- Update dependencies monthly
- Review security advisories
- Audit code for vulnerabilities
- Test security measures
- Update documentation

### Dependency Updates
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

## Compliance

### Data Protection
- User data encrypted in transit (HTTPS)
- Passwords hashed at rest
- Sensitive data excluded from logs
- Right to deletion (soft deletes)

### Privacy
- Minimal data collection
- Clear privacy policy
- User consent for emails
- Data retention policies

## Contact

For security concerns or to report vulnerabilities:
- Review code on GitHub
- Check security documentation
- Follow security best practices

---

**Remember: Security is an ongoing process, not a one-time implementation.**
