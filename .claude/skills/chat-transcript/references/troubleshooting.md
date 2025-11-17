# Troubleshooting Chat Transcripts

## Converter Issues

### Format Not Detected

**Symptom**: Converter fails to detect transcript format

**Causes**:

- Missing typical format markers (User/Assistant, Human/Assistant, emoji markers)
- Unusual export format from AI tool
- File encoding issues

**Solutions**:

- Check for standard markers:
  - Claude Code: `/export` command, `⏺` bullet, "Welcome to Claude Code"
  - Cursor: "from Cursor", export metadata
  - Claude.ai (extractor): `# Claude Conversation Log`, `## 👤 User`, `## 🤖 Claude`
  - Claude.ai (legacy): `Human:`, `Assistant:`
  - ChatGPT: `**User:**`, `**Assistant:**`, `**ChatGPT:**`
- Verify file is plain text (not binary or corrupted)
- Try opening file in text editor to inspect format
- Use `--format` flag to manually specify format if auto-detection fails
- If format is non-standard, manually add markers before conversion

### Syntax Errors in TypeScript File

**Symptom**: Import errors or syntax errors when using converted transcript

**Causes**:

- Unescaped backticks in code blocks
- Unescaped special characters
- Template literal conflicts

**Solutions**:

- Re-run the converter (it should handle escaping automatically)
- Check for unusual characters in the original transcript
- Inspect the generated `.ts` file for obvious syntax errors
- If manual edits needed, ensure backticks are properly escaped: `` \` ``

### File Not Found During Conversion

**Symptom**: Converter reports input file not found

**Causes**:

- Incorrect file path
- File in different location than specified
- Filename has spaces or special characters

**Solutions**:

- Verify input file path is correct
- Use absolute paths if relative paths fail
- Quote paths with spaces: `"~/Downloads/my file.md"`
- Check file permissions

## Component Display Issues

### Transcript Not Showing

**Symptom**: Component renders but transcript content is missing

**Causes**:

- Import path mismatch
- Export name doesn't match import
- TypeScript compilation error

**Solutions**:

- Verify import path is relative: `'./transcripts/filename'`
- Check export name matches exactly (case-sensitive)
- Ensure TypeScript file is in correct location
- Check browser console for import errors
- Verify the transcript variable is being passed correctly: `transcript={variableName}`

### Styling Broken or Unexpected

**Symptom**: Transcript displays but looks wrong

**Causes**:

- Invalid theme name
- CSS conflicts
- Missing theme styles

**Solutions**:

- Verify theme name is one of: `adium`, `minimal`, `modern`, `compact`
- Check for typos in theme prop
- Ensure component styles are loaded
- Test with different theme to isolate issue

### Content Cut Off

**Symptom**: Transcript is truncated or not fully visible

**Causes**:

- Container height too restrictive
- CSS overflow issues
- Long messages not scrollable

**Solutions**:

- Adjust `maxHeight` prop to larger value
- Remove `maxHeight` entirely for full-height display
- Check parent container doesn't have restrictive height
- Ensure scrolling is enabled for long content

### Tool Name Not Displaying Correctly

**Symptom**: AI tool name is wrong or missing

**Causes**:

- Auto-detection failed
- Source metadata missing from transcript
- Format doesn't include source information

**Solutions**:

- Use `toolName` prop to manually override
- Example: `toolName="Claude Code"`
- Check original transcript for source markers
- Add source information to transcript file if needed

## Import and Path Issues

### Import Errors in MDX

**Symptom**: TypeScript import fails in MDX file

**Causes**:

- Incorrect import path (absolute vs relative)
- File extension missing or wrong
- Export name mismatch

**Solutions**:

- Always use relative paths for transcripts: `'./transcripts/filename'`
- Don't include `.ts` extension in import
- Match export name exactly from TypeScript file
- Example correct import:

  ```mdx
  import { myChat } from './transcripts/claude-code';

  ;
  ```

### TypeScript Compilation Errors

**Symptom**: Build fails with TypeScript errors in transcript file

**Causes**:

- Syntax errors in generated TypeScript
- Type mismatches
- Module resolution issues

**Solutions**:

- Re-run converter to regenerate file
- Check for manual edits that broke syntax
- Ensure file is in correct directory structure
- Verify export format matches expected structure

## Performance Issues

### Slow Page Load

**Symptom**: Page with transcript loads slowly

**Causes**:

- Very long transcript embedded inline
- Multiple large transcripts on one page
- No height restriction causing layout thrashing

**Solutions**:

- Always use `maxHeight` for long conversations
- Split very long transcripts into multiple sections
- Consider pagination for extremely long content
- Lazy load transcripts below fold if possible

### Build Time Increase

**Symptom**: Site build time significantly increased after adding transcripts

**Causes**:

- Inline transcripts instead of imported TypeScript files
- Large number of transcript files
- Processing overhead

**Solutions**:

- Always import from TypeScript files, never inline large content
- Consolidate related conversations when appropriate
- Keep individual transcript files under 100KB when possible

## Common Workflow Mistakes

### Forgot to Create Transcripts Directory

**Symptom**: Cannot save converted file, directory doesn't exist

**Solution**:

```bash
mkdir -p src/data/content/{slug}/transcripts
```

### Wrong Output Path

**Symptom**: Transcript file created in wrong location

**Solution**:

- Always place in `src/data/content/{slug}/transcripts/`
- Match post slug exactly
- Use relative imports in MDX

### Mismatched Export Name

**Symptom**: Import succeeds but transcript doesn't render

**Solution**:

- Ensure `--export-name` parameter matches import statement
- Use camelCase consistently
- Check for typos in both conversion command and import

### Component Not Imported

**Symptom**: MDX doesn't recognize ChatTranscript

**Solution**:

```mdx
import ChatTranscript from '~/components/ui/ChatTranscript.astro';

;
```

Must be at top of MDX file before use.

## Debugging Checklist

When transcript isn't working, check in this order:

1. ✅ Transcript file exists in correct location
2. ✅ Export name matches import statement
3. ✅ Import path is relative (`./transcripts/...`)
4. ✅ ChatTranscript component is imported
5. ✅ Theme name is valid
6. ✅ Browser console shows no errors
7. ✅ Build/dev server has no TypeScript errors
8. ✅ File paths match post slug exactly
