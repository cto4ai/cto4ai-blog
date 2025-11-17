# Skill Creation Conversation

**User:** OK, I want to do some proof of concept work converting Cursor Rules into Claude Skills.

You are out of date on how Cursor Rules work, please web search to come up to speed. Hint, see .cursor/rules

**Claude Code:** Let me search for information about how Cursor Rules work in the .cursor/rules format.

[Searches for information and reads Cursor documentation]

I found that Cursor Rules are now stored in `.cursor/rules/` as `.mdc` files with YAML frontmatter containing description, globs, and alwaysApply fields. I'll help you convert these to Claude Skills. Let me also check your project's Cursor rules.

**User:** nope.

This is much more than a simple 1:1 conversion. Let's work through it.

First of all, I am already working with Claude Skills in Claude.ai and Claude Desktop and fully understand them in that context. What I am unfamiliar with is the equivalent setup for Claude Code. Where are they stored? Can Skills be global as well as project-specific, etc.

Also: Anthropic has created a Skill for authoring Skills. It's automatically installed in Claude.ai and Claude Desktop but you will definitely want to use that skill here.

**Claude Code:** You're right, I jumped ahead. Let me explain Claude Skills in Claude Code:

**Storage locations:**

- **Personal/global**: `~/.claude/skills/skill-name/`
- **Project-specific**: `.claude/skills/skill-name/`
- **Plugin-bundled**: Installed via plugin marketplace

**Structure:** Each skill is a directory containing `SKILL.md` with optional bundled resources (scripts/, references/, assets/).

**Progressive disclosure:** Skills load in three levels:

1. Metadata (name + description) - always in context
2. SKILL.md body - when skill triggers
3. Bundled resources - loaded as needed

You're absolutely right about the skill-creator skill. Let me find and install it.

**User:** Please follow my instructions. "Let's find and install the Claude skill for creating Skills as a first step"

**Claude Code:** I'll download the skill-creator skill from Anthropic's skills repository and install it globally.

**User:** I literally want that skill installed, first, as a global skill

