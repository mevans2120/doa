# Test-Driven Development (TDD) Workflow Guide

## Quick Reference

### TDD Cycle
```
🔴 RED → 🟢 GREEN → 🔵 REFACTOR → 🔴 RED → ...
```

1. **🔴 RED**: Write a failing test
2. **🟢 GREEN**: Write minimal code to pass
3. **🔵 REFACTOR**: Improve code quality
4. **Repeat**: Continue the cycle

## Step-by-Step TDD Process

### 1. Write the Test First (RED)

Before writing any component code, start with a test:

```typescript
// src/components/__tests__/NewComponent.test.tsx
import { render, screen } from '@testing-library/react';
import NewComponent from '../NewComponent';

describe('NewComponent', () => {
  it('renders the component title', () => {
    render(<NewComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

**Run the test** - it should fail because the component doesn't exist yet:
```bash
npm test NewComponent.test.tsx
```

### 2. Write Minimal Code (GREEN)

Create the simplest implementation to make the test pass:

```typescript
// src/components/NewComponent.tsx
interface Props {
  title: string;
}

const NewComponent: React.FC<Props> = ({ title }) => {
  return <div>{title}</div>;
};

export default NewComponent;
```

**Run the test again** - it should now pass:
```bash
npm test NewComponent.test.tsx
```

### 3. Refactor (BLUE)

Improve the code while keeping tests green:

```typescript
// src/components/NewComponent.tsx
interface NewComponentProps {
  title: string;
  className?: string;
}

const NewComponent: React.FC<NewComponentProps> = ({ 
  title, 
  className = '' 
}) => {
  return (
    <div className={`component-wrapper ${className}`}>
      <h2 className="component-title">{title}</h2>
    </div>
  );
};

export default NewComponent;
```

**Run tests** - ensure they still pass after refactoring:
```bash
npm test NewComponent.test.tsx
```

## TDD for Different Component Types

### 1. Simple Display Component

```typescript
// Test first
describe('UserCard', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg'
  };

  it('displays user name', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays user email', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('displays user avatar', () => {
    render(<UserCard user={mockUser} />);
    const avatar = screen.getByRole('img', { name: 'John Doe' });
    expect(avatar).toHaveAttribute('src', '/avatar.jpg');
  });
});
```

### 2. Interactive Component

```typescript
// Test first
describe('Counter', () => {
  it('starts with initial value', () => {
    render(<Counter initialValue={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('increments when plus button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={0} />);
    
    await user.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('decrements when minus button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={1} />);
    
    await user.click(screen.getByRole('button', { name: '-' }));
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
```

### 3. Form Component

```typescript
// Test first
describe('ContactForm', () => {
  it('renders all form fields', () => {
    render(<ContactForm onSubmit={jest.fn()} />);
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('calls onSubmit with form data when submitted', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    
    render(<ContactForm onSubmit={mockSubmit} />);
    
    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Message'), 'Hello world');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello world'
    });
  });

  it('shows validation errors for invalid input', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={jest.fn()} />);
    
    await user.click(screen.getByRole('button', { name: 'Send' }));
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });
});
```

## TDD Best Practices

### 1. Test Naming Convention

```typescript
// ✅ Good: Descriptive test names
describe('LoginForm', () => {
  describe('when user enters valid credentials', () => {
    it('calls onLogin with username and password', () => {});
    it('shows loading state during submission', () => {});
    it('redirects to dashboard on success', () => {});
  });

  describe('when user enters invalid credentials', () => {
    it('displays error message', () => {});
    it('does not call onLogin', () => {});
    it('clears password field', () => {});
  });
});
```

### 2. Test Data Management

```typescript
// ✅ Good: Centralized test data
const createMockUser = (overrides = {}) => ({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  ...overrides
});

describe('UserProfile', () => {
  it('renders admin badge for admin users', () => {
    const adminUser = createMockUser({ role: 'admin' });
    render(<UserProfile user={adminUser} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
```

### 3. Setup and Teardown

```typescript
describe('ComponentWithAPI', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup default API responses
    mockApiCall.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    // Cleanup after each test
    cleanup();
  });
});
```

## Common TDD Patterns

### 1. Testing Hooks

```typescript
// Test first
describe('useCounter hook', () => {
  it('returns initial count', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('increments count when increment is called', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### 2. Testing Context

```typescript
// Test first
describe('ThemeContext', () => {
  const renderWithTheme = (children: React.ReactNode) => {
    return render(
      <ThemeProvider>
        {children}
      </ThemeProvider>
    );
  };

  it('provides default theme', () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      return <div>{theme}</div>;
    };

    renderWithTheme(<TestComponent />);
    expect(screen.getByText('light')).toBeInTheDocument();
  });
});
```

### 3. Testing Error Boundaries

```typescript
// Test first
describe('ErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  it('catches errors and displays fallback UI', () => {
    render(
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
```

## TDD Commands

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run specific test file
npm test Header.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="renders"

# Run tests with coverage
npm test -- --coverage

# Run tests for changed files only
npm test -- --onlyChanged
```

### Test Coverage

```bash
# Generate coverage report
npm test -- --coverage --watchAll=false

# View coverage in browser
open coverage/lcov-report/index.html
```

## TDD Checklist

### Before Writing Code
- [ ] Understand the requirement
- [ ] Write a failing test
- [ ] Run the test to confirm it fails
- [ ] Understand why it fails

### Writing Code
- [ ] Write minimal code to pass the test
- [ ] Run the test to confirm it passes
- [ ] Don't add extra functionality yet

### Refactoring
- [ ] Improve code structure
- [ ] Keep tests passing
- [ ] Add more tests for edge cases
- [ ] Ensure good test coverage

### Before Committing
- [ ] All tests pass
- [ ] Code coverage meets requirements
- [ ] Code is clean and readable
- [ ] No console errors or warnings

## Common TDD Mistakes to Avoid

### ❌ Don't Do This

```typescript
// Writing implementation before tests
const Component = () => {
  // Complex implementation
  return <div>...</div>;
};

// Then writing tests
it('should work', () => {
  // Vague test
});
```

### ✅ Do This Instead

```typescript
// Write specific test first
it('displays user name when user prop is provided', () => {
  const user = { name: 'John Doe' };
  render(<UserCard user={user} />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});

// Then implement
const UserCard = ({ user }) => {
  return <div>{user.name}</div>;
};
```

## Integration with DOA Project

### Component Development Flow

1. **Create test file**: `src/components/__tests__/NewComponent.test.tsx`
2. **Write failing test**: Test the expected behavior
3. **Run test**: `npm test NewComponent.test.tsx`
4. **Create component**: `src/components/NewComponent.tsx`
5. **Implement minimal code**: Make test pass
6. **Refactor**: Improve code quality
7. **Add more tests**: Cover edge cases
8. **Update documentation**: Add to component library

### Example: Adding a New DOA Component

```typescript
// 1. Test first (RED)
describe('PunkButton', () => {
  it('renders with punk styling', () => {
    render(<PunkButton>Click me</PunkButton>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toHaveClass('punk-btn');
  });
});

// 2. Minimal implementation (GREEN)
const PunkButton = ({ children }) => {
  return <button className="punk-btn">{children}</button>;
};

// 3. Refactor and expand (BLUE)
interface PunkButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

const PunkButton: React.FC<PunkButtonProps> = ({ 
  children, 
  variant = 'primary',
  onClick 
}) => {
  return (
    <button 
      className={`punk-btn punk-btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

Remember: **Red, Green, Refactor** - this cycle is the heart of TDD!