# Auto-Formatting with Prettier

This guide explains how to set up automatic code formatting with Prettier to avoid CI failures.

## Problem

The project uses pre-push hooks that validate code formatting. If your code isn't properly formatted, the push will be blocked with errors like:

```
[warn] src/data/content/some-file.md
[warn] Code style issues found in the above file. Run Prettier with --write to fix.
```

## Solution: Format As You Go

### Option 1: VSCode Auto-Format on Save (Recommended)

The project already has this configured in `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

**What this does:**

- Automatically formats any file when you save it (Cmd+S / Ctrl+S)
- Uses the Prettier VSCode extension
- Applies project's `.prettierrc.cjs` configuration

**Requirements:**

1. Install the [Prettier VSCode extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
2. Restart VSCode after installation
3. All files you edit will auto-format on save

**Pro tip:** After copying files from outside the project (like from Downloads), open them in VSCode and hit save to trigger auto-formatting.

### Option 2: Manual Formatting Commands

Format files manually when needed:

```bash
# Check what needs formatting (no changes)
npm run check:prettier

# Auto-fix all formatting issues
npm run fix:prettier

# Format a specific file
npx prettier --write path/to/file.md

# Format a directory
npx prettier --write src/data/content/my-post/**/*
```

### Option 3: Pre-Commit Hooks (Auto-format on Commit)

If you want formatting to happen automatically when you commit (instead of on save):

1. Install dependencies:

```bash
npm install -D husky lint-staged
```

2. Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,astro,md,mdx,json,yaml,yml}": "prettier --write"
  }
}
```

3. Set up husky:

```bash
npx husky init
npx husky add .husky/pre-commit "npx lint-staged"
```

This will auto-format only the files you're committing, right before the commit happens.

## Prettier Configuration

The project's Prettier config is in `.prettierrc.cjs`:

```javascript
module.exports = {
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  // ... other settings
};
```

## File Types Formatted

Prettier formats these file types in this project:

- JavaScript/TypeScript: `.js`, `.jsx`, `.ts`, `.tsx`
- Astro components: `.astro`
- Markdown: `.md`, `.mdx`
- Config files: `.json`, `.yaml`, `.yml`
- Styles: `.css`

## Common Issues

### Issue: Files Not Auto-Formatting in VSCode

**Solutions:**

1. **Check Prettier extension is installed:**
   - Open VSCode Extensions (Cmd+Shift+X)
   - Search for "Prettier"
   - Install "Prettier - Code formatter" by Prettier

2. **Verify default formatter:**
   - Open a file
   - Right-click → "Format Document With..."
   - Select "Prettier - Code formatter"
   - Check "Configure Default Formatter"

3. **Check VSCode settings:**
   - Open settings (Cmd+,)
   - Search for "format on save"
   - Ensure it's checked

### Issue: Format on Save Not Working for Markdown

Add to `.vscode/settings.json`:

```json
{
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Issue: Files Copied from Outside Project Not Formatted

When you copy files via command line (like `cp`), VSCode doesn't see them until you open them. After copying files:

1. Open the file in VSCode
2. Press Cmd+S (save) to trigger auto-format
3. Alternatively, run `npm run fix:prettier` to format everything

## Best Practices

1. **Enable format on save** - catches issues immediately as you work
2. **Run `npm run check` before pushing** - verifies everything passes
3. **Format new files immediately** - don't wait until pre-push hook fails
4. **Use `npm run fix:prettier`** - quick fix for all formatting issues at once

## Integration with CI/CD

See [pre-push-hooks.md](./pre-push-hooks.md) for details on how Prettier checks are enforced before pushing code.
