# Pydantic AI v1 — CTO Field Guide

*Last updated: 2025‑09‑09 (America/Chicago)*

## TL;DR
- **What it is:** a Python **agent framework** from the Pydantic team that brings FastAPI‑style ergonomics, **type‑safe I/O**, and **dependency injection** to LLM apps. It’s **provider‑agnostic**, integrates with **MCP**, **AG‑UI**, and **OpenTelemetry/Logfire**, and now ships **v1 API stability**.  
  Sources: [Docs](https://ai.pydantic.dev/), [V1 announcement](https://pydantic.dev/articles/pydantic-ai-v1), [Changelog & stability policy](https://ai.pydantic.dev/changelog/)
- **Niche:** developer‑centric, typed agents with first‑class observability and production surfaces (durable execution, human‑in‑the‑loop UI protocol). Competitors include **LangGraph**, **LlamaIndex**, **Semantic Kernel**, **DSPy**, **CrewAI**.  
  Sources: [LangGraph](https://www.langchain.com/langgraph), [LlamaIndex Agents](https://docs.llamaindex.ai/en/stable/use_cases/agents/), [Semantic Kernel Agent Framework](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/), [DSPy](https://dspy.ai/), [CrewAI](https://docs.crewai.com/concepts/agents)
- **When to use:** when you want **typed outputs**, **clean DI**, **portable models**, **structured tool calling**, **observability** and **durability** without wiring everything from scratch.
- **What’s new/unique in v1:** API stability (no breaking changes until v2), deeper **Logfire/OTel** integration, **MCP** (tools as servers/clients), **AG‑UI** (agent↔user protocol), and **durable execution** with **Temporal**/**DBOS**.  
  Sources: [V1 post](https://pydantic.dev/articles/pydantic-ai-v1), [Logfire integration](https://ai.pydantic.dev/logfire/), [MCP](https://ai.pydantic.dev/mcp/), [AG‑UI](https://ai.pydantic.dev/ag-ui/), [Durable execution overview](https://ai.pydantic.dev/durable_execution/overview/)

---

## What is Pydantic AI?
Pydantic AI is a **GenAI agent framework** for Python that emphasizes **type‑safety**, **validation**, and **developer ergonomics** (think: *FastAPI for agents*). You define an `Agent` with clear **input/output types**, add **function tools**, wire **dependencies** via DI, and run on **any supported model provider**.

- **Homepage / Docs:** [ai.pydantic.dev](https://ai.pydantic.dev/)
- **Agents (concepts & API):** [Concepts](https://ai.pydantic.dev/agents/), [API](https://ai.pydantic.dev/api/agent/)
- **Dependency Injection:** [Dependencies](https://ai.pydantic.dev/dependencies/)
- **Model providers (OpenAI, Anthropic, Gemini, Groq, Mistral, Cohere, Bedrock, HF):** [Overview](https://ai.pydantic.dev/models/overview/)
- **Install:** [pip/uv instructions](https://ai.pydantic.dev/install/)

### Why it matters
- **Type‑checked outputs** reduce brittle prompt‑parsing.  
- **DI** keeps tools and prompts clean and testable.  
- **Provider‑agnostic** lets you swap models without rewriting app code.  
- **Observability** via OpenTelemetry + **Pydantic Logfire** gives you traces/spans of prompts, tool calls, and model requests.  
  Sources: [Logfire docs](https://ai.pydantic.dev/logfire/), [Logfire product](https://pydantic.dev/logfire)

---

## The niche it fills (and who else is in it)
**Pydantic AI** focuses on **typed, testable, production‑grade agents** with built‑in **observability** and **durability**.

| Framework | Sweet Spot | Typing/DI | Orchestration | Standards & UX | Observability |
|---|---|---|---|---|---|
| **Pydantic AI** | Typed agents; DI; portability | Strong (Pydantic types, DI) | Graphs & multi‑agent patterns; **durable exec** via Temporal/DBOS | **MCP** (client/server), **AG‑UI**, **A2A** | **OTel** + **Logfire**; other OTel backends |
| **LangGraph** | Complex agent workflows/state machines | Pythonic types; DI N/A | Graph orchestration, stateful agents | Human‑in‑loop & “time‑travel” in platform | LangSmith integration (platform) |
| **LlamaIndex** | Data/RAG‑heavy apps; agents + workflows | Pythonic types; DI varies | Workflows + agents | Ecosystem tools, LlamaCloud | LlamaCloud / community tools |
| **Semantic Kernel** | Enterprise SDK across C#/.NET, Python, Java | SDK types; plugin system | Single/multi‑agent patterns | Plugin ecosystem | Azure/enterprise integrations |
| **DSPy** | Programmatic LLM pipelines w/ auto‑compile/evals | Declarative modules, compiles programs | Pipelines; can drive agent loops | Research‑centric; evals/optimizers | Ecosystem integrations |
| **CrewAI** | Multi‑agent “crews”, YAML first, enterprise builder | Pydantic models for structured output | Crew/flow orchestration | MCP integrations; visual builder | Integrates with Langfuse/others |

Sources: [LangGraph](https://www.langchain.com/langgraph), [LlamaIndex Agents](https://docs.llamaindex.ai/en/stable/use_cases/agents/), [Semantic Kernel Agent Framework](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/), [DSPy](https://dspy.ai/), [CrewAI Agents](https://docs.crewai.com/concepts/agents)

> **Positioning takeaway:** If you want **Python‑native typing/validation**, clear **DI**, **portable providers**, **open standards** (MCP/A2A/OTel) and **observability** out‑of‑the‑box, Pydantic AI is the most “software‑engineering‑friendly” choice right now.

---

## When would I use it?
Use Pydantic AI when you need:
- **Structured outputs** (e.g., JSON/objects validated by Pydantic) without regex‑wrangling.  
- **Non‑trivial tools** that need authenticated clients, DB handles, feature flags, etc. supplied via **DI**.  
- **Provider portability** (OpenAI ↔ Anthropic ↔ Groq ↔ Bedrock ↔ …).  
- **Production rails**:
  - **Observability** (OTel/Logfire; optional redaction of prompts/completions).  
    Source: [Logfire integration](https://ai.pydantic.dev/logfire/)
  - **Durability & retries** for long‑running/human‑in‑loop flows using **Temporal** or **DBOS**.  
    Sources: [Durable exec overview](https://ai.pydantic.dev/durable_execution/overview/), [Temporal](https://ai.pydantic.dev/durable_execution/temporal/), [DBOS](https://ai.pydantic.dev/durable_execution/dbos/)
  - **UI protocol** to build interactive UIs with consistent state handling (**AG‑UI**).  
    Source: [AG‑UI](https://ai.pydantic.dev/ag-ui/)
  - **Tooling standardization** via **MCP** (consume or host MCP servers).  
    Source: [MCP](https://ai.pydantic.dev/mcp/)
- **Evaluation & testing**: Pydantic AI ships example suites and integrates with **Pydantic Evals** and OTel.  
  Sources: [Examples](https://ai.pydantic.dev/examples/setup/), [Changelog mentions tracing/evals](https://ai.pydantic.dev/changelog/)

---

## What’s new & unique in **v1**
- **API Stability Commitment** — *no breaking changes until v2 (earliest April 2026)*, with security fixes for v1 afterward.  
  Source: [Changelog & policy](https://ai.pydantic.dev/changelog/)
- **Observability as a first‑class citizen** — native **OpenTelemetry** spans for model calls & tools; **opt‑in Logfire** with deep views and HTTP capture; supports third‑party OTel backends (Langfuse, W&B Weave, Arize, etc.).  
  Source: [Logfire docs](https://ai.pydantic.dev/logfire/)
- **Open standards baked in** — **MCP** (Model Context Protocol), **AG‑UI** (Agent‑User Interaction), and **A2A** (Agent‑to‑Agent).  
  Sources: [MCP](https://ai.pydantic.dev/mcp/), [AG‑UI](https://ai.pydantic.dev/ag-ui/), [A2A](https://ai.pydantic.dev/a2a/)
- **Durable execution** — official integrations & examples for **Temporal** and **DBOS** to survive crashes/restarts and checkpoint long workflows.  
  Sources: [Overview](https://ai.pydantic.dev/durable_execution/overview/), [Temporal](https://ai.pydantic.dev/durable_execution/temporal/), [DBOS](https://ai.pydantic.dev/durable_execution/dbos/)
- **Provider‑agnostic models** — built‑ins for OpenAI/Anthropic/Gemini/Groq/Mistral/Cohere/Bedrock/HF.  
  Source: [Model providers](https://ai.pydantic.dev/models/overview/)
- **V1 release details** — tagged releases and announcement.  
  Sources: [V1 blog](https://pydantic.dev/articles/pydantic-ai-v1), [GitHub releases](https://github.com/pydantic/pydantic-ai/releases), [PyPI](https://pypi.org/project/pydantic-ai/), [X announcement](https://x.com/pydantic/status/1963759560524550230)

---

## Quick mental model (how it fits together)
- **Agent**: typed instructions + tools + output type.  
  Source: [Agents](https://ai.pydantic.dev/agents/)  
- **Tools**: normal Python functions; input/return types enforce structure; DI injects clients/secrets.  
  Source: [Function Tools](https://ai.pydantic.dev/tools/function_tools/)  
- **Dependencies (DI)**: dataclass or Pydantic model passed to runs and tools; keeps global state out of prompts.  
  Source: [Dependencies](https://ai.pydantic.dev/dependencies/)  
- **Providers**: `"openai:gpt‑4o"`, `"anthropic:claude‑3‑5"`, etc.  
  Source: [Providers](https://ai.pydantic.dev/models/overview/)  
- **Observability**: OTel spans with optional Logfire backend; can redact prompts/completions.  
  Source: [Logfire](https://ai.pydantic.dev/logfire/)  
- **Durability**: run agents inside Temporal/DBOS workflows.  
  Sources: [Temporal](https://ai.pydantic.dev/durable_execution/temporal/), [DBOS](https://ai.pydantic.dev/durable_execution/dbos/)  
- **Standards**: **MCP** for tools and **AG‑UI** for interactive UX; **A2A** for interop between agent systems.  
  Sources: [MCP](https://ai.pydantic.dev/mcp/), [AG‑UI](https://ai.pydantic.dev/ag-ui/), [A2A](https://ai.pydantic.dev/a2a/)

---

## Light comparison notes
**Pydantic AI vs. LangGraph**  
- Choose **Pydantic AI** if you value typing/DI, provider portability and OTel/Logfire out‑of‑box.  
- Choose **LangGraph** if your primary challenge is **complex multi‑agent orchestration** with checkpointing/state machines (and you’re okay leaning on LangSmith/Platform).  
  Source: [LangGraph overview](https://www.langchain.com/langgraph)

**Pydantic AI vs. LlamaIndex**  
- Choose **Pydantic AI** for typed agents + DI and provider portability.  
- Choose **LlamaIndex** when your app is **RAG/data‑heavy** and you want its retrieval ecosystem/workflows.  
  Source: [LlamaIndex Agents](https://docs.llamaindex.ai/en/stable/use_cases/agents/)

**Pydantic AI vs. Semantic Kernel**  
- Choose **Pydantic AI** for Python‑first ergonomics and DI;  
- Choose **SK** if you need **multi‑language SDKs** and Azure‑oriented enterprise patterns.  
  Sources: [SK Agent Framework](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/), [SK overview](https://learn.microsoft.com/en-us/semantic-kernel/overview/)

**Pydantic AI vs. DSPy**  
- Choose **Pydantic AI** for app‑level agents;  
- Choose **DSPy** when you want **programmatic pipelines** that *compile* to better prompts/weights and integrate into your stack for optimization/evals.  
  Sources: [DSPy](https://dspy.ai/), [DSPy paper](https://arxiv.org/abs/2310.03714)

**Pydantic AI vs. CrewAI**  
- Choose **Pydantic AI** when you want typed agents + DI and standards (MCP/AG‑UI/A2A);  
- Choose **CrewAI** for multi‑agent “crew” orchestration and visual builder/enterprise features.  
  Source: [CrewAI Agents](https://docs.crewai.com/concepts/agents)

---

## Recent podcast & video appearances (last ~60–90 days)
- **Software Engineering Radio #676** — *Samuel Colvin on Pydantic & Pydantic AI* (2025‑07‑10).  
  Links: [Episode page](https://www.se-radio.net/2025/07/se-radio-episode-676-samuel-colvin-on-pydantic-and-pydantic-ai/), [Apple Podcasts](https://podcasts.apple.com/us/podcast/se-radio-episode-676-samuel-colvin-on-pydantic-and/id120906714?i=1000673312981)
- **YouTube (Pydantic channel):** *Pydantic AI — MCP Sampling* (published ~2 months ago).  
  Link: [Video](https://www.youtube.com/watch?v=DduQNX9P1zk)
- **YouTube (AI Engineer World’s Fair):** *MCP is all you need — Samuel Colvin* (published ~2–3 months ago).  
  Link: [Video](https://www.youtube.com/watch?v=0a76UPtM1DM)

> If you want a tighter 60–90 day window by exact publish date, use the episode/video timestamps above; all are in the late‑July to mid‑summer 2025 window.

---

## Release notes & ecosystem links
- **V1 announcement (2025‑09‑04):** [Blog post](https://pydantic.dev/articles/pydantic-ai-v1)
- **Releases:** [GitHub releases](https://github.com/pydantic/pydantic-ai/releases), [PyPI](https://pypi.org/project/pydantic-ai/)
- **Stability policy:** [Changelog (V1 policy & timeline)](https://ai.pydantic.dev/changelog/)
- **Observability:** [Logfire docs](https://ai.pydantic.dev/logfire/), [Logfire product](https://pydantic.dev/logfire)
- **Standards:** [MCP](https://ai.pydantic.dev/mcp/), [AG‑UI](https://ai.pydantic.dev/ag-ui/), [A2A](https://ai.pydantic.dev/a2a/)
- **Durability:** [Overview](https://ai.pydantic.dev/durable_execution/overview/), [Temporal](https://ai.pydantic.dev/durable_execution/temporal/), [DBOS](https://ai.pydantic.dev/durable_execution/dbos/)
- **Examples:** [How to run them](https://ai.pydantic.dev/examples/setup/)

---

## Editor’s angle (for cto4.ai)
If you like **FastAPI** and **Pydantic**, this is the closest thing to that experience for agents: you get **deterministic interfaces** (types), **clean injection** of real services, **model portability**, and **production add‑ons** (OTel, Logfire, MCP, AG‑UI, Temporal/DBOS) that reduce time‑to‑prod. The trade‑off vs. a heavy orchestration platform is that you’ll compose more of your own workflow control—by design, it keeps you in normal Python.

