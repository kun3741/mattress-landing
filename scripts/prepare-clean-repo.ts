import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const root = process.cwd()
const outDir = path.join(root, 'deploy', 'clean-repo')

// List of files/folders to include in the clean repo
const include = [
  // Project metadata
  'package.json',
  'tsconfig.json',
  'next.config.mjs',
  'postcss.config.mjs',
  'tailwind.config.ts',
  'pnpm-lock.yaml',
  'next-env.d.ts',
  'README.md',
  'public',
  'styles',
  // Source code
  'app',
  'components',
  'hooks',
  'lib',
  'types',
  // GitHub workflows for deployment
  '.github',
]

const copyFilterOut = [
  // Never include local env or secrets
  '.env', '.env.local', '.env.development.local', '.env.test.local', '.env.production.local',
  // Next build output and caches
  '.next', 'out', 'dist', 'build', 'node_modules',
  // IDE and OS files
  '.vscode', '.idea', '.git', '.DS_Store', 'Thumbs.db',
  // Workspace-only docs
  'CHANGES_SUMMARY.md', 'COMPLETION_REPORT.md', 'GIT_COMMIT_MESSAGE.txt', 'GITHUB_PACKAGE_COMPLETE.md',
  'DEPLOYMENT_GUIDE.md', 'README_VIDEO_FEATURE.md', 'USER_GUIDE.md',
  // DB scripts local
  'scripts/002_seed_initial_data.sql',
  // Any deploy helper folders except the clean-repo result itself
  'deploy/github',
]

function rmrf(p: string) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true })
  }
}

function mkdirp(p: string) {
  fs.mkdirSync(p, { recursive: true })
}

function copyRecursive(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    mkdirp(dest)
    for (const entry of fs.readdirSync(src)) {
      const s = path.join(src, entry)
      const d = path.join(dest, entry)
      // Filter out unwanted entries
      const rel = path.relative(root, s).replace(/\\/g, '/')
      if (copyFilterOut.some(f => rel === f || rel.startsWith(f + '/'))) continue
      copyRecursive(s, d)
    }
  } else {
    mkdirp(path.dirname(dest))
    fs.copyFileSync(src, dest)
  }
}

function generateGitignore(targetRoot: string) {
  const content = `# Node
node_modules

# Next.js
.next
out

# Env
.env*

# OS/IDE
.DS_Store
Thumbs.db
.vscode/
.idea/
`
  fs.writeFileSync(path.join(targetRoot, '.gitignore'), content)
}

function ensureEnvExample(targetRoot: string) {
  const example = `# Environment variables (do not commit real secrets)
MONGODB_URI=""
MONGODB_DB_NAME="mattress_landing"
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""
NEXT_PUBLIC_APP_URL=""
ADMIN_USER=""
ADMIN_PASS=""
`
  fs.writeFileSync(path.join(targetRoot, '.env.example'), example)
}

function main() {
  console.log('🧹 Building clean GitHub repo folder...')
  rmrf(outDir)
  mkdirp(outDir)

  // Copy whitelisted roots
  for (const item of include) {
    const src = path.join(root, item)
    if (!fs.existsSync(src)) continue
    const dest = path.join(outDir, item)
    copyRecursive(src, dest)
  }

  // Generate minimal .gitignore and .env.example
  generateGitignore(outDir)
  ensureEnvExample(outDir)

  // Sanity check: remove any .env files if copied by mistake
  for (const file of ['.env', '.env.local', '.env.development.local', '.env.test.local', '.env.production.local']) {
    rmrf(path.join(outDir, file))
  }

  // Optional: format package.json (remove workspace-only scripts)
  const pkgPath = path.join(outDir, 'package.json')
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    // Remove dev-only scripts that could confuse users
    const keepScripts = ['build', 'dev', 'start', 'lint', 'db:init', 'db:seed', 'api:test', 'telegram:test']
    if (pkg.scripts) {
      const filtered: Record<string, string> = {}
      for (const k of Object.keys(pkg.scripts)) {
        if (keepScripts.includes(k)) filtered[k] = pkg.scripts[k]
      }
      pkg.scripts = filtered
    }
    // Ensure engines and type are fine
    pkg.engines = { node: '>=20' }
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  }

  console.log('✅ Clean folder ready at deploy/clean-repo')
}

main()
