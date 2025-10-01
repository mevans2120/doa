#!/bin/bash

echo "🚀 Starting session..."
echo ""

# Clean expired sessions
node scripts/memory-utils.js clean

# Show current memory status
node scripts/memory-utils.js show

# Show memory bank status
if [ -f "memory-bank/CURRENT.md" ]; then
  echo "📋 MEMORY BANK STATUS"
  echo ""
  head -30 memory-bank/CURRENT.md
  echo ""
fi

echo "✅ Ready to work!"
