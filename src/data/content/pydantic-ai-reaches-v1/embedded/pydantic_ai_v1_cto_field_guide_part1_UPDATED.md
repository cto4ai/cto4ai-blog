# Pydantic AI v1 — CTO Field Guide (Part 1: Core + Comparison)

_Last updated: 2025-09-13 (America/Chicago)_

## TL;DR

- **What it is:** a Python **agent framework** from the Pydantic team that brings FastAPI‑style ergonomics, **type‑safe I/O**, and **dependency injection** to LLM apps. It’s **provider‑agnostic**, integrates with **MCP**, **AG‑UI**, and **OpenTelemetry/Logfire**, and now ships **v1 API stability**.  
  Sources: [Docs](https://ai.pydantic.dev/), [V1 announcement](https://pydantic.dev/articles/pydantic-ai-v1), [Changelog & stability policy](https://ai.pydantic.dev/changelog/)
- **Niche:** developer‑centric, typed agents with first‑class observability and production surfaces (durable execution, human‑in‑the‑loop UI protocol). Competitors include **LangGraph**, **LlamaIndex**, **Semantic Kernel**, **DSPy**, **CrewAI**.  
  Sources: [LangGraph](https://www.langchain.com/langgraph), [LlamaIndex Agents](https://docs.llamaindex.ai/en/stable/use_cases/agents/), [Semantic Kernel Agent Framework](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/), [DSPy](https://dspy.ai/), [CrewAI](https://docs.crewai.com/concepts/agents)

---

## What is Pydantic AI?

Pydantic AI is a **GenAI agent framework** for Python that emphasizes **type‑safety**, **validation**, and **developer ergonomics** (think: _FastAPI for agents_). You define an `Agent` with clear **input/output types**, add **function tools**, wire **dependencies** via DI, and run on **any supported model provider**.

- **Homepage / Docs:** [ai.pydantic.dev](https://ai.pydantic.dev/)
- **Agents (concepts & API):** [Concepts](https://ai.pydantic.dev/agents/), [API](https://ai.pydantic.dev/api/agent/)
- **Dependency Injection:** [Dependencies](https://ai.pydantic.dev/dependencies/)
- **Model providers:** [Overview](https://ai.pydantic.dev/models/overview/)

### Why it matters

- **Type‑checked outputs** reduce brittle prompt‑parsing.
- **DI** keeps tools and prompts clean and testable.
- **Provider‑agnostic** lets you swap models without rewriting app code.
- **Observability** via OpenTelemetry + **Pydantic Logfire** gives you traces/spans of prompts, tool calls, and model requests.  
  Sources: [Logfire docs](https://ai.pydantic.dev/logfire/), [Logfire product](https://pydantic.dev/logfire)

---

## The niche it fills (and who else is in it)

**Pydantic AI** focuses on **typed, testable, production‑grade agents** with built‑in **observability** and **durability**.

| Framework           | Sweet Spot                                          | Typing/DI                              | Orchestration                                                     | Standards & UX                              | Observability                               |
| ------------------- | --------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| **Pydantic AI**     | Typed agents; DI; portability                       | Strong (Pydantic types, DI)            | Graphs & multi‑agent patterns; **durable exec** via Temporal/DBOS | **MCP** (client/server), **AG‑UI**, **A2A** | **OTel** + **Logfire**; other OTel backends |
| **LangGraph**       | Complex agent workflows/state machines              | Pythonic types; DI N/A                 | Graph orchestration, stateful agents                              | Human‑in‑loop & “time‑travel” in platform   | LangSmith integration (platform)            |
| **LlamaIndex**      | Data/RAG‑heavy apps; agents + workflows             | Pythonic types; DI varies              | Workflows + agents                                                | Ecosystem tools, LlamaCloud                 | LlamaCloud / community tools                |
| **Semantic Kernel** | Enterprise SDK across C#/.NET, Python, Java         | SDK types; plugin system               | Single/multi‑agent patterns                                       | Plugin ecosystem                            | Azure/enterprise integrations               |
| **DSPy**            | Programmatic LLM pipelines w/ auto‑compile/evals    | Declarative modules, compiles programs | Pipelines; can drive agent loops                                  | Research‑centric; evals/optimizers          | Ecosystem integrations                      |
| **CrewAI**          | Multi‑agent “crews”, YAML first, enterprise builder | Pydantic models for structured output  | Crew/flow orchestration                                           | MCP integrations; visual builder            | Integrates with Langfuse/others             |

Sources: [LangGraph](https://www.langchain.com/langgraph), [LlamaIndex Agents](https://docs.llamaindex.ai/en/stable/use_cases/agents/), [Semantic Kernel Agent Framework](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/), [DSPy](https://dspy.ai/), [CrewAI Agents](https://docs.crewai.com/concepts/agents)

> **Positioning takeaway:** If you want **Python‑native typing/validation**, clear **DI**, **portable providers**, **open standards** (MCP/A2A/OTel) and **observability** out‑of‑the‑box, Pydantic AI is the most “software‑engineering‑friendly” choice right now.

---

### When would I use Pydantic AI? (versus alternatives)

| Scenario                                                                               | Choose **Pydantic AI** if…                                                                              | Consider **Alternative(s)**                                  | Notes                                                                          |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Typed contracts to your app (strict JSON / enums / schemas); easy testing              | You want first-class typing/validation and FastAPI-style DI, and you’ll swap providers without rewrites | LangGraph + Pydantic models; DSPy for programmatic pipelines | Pydantic AI’s type safety + DI keeps tools/business logic clean and testable   |
| Complex, stateful **multi-agent graphs** with node-level checkpointing and time-travel | Your graph is moderate and you prefer plain Python + DI                                                 | **LangGraph**                                                | LangGraph excels at large graphs and recovery tooling                          |
| Heavy **RAG / knowledge** work (indexes, retrievers, query engines)                    | You’ll still orchestrate agents/tools in Python and plug retrieval underneath                           | **LlamaIndex**, LangChain RAG                                | Use Pydantic AI for the agent layer; call into a RAG lib as a tool             |
| **Cross-language** enterprise SDKs (C#, Java) and Azure tilt                           | You’re all-Python today                                                                                 | **Semantic Kernel**                                          | SK shines when you need multi-language parity and Azure integrations           |
| **Auto-optimization** of prompts/pipelines; researchy LLM programming                  | You want app-level agents more than compiler-style optimization                                         | **DSPy**                                                     | Pairing Pydantic AI + DSPy is common: DSPy optimizes, Pydantic AI orchestrates |
| Standards-forward UX & tools (**MCP**, **AG-UI**, **A2A**)                             | You want out-of-box MCP tools/servers and a consistent agent↔UI protocol                                | LangGraph (platform features), CrewAI (builder)              | Pydantic AI bakes MCP/AG-UI/A2A into the core story                            |
| **Observability-first** (OpenTelemetry, redaction, cost/trace views)                   | You want vendor-neutral OTel plus deep **Logfire** hooks                                                | LangSmith (LangChain), Langfuse/Weave (3rd-party)            | Pydantic AI has OTel primitives; Logfire adds rich traces/costs                |
| **Durable execution** / human-in-loop over hours–days                                  | You like Temporal/DBOS-style durability with Python code                                                | LangGraph (checkpointing), bespoke workflow engines          | Pydantic AI documents Temporal/DBOS patterns for robust durability             |
| Python/FastAPI shop, want **simple DI** and clean test seams                           | Your team’s muscle memory is Pydantic/FastAPI                                                           | —                                                            | Lowest friction path for Python backends                                       |
| **Low-code** multi-agent builder for non-dev teammates                                 | You want a visual builder & hosted flows                                                                | **CrewAI** (builder), LangGraph Studio                       | Pydantic AI is code-first; great for engineers, less for no-code               |

---

### Quick checklist: use Pydantic AI when…

- You need **typed, validated outputs/tools** (schemas, enums, auto‑retry on schema fail).
- You want **FastAPI‑style DI** to inject DB clients, secrets, and services cleanly.
- You need **provider portability** (OpenAI ↔ Anthropic ↔ Groq/Bedrock/HF) without rewrites.
- You care about **observability from day 1** (OpenTelemetry + optional Logfire, cost/redaction).
- You need **durable/human‑in‑loop flows** or **standards** like **MCP**/**AG‑UI**/**A2A**.

---

## What’s new & unique in **v1**

- **API Stability Commitment** — _no breaking changes until v2 (earliest April 2026)_.  
  Source: [Changelog & policy](https://ai.pydantic.dev/changelog/)
- **Observability as a first‑class citizen** — native **OpenTelemetry** spans; optional **Logfire** with deep views and HTTP capture.  
  Source: [Logfire docs](https://ai.pydantic.dev/logfire/)
- **Open standards baked in** — **MCP**, **AG‑UI**, **A2A**.  
  Sources: [MCP](https://ai.pydantic.dev/mcp/), [AG‑UI](https://ai.pydantic.dev/ag-ui/), [A2A](https://ai.pydantic.dev/a2a/)
- **Durable execution** — examples for **Temporal** and **DBOS**.  
  Sources: [Overview](https://ai.pydantic.dev/durable_execution/overview/), [Temporal](https://ai.pydantic.dev/durable_execution/temporal/), [DBOS](https://ai.pydantic.dev/durable_execution/dbos/)
- **Provider‑agnostic models** — OpenAI/Anthropic/Gemini/Groq/Mistral/Cohere/Bedrock/HF.  
  Source: [Model providers](https://ai.pydantic.dev/models/overview/)

---

## Quick mental model (how it fits together)

- **Agent**: typed instructions + tools + output type.  
  Source: [Agents](https://ai.pydantic.dev/agents/)
- **Tools**: Python functions; input/return types enforce structure; DI injects clients/secrets.  
  Source: [Function Tools](https://ai.pydantic.dev/tools/function_tools/)
- **Dependencies (DI)**: dataclass or Pydantic model passed to runs and tools.  
  Source: [Dependencies](https://ai.pydantic.dev/dependencies/)
- **Providers**: defined by string IDs (e.g., `openai:gpt‑4o`, `anthropic:claude‑3‑5`).  
  Source: [Providers](https://ai.pydantic.dev/models/overview/)
- **Observability/Durability/UX**: OTel + Logfire; Temporal/DBOS; MCP & AG‑UI.  
  Sources: [Logfire](https://ai.pydantic.dev/logfire/), [Durable exec](https://ai.pydantic.dev/durable_execution/overview/), [MCP](https://ai.pydantic.dev/mcp/), [AG‑UI](https://ai.pydantic.dev/ag-ui/)

---
