# Anthropic 2025: A Year of Skills, MCPs, and Programmable AI

_A comprehensive timeline of Anthropic releases relevant to the agentic AI ecosystem_

---

## Executive Summary

2025 was the year Anthropic transformed from an AI lab shipping models to an **agentic AI platform company**. The key themes:

- **MCP went from experiment to industry standard** — adopted by OpenAI, Google, Microsoft, Salesforce, and donated to the Linux Foundation
- **Skills emerged as the next standard** — open-sourced in December, enabling portable agent capabilities
- **Tool use became programmable** — Tool Search Tool and Programmatic Tool Calling shipped in November
- **Claude Code became a $1B business** — from research preview to acquisition of Bun

---

## Q1 2025: Extended Thinking & Claude Code Preview

### February 24 — Claude 3.7 Sonnet & Claude Code Research Preview

The year started with a bang. Anthropic released **Claude 3.7 Sonnet**, the industry's first **hybrid reasoning model** — combining instant responses with deep, step-by-step thinking in a single model.

**Key features:**

- **Extended Thinking mode** — toggle between instant responses and deep reasoning
- **Thinking budget control** — developers can set token limits for reasoning (up to 128K output tokens)
- **Visible thought process** — raw chain-of-thought displayed to users (research preview)
- Pricing: $3/$15 per million tokens (same as 3.5 Sonnet)

Alongside the model, Anthropic quietly released **Claude Code** as a limited research preview — an agentic coding tool that would later become their fastest-growing product.

> "Since June 2024, Sonnet has been the preferred model for developers worldwide. Today, we're empowering developers further by introducing Claude Code." — Anthropic

**Why it matters for Skillport:** Claude 3.7 Sonnet laid the groundwork for agent architecture. The extended thinking feature demonstrated that models could self-direct computational resources — a key capability for autonomous agents.

**References:**

