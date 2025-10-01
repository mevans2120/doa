# Session Checklist

## 🚀 Session Start

```bash
npm run session:start
```

- [ ] Review Claude Memory status
- [ ] Check Memory Bank for updates
- [ ] Note any pending tasks

## 🔄 During Session

Add context notes:
```bash
npm run memory:note "Important note"
```

Track:
- [ ] Major changes
- [ ] New patterns learned
- [ ] Architectural decisions

## ✅ Session End

```bash
npm run session:end
```

Then update:
- [ ] `memory-bank/CURRENT.md`
- [ ] `memory-bank/progress.md`
- [ ] `memory-bank/CHANGELOG.md` (if major features)
