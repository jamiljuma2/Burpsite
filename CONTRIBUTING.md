# Contributing to Burpsite

Thank you for your interest in contributing! Here's how to help.

## Code of Conduct

- Be respectful and professional
- Help others learn and grow
- Report security issues privately
- Follow all applicable laws

## Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/yourusername/Burpsite.git`
3. **Create a feature branch**: `git checkout -b feature/your-feature`
4. **Make your changes**
5. **Test thoroughly**
6. **Commit with clear messages**: `git commit -m "feat: add new feature"`
7. **Push to your fork**: `git push origin feature/your-feature`
8. **Create a Pull Request**

## Development Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## Coding Standards

### Backend (JavaScript/Node.js)

```javascript
// Use es6+ features
const myFunction = (param) => {
  // Do something
};

// Comment complex logic
/**
 * Processes user input and returns sanitized output
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
const sanitizeInput = (input) => {
  // Implementation
};

// Use consistent naming
const userData = {}; // ✓
const GetUserData = {}; // ✗
```

### Frontend (React/JSX)

```javascript
// Use functional components with hooks
export default function MyComponent() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// Use descriptive component names
export default ProxyInterceptor; // ✓
export default Proxy; // ✗ (less specific)

// Prop types or TypeScript
MyComponent.propTypes = {
  title: PropTypes.string.required,
};
```

### Database

```sql
-- Use lowercase table names
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Use descriptive column names
user_created_at TIMESTAMP; -- ✓
created TIMESTAMP; -- ✗
```

## Types of Contributions

### Bug Reports
- Include reproduction steps
- Show expected vs actual behavior
- Include environment info
- Add error messages/screenshots

### Feature Requests
- Describe the feature clearly
- Include use cases
- Suggest implementation approach
- Provide examples

### Code Improvements
- Follow coding standards
- Add tests where applicable
- Update documentation
- Reference related issues

### Documentation
- Fix typos and unclear explanations
- Add examples
- Include code snippets
- Keep it current

## Testing Before PR

### Backend
```bash
cd backend
npm test
npm run lint  # (when available)
```

### Frontend
```bash
cd frontend
npm test
npm run build  # Check for build errors
```

## PR Guidelines

### Title
- Be descriptive: `feat: add SQL injection detection`
- Use conventional commits format:
  - `feat:` New feature
  - `fix:` Bug fix
  - `docs:` Documentation
  - `refactor:` Code restructuring
  - `test:` Test additions
  - `perf:` Performance improvement

### Description
```markdown
## Description
Brief description of changes

## Related Issue
Fixes #123

## Type of Change
- [x] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing Done
- [ ] Manual testing
- [ ] Added tests
- [ ] Updated existing tests

## Screenshots (if applicable)
[Any screenshots showing the feature]

## Checklist
- [ ] Code follows style guidelines
- [ ] No new warnings generated
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
```

## Areas for Contribution

### High Priority
- [ ] Actual proxy server implementation
- [ ] Real-time WebSocket updates
- [ ] PDF/JSON report generation
- [ ] Input validation (Joi)
- [ ] Unit tests

### Medium Priority
- [ ] Plugin system
- [ ] Custom payload management
- [ ] Advanced filtering/search
- [ ] Export functionality
- [ ] API authentication options

### Lower Priority
- [ ] Performance optimizations
- [ ] UI/UX improvements
- [ ] Dark mode enhancements
- [ ] Keyboard shortcuts
- [ ] Multi-language support

## Reporting Security Issues

**Do not open GitHub issues for security vulnerabilities.**

Email security concerns to the maintainers privately with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We'll acknowledge receipt within 48 hours and work on a fix.

## Documentation

### When to Update Docs
- Any feature changes
- API modifications
- New modules or commands
- Breaking changes

### Where to Document
- **README.md**: Setup and overview
- **API.md**: API endpoints
- **ARCHITECTURE.md**: Technical design
- **Inline comments**: Complex logic

### Example Code Comments

```javascript
/**
 * Scans a given URL for common vulnerabilities
 * 
 * @async
 * @param {string} url - The URL to scan
 * @returns {Promise<Array>} Array of detected vulnerabilities
 * @throws {Error} If the URL is invalid
 * 
 * @example
 * const vulns = await scanURL('https://example.com');
 * console.log(vulns);
 */
const scanURL = async (url) => {
  // Implementation
};
```

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Example:
```
feat(scanner): add CSRF vulnerability detection

Added new test for CSRF tokens in forms.
Checks for forms missing CSRF token fields
and reports them as medium severity.

Fixes #234
```

## Review Process

1. **Automated Checks**
   - Code style (future)
   - Tests pass
   - No linting errors

2. **Code Review**
   - Functionality review
   - Security review
   - Performance review
   - Documentation review

3. **Approval**
   - Requires 1+ approval
   - All discussions resolved
   - Tests passing

4. **Merge**
   - Squash commits (if needed)
   - Merge to main
   - Close related issues

## Local Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend builds without warnings
- [ ] Database connection works
- [ ] Can register a user
- [ ] Can login
- [ ] Can access all modules
- [ ] No console errors
- [ ] Specific feature works as intended

## Questions?

- Check existing issues/discussions
- Review documentation
- Ask in GitHub discussions
- Open an issue with your question

## Recognition

Contributors will be recognized:
- In commit history
- In CONTRIBUTORS.md (future)
- In release notes (for major contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making Burpsite better!** 🛡️