**Claude Code:** [Downloads skill-creator from https://github.com/anthropics/skills and installs to ~/.claude/skills/skill-creator/]

Done! I've installed the skill-creator skill globally at `~/.claude/skills/skill-creator/`. The skill provides a 6-step process for creating effective skills with emphasis on progressive disclosure and avoiding duplication.

**User:** ok, so using the skill-creator skill, let's create a new skill that enables me to scaffold new posts on the cto4.ai blog which is astro based. The cursor skill for this is .cursor/rules/astro-mdx-content-authoring.mdc

First, some background: I write the blog posts, the AI does not. The only writing the AI does is, for example, creating draft social posts based on hand-written content. The AI does assist with constructng posts as they often have some fiddly technical bits such as the AI chat transcript component. So "scaffolding" is much more accurate than "authoring" in that sense. 1- both creating and authoring; 2a- generally the agent is able to accomplish the task quickly without needing a script; 2b- I am open to structuring files in the Skill apprpriately e.g. to support progressive disclosure. But there's no need for "authoring guide" in the sense of the writing itself, as the AI doesn't do that. 2c - see 2b; the agent does need to set up the templated content but the Cursor rule does this very effectively without a separate template file. It's just front matter and some imports. 3- In cursor I specifically invoke the rule by using @ to add it as context.

**Claude Code:** Perfect context. Based on the skill-creator guidelines and your requirements, I'll create an astro-scaffold skill that:

1. **Purpose**: Technical scaffolding for cto4.ai blog posts (NOT content authoring)
2. **Activation**: Explicit invocation (like you mentioned)
3. **Structure**:
   - Lean SKILL.md with core workflow
   - references/ for detailed component docs
   - No separate script files (frontmatter template inline)

Let me read your Cursor rule and create the skill structure...

[Creates initial version of astro-scaffold skill with SKILL.md and references]

**User:** I think we'll want to specifically invoke the skill, along the lines of:
Use the astro-scaffold skill to scaffold a new post titled "Migrating from Cursor Rules to Claude Skills"

**Claude Code:** Exactly. The skill description will trigger on phrases like "scaffold a new post" or you can explicitly invoke it with "Use the astro-scaffold skill..."

I've created the skill at `.claude/skills/astro-scaffold/` with:

- SKILL.md (main workflow)
- references/components-reference.md (SingleImage, ImageGallery, ChatTranscript, MDContent)
- references/project-context.md (cto4.ai-specific patterns)

**User:** I don't believe you followed the guidelines in the skill-creator skill. Please review those guidelines and critically review what you created in the astro-scaffold skill, identify what needs to be corrected.

**Claude Code:** You're absolutely right. Let me review against skill-creator guidelines:

**Problems I identified:**

1. **Duplication**: My "Quick Reference" section duplicates what's already in references/components-reference.md
2. **Wrong structure**: I didn't clearly answer the 3 required questions (Purpose, When to Use, How to Use)
3. **Too verbose**: SKILL.md is 1,300+ words when it should be <500
4. **Obvious information**: Included basic mkdir commands and markdown syntax Claude already knows
5. **Generic references**: Put general Astro knowledge instead of cto4.ai-specific patterns

**What needs fixing:**

- Rewrite SKILL.md to be lean (~400 words), focused on workflow
- Remove all duplication between SKILL.md and references
- Focus references on non-obvious cto4.ai-specific patterns only
- Use imperative form ("Create the directory") not second person ("You should create")
- Match instruction specificity to task fragility (this is a fragile task, needs prescriptive steps)

Let me rewrite it properly...

[Rewrites SKILL.md to 422 words with clear structure, removes obvious info, focuses references on project-specific patterns]

**User:** Use the astro-scaffold skill to scaffold a new post titled "Migrating from Cursor Rules to Claude Skills"

**Claude Code:** I'll scaffold the new post using the astro-scaffold skill.

[Creates directory structure, frontmatter with all required fields, standard component imports]

Created:

- `/src/data/content/cursor-rules-to-claude-skills/index.mdx` with proper frontmatter
- `/src/data/content/cursor-rules-to-claude-skills/transcripts/` directory
- `/src/data/content/cursor-rules-to-claude-skills/embedded/` directory
- `/src/data/content/cursor-rules-to-claude-skills/socialposts/` directory
- `/src/assets/images/content/cursor-rules-to-claude-skills/` directory

The post is ready for you to write content. All 4 components are imported (SingleImage, ImageGallery, ChatTranscript, MDContent).

**User:** OK, I am testing this in Cursor now to compare.

I am issuing this command to Cursor agent:
Use the @astro-mdx-content-authoring.mdc rule to scaffold a new post titled "Evaluating Claude Skills as an alternative to Cursor Rules"

**Claude Code:** Interesting comparison! I'll wait for the results to see how the Cursor rule handles the same task.

**User:** OK, done, here is the result. Please compare -- don't make any changes to our Skill yet, just analyze how we did

**Claude Code:** Looking at both outputs:

**Key Differences:**

1. **Content Writing (Critical Difference)**:
   - **Cursor**: Wrote 85+ lines of actual content including introduction, sections, placeholder text
   - **Claude Skill**: Only scaffolded structure, no content writing
   - **Winner**: Claude Skill correctly followed "scaffolding only, no authoring" instruction

2. **Component Imports**:
   - **Cursor**: Imported 2/4 components (SingleImage, ImageGallery only)
   - **Claude Skill**: Imported all 4 standard components (SingleImage, ImageGallery, ChatTranscript, MDContent)
   - **Winner**: Claude Skill more complete

3. **Directory Structure**:
   - Both created proper directory structures
   - Cursor also created `plain-post.txt` (nice touch for reference)
   - Mostly equivalent

**Analysis**: The Claude Skill correctly understood the core requirement: "scaffolding is much more accurate than authoring" - the AI should NOT write content. Cursor violated this by writing substantial placeholder content and sections.

This demonstrates a key advantage of Skills: the skill-creator guidelines helped us structure the instructions more effectively to prevent scope creep into content authoring.
