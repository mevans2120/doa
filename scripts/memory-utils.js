#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MEMORY_DIR = path.join(process.cwd(), '.claude-memory');
const SESSION_DIR = path.join(MEMORY_DIR, 'session');
const ARCHIVE_DIR = path.join(SESSION_DIR, 'archive');
const PROJECT_DIR = path.join(MEMORY_DIR, 'project');
const PATTERNS_DIR = path.join(MEMORY_DIR, 'patterns');

// Utility functions
function readJSON(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (error) {
    return null;
  }
}

function writeJSON(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n');
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

function getSessionId() {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const hour = now.getHours();
  let timeOfDay = 'morning';
  if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17) timeOfDay = 'evening';
  return `${date}-${timeOfDay}`;
}

// Memory operations
const memory = {
  get(category, name) {
    const filepath = path.join(MEMORY_DIR, category, `${name}.json`);
    return readJSON(filepath);
  },

  set(category, name, data) {
    const filepath = path.join(MEMORY_DIR, category, `${name}.json`);
    writeJSON(filepath, data);
  },

  updateSession(updates) {
    const sessionPath = path.join(SESSION_DIR, 'current.json');
    const session = readJSON(sessionPath) || {};
    const updated = { ...session, ...updates };
    writeJSON(sessionPath, updated);
    return updated;
  },

  learnPattern(category, key, pattern) {
    const filepath = path.join(PATTERNS_DIR, `${category}.json`);
    const patterns = readJSON(filepath) || {};
    patterns[key] = {
      ...pattern,
      learnedAt: getCurrentTimestamp()
    };
    writeJSON(filepath, patterns);
    return patterns;
  },

  addContextNote(note) {
    const sessionPath = path.join(SESSION_DIR, 'current.json');
    const session = readJSON(sessionPath) || {};
    if (!session.contextNotes) session.contextNotes = [];
    session.contextNotes.push({
      note,
      timestamp: getCurrentTimestamp()
    });
    writeJSON(sessionPath, session);
    return session;
  }
};

// Session management
function startSession() {
  const sessionPath = path.join(SESSION_DIR, 'current.json');
  const sessionId = getSessionId();

  const session = {
    sessionId,
    startedAt: getCurrentTimestamp(),
    currentTask: {
      feature: '',
      files: [],
      progress: 'not_started',
      nextSteps: []
    },
    activeBugs: [],
    recentChanges: [],
    contextNotes: [],
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  writeJSON(sessionPath, session);
  console.log(`✅ Started session: ${sessionId}`);
  return session;
}

function archiveSession() {
  const sessionPath = path.join(SESSION_DIR, 'current.json');
  const session = readJSON(sessionPath);

  if (!session) {
    console.log('⚠️  No active session to archive');
    return;
  }

  const archivePath = path.join(ARCHIVE_DIR, `${session.sessionId}.json`);
  writeJSON(archivePath, {
    ...session,
    archivedAt: getCurrentTimestamp()
  });

  console.log(`📦 Archived session: ${session.sessionId}`);

  // Clean up old archives (30+ days)
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  fs.readdirSync(ARCHIVE_DIR).forEach(file => {
    const filepath = path.join(ARCHIVE_DIR, file);
    const stats = fs.statSync(filepath);
    if (stats.mtimeMs < thirtyDaysAgo) {
      fs.unlinkSync(filepath);
      console.log(`🗑️  Removed old archive: ${file}`);
    }
  });
}

function showMemory() {
  console.log('\n📊 MEMORY STATUS\n');

  // Session
  const session = readJSON(path.join(SESSION_DIR, 'current.json'));
  if (session) {
    console.log('🔄 Current Session:', session.sessionId);
    console.log('📝 Task:', session.currentTask.feature || 'None');
    console.log('📈 Progress:', session.currentTask.progress);
    if (session.contextNotes && session.contextNotes.length > 0) {
      console.log('\n💡 Context Notes:');
      session.contextNotes.forEach((item, i) => {
        const note = typeof item === 'string' ? item : item.note;
        console.log(`  ${i + 1}. ${note}`);
      });
    }
  } else {
    console.log('⚠️  No active session');
  }

  // Tech Stack
  const techStack = readJSON(path.join(PROJECT_DIR, 'tech-stack.json'));
  if (techStack) {
    console.log('\n🛠️  Tech Stack:');
    console.log('  Framework:', techStack.framework);
    console.log('  Language:', techStack.language);
  }

  console.log('\n');
}

function cleanExpired() {
  const sessionPath = path.join(SESSION_DIR, 'current.json');
  const session = readJSON(sessionPath);

  if (session && new Date(session.expiresAt) < new Date()) {
    console.log('🧹 Session expired, archiving...');
    archiveSession();
    return true;
  }

  console.log('✅ Session is current');
  return false;
}

// CLI interface
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'start':
    startSession();
    showMemory();
    break;

  case 'archive':
    archiveSession();
    break;

  case 'show':
    showMemory();
    break;

  case 'clean':
    cleanExpired();
    break;

  case 'note':
    if (args.length === 0) {
      console.log('Usage: memory-utils.js note "Your note here"');
      process.exit(1);
    }
    memory.addContextNote(args.join(' '));
    console.log('✅ Note added');
    break;

  case 'tech-stack':
    const techStack = memory.get('project', 'tech-stack');
    console.log(JSON.stringify(techStack, null, 2));
    break;

  case 'patterns':
    const category = args[0] || 'api-patterns';
    const patterns = memory.get('patterns', category);
    console.log(JSON.stringify(patterns, null, 2));
    break;

  default:
    console.log(`
Memory Utilities - Hybrid Memory System

Usage:
  npm run memory:start       Start new session
  npm run memory:show        Show current memory status
  npm run memory:note "..."  Add context note
  npm run memory:tech        Show tech stack
  npm run memory:patterns    Show learned patterns

Session Management:
  npm run session:start      Start session and show memory
  npm run session:end        Archive session
    `);
}
