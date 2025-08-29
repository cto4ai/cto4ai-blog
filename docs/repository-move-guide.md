# Repository Move Guide

## Moving cto4ai-blog from `/Users/jackivers/Projects/hugo/` to `/Users/jackivers/Projects/`

This guide documents the process of relocating the cto4ai-blog repository to a cleaner path structure.

### Current State
- **Current location**: `/Users/jackivers/Projects/hugo/cto4ai-blog`
- **Target location**: `/Users/jackivers/Projects/cto4ai-blog`
- **Reason**: Cleaner directory structure (the blog is no longer Hugo-based, it's Astro-based)

### Pre-Move Checklist
- [ ] Ensure all changes are committed and pushed
- [ ] Close the project in Cursor/VS Code
- [ ] Close any terminal sessions in the project directory

### Step 1: Move the Repository Directory

Open Terminal and run:
```bash
cd /Users/jackivers/Projects
mv hugo/cto4ai-blog cto4ai-blog
```

### Step 2: Update Hardcoded Paths in Project Files

After moving, update these 5 files to replace the old path with the new one:

| File | Update Required |
|------|-----------------|
| `/docs/dev-server-with-search.md` | Replace `/Users/jackivers/Projects/hugo/cto4ai-blog` with `/Users/jackivers/Projects/cto4ai-blog` |
| `/migrate_micro_content.py` | Update `ASTRO_ASSETS_DIR` path and print statement (2 occurrences) |
| `/scripts/add-content-types.py` | Update `project_root` variable |
| `/scripts/migrate-to-unified-structure.py` | Update default argument value |

#### Example changes:

**migrate_micro_content.py**:
```python
# OLD:
ASTRO_ASSETS_DIR = Path("/Users/jackivers/Projects/hugo/cto4ai-blog/src/assets/images")

# NEW:
ASTRO_ASSETS_DIR = Path("/Users/jackivers/Projects/cto4ai-blog/src/assets/images")
```

### Step 3: Re-open in Cursor

1. If Cursor is open with the old project, close it completely
2. Open Cursor
3. Use "Open Folder" and navigate to `/Users/jackivers/Projects/cto4ai-blog`
4. Your `.cursor/rules/` directory with AI assistance rules will be automatically available

### Step 4: Update Claude Code

When using Claude Code after the move:
```bash
cd /Users/jackivers/Projects/cto4ai-blog
```

### Step 5: Verify Everything Works

Run these commands to verify the move was successful:

```bash
# Check git status
git status

# Verify git remotes
git remote -v

# Test the development server
npm run dev

# Run a build to ensure everything compiles
npm run build
```

### What's Preserved Automatically

These items move with the repository and require no action:
- ✅ All git history and configuration
- ✅ Git remotes (GitHub connection)
- ✅ `.cursor/rules/` directory with your AI assistance rules
- ✅ `.vscode/` settings that Cursor also uses
- ✅ All project files and directories
- ✅ Node modules and dependencies
- ✅ File permissions and timestamps
- ✅ `.history/` directory (though it's now gitignored)

### What Needs Manual Updates

- ❗ The 5 files with hardcoded paths (listed in Step 2)
- ❗ Any personal scripts or aliases pointing to the old location
- ❗ Cursor's recent files list (will refresh after reopening)
- ❗ Any terminal sessions with the old path as working directory

### Cursor-Specific Considerations

Since you use Cursor for AI-assisted copywriting and coding:

1. **Cursor Rules**: Your custom rules in `.cursor/rules/` will move with the project:
   - `astro-mdx-content-authoring.mdc`
   - `linkedin-post-creation.mdc`
   - `named-entity-linking.mdc`
   - `snipd-quotes.mdc`

2. **Workspace Storage**: Cursor stores workspace-specific data in `~/Library/Application Support/Cursor/User/workspaceStorage/`. After reopening from the new location, Cursor will create a new workspace entry.

3. **Recent Files**: The "Recent" list in Cursor will still show the old path initially. These entries will update as you work with files from the new location.

### Troubleshooting

If you encounter issues after moving:

1. **Git issues**: Ensure you're in the correct directory (`/Users/jackivers/Projects/cto4ai-blog`)
2. **Build errors**: Try removing `node_modules` and reinstalling:
   ```bash
   rm -rf node_modules
   npm install
   ```
3. **Cursor not recognizing rules**: Verify `.cursor/rules/` exists in the new location
4. **Scripts failing**: Check if they have the updated paths (Step 2)

### Post-Move Cleanup (Optional)

After confirming everything works:
1. Remove any old Cursor workspace entries pointing to `/Users/jackivers/Projects/hugo/cto4ai-blog`
2. Update any documentation or README files that reference the old path
3. Update any CI/CD configurations if they reference absolute paths

## Completion Checklist

- [ ] Repository moved to `/Users/jackivers/Projects/cto4ai-blog`
- [ ] All 5 files with hardcoded paths updated
- [ ] Project reopened in Cursor from new location
- [ ] Git operations verified (`git status`, `git log`)
- [ ] Development server tested (`npm run dev`)
- [ ] Build process tested (`npm run build`)
- [ ] Cursor rules working correctly

---

*Document created: August 29, 2025*
*Last updated: August 29, 2025*