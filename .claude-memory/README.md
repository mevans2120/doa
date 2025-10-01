# Claude Memory

Auto-managed context for AI coding sessions in the DOA project.

## Structure

```
.claude-memory/
├── session/
│   ├── current.json         # Active session (expires 24hrs)
│   └── archive/             # Past sessions (auto-cleaned after 30 days)
├── project/
│   ├── tech-stack.json      # Tech stack info
│   └── conventions.json     # Code conventions
├── patterns/
│   ├── api-patterns.json    # API/backend patterns
│   └── component-patterns.json  # Component/frontend patterns
└── examples/
    └── session-template.json    # Template for new sessions
```

## Usage

### View Current Memory
```bash
npm run memory:show      # Current session status
npm run memory:tech      # Tech stack
npm run memory:patterns  # Learned patterns
```

### Add Context Notes
```bash
npm run memory:note "Important context for this session"
```

### Session Management
```bash
npm run session:start    # Initialize session, load memory
npm run session:end      # Archive session, clean up
```

## File Descriptions

### session/current.json
Active session tracking:
- Current task and progress
- Active bugs
- Recent changes
- Context notes
- Auto-expires after 24 hours

### project/tech-stack.json
Technology stack information:
- Framework (Next.js 15)
- Language (TypeScript)
- Styling (Tailwind CSS 4, styled-components)
- CMS (Sanity)
- Testing tools (Jest, Playwright)
- Updated when stack changes

### project/conventions.json
Code conventions and standards:
- Naming conventions
- File structure
- Testing patterns
- Code style preferences
- Updated when conventions evolve

### patterns/*.json
Learned code patterns:
- **api-patterns.json**: Backend/API patterns
- **component-patterns.json**: Frontend/component patterns
- Auto-learned during development
- Include examples and usage notes

## Relationship to Memory Bank

| Feature | Claude Memory | Memory Bank |
|---------|--------------|-------------|
| **Purpose** | Temporary, AI-focused | Permanent, human-readable |
| **Updates** | Auto, real-time | Manual, end of session |
| **Audience** | AI only | Humans + AI |
| **Git** | Ignored (local) | Tracked & committed |
| **Content** | Current tasks, patterns | Decisions, changelog |
| **Lifespan** | 24-30 days | Permanent |

### What Goes Where?

**Claude Memory** (`.claude-memory/`):
- ✅ Current task and progress
- ✅ Active bugs being worked on
- ✅ Recent file changes
- ✅ Learned code patterns
- ✅ Session-specific notes

**Memory Bank** (`memory-bank/`):
- ✅ Architectural decisions
- ✅ Major feature releases
- ✅ Project overview
- ✅ Deployment records
- ✅ Why choices were made

## Workflow

### 1. Session Start
```bash
npm run session:start
```
- Loads current.json (or creates new session)
- Shows tech stack and conventions
- Displays Memory Bank status
- Ready to code!

### 2. During Work
- Session auto-updates in current.json
- Add notes as needed:
  ```bash
  npm run memory:note "User prefers dark mode"
  ```
- Patterns learned automatically

### 3. Session End
```bash
npm run session:end
```
- Archives current.json
- Cleans old archives (30+ days)
- Prompts to update Memory Bank

### 4. Update Memory Bank
Manually update:
- `memory-bank/CURRENT.md` - Project status
- `memory-bank/progress.md` - Session summary
- `memory-bank/CHANGELOG.md` - Major features

## Maintenance

### Auto-Cleanup
- Sessions expire after 24 hours
- Archives cleaned after 30 days
- No manual maintenance needed

### Manual Updates
Update when:
- Tech stack changes → `project/tech-stack.json`
- Conventions change → `project/conventions.json`
- New patterns identified → Add to `patterns/*.json`

## Benefits

1. **Context Preservation**: No re-explaining project each session
2. **Pattern Learning**: AI remembers your code patterns
3. **Time Savings**: 5-10 minutes saved per session
4. **Session State**: Pick up where you left off
5. **Low Overhead**: Automatic management, minimal effort

## Getting Started

1. Run `npm run session:start` to begin
2. Work as normal - memory updates automatically
3. Run `npm run session:end` when done
4. Update Memory Bank files manually

---

For full documentation, see `CLAUDE.md` and the [Hybrid Memory Guide](/Users/michaelevans/codymd-hacknback-main/docs/HYBRID_MEMORY_GUIDE.md).
