# Complete Guide to Skills in Claude Code

**For users familiar with Skills in Claude.ai and Claude Desktop**

## Table of Contents

- [Quick Overview: Key Differences](#quick-overview-key-differences)
- [Installing Skills in Claude Code](#installing-skills-in-claude-code)
- [Skill Structure](#skill-structure-same-across-all-platforms)
- [Key Claude Code-Specific Features](#key-claude-code-specific-features)
- [Official Anthropic Skills Available via Plugins](#official-anthropic-skills-available-via-plugins)
- [Creating Skills in Claude Code](#creating-skills-in-claude-code)
- [Testing and Debugging Skills](#testing-and-debugging-skills)
- [Team Workflows & Distribution](#team-workflows--distribution)
- [Community Resources](#community-resources)
- [Skills + MCP Integration: The Power Combo](#skills--mcp-integration-the-power-combo)
- [Skills vs Other Claude Code Features](#skills-vs-other-claude-code-features)
- [Skills vs MCP: When to Use Which](#skills-vs-mcp-when-to-use-which)
- [Advanced: Skills in the Claude Agent SDK](#advanced-skills-in-the-claude-agent-sdk)
- [Security Considerations](#security-considerations)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)
- [Quick Reference: Essential Commands](#quick-reference-essential-commands)
- [Next Steps](#next-steps)
- [Key Differences Summary](#key-differences-summary-claude-code-vs-claudeaidesktop)

-----

## Quick Overview: Key Differences

While Skills work similarly across Claude.ai, Claude Desktop, and Claude Code, there are important differences in **how you install and manage them**:

|Feature         |Claude.ai                       |Claude Desktop             |Claude Code                                                  |
|----------------|--------------------------------|---------------------------|-------------------------------------------------------------|
|**Installation**|Web UI (Settings > Capabilities)|Upload ZIP or drag-and-drop|Plugin system via `/plugin` commands                         |
|**Location**    |Cloud-based                     |`~/.claude/skills/`        |`~/.claude/skills/` (personal)<br>`.claude/skills/` (project)|
|**Distribution**|Manual upload                   |Manual file sharing        |Plugin marketplaces + git repos                              |
|**Discovery**   |Same (model-invoked)            |Same (model-invoked)       |Same (model-invoked)                                         |

-----

## Installing Skills in Claude Code

### Method 1: Via Plugin Marketplaces (Recommended)

Claude Code uses a **plugin system** that makes it easy to install and share Skills:

```bash
# 1. Add the official Anthropic skills marketplace
/plugin marketplace add anthropics/skills

# 2. Install specific skill collections
/plugin install document-skills@anthropic-agent-skills
/plugin install example-skills@anthropic-agent-skills

# 3. Restart Claude Code to load the skills
# (Skills are now available automatically)
```

**Interactive installation:**

```bash
/plugin
# Then select "Browse and install plugins" from the menu
```

### Method 2: Manual Installation (Personal Skills)

```bash
# Personal skills directory (available across all projects)
~/.claude/skills/my-skill/
└── SKILL.md

# Project skills directory (only for current project)
.claude/skills/my-skill/
└── SKILL.md
```

### Method 3: Via Plugin from GitHub

```bash
# Add a custom marketplace (e.g., community plugins)
/plugin marketplace add obra/superpowers-marketplace

# Install plugins from that marketplace
/plugin install superpowers@obra
```

-----

## Skill Structure (Same Across All Platforms)

Skills use the **same format** whether in Claude.ai, Claude Desktop, or Claude Code:

```markdown
---
name: my-skill-name
description: Clear description of what this skill does and when to use it
---

# My Skill Name

## Instructions
[Step-by-step guidance for Claude]

## Examples
[Concrete usage examples]

## Guidelines
[Best practices and constraints]
```

**Progressive Disclosure Architecture:**

- **Level 1:** Metadata (name + description) - ~100 tokens
- **Level 2:** Full SKILL.md content - <5k tokens
- **Level 3:** Additional linked files (only loaded as needed)

-----

## Key Claude Code-Specific Features

### 1. Plugin System Integration

Skills in Claude Code can be bundled into **plugins** along with:

- Custom slash commands
- Subagents (specialized AI assistants)
- MCP servers (external tool integrations)
- Hooks (event handlers)

**Plugin Structure:**

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
├── skills/                  # Skills directory
│   └── my-skill/
│       └── SKILL.md
├── commands/                # Slash commands (optional)
│   └── custom-cmd.md
├── agents/                  # Subagents (optional)
│   └── specialist.md
└── hooks/                   # Event handlers (optional)
    └── hooks.json
```

### 2. Project-Level Skills

Claude Code supports **project-scoped skills** via `.claude/skills/`:

```bash
your-project/
├── .claude/
│   ├── skills/              # Project-specific skills
│   │   └── project-skill/
│   │       └── SKILL.md
│   └── CLAUDE.md            # Project guide for Claude
└── src/
```

**Benefits:**

- Skills checked into git
- Team members get them automatically
- Version controlled alongside code

### 3. CLAUDE.md Integration

Create a `CLAUDE.md` file in your project root to guide Claude Code's behavior:

```markdown
# Project Guide for Claude

## Scope
- Work only within this repository
- Never delete files outside ./tmp without confirmation

## Conventions
- Use TypeScript strict mode
- Follow ESLint configuration
- Run tests before commits

## Available Skills
- Use `code-review-skill` before committing
- Use `test-generator-skill` for new features
```

-----

## Official Anthropic Skills Available via Plugins

### Document Creation Skills

- **docx** - Word documents with tracked changes, comments, formatting
- **pdf** - PDF manipulation, text extraction, form filling
- **pptx** - PowerPoint presentations with layouts and charts
- **xlsx** - Excel spreadsheets with formulas and data analysis

### Creative Skills

- **algorithmic-art** - Generative art using p5.js
- **canvas-design** - Visual art in PNG/PDF formats
- **slack-gif-creator** - Animated GIFs for Slack

### Development Skills

- **mcp-builder** - Create MCP servers for external integrations
- **webapp-testing** - Test web apps with Playwright
- **skill-creator** - Interactive skill creation tool

### Enterprise Skills

- **brand-guidelines** - Apply brand colors and typography
- **internal-comms** - Status reports, newsletters, FAQs

-----

## Creating Skills in Claude Code

### Option 1: Use skill-creator (Interactive)

```bash
# Enable skill-creator if not already available
# Then just ask:
"Use skill-creator to help me build a skill for [your workflow]"
```

Claude will guide you through:

1. Understanding your workflow
2. Generating folder structure
3. Creating SKILL.md with proper format
4. Adding supporting files

### Option 2: Manual Creation

```bash
# 1. Create skill directory
mkdir -p ~/.claude/skills/my-workflow

# 2. Create SKILL.md
cat > ~/.claude/skills/my-workflow/SKILL.md << 'EOF'
---
name: my-workflow
description: Automates my specific development workflow. Use when user mentions [key triggers].
---

# My Workflow

## Instructions
1. First, do this...
2. Then, do that...
3. Finally, verify...

## Examples
- Example scenario 1
- Example scenario 2
EOF

# 3. Restart Claude Code
```

-----

## Testing and Debugging Skills

### Verify Skill Installation

```bash
# Ask Claude to list available skills
"What skills do you have access to?"

# Or check manually
ls ~/.claude/skills/           # Personal skills
ls .claude/skills/             # Project skills
```

### Debug Skill Not Activating

**Problem:** Claude doesn't use your skill when expected

**Solutions:**

1. **Check description specificity**
   
   ```yaml
   # ❌ Too vague
   description: Helps with coding tasks
   
   # ✅ Specific triggers
   description: Generates commit messages from git diffs. Use when writing commits or reviewing staged changes.
   ```
2. **Verify YAML syntax**
- Must start with `---`
- `name:` and `description:` are required
- No tabs, only spaces
3. **Simplify SKILL.md**
- Remove verbose prose
- Keep instructions crisp
- Under 500 lines recommended

### Testing in Local Development

Create a test project structure:

```bash
test-project/
├── .claude/
│   ├── skills/
│   │   └── test-skill/
│   │       └── SKILL.md
│   └── CLAUDE.md
└── test.txt
```

Test with clear trigger phrases that match your skill's description.

-----

## Team Workflows & Distribution

### Option 1: Git-Based Distribution

```bash
# 1. Add skills to project repo
your-repo/
├── .claude/
│   └── skills/
│       ├── team-workflow/
│       │   └── SKILL.md
│       └── code-review/
│           └── SKILL.md

# 2. Team members pull and trust the repo
# Skills load automatically
```

### Option 2: Plugin Marketplaces

```bash
# 1. Create a plugin with your team's skills
team-plugin/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    ├── workflow-1/
    └── workflow-2/

# 2. Host on GitHub

# 3. Team members add marketplace and install
/plugin marketplace add your-org/team-plugins
/plugin install team-workflow@team-plugins
```

### Option 3: Shared Personal Skills

```bash
# Share ~/.claude/skills/ directory via:
# - Dotfiles repository
# - Shared network drive
# - Internal package manager
```

-----

## Community Resources

### Major Community Skill Collections

**1. obra/superpowers** - 20+ battle-tested skills

```bash
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@obra
```

Features: TDD, debugging, collaboration patterns, `/brainstorm`, `/write-plan`

**2. jeremylongshore/claude-code-plugins-plus** - 243 plugins, 175 with Skills

```bash
/plugin marketplace add jeremylongshore/claude-code-plugins
/plugin install devops-automation-pack@claude-code-plugins-plus
```

First marketplace 100% compliant with Anthropic's 2025 Skills schema

**3. Neon Database Skills**

```bash
# Follow Neon's installation guide
# Includes: Drizzle ORM integration, database provisioning, management API
```

See detailed Skills + MCP integration example in [Skills + MCP Integration](#skills--mcp-integration-the-power-combo) section below.

### Notable Individual Skills

- **ffuf-web-fuzzing** - Web security testing
- **playwright-skill** - Browser automation
- **claude-d3js-skill** - Data visualization
- **claude-scientific-skills** - Scientific computing
- **web-asset-generator** - Generate web assets

-----

## Official Documentation & Learning Resources

### Essential Reading

**Core Concepts:**

1. [**Agent Skills Engineering Blog**](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)  
   Deep dive into progressive disclosure, architecture, development best practices
2. [**Claude Code Skills Documentation**](https://docs.claude.com/en/docs/claude-code/skills)  
   Official guide to creating, managing, and using skills
3. [**Skills API Documentation**](https://docs.claude.com/en/api/skills)  
   Using skills via API with `/v1/skills` endpoint

**Best Practices:**
4. [**Skill Authoring Best Practices**](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)  
Progressive disclosure, testing across models, workflow patterns

5. [**Claude Code Best Practices**](https://docs.claude.com/en/docs/claude-code/overview)  
   CLAUDE.md usage, project scoping, safety guidelines

### GitHub Repositories

**Official:**

- [anthropics/skills](https://github.com/anthropics/skills) - Example skills + document-skills reference
- [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks/tree/main/skills) - Tutorials and examples

**Community:**

- [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) - Curated list of skills, resources, tools
- [obra/superpowers](https://github.com/obra/superpowers) - Production-ready skill library
- [jeremylongshore/claude-code-plugins-plus](https://github.com/jeremylongshore/claude-code-plugins-plus) - Large plugin marketplace

### Support Articles

- [What are Skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Using Skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [Creating Custom Skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)

### Video & Blog Resources

**Blogs:**

- [Skills Announcement](https://www.anthropic.com/news/skills) - Official launch announcement
- [Simon Willison: Claude Skills are awesome](https://simonwillison.net/2025/Oct/16/claude-skills/) - Technical analysis
- [Getting Started with Claude Skills - Neon](https://neon.com/blog/getting-started-with-claude-skills) - Practical tutorial

**Tutorials:**

- [How to Create Your First Claude Skill](https://skywork.ai/blog/ai-agent/how-to-create-claude-skill-step-by-step-guide/)
- [How to Use Skills in Claude Code](https://skywork.ai/blog/how-to-use-skills-in-claude-code-install-path-project-scoping-testing/)
- [Claude Skills vs Commands vs Subagents vs Plugins](https://www.youngleaders.tech/p/claude-skills-commands-subagents-plugins)

-----

## Skills + MCP Integration: The Power Combo

### Understanding the Complementary Relationship

While Skills and MCP servers are distinct features, they work best **together**. Think of them as two sides of the same coin:

- **Skills** = The "how" (procedures, workflows, methodologies, domain expertise)
- **MCPs** = The "what" (data access, tool integrations, external system connections)

Skills teach Claude HOW to perform tasks through procedures, workflows, standards, and patterns, while MCP provides access to WHAT data and tools Claude needs from external systems.

#### Token Efficiency Comparison

| Aspect | MCP Servers | Skills |
|--------|-------------|---------|
| **Initial Context** | Tens of thousands of tokens per server, especially for complex integrations | Dozens of tokens for metadata, full content loads only when needed |
| **When to Use** | Real-time data access, external tool integration | Repeatable workflows, domain expertise, best practices |
| **Complexity** | Requires server setup, authentication, transport config | Write Markdown, add to folder, auto-detected |
| **Maintenance** | API changes require server updates | Update Markdown file |

#### The Hybrid Advantage

A common hybrid approach uses Skills as MCP clients: Skills invoke MCP servers for specific tasks (database queries, image generation) while maintaining workflow orchestration in Claude's environment. This reduces server complexity by 40-60% compared to pure MCP architectures.

**Productivity Gains:** Teams using Skills reduce repetitive prompt engineering time by 73% compared to traditional approaches, according to Anthropic's internal benchmarks published in their October 2025 release notes.

-----

### Marketplaces for Skills + MCP Integration

#### 1. Awesome MCP Servers - Claude Skills Library

**URL:** https://mcpservers.org/claude-skills

Features Skills that integrate with MCP servers, including AWS cost optimization with integrated MCP servers for billing analysis, MCP builder guides, and Playwright automation Skills.

**Notable Skills:**

**mcp-builder**
- Guide for creating high-quality MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK)
- Use when: Building custom MCP integrations
- License: Complete terms in LICENSE.txt

**AWS Cost Optimization Skill**
- Provides AWS cost optimization, monitoring, and operational best practices with integrated MCP servers for billing analysis, cost estimation, observability, and security assessment
- Use when: Managing AWS infrastructure costs
- Combines: Skills for methodologies + MCPs for real-time billing data

**Playwright Automation Skills**
- Enables Claude to write and execute Playwright automation on-the-fly, with toolkit for testing local web applications using Playwright
- Use when: Web testing and browser automation
- Pattern: Skill orchestrates test workflows, MCP provides browser control

**Notion Integration Skills**
- Turns discussions into durable knowledge in Notion, captures insights from chat, and files them to the right wiki or database with smart linking
- Use when: Knowledge management and documentation
- Pattern: Skill defines organization workflows, Notion MCP handles API calls

#### 2. Neon Database Skills + MCP Bundle

**Marketplace:** neondatabase-labs/ai-rules

```bash
/plugin marketplace add neondatabase-labs/ai-rules
/plugin install neon@neondatabase-labs
```

Neon created a marketplace bundling four Claude Skills plus an MCP server in a single plugin - the Skills teach workflows while the MCP provides runtime API access to Neon's database platform.

**What You Get:**

**4 Skills:**
1. **Drizzle ORM Integration Skill**
   - Teaches Claude how to set up the connection string, configure environment variables, and test queries for Neon's serverless driver
   - Covers: New projects, existing projects, schema updates

2. **Neon Management API Skill**
   - Workflows around creating and managing databases, provisioning projects, or fetching connection URLs
   - Use when: Building automation or provisioning resources dynamically

3. **Neon Best Practices Skill**
   - Covers Neon's best practices and docs, helps Claude include relevant documentation snippets or usage patterns
   - Acts as: "Neon brain" for contextual knowledge

4. **Serverless Driver Setup Skill**
   - Focuses on: Compute/storage-separated architecture with minimal boilerplate

**1 MCP Server:**
- Gives Claude runtime access to Neon's APIs for checking project info, creating databases, and validating schema connections - every tool inside Claude Code can now talk directly to Neon through that MCP interface

**Installation Flow:**
Open Claude Code, go through Quick Start, add the Neon Marketplace, install the Neon plugin, and restart Claude Code. Once up, Claude automatically detects the Neon MCP connection.

**Architecture Pattern:**
```
User Query
    ↓
Skill provides context (how to structure queries, best practices)
    ↓
MCP server executes action (creates database, fetches connection string)
    ↓
Skill formats and presents results
```

#### 3. Databricks MCP Catalog (Enterprise)

**Platform:** Databricks workspace → Agents tab → MCP Servers

Databricks addresses MCP discovery and governance challenges with the Databricks MCP Catalog, making external MCPs available in Databricks Marketplace with three options: Managed MCP servers, External MCP servers, or Custom MCP servers.

**Three Integration Options:**

1. **Managed MCP Servers**
   - Pre-configured by Databricks
   - Unity Catalog integration
   - Built-in governance

2. **External MCP Servers**
   - Third-party vendors like Glean MCP for internal document retrieval, You.com MCP for online searches, or data providers like FactSet and S&P Global
   - Centralized discovery and governance
   - Partner MCP server providers making their MCPs available with single-click connections

3. **Custom MCP Servers**
   - Build and host your own
   - Full customization

**Example Use Case: Financial Analysis**

A developer curated two Skills for Claude: the financial-analysis Skill and the data-querying Skill. The financial-analysis Skill starts with a Claude-assisted deep-researched financial statement analysis guide covering profitability, liquidity, leverage, cash flow, and valuation analyses.

The data-querying Skill gives Claude detailed instruction on how to use the Databricks Managed MCP server to send LLM-generated SQL queries to retrieve data.

**Critical Security Note:**
Since Claude uses an MCP server to send SQL queries to Databricks for execution, it's crucial that proper controls are in place so that any create, update, and delete operations are disallowed. Consider incorporating that instruction into the SKILL.md and ensure credentials like Service Principals only have SELECT privilege on datasets.

**Skills Creation:**
Used the skill-creator Skill to create the SKILL.md markdown file and underlying references.

#### 4. MCP Skill Hub (Self-Hosted Management Tool)

**GitHub:** Search for "mcp-skill-hub"

MCP Skill Hub is a production-ready MCP server specifically designed to host and manage Anthropic Skills, providing dynamic discovery, hot-reloading, and powerful management tools.

**What It Does:**
Rather than a marketplace, MCP Skill Hub is an **MCP server that hosts your Skills collection** as MCP resources.

Instead of manually uploading skills or managing them through Claude's web interface, you organize skills in a directory on your file system, point the MCP server to that directory, and Claude discovers them dynamically through the MCP protocol.

**Key Features:**
- **Dynamic Discovery:** File system becomes your skills repository
- **Hot-Reloading:** Real-time change detection when Skills are updated
- **Organization:** Maintain multiple skill directories for different contexts

**Configuration:**

```bash
# Install
poetry run mcp-skills

# Configure environment variables
export MCP_SKILLS_DIR=~/skills/your-collection
export MCP_SKILLS_HOT_RELOAD=true
export MCP_SKILLS_DEBOUNCE_DELAY=0.5
export MCP_SKILLS_LOG_LEVEL=INFO
```

**Claude Desktop Config:**
```json
{
  "mcpServers": {
    "skill-hub": {
      "command": "poetry",
      "args": ["run", "mcp-skills"],
      "env": {
        "MCP_SKILLS_DIR": "/path/to/your/skills"
      }
    }
  }
}
```

**Use Cases:**

**Personal Learning:**
Maintain a growing library of Anthropic Skills for different tech stacks - as you learn new patterns or best practices, add or update skills in your directory.

**Team Standardization:**
Host a team skills repository that everyone connects to - when someone discovers a better approach, they update the skill and everyone benefits immediately through hot-reloading.

**Organizational Knowledge:**
Maintain an organizational skills repository covering company workflows - new employees connect to the MCP server and immediately have Claude equipped with organizational knowledge.

**Multi-Client Consulting:**
Maintain separate skill directories for different clients - switch contexts by pointing the MCP server to different directories.

```bash
# Working with Client A
export MCP_SKILLS_DIR=~/skills/client-a
poetry run mcp-skills

# Switch to Client B
export MCP_SKILLS_DIR=~/skills/client-b
poetry run mcp-skills
```

-----

### Real-World Integration Patterns

#### Pattern 1: Marketing Automation

**Use Case:** Combined with MCP servers connecting Claude directly to platforms like HubSpot, ActiveCampaign, and Klaviyo, marketing teams access real-time CRM data, trigger automated workflows, and execute complex multi-step campaigns through natural language commands.

**Architecture:**
```
Marketing Skill (defines campaign workflows)
    ↓
HubSpot MCP (provides CRM data)
    ↓
ActiveCampaign MCP (executes email automation)
    ↓
Klaviyo MCP (manages customer segments)
```

**Ecosystem Growth:**
The MCP ecosystem has grown to 257+ servers as of November 2025, with major marketing platforms prioritizing adoption throughout 2025.

**Time Savings:**
30% time savings on routine CRM analysis tasks when combining HubSpot MCP access with Claude Skills defining analytical methodologies.

**Available MCP Servers:**
- HubSpot's beta MCP server (released Q2 2025) enables direct CRM access and campaign management
- ActiveCampaign's June 2025 MCP server brings email automation to AI assistants across all plan tiers
- Klaviyo's enhanced August 2025 MCP server provides both local and remote connectivity for broader accessibility

#### Pattern 2: Financial Analysis (Databricks Example)

**Components:**
1. **Financial Analysis Skill**
   - Methodologies: Profitability, liquidity, leverage, cash flow, valuation
   - Framework: How to interpret financial statements
   - Domain expertise: Ratio analysis, trend identification

2. **Data Querying Skill**
   - Procedures: How to construct SQL queries for financial data
   - Best practices: Query optimization, data validation
   - Workflow: From question → SQL → interpretation

3. **Databricks MCP Server**
   - Real-time data access from Unity Catalog
   - Execute SQL queries against financial datasets
   - Retrieve stock prices, income statements, balance sheets, cash flows

**Example Workflow:**
```
User: "Analyze Apple's profitability trends over the last 5 years"
    ↓
Financial Analysis Skill: Provides profitability analysis framework
    ↓
Data Querying Skill: Constructs SQL for Apple's income statements
    ↓
Databricks MCP: Executes query against Unity Catalog
    ↓
Financial Analysis Skill: Interprets results using analytical framework
    ↓
Output: Comprehensive profitability analysis with trends and insights
```

#### Pattern 3: Database Development (Neon Example)

**Flow:**
1. User asks: "Set up a new Next.js project with Neon database"
2. **Drizzle ORM Skill** provides: Connection string format, environment variable setup, schema definition patterns
3. **Neon MCP** executes: Creates new database project, generates connection URL
4. **Best Practices Skill** adds: Neon-specific optimizations, connection pooling guidance
5. **Neon MCP** validates: Tests connection, verifies schema

**Benefits:**
- Single command gets you from idea to working database
- Skills ensure best practices are followed
- MCP handles actual provisioning
- No manual console navigation needed

#### Pattern 4: Web Testing Automation

**Components:**
- **Playwright Skill:** Test design patterns, accessibility-first automation approaches
- **Playwright MCP Server:** Browser control, page interaction, screenshot capture
- **Testing Skill:** Test case organization, assertion strategies, error handling

**Example:**
```
User: "Test the login flow on staging"
    ↓
Testing Skill: Defines test structure (setup, action, assertion, cleanup)
    ↓
Playwright Skill: Provides accessibility-first element selection
    ↓
Playwright MCP: Executes browser automation
    ↓
Testing Skill: Formats results, suggests improvements
```

-----

### Creating Skills That Use MCPs

#### Step 1: Identify the Division of Labor

Ask yourself:
- What **knowledge/workflow** does Claude need? → Goes in Skill
- What **data/actions** require external systems? → Goes through MCP

#### Step 2: Write the Skill with MCP Instructions

**Example SKILL.md for Database Operations:**

```markdown
---
name: database-analyst
description: Analyzes database schema and query performance. Use when user asks about database optimization, schema design, or query analysis.
allowed-tools: [bash_tool]
---

# Database Analysis Skill

## Prerequisites

This skill works with the following MCP servers:
- PostgreSQL MCP (for database access)
- Notion MCP (optional, for documentation)

## Analysis Workflow

When analyzing a database:

1. **Schema Review**
   - Use PostgreSQL MCP to retrieve table structures
   - Identify missing indexes, normalization issues
   - Check for appropriate data types

2. **Query Performance**
   - Request slow query logs from PostgreSQL MCP
   - Analyze execution plans
   - Suggest index improvements

3. **Documentation** (if Notion MCP available)
   - Create schema documentation in Notion
   - Link related tables and relationships
   - Document optimization recommendations

## MCP Tool Usage

### Retrieving Schema
Ask the PostgreSQL MCP to list all tables and their columns.

### Analyzing Queries
Request EXPLAIN ANALYZE output for slow queries from PostgreSQL MCP.

### Creating Documentation
Use Notion MCP to create a new database page with schema diagrams.

## Best Practices

- Always explain WHY a change is recommended
- Consider impact on existing queries
- Document breaking changes clearly
```

#### Step 3: Test the Integration

```bash
# Ensure MCP server is configured
claude mcp add --transport stdio postgresql \
  --env DATABASE_URL=your_connection_string \
  -- npx -y @modelcontextprotocol/server-postgres

# Test the skill
"Analyze the users table schema and suggest optimizations"
```

#### Step 4: Iterate Based on Token Usage

**Monitor context consumption:**
- Skill metadata: ~50-100 tokens
- Full skill content: ~1,000-3,000 tokens
- MCP server context: Variable (can be large)

**Optimization strategies:**
- Keep Skills focused and modular
- Don't duplicate information that's in MCP server docs
- Use progressive disclosure (link to detailed docs rather than including everything)

-----

### Common Skills + MCP Combinations

| Skill Type | Paired MCP Server(s) | Use Case |
|------------|---------------------|----------|
| **Code Review** | GitHub, Linear | Fetch PRs, file issues for problems found |
| **API Documentation** | OpenAPI servers, Postman | Generate docs from specs, test endpoints |
| **Content Publishing** | WordPress, Medium, Ghost | Write following style guide, publish to platform |
| **Data Pipeline** | PostgreSQL, BigQuery, S3 | Extract, transform, analyze data workflows |
| **Customer Support** | Zendesk, Intercom, Salesforce | Retrieve context, suggest responses, create tickets |
| **Financial Modeling** | Excel MCP, Financial data APIs | Build models following methodologies |
| **Infrastructure** | AWS, Azure, GCP MCPs | Provision following architecture patterns |
| **Meeting Prep** | Calendar, Notion, Slack | Gather context, create agendas, summarize notes |

-----

### Security Best Practices

#### Skill-Level Security

**In your SKILL.md:**
```yaml
---
name: safe-database-skill
description: Database operations with read-only access
allowed-tools: [bash_tool]
---

## Security Rules

⚠️ **CRITICAL RESTRICTIONS:**
- NEVER execute DROP, DELETE, or TRUNCATE commands
- Only SELECT queries are permitted
- Always verify credentials have read-only permissions
- Confirm destructive operations with user
```

#### MCP-Level Security

**Database MCP Example:**
Ensure credentials passed into Claude Code, such as a Service Principal, only have SELECT privilege on datasets in Unity Catalog. Consider incorporating restrictions into the SKILL.md.

**Configuration:**
```json
{
  "mcpServers": {
    "postgres-readonly": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://readonly_user:pass@host/db"
      }
    }
  }
}
```

#### Defense in Depth

1. **Skill instructions** explicitly forbid dangerous operations
2. **MCP credentials** have minimal necessary permissions
3. **User confirmation** required for any destructive actions
4. **Audit logging** of all MCP calls in production

-----

### Troubleshooting Skills + MCP Integration

#### Issue: Skill Isn't Using the MCP

**Symptoms:**
- Claude acknowledges the MCP exists but doesn't use it
- Skill executes without accessing external data

**Solutions:**
1. **Make MCP usage explicit in Skill:**
   ```markdown
   ## Required Tools
   This skill MUST use the PostgreSQL MCP server for all data access.
   
   When the user asks for data:
   1. First, use PostgreSQL MCP to retrieve it
   2. Then, apply analysis frameworks
   ```

2. **Check MCP server is running:**
   ```bash
   # View active MCP connections
   # In Claude Code, ask:
   "What MCP servers are currently connected?"
   ```

3. **Verify Skill description mentions data needs:**
   ```yaml
   description: Analyzes customer data from Salesforce. Use when user asks about customer insights, CRM analytics, or sales trends. REQUIRES Salesforce MCP.
   ```

#### Issue: Too Many Tokens Consumed

**Symptoms:**
- Responses are truncated
- Claude says context window is full
- Slow performance

**Solutions:**

1. **Limit MCP scope:**
   ```json
   {
     "mcpServers": {
       "github": {
         "command": "docker",
         "args": ["run", "-i", "ghcr.io/github/github-mcp-server"],
         "env": {
           "GITHUB_REPOSITORIES": "myorg/myrepo",  // Limit to specific repos
           "GITHUB_PERSONAL_ACCESS_TOKEN": "token"
         }
       }
     }
   }
   ```

2. **Make Skills more focused:**
   - Split large Skills into smaller, specialized ones
   - Use `allowed-tools` to limit scope
   - Reference external docs instead of including everything

3. **Use Skills to filter MCP queries:**
   ```markdown
   ## Efficient Data Retrieval
   
   Before querying the MCP:
   1. Determine the minimum data needed
   2. Use specific filters (date ranges, IDs, etc.)
   3. Request only necessary columns
   
   Example:
   ❌ "Fetch all customer records"
   ✅ "Fetch name and email for customers created in last 30 days"
   ```

#### Issue: MCP Authentication Failures

**Symptoms:**
- Connection errors
- "Unauthorized" messages
- Skills work but MCP calls fail

**Solutions:**

1. **Verify environment variables:**
   ```bash
   # Check if vars are set
   echo $DATABASE_URL
   echo $GITHUB_PERSONAL_ACCESS_TOKEN
   ```

2. **Test MCP independently:**
   ```bash
   # Test PostgreSQL MCP
   npx @modelcontextprotocol/server-postgres
   # Should show available tools
   ```

3. **Update credentials in config:**
   ```json
   {
     "mcpServers": {
       "your-server": {
         "env": {
           "API_KEY": "${YOUR_NEW_API_KEY}"  // Update here
         }
       }
     }
   }
   ```

-----

### Future: Skills + MCP Ecosystem Growth

Developer and researcher Simon Willison suggests Skills might be a bigger deal than MCP, predicting a "Cambrian explosion" of Skills that will exceed the MCP adoption rush - precisely because creating a Skill is so much simpler than building an MCP server.

**What This Means:**
- More Skills will emerge to orchestrate existing MCPs
- Skills will become the "glue" between multiple MCP servers
- Teams will share Skills more readily than custom MCP servers
- Enterprise Skills libraries will become valuable IP

**The Convergence:**
This infrastructure convergence - Skills teaching Claude what to do, MCP giving it the tools to do it - marks the first time marketers (and developers) can deploy truly autonomous AI workflows without engineering resources.

-----

### Quick Reference: When to Use Skills vs MCPs vs Both

**Use Skills Alone:**
- Repeatable workflows with no external data needs
- Document generation following templates
- Code review checklists
- Style guide enforcement
- Analysis frameworks

**Use MCPs Alone:**
- Simple data retrieval
- Basic CRUD operations
- Real-time monitoring
- Single-purpose integrations

**Use Skills + MCPs Together (Recommended):**
- Complex workflows requiring external data
- Multi-step automation across systems
- Domain-specific analysis with live data
- Team processes combining methodology + tools
- Any task that benefits from both "how" and "what"

**Golden Rule:** If you find yourself typing the same instructions repeatedly, create a Skill. If that Skill needs external data or actions, pair it with an MCP.

-----

## Skills vs Other Claude Code Features

|Feature           |When to Use                                         |Invocation                               |
|------------------|----------------------------------------------------|-----------------------------------------|
|**Skills**        |Repeatable procedural knowledge across conversations|Model-invoked (automatic)                |
|**Slash Commands**|User-triggered shortcuts for specific actions       |User-invoked (`/command`)                |
|**Subagents**     |Self-contained agents with restricted tool access   |Either (can be command-triggered or auto)|
|**Plugins**       |Bundle Skills + Commands + Agents together          |Via `/plugin install`                    |
|**MCP Servers**   |Connect to external data sources and APIs           |Automatic when configured                |
|**CLAUDE.md**     |Persistent project context and guidelines           |Always loaded for project                |

**Key Insight:** If you type the same instructions repeatedly across conversations → create a Skill

-----

## Skills vs MCP: When to Use Which

|Aspect            |Skills                                |MCP                           |
|------------------|--------------------------------------|------------------------------|
|**Purpose**       |Task procedures and workflows         |External tool/data integration|
|**Best For**      |Repeatable tasks, document workflows  |Database access, API calls    |
|**Code Execution**|Can include executable scripts        |Provides tools/resources      |
|**Portability**   |Same everywhere (claude.ai, Code, API)|Requires server configuration |
|**Token Usage**   |~100 tokens (metadata) to <5k (loaded)|Varies by implementation      |

**Use Together:** The `mcp-builder` skill helps create MCP servers! Skills can orchestrate MCP usage.

-----

## Advanced: Skills in the Claude Agent SDK

If you're building custom agents with the SDK:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const response = await query({
  prompt: "Your task here",
  options: {
    plugins: [
      { type: "local", path: "./my-plugin" },
      { type: "local", path: "~/.claude/skills/my-skill" }
    ]
  }
});
```

See: [Plugins in the SDK Documentation](https://docs.claude.com/en/docs/agent-sdk/plugins)

-----

## Security Considerations

⚠️ **Important:** Skills can execute arbitrary code

**Best Practices:**

1. **Only install from trusted sources**
2. **Audit SKILL.md and scripts** before enabling
3. **Use `allowed-tools` field** to restrict permissions:
   
   ```yaml
   ---
   name: read-only-analyzer
   description: Analyzes code without modifications
   allowed-tools: [Read, Grep, Glob, Bash]  # No Write
   ---
   ```
4. **Project-level safety in CLAUDE.md:**
   
   ```markdown
   ## Safety Rules
   - Work only within ./src directory
   - Never delete files without confirmation
   - Ask before external API calls
   ```

**Security Research:**

- [Weaponizing Claude Code Skills](https://medium.com/@yossifqassim/weaponizing-claude-code-skills-from-5-5-to-remote-shell-a14af2d109c9) - Understand potential risks

-----

## Troubleshooting Common Issues

### Skills Not Appearing

**Check:**

```bash
# 1. Verify plugin installation
/plugin

# 2. Check skill directories exist
ls ~/.claude/skills/
ls .claude/skills/

# 3. Restart Claude Code
# Exit and reopen terminal
```

### Skills Not Activating

**Solutions:**

1. Make description more specific and trigger-focused
2. Check YAML frontmatter syntax (no tabs!)
3. Verify SKILL.md is under 500 lines
4. Test with exact phrases from description

### Plugin Installation Errors

**Common fixes:**

```bash
# Marketplace not found
/plugin marketplace remove old-name
/plugin marketplace add correct-org/correct-repo

# Plugin path issues
# Check ~/.claude/plugins/ for CLI-installed plugins
ls ~/.claude/plugins/

# Permission errors
chmod -R 755 ~/.claude/skills/
```

### Multiple Skills Conflicting

**Solutions:**

1. Make descriptions mutually exclusive
2. Use more specific trigger phrases
3. Consider combining into single skill
4. Use `allowed-tools` to limit scope

-----

## Quick Reference: Essential Commands

```bash
# Plugin Management
/plugin                                    # Interactive menu
/plugin marketplace add org/repo          # Add marketplace
/plugin install name@marketplace          # Install plugin
/plugin marketplace remove name           # Remove marketplace

# Viewing Help
/help                                     # See all commands
"What skills do you have access to?"     # Ask Claude

# Testing
"Use [skill-name] to [task]"             # Explicit skill invocation
```

-----

## Next Steps

**Getting Started:**

1. Install official skills: `/plugin marketplace add anthropics/skills`
2. Browse examples: Visit [anthropics/skills on GitHub](https://github.com/anthropics/skills)
3. Create first skill: Use `skill-creator` or manual method
4. Test locally before sharing with team

**Going Deeper:**

1. Read [Agent Skills Engineering Blog](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
2. Explore [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)
3. Join community discussions on Discord/GitHub
4. Experiment with combining Skills + MCP + Subagents

**For Teams:**

1. Set up project-level `.claude/skills/` in your repo
2. Create team plugin marketplace on GitHub
3. Document workflows in CLAUDE.md
4. Establish skill review/approval process

-----

## Key Differences Summary: Claude Code vs Claude.ai/Desktop

**What's the Same:**

- ✅ SKILL.md format and structure
- ✅ Progressive disclosure architecture
- ✅ Model-invoked activation
- ✅ Available on Pro/Max/Team/Enterprise plans

**What's Different:**

- 🔄 Installation via `/plugin` commands (not web UI or drag-drop)
- 🔄 Plugin system bundles Skills with Commands/Agents/Hooks/MCP
- 🔄 Project-level skills via `.claude/skills/` (version controlled)
- 🔄 CLAUDE.md for project-specific guidance
- 🔄 Stronger team distribution via git and marketplaces

**Bottom Line:** Skills in Claude Code are more **developer-centric** with better **version control**, **team sharing**, and **integration with development workflows**.

-----

*Last Updated: November 2025*  
*Based on Claude Code plugin system (launched October 2025)*
