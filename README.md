# 🚀 ElasticHR Copilot

Governed AI-powered HR intelligence via Slack + Elastic.

ElasticHR Copilot is a multi-agent HR analytics platform that transforms Slack into a secure, intelligent HR command center for HR and business leaders. Built on Elastic Serverless with ES|QL, it lets teams query workforce data in natural language while maintaining strict index-level governance and data control. Instead of static dashboards, ElasticHR Copilot delivers real-time, conversational HR intelligence directly inside Slack.

---

## 🧩 Architecture

At a high level, ElasticHR Copilot consists of:

- **Slack Bot layer** – Handles user messages, parses intent, and routes each request to the appropriate HR analytics agent.  
- **Elastic Agent Builder** – Lets HR leadership configure and govern multiple agents (HR Insights, Performance Intelligence, Compensation Analytics) using a multi-agent builder UI.  
- **Elastic Serverless + ES|QL** – Executes structured ES|QL queries against governed HR indices such as `hr_employees`, `hr_performance`, and `hr_leaves`.  
- **Governance layer** – Ensures that every query is scoped to authorized indices and respects HR data access policies.  

Data flow:

1. A user asks a workforce question in Slack.  
2. The Slack bot parses the intent and selects the right HR agent.  
3. The agent generates one or more ES|QL queries over governed HR indices.  
4. Elastic Serverless executes these queries and returns results.  
5. The bot renders the results back in Slack as messages, tables, or summaries.

---

## 💡 What It Solves

Modern HR teams struggle with:

- Fragmented workforce data across multiple systems  
- Static dashboards with limited drill-down and flexibility  
- Slow, manual access to leadership insights  
- Lack of governed AI over sensitive employee data  

ElasticHR Copilot addresses this by combining:

- ⚡ Elastic Serverless (ES|QL-powered analytics)  
- 🤖 Multi-agent intelligence via Elastic Agent Builder  
- 💬 Slack-based conversational interface  
- 🔐 Controlled access to governed HR indices  

---

## ⚙️ How It Works

1. A user asks a workforce question in Slack (for example, “Show attrition trend for engineering in Q4”).  
2. The Slack bot parses the user intent and routes the query to the right HR agent.  
3. The selected agent generates structured ES|QL queries based on governed HR schemas.  
4. Elastic Serverless executes those ES|QL queries against authorized HR indices.  
5. Results are formatted (tables, charts, summaries) and sent back to the Slack channel or DM.  
6. All queries are scoped to governed indices such as:
   - `hr_employees`  
   - `hr_performance`  
   - `hr_leaves`  

---


## 🔧 Serverless Configuration Alignment

To keep this project aligned with **Elastic Serverless** deployments, use these environment variables:

- `ELASTIC_SERVERLESS_ENDPOINT` (recommended)
- `ELASTIC_API_KEY`
- `ELASTIC_INFERENCE_ID` (optional, defaults to `.openai-gpt-4.1-mini-chat_completion`)

`ELASTIC_URL` is still supported as a backward-compatible fallback.

---

## 🎯 Key Capabilities

- 📊 Workforce analytics in natural language  
- 📈 Attrition, headcount, and performance insights  
- 💰 Compensation analytics and pay-disparity views  
- 🏢 Team- and org-level intelligence for managers and HRBPs  
- 🔐 Index-level governance and controlled data exposure  
- ⚡ Real-time ES|QL query execution on Elastic Serverless  

---

## 🧠 Why This Matters

ElasticHR Copilot shows how enterprise-grade search and analytics can power secure AI agents for HR. It helps organizations move from static dashboards to dynamic, governed intelligence workflows that live where teams already work: Slack.

This project showcases:

- Elastic Agent Builder for multi-agent orchestration  
- ES|QL-driven analytics on Elastic Serverless  
- Slack enterprise integration for conversational insights  
- A reference architecture for governed HR AI copilots in the enterprise
