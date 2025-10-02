# Git Workflow Guide

## Repository Structure

This project uses a single git repository structure:
- **Location**: `/Users/michaelevans/DOA/doa-website/`
- **Remote**: https://github.com/mevans2120/doa

## Important: Always Check Location First

```bash
# ALWAYS verify your current directory before git commands
pwd

# You should be in: /Users/michaelevans/DOA/doa-website/
```

## Standard Commit & Push Workflow

### 1. Verify Location
```bash
pwd  # Should show /Users/michaelevans/DOA/doa-website/
```

### 2. Check Status
```bash
git status
```

### 3. Pull First (Avoid Divergent Branches)
```bash
git pull --no-rebase origin main
```

### 4. Stage Changes
```bash
git add <files>
# Example:
git add src/components/NewComponent.tsx
git add memory-bank/CURRENT.md memory-bank/progress.md
```

### 5. Commit with Proper Message
```bash
git commit -m "$(cat <<'EOF'
feat: descriptive commit message

Detailed description of changes made.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 6. Push to Remote
```bash
git push origin main
```

## Common Issues & Solutions

### Issue: "No such file or directory" when using cd
**Problem**: Trying to `cd doa-website` when already in doa-website directory

**Solution**: Check `pwd` first. If already in `/Users/michaelevans/DOA/doa-website/`, don't try to cd.

### Issue: "Updates were rejected" (divergent branches)
**Problem**: Remote has commits you don't have locally

**Solution**: Always pull before pushing:
```bash
git pull --no-rebase origin main
git push origin main
```

### Issue: "Embedding git repository" warning
**Problem**: Trying to add a nested git repository from parent directory

**Solution**: Always work from within the doa-website directory itself, not from parent.

## Pre-Commit Checklist

Before committing:
- [ ] Verify `pwd` shows correct location
- [ ] Run `git pull --no-rebase origin main` to get latest changes
- [ ] Check `git status` to see what will be committed
- [ ] Update memory-bank/CURRENT.md if needed
- [ ] Update memory-bank/progress.md with session notes
- [ ] Stage only relevant files
- [ ] Use proper commit message format
- [ ] Push immediately after committing

## Configuration

If you encounter the "need to specify how to reconcile divergent branches" error, the workflow uses:
```bash
git pull --no-rebase origin main  # merge strategy
```

This is already the correct approach for this project.

---

*Last updated: 2025-10-02*
