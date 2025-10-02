#!/bin/bash

echo "💾 Ending session..."
echo ""

# Archive current session
node scripts/memory-utils.js archive

echo ""
echo "⚠️  Remember to update:"
echo "   • memory-bank/CURRENT.md - Update project status"
echo "   • memory-bank/progress.md - Add session summary"
echo ""
echo "✅ Session archived!"
