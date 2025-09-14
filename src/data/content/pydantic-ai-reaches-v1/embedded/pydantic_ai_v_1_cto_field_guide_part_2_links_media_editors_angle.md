# Pydantic AI v1 — CTO Field Guide (Part 2: Links, Media, Editor’s Angle)

*Last updated: 2025‑09‑13 (America/Chicago)*

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
  Links: [Episode page](https://se-radio.net/2025/07/se-radio-676-samuel-colvin-on-the-pydantic-ecosystem/), [Apple Podcasts](https://podcasts.apple.com/tt/podcast/se-radio-676-samuel-colvin-on-the-pydantic-ecosystem/id120906714?i=1000716721772)
- **YouTube (Pydantic channel):** *Pydantic AI — MCP Sampling* (published ~2 months ago).  
  Link: [Video](https://www.youtube.com/watch?v=3AK7kznOl3k)
- **YouTube (AI Engineer World’s Fair):** *MCP is all you need — Samuel Colvin* (published ~2–3 months ago).  
  Link: [Video](https://www.youtube.com/watch?v=bmWZk9vTze0)

> If you want a tighter 60–90 day window by exact publish date, use the timestamps above.

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

---

*END OF DOCUMENT*