- [Claude 3.7 Sonnet announcement](https://www.anthropic.com/news/claude-3-7-sonnet)
- [Claude's Extended Thinking deep dive](https://www.anthropic.com/news/visible-extended-thinking)
- [Claude 3.7 Sonnet on AWS Bedrock](https://aws.amazon.com/blogs/aws/anthropics-claude-3-7-sonnet-the-first-hybrid-reasoning-model-is-now-available-in-amazon-bedrock/)
- [Claude 3.7 Sonnet on Google Vertex AI](https://cloud.google.com/blog/products/ai-machine-learning/anthropics-claude-3-7-sonnet-is-available-on-vertex-ai)

### March — MCP Gains Momentum

- **March 18**: Claude 3.7 Sonnet GA on Google Vertex AI
- **March 26**: **OpenAI announces MCP support** — Sam Altman tweets "People love MCP and we are excited to add support across our products"
- OpenAI's adoption was the inflection point — MCP went from "Anthropic's protocol" to "the industry protocol"

**References:**

- [Sam Altman MCP announcement on X](https://x.com/sama/status/1904957253247152129)
- [The New Stack: Why the Model Context Protocol Won](https://thenewstack.io/why-the-model-context-protocol-won/)

---

## Q2 2025: Claude 4 & The Agent Economy

### May 22 — Claude 4 Launch ("Code with Claude" Developer Conference)

Anthropic hosted its first-ever developer conference and launched **Claude 4** — the most significant model release of the year.

**Models released:**

- **Claude Opus 4** — flagship model, 72.5% on SWE-bench, sustained performance over hours of work
- **Claude Sonnet 4** — balanced model, strict upgrade from 3.7 Sonnet

**Platform capabilities announced:**

- **Extended thinking with tool use (beta)** — Claude can alternate between reasoning and tool calls
- **Parallel tool use** — multiple tools in a single turn
- **MCP Connector in the API** — connect MCP servers directly through the Anthropic API
- **Web Search API** — real-time internet access for Claude
- **Files API** — persistent file handling in the API
- **Code Execution Tool** — sandboxed Python execution (beta header: `code-execution-2025-05-22`)
- **Extended prompt cache TTL** — 1 hour (up from 5 minutes)

**Claude Code goes GA:**

- Native VS Code and JetBrains integrations
- GitHub Actions support for background tasks
- OAuth authentication (a first for Anthropic's API)

**Safety milestone:** Claude Opus 4 deployed under **ASL-3** (AI Safety Level 3) — Anthropic's highest deployment standard at the time.

> "This lays the foundation of what could become the agent economy." — Mike Krieger, CPO

**Why it matters for Skillport:** The May release established the infrastructure for modern agents: MCP in the API, extended thinking with tools, and code execution. These are the primitives that Skills build upon.

**References:**

- [Introducing Claude 4](https://www.anthropic.com/news/claude-4)
- [New capabilities for building agents on the Anthropic API](https://www.anthropic.com/news/agent-capabilities-api)
- [Claude 4 System Card (PDF)](https://www-cdn.anthropic.com/4263b940cabb546aa0e3283f35b686f4f3b2ff47.pdf)
- [Code Execution Tool documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool)
- [Simon Willison's live blog: Code with Claude](https://simonwillison.net/2025/May/22/code-with-claude-live-blog/)

---

## Q3 2025: Claude Code Explosion & Agent SDK

### August 5 — Claude Opus 4.1

Incremental upgrade focused on agentic tasks:

- 74.5% on SWE-bench Verified (up from 72.5%)
- Improved multi-file code refactoring
- Better debugging precision
- Same pricing as Opus 4

**Also in August:**

- Claude Code revenue up **5.5x** since Claude 4 launch
- New capability: Claude can **end conversations** that remain "persistently harmful or abusive"
- **Code Execution Tool updated** to `code_execution_20250825` — now supports Bash commands and file operations (previously Python only)

**References:**

- [Claude Opus 4.1 model page](https://www.anthropic.com/claude/opus)
- [Code Execution Tool docs (August update)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool)

### September 9 — "Create and Edit Files" Feature Preview

Claude gained the ability to **create and edit files directly** within claude.ai and the desktop app — Excel spreadsheets, Word documents, PowerPoint presentations, and PDFs.

**Official feature name:** "Code execution and file creation" (in settings: "Upgraded file creation and analysis")

**How it works:**

- Claude runs in a private sandboxed computer environment (Ubuntu 24.04)
- Writes and executes Python/Node.js code to produce files
- Limited internet access via allowlisted domains (npm, PyPI, GitHub)
- Files can be downloaded or saved directly to Google Drive

**What Simon Willison called it:** "Claude's Code Interpreter" — essentially the same pattern as ChatGPT's Code Interpreter, but with a confusing name.

**Key use cases:**

- Turn raw data into polished outputs with analysis, charts, and insights
- Build spreadsheets with working formulas and multiple sheets
- Cross-format work: PDF → PowerPoint, meeting notes → formatted document

This feature was **entirely powered by Skills** internally, though Skills weren't public yet.

> "File creation turns projects that normally require programming expertise, statistical knowledge, and hours of effort into minutes of conversation." — Anthropic

**October 21:** Feature became generally available for all paid plans with network and egress controls.

**References:**

- [Claude can now create and edit files (announcement)](https://www.anthropic.com/news/create-files)
- [Create and edit files with Claude (Help Center)](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude)
- [Simon Willison: My review of Claude's new Code Interpreter](https://simonwillison.net/2025/Sep/9/claude-code-interpreter/)

### September 29 — Claude Sonnet 4.5 & Claude Agent SDK

The second major launch of the year.

**Claude Sonnet 4.5:**

- 77.2% on SWE-bench Verified (82% with high compute)
- 61.4% on OSWorld (computer use)
- Maintains focus for **30+ hours** on complex tasks
- Same pricing: $3/$15 per million tokens
- "The best coding model in the world" — Anthropic

**Claude Agent SDK released:**

- Same infrastructure that powers Claude Code
- Renamed from "Claude Code SDK" because it powers far more than coding
- Used internally for research, video creation, note-taking
- Available to all developers via the API

**Other September releases:**

- **Checkpoints in Claude Code** — save/restore progress instantly
- **VS Code extension** (native)
- **Context editing feature** in the API
- **Memory tool** — agents can run longer with persistent context
- **"Imagine with Claude"** research preview — real-time software generation

**JetBrains integration:** Claude Agent announced for JetBrains IDEs, built on the Agent SDK.

**References:**

- [Introducing Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5)
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Claude Agent SDK on npm](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk)
- [JetBrains Claude Agent announcement](https://blog.jetbrains.com/ai/2025/09/introducing-claude-agent-in-jetbrains-ides/)

---

## Q4 2025: Skills, Advanced Tool Use, and Linux Foundation

### October 15 — Claude Haiku 4.5

Fast, efficient model for parallel sub-agent work:

- 73.3% on SWE-bench Verified (matches Sonnet 4 on coding)
- $1/$5 per million tokens
- Designed for real-time assistants and customer support

**References:**

- [Claude Haiku 4.5 model page](https://www.anthropic.com/claude/haiku)

### October 16 — Claude Skills Launch 🎯

**The big one for Skillport.** Anthropic publicly released Skills:

**What are Skills?**

- Folders containing instructions, scripts, and resources
- Loaded dynamically when relevant to a task
- Token-efficient: only metadata loaded until needed
- Require the Code Execution Tool to run

**Available surfaces:**

- Claude.ai (all paid plans)
- Claude Code (via plugins from `anthropics/skills` marketplace)
- API (`/v1/skills` endpoint)

**Anthropic-built Skills shipped:**

- Excel (.xlsx) creation and editing
- PowerPoint (.pptx) creation
- Word (.docx) creation
- PDF handling

**Developer capabilities:**

- Create custom Skills via Claude Console
- Version management
- Skills Cookbook and documentation

> "Skills are conceptually extremely simple: a skill is a Markdown file telling the model how to do something, optionally accompanied by extra documents and pre-written scripts." — Simon Willison

**Why it matters:** Skills democratize agent capabilities. Anyone can package domain expertise into a portable folder that Claude loads on demand.

**References:**

- [Introducing Agent Skills](https://www.anthropic.com/news/skills)
- [Agent Skills documentation](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview)
- [Agent Skills API reference](https://docs.anthropic.com/en/api/agent-skills)
- [Skills Cookbook](https://github.com/anthropics/anthropic-cookbook/tree/main/skills)
- [anthropics/skills GitHub repo](https://github.com/anthropics/skills)
- [Simon Willison: Claude Skills are awesome](https://simonwillison.net/2025/Oct/16/claude-skills/)

### October — Memory Rollout

- Memory capabilities rolled out to Max plan users
- Gradual rollout to Pro plans over following weeks
- Claude can remember context across conversations

**References:**

- [Using Claude's chat search and memory](https://support.anthropic.com/en/articles/10334033-using-claude-s-chat-search-and-memory-to-build-on-previous-context)

### October 27 — Claude for Excel (Research Preview) 📊

Anthropic launched **Claude for Excel** as part of its "Advancing Claude for Financial Services" initiative.

**What is it?**

- An Excel **add-in** (sidebar integration, not just a web feature)
- Claude can read, analyze, modify, and create Excel workbooks
- Cell-level citations for verification
- Direct competition with Microsoft Copilot in Excel

**Initial capabilities:**

- Discuss formulas and worksheets
- Debug and fix errors
- Create draft models from scratch
- Populate templates while preserving formulas and structure

**Limitations in research preview:**

- No pivot tables or data validation
- No macros or VBA
- 1,000 initial users (Max, Team, Enterprise)

**New financial services connectors announced:**

- Aiera (earnings calls)
- LSEG (market data)
- Moody's (credit ratings)
- Egnyte (secure document access)
- Chronograph, Third Bridge, MT Newswires

**New financial Agent Skills:**

- Comparable company analysis
- Discounted cash flow models
- Due diligence data packs
- Company teasers and profiles
- Earnings analyses
- Initiating coverage reports

> "Claude for Excel allows users to work directly with Claude in a sidebar in Microsoft Excel, where Claude can read, analyze, modify, and create new Excel workbooks." — Anthropic

**References:**

- [Advancing Claude for Financial Services](https://www.anthropic.com/news/advancing-claude-for-financial-services)
- [Claude for Excel on Microsoft AppSource](https://marketplace.microsoft.com/en-us/product/saas/wa200009404)
- [Claude for Excel Help Center](https://support.claude.com/en/articles/12650343-claude-for-excel)
- [The Register: Anthropic's Claude is learning Excel](https://www.theregister.com/2025/10/28/anthropic_claude_excel/)
- [VentureBeat: Anthropic rolls out Claude AI for finance](https://venturebeat.com/ai/anthropic-rolls-out-claude-ai-for-finance-integrates-with-excel-to-rival)

### November 18 — Microsoft & NVIDIA Partnerships

Major infrastructure deals announced:

- Microsoft and NVIDIA expected to invest up to **$15 billion** in Anthropic
- Anthropic to buy **$30 billion** in Azure compute running on NVIDIA systems
- Claude models available in Microsoft 365 Copilot and Azure AI

**References:**

- [Anthropic partnership announcements](https://www.anthropic.com/news)
- [Claude on Microsoft Azure](https://azure.microsoft.com/en-us/products/ai-services/anthropic)

### November 20 — Advanced Tool Use (Beta) 🛠️

Three features that fundamentally change how agents handle tools:

**1. Tool Search Tool**

The **Tool Search Tool** enables Claude to discover tools on-demand instead of loading all definitions upfront.

**The problem it solves:**

- Large tool libraries consume massive context (Anthropic's internal systems hit 134K tokens in tool definitions)
- Most tools aren't relevant for any given task
- Context bloat leaves less room for actual work

**How it works:**

- Mark tools with `defer_loading: true` — definitions go to API but don't load into context
- Include a Tool Search Tool (regex or BM25-based): `{"type": "tool_search_tool_regex_20251119", "name": "tool_search_tool_regex"}`
- Claude sees only the Tool Search Tool (~500 tokens) plus always-loaded tools
- When Claude needs a capability, it searches and loads only what's needed

**Results:**

- Reduces context from 134K+ tokens to ~500 tokens (85%+ reduction)
- Works with MCP toolsets via `default_config: {"defer_loading": true}`

**Example configuration:**

```json
{
  "tools": [
    {"type": "tool_search_tool_regex_20251119", "name": "tool_search_tool_regex"},
    {
      "name": "github.createPullRequest",
      "description": "Create a pull request",
      "input_schema": {...},
      "defer_loading": true
    }
  ]
}
```

**2. Programmatic Tool Calling**

Claude writes Python code to orchestrate multiple tools, with results processed by script before entering context.

**The problem it solves:**

- Traditional tool calling requires a full inference pass per tool
- Intermediate results pile up in context whether useful or not
- Multi-step workflows become token-expensive

**How it works:**

- Add `allowed_callers: ["code_execution_20250825"]` to tool definitions
- Claude writes Python that calls tools as functions
- Code runs in Code Execution Tool (sandboxed container)
- Script processes/filters results before Claude sees them

**Results:**

- 37%+ token efficiency gains in complex workflows
- Loops, conditionals, and error handling explicit in code
- Only final aggregated results enter context

**3. Tool Use Examples**

Concrete examples (`input_examples` field) improve parameter accuracy beyond what JSON Schema can express.

**The problem it solves:**

- JSON Schema defines structure but can't express usage patterns
- "due_date is a string" doesn't tell Claude the expected format
- Complex nested structures lead to errors

**Results:**

- 72% → 90% accuracy on complex parameter handling (Anthropic internal testing)

> "Anthropic built these features to solve their own problems. Their internal systems hit 134K tokens in tool definitions." — Deb Acharjee

**Why it matters for Skillport:** These features enable Skills to scale. A Skillport marketplace with thousands of Skills becomes practical when Claude can search and load them on-demand.

**References:**

- [Advanced Tool Use engineering blog](https://www.anthropic.com/engineering/advanced-tool-use)
- [Tool Search Tool documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)
- [Programmatic Tool Calling documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)
- [Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Programmatic Tool Calling Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/tool_use/programmatic_tool_calling_ptc.ipynb)
- [Deb Acharjee: Anthropic Just Shipped the Fix for Tool Definition Bloat](https://medium.com/@DebaA/anthropic-just-shipped-the-fix-for-tool-definition-bloat-77464c8dbec9)
- [Arcade: What Anthropic's Tool Search Means for Production AI](https://blog.arcade.dev/anthropic-tool-search-claude-mcp-runtime)

### November 24 — Claude Opus 4.5

The most powerful Claude model released:

- **80.9%** on SWE-bench Verified (agentic coding)
- **66.3%** on OSWorld (computer use)
- **62.3%** on MCP Atlas (scaled tool use)
- Pricing: **$5/$25** per million tokens (down from $15/$75)
- Outperformed human candidates on Anthropic's internal engineering exam

**Platform updates with Opus 4.5:**

- **Plan Mode** in Claude Code — builds editable plan.md before execution
- **Claude Code in desktop app** — run multiple local/remote sessions
- **Context window compaction** — infinite-length conversations via automatic summarization
- **Claude for Excel GA** — now with pivot tables, charts, file uploads (available to Max, Team, Enterprise)
- **Claude for Chrome** — browser automation for Max users

**References:**

- [Introducing Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5)
- [Claude Opus 4.5 System Card](https://www.anthropic.com/research/claude-opus-4-5-system-card)
- [TechCrunch: Anthropic releases Opus 4.5 with new Chrome and Excel integrations](https://techcrunch.com/2025/11/24/anthropic-releases-opus-4-5-with-new-chrome-and-excel-integrations/)
- [MacRumors: Anthropic Launches Claude Opus 4.5](https://www.macrumors.com/2025/11/24/anthropic-claude-opus-4-5/)

### November 25 — MCP One-Year Anniversary Spec Release

Major protocol update:

- **Asynchronous operations**
- **Statelessness support**
- **Server identity**
- **Official extensions framework**
- **MCP Registry** — community index with ~2,000 servers
- **97M+ monthly SDK downloads** (Python + TypeScript)

**References:**

- [One Year of MCP: November 2025 Spec Release](https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/)
- [MCP Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)

### December 9 — MCP Donated to Linux Foundation 🏛️

Anthropic donated MCP to the **Agentic AI Foundation (AAIF)**, a directed fund under the Linux Foundation.

**Co-founders:**

- Anthropic
- Block (Square)
- OpenAI

**Supporting members:**

- Google
- Microsoft
- Amazon Web Services
- Cloudflare
- Bloomberg

**Founding projects:**

- **MCP** (Anthropic)
- **goose** (Block)
- **AGENTS.md** (OpenAI)

> "This is the 'HTTP moment' for AI. Just as HTTP enabled the World Wide Web, MCP provides the foundation for an 'Agentic Web' where autonomous entities can collaborate across organizational boundaries."

**References:**

- [Donating the Model Context Protocol and establishing the Agentic AI Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)
- [MCP joins the Agentic AI Foundation](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/)

### December 3 — Bun Acquisition & $1B Milestone

- Anthropic acquired **Bun** (JavaScript runtime, 7M+ monthly downloads, 82K GitHub stars)
- Claude Code reached **$1B annual run-rate revenue** in November — 6 months after GA
- Bun remains open source (MIT licensed)

**References:**

- [Anthropic acquires Bun announcement](https://www.anthropic.com/news)

### December 3 — Snowflake Partnership

$200 million multi-year partnership:

- Claude models available to 12,600+ Snowflake customers
- Claude Sonnet 4.5 powers Snowflake Intelligence
- > 90% accuracy on complex text-to-SQL tasks

**References:**

- [Snowflake and Anthropic partnership announcement](https://www.anthropic.com/news)

### December 18 — Agent Skills Open Standard 📦

Anthropic released **Agent Skills as an open standard**:

**What's new:**

- **Portable across platforms** — Skills work in Claude, ChatGPT, Cursor, and any adopting platform
- **Organization-wide management** — Enterprise admins can centrally provision Skills
- **Partner Skills directory** — Atlassian, Canva, Cloudflare, Figma, Notion, Ramp, Sentry

**Partner integrations:**

- **Atlassian** — "Claude doesn't just see Jira tickets or Confluence pages; it knows what to do"
- **Box** — Transform files into presentations/spreadsheets following org standards
- **Canva** — Customize agents for design workflows

> "With the open Agent Skills standard, we're radically expanding the ability to create and deploy shareable, simple-to-implement, powerful, and portable skills — accessible by all." — Anthropic

**References:**

- [Agent Skills December update](https://www.anthropic.com/news/skills)
- [Agent Skills: Anthropic's Next Bid to Define AI Standards](https://thenewstack.io/agent-skills-anthropics-next-bid-to-define-ai-standards/)
- [Axios: Anthropic's Claude chatbot gets update](https://www.axios.com/2025/12/18/anthropic-claude-enterprise-skills-update)

---

## Key Metrics (End of 2025)

| Metric                  | Value                          |
| ----------------------- | ------------------------------ |
| Claude Code ARR         | $1B+ (November)                |
| MCP SDK downloads       | 97M+/month                     |
| MCP servers in registry | ~2,000                         |
| Enterprise market share | 40% (Menlo Ventures)           |
| Coding market share     | 54% (Menlo Ventures)           |
| Anthropic valuation     | $183B+ (Series F)              |
| Annual revenue          | $5B+ (up from $1B in 8 months) |

---

## The Skillport Opportunity

Looking at 2025's trajectory, several things become clear:

1. **Skills are the new plugins** — but portable, standardized, and agent-native
2. **MCP won** — it's now industry infrastructure, not a competitive advantage
3. **The gap is distribution** — Skills exist, but there's no marketplace
4. **Enterprise needs governance** — admin controls for Skills just shipped in December
5. **Tool Search enables scale** — thousands of Skills become practical with on-demand loading

Skillport sits at the intersection of these trends: a **marketplace for Claude Skills** that works across surfaces (Claude.ai, Claude Code, API) with the distribution and governance that enterprises need.

The primitives are in place. Tool Search Tool makes discovery scalable. The Agent SDK makes building Skills accessible. The open standard makes Skills portable. What's missing is the marketplace.

---

## Timeline Quick Reference

| Date   | Release                        | Key Feature                                            | Reference                                                                                                                |
| ------ | ------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Feb 24 | Claude 3.7 Sonnet              | Extended thinking, Claude Code preview                 | [Link](https://www.anthropic.com/news/claude-3-7-sonnet)                                                                 |
| Mar 26 | OpenAI MCP support             | Industry adoption inflection point                     | [Link](https://x.com/sama/status/1904957253247152129)                                                                    |
| May 22 | Claude 4                       | MCP in API, web search, Files API, Code Execution Tool | [Link](https://www.anthropic.com/news/claude-4)                                                                          |
| May 22 | API capabilities               | Code Execution, MCP Connector, Files API, 1hr cache    | [Link](https://www.anthropic.com/news/agent-capabilities-api)                                                            |
| Aug 5  | Opus 4.1                       | 74.5% SWE-bench                                        | [Link](https://www.anthropic.com/claude/opus)                                                                            |
| Aug 25 | Code Execution update          | Bash + file ops (`code_execution_20250825`)            | [Link](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool)                                |
| Sep 9  | Create and edit files          | Skills-powered file creation (preview)                 | [Link](https://www.anthropic.com/news/create-files)                                                                      |
| Sep 29 | Sonnet 4.5 + Agent SDK         | 77.2% SWE-bench, SDK for all                           | [Link](https://www.anthropic.com/news/claude-sonnet-4-5)                                                                 |
| Oct 15 | Haiku 4.5                      | Fast sub-agent model                                   | [Link](https://www.anthropic.com/claude/haiku)                                                                           |
| Oct 16 | **Skills launch**              | Public Skills + /v1/skills API                         | [Link](https://www.anthropic.com/news/skills)                                                                            |
| Oct 21 | Create and edit files GA       | Network/egress controls for paid plans                 | [Link](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude)                                |
| Oct 27 | **Claude for Excel**           | Excel add-in (research preview)                        | [Link](https://www.anthropic.com/news/advancing-claude-for-financial-services)                                           |
| Nov 20 | **Advanced Tool Use**          | Tool Search Tool, Programmatic Tool Calling            | [Link](https://www.anthropic.com/engineering/advanced-tool-use)                                                          |
| Nov 24 | Opus 4.5                       | 80.9% SWE-bench, $5/$25 pricing, Excel GA              | [Link](https://www.anthropic.com/news/claude-opus-4-5)                                                                   |
| Nov 25 | MCP Nov spec                   | Async ops, registry, extensions                        | [Link](https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/)                                     |
| Dec 3  | Bun acquisition                | Claude Code $1B ARR                                    | [Link](https://www.anthropic.com/news)                                                                                   |
| Dec 9  | MCP → Linux Foundation         | AAIF with OpenAI, Block, Google, Microsoft             | [Link](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) |
| Dec 18 | **Agent Skills open standard** | Portable Skills, enterprise admin                      | [Link](https://www.anthropic.com/news/skills)                                                                            |

---

## Additional Resources

### Official Documentation

- [Tool Use Overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
- [Code Execution Tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool)
- [Tool Search Tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)
- [Programmatic Tool Calling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)
- [Agent Skills Overview](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview)
- [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25)

### Engineering Blogs

- [Advanced Tool Use](https://www.anthropic.com/engineering/advanced-tool-use)
- [Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Building Agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)

### Cookbooks & Examples

- [Claude Cookbooks (GitHub)](https://github.com/anthropics/claude-cookbooks)
- [Programmatic Tool Calling Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/tool_use/programmatic_tool_calling_ptc.ipynb)
- [Skills Cookbook](https://github.com/anthropics/anthropic-cookbook/tree/main/skills)
- [anthropics/skills marketplace](https://github.com/anthropics/skills)

### Developer Platform

- [Claude Developer Platform Release Notes](https://platform.claude.com/docs/en/release-notes/overview)
- [Anthropic Academy](https://www.anthropic.com/learn/build-with-claude)

### Third-Party Analysis

- [Simon Willison: Claude's Code Interpreter](https://simonwillison.net/2025/Sep/9/claude-code-interpreter/)
- [Deb Acharjee: Fix for Tool Definition Bloat](https://medium.com/@DebaA/anthropic-just-shipped-the-fix-for-tool-definition-bloat-77464c8dbec9)
- [Arcade: What Tool Search Means for Production AI](https://blog.arcade.dev/anthropic-tool-search-claude-mcp-runtime)

---

_Last updated: January 5, 2026_
