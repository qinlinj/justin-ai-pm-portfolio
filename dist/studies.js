const groups = [
{id:'knowledge',title:'Knowledge assistants',items:[
{title:'Chat with Docs',sub:'Document Q&A that preserves sources, respects access boundaries, and exposes where answers fail.',flow:['Documents','Ingest & index','Scoped retrieval','Grounded answer'],problem:'Answer questions over changing documents while preserving provenance and enforcing the permissions of the person asking.',architecture:'Parse documents into structured blocks; retain source IDs, page locations, versions, and access labels. Create chunk embeddings and a lexical index. Apply access filters before retrieval, rerank candidates, and generate answers with citations. A change queue reindexes updated documents and invalidates deleted content and stale caches.',decisions:'<strong>Hybrid vs. vector-only retrieval:</strong> combine lexical precision with semantic recall, accepting added indexing and tuning cost. <strong>Chunk size:</strong> compare structural chunks with fixed windows for context coverage and retrieval precision. <strong>Freshness vs. latency:</strong> incremental updates reduce stale answers but require version consistency. Abstain when retrieved evidence does not support an answer; never rely on the model to enforce access.',evaluation:'Build a question set with source spans, unanswerable questions, document updates, and cross-permission probes. Attribute failures to parsing, retrieval, reranking, or generation. Compare retrieval recall, citation support, answer quality, latency, and cost; gate releases on permission isolation and groundedness.'},
{"title": "Source-grounded research assistant", "sub": "Turn a research brief into a reviewable report with evidence coverage, conflicts, and open questions.", "flow": ["Research brief", "Questions & evidence", "Gap / conflict review", "Reviewed report"], "problem": "A document answer resolves one question. A research deliverable must cover a brief, reconcile sources, and make unresolved gaps visible. Citation accuracy alone does not establish completeness.", "architecture": "Split an approved brief into subquestions and acceptance criteria. Maintain an evidence ledger linking each question and claim to source passages, versions, permissions, and disagreements. Run bounded retrieve–inspect cycles against missing coverage; persist task state and stop at the evidence or budget limit. Draft a report with supported conclusions, counter-evidence, and open questions for human review. An optional audio job uses only the approved report and retains source links.", "decisions": "<strong>Direct RAG vs. a research loop:</strong> use direct retrieval for a narrow question; add planning and revision only when a brief requires multiple dependent questions. <strong>Coverage vs. more searching:</strong> use the acceptance rubric to decide which gap warrants another query, rather than maximizing source count. <strong>Review vs. confident synthesis:</strong> preserve unresolved disagreements instead of letting the writer silently choose a side. Cache against source versions and access scope; separate report review from optional audio generation.", "evaluation": "Compare direct RAG and the research workflow on the same brief, sources, model, and budget. Use expert-authored criteria for question coverage, claim support, missed counter-evidence, conflict disclosure, reviewer corrections, latency, and cost. Include missing sources, changed documents, inaccessible material, and interrupted sessions. Validate the optional audio script against the approved report before speech synthesis."}
]},
{id:'agents',title:'Evidence verification',items:[
{title:'Customer support agent',sub:'Resolve support requests while keeping business actions under control.',flow:['Intent & policy','Validate permissions','Required approval','Execute / handoff'],problem:'Support users with accurate answers and appropriate business actions while preserving policy boundaries and a reliable path to a human.',architecture:'Map support goals to intents, allowed tools, and escalation rules. Store conversation state separately from model context. Retrieve policy evidence, validate tool arguments, and route sensitive or irreversible actions through policy checks and human confirmation. Use idempotency keys for mutations and hand off the transcript, evidence, attempted actions, and unresolved issue.',decisions:'<strong>Workflow vs. open-ended agent:</strong> use deterministic steps for policy-bound actions and bounded reasoning for ambiguous requests. <strong>Prompt/RAG vs. training:</strong> establish failure categories and improve retrieval and prompts first. Curate consented, redacted conversations with verified outcomes for SFT; compare preference optimization only when preference labels are reliable. Training cannot replace runtime authorization.',evaluation:'Define an offline support set before tuning: answer correctness, policy compliance, tool selection, argument validity, successful resolution, and handoff quality. Simulate tool failures and prompt injection. Compare prompt, RAG, SFT, and preference variants on held-out cases with human review; track action violations separately from answer quality.'},
{title:'Trip planning agent',sub:'Converge on a workable itinerary despite changing quotes and long-running tasks.',flow:['Goals & constraints','Specialist proposals','Shared plan state','Review & confirm'],problem:'Coordinate travel research into a consistent itinerary under budget, timing, and preference constraints without treating a price quote as a booking.',architecture:'A coordinator delegates bounded research to transport, lodging, and activity specialists. A versioned plan store records constraints, proposals, dependencies, quote timestamps, and conflicts. The coordinator reconciles proposals against a shared objective and stops when constraints are met or the iteration budget is exhausted. Persist checkpoints and tool results for recovery; refresh quotes before user confirmation.',decisions:'<strong>Multi-agent vs. single planner:</strong> parallel specialists can reduce research time but add coordination cost and conflicting assumptions. Limit iterations and use a single authoritative plan. <strong>Memory vs. current intent:</strong> retain user-approved preferences separately from task state. Retry transient reads with backoff; require explicit confirmation for bookings and use idempotency to avoid duplicate actions.',evaluation:'Use scenario suites with conflicting preferences, unavailable inventory, changing prices, tool timeouts, and resumed sessions. Score itinerary feasibility, constraint satisfaction, quote freshness, plan convergence, and recovery correctness. Compare total task success, latency, tool calls, and cost with a single-agent baseline; inspect confirmation compliance independently.'},
{title:'Fact-checking agent',sub:'Trace claims to evidence — and stop when evidence or budget runs out.',flow:['Decompose claims','Retrieve evidence','Judge support','Cite / abstain'],problem:'Verify time-sensitive claims with attributable evidence while distinguishing contradiction, insufficient evidence, and genuine agreement.',architecture:'Normalize the claim, scope time and entities, and plan bounded searches. Retrieve current primary sources where possible, preserve publication and event dates, and cluster duplicate reporting. Judge evidence relevance and entailment per claim, then produce a cited verdict with uncertainty. A runtime controller manages tool retries, search depth, and explicit evidence and budget stop conditions.',decisions:'<strong>Coverage vs. budget:</strong> additional searches may find missing evidence but increase latency and cost; stop at a defined evidence threshold or return insufficient evidence. <strong>Source count vs. independence:</strong> copied reports do not constitute separate corroboration. Prefer verifiable source passages over fluent consensus, and route unresolved source conflicts for review.',evaluation:'Evaluate retrieval relevance, evidence entailment, citation correctness, verdict calibration, and complete task outcomes separately. Include stale evidence, manipulated sources, conflicting reports, and budget exhaustion. Curate reviewed errors and hard negatives into a versioned post-training dataset; hold out topics and time periods to check generalization and avoid training/test leakage.'}
]},
{id:'multimodal',title:'Multimodal & generative systems',items:[
{title:'Multimodal assistant',sub:'Connect image understanding to a responsive, observable serving pipeline.',flow:['Text + image','Encode & assemble','GPU routing','Safety & response'],problem:'Serve conversations involving images and text with predictable latency and resource use, while making visual misunderstandings diagnosable.',architecture:'Validate uploads and normalize images, run image encoding, and assemble visual tokens with text and relevant conversation context. Route requests by model capability and available GPU memory; schedule prefill and decoding, then apply output safety checks and stream the response. Trace preprocessing, encoding, queueing, inference, and filtering as separate stages.',decisions:'<strong>Resolution vs. compute:</strong> more image detail can help OCR and fine-grained reasoning but increases visual tokens and memory. <strong>Cache reuse vs. isolation:</strong> key encoded-image caches by content, encoder version, and authorized scope. <strong>Utilization vs. latency:</strong> batching improves throughput while queueing delays responses. Autoscale using queue depth and service time with warm-capacity limits, not GPU utilization alone.',evaluation:'Create task slices for OCR, spatial reasoning, visual grounding, multi-image comparison, and unsafe inputs. Measure per-stage latency, GPU memory pressure, queue time, cache behavior, and answer quality. Use redacted traces to locate regressions, replay failures in offline evals, and compare scheduling and model changes before release.'},
{title:'Text-to-video generation',sub:'Treat generation as an expensive, long-running workflow with explicit capacity budgets.',flow:['Prompt & budget','Admission queue','GPU generation','Validate & deliver'],problem:'Turn prompts into coherent video while controlling GPU spend, queue time, and failures in a workload that cannot be treated like a short chat request.',architecture:'Validate prompts and output constraints, estimate job cost, and admit work only within per-user and fleet capacity budgets. Persist an asynchronous job state machine and queue GPU stages for prompt conditioning, generation, decoding, and safety validation. Store intermediate checkpoints where supported; expose status and cancellation, and recover failed stages without duplicating completed work.',decisions:'<strong>Quality vs. capacity:</strong> duration, resolution, frames, and sampling steps all affect compute. Compare model and inference settings against a fixed budget. <strong>Throughput vs. wait time:</strong> bucket similar jobs and cap queue depth; reserve capacity for bounded service classes. Use checkpointing only when recovery savings exceed storage and I/O cost. Distinguish retries from stochastic regeneration.',evaluation:'Review prompt adherence, temporal consistency, motion, visual artifacts, and safety on a fixed prompt suite with human comparisons. Simulate worker loss, cancellation, and retry exhaustion. Measure GPU time, queue wait, completion rate, and cost per accepted output; profile generation and decoding bottlenecks before choosing optimizations.'}
]},
{id:'reasoning',title:'Reasoning & coding',items:[
{title:'Reasoning models',sub:'Understand how extra reasoning changes the training and inference compute budget.',flow:['Base model','Instruction alignment','Reasoning training','Budgeted inference'],problem:'Improve performance on tasks that benefit from reasoning without assuming that longer responses or more inference compute always improve correctness.',architecture:'Begin with a pretrained base model, use supervised instruction examples for task following, and compare preference alignment approaches for response behavior. For verifiable domains, train against checked outcomes with reward validation. At inference, allocate bounded reasoning or candidate-sampling budgets, verify outputs where possible, and return a concise answer with useful justification.',decisions:'<strong>Training compute vs. test-time compute:</strong> more capable weights and more inference effort have different cost and latency profiles. <strong>Chain-of-thought supervision vs. outcome rewards:</strong> process traces can be noisy; verifiable rewards can be exploited if validators are weak. Compare fixed reasoning budgets with adaptive routing by task difficulty. Evaluate answers and useful explanations without treating hidden reasoning traces as proof.',evaluation:'Use held-out math, code, and constrained reasoning tasks with independent validators and contamination checks. Compare accuracy, calibration, latency, and compute across budget settings. Audit reward hacking and regressions on short, simple tasks. Inspect whether additional reasoning improves verified outcomes enough to justify its cost.'},
{title:'AI coding assistant',sub:'An AI IDE-style architecture for context, controlled execution, and verified changes.',flow:['IDE intent','Code context','Permissioned agent','Diff & verification'],problem:'Support low-latency completion and larger coding tasks while respecting repository boundaries, execution permissions, and the developer’s review process.',architecture:'An IDE extension tracks the active editor and explicit task context. A repository index combines symbol, lexical, and semantic retrieval; context assembly respects ignored and sensitive files. Route inline completions to a low-latency path. A separate agent loop plans edits, requests permission for consequential tools, runs checks in an isolated environment, and presents a reviewable diff.',decisions:'<strong>Fresh context vs. indexing cost:</strong> incremental indexing reduces stale code but requires version-aware invalidation. <strong>Completion speed vs. context depth:</strong> use small local context and cancellation for suggestions; expand retrieval for complex tasks. <strong>Autonomy vs. control:</strong> define command allowlists, network boundaries, human review, and rollback together. A passing test suite is evidence, not a complete correctness guarantee.',evaluation:'Measure completion latency and acceptance with consented instrumentation; use isolated coding tasks for patch correctness, test regressions, edit scope, and task completion. Test repository prompt injection, secret access, and permission bypass attempts. Track context retrieval misses, tool failures, and verification gaps separately to attribute errors and guide iteration.'}
]}
];
const studySignals = {
'Chat with Docs': {principle:'Enforce access before retrieval; ground every answer in evidence.', impact:'Permission-scoped hybrid retrieval is intended to protect user trust while improving evidence coverage. Reranking and citation checks add latency and cost; stage-level traces make that cost and unsupported answers diagnosable.'},
'Source-grounded research assistant': {"principle": "Treat evidence coverage and unresolved conflicts as deliverables, not just citations.", "impact": "A question-to-evidence ledger lets a reviewer see what is supported, missing, or contested. Bounded search and persistent task state make completion and cost inspectable. The baseline comparison tests whether the extra orchestration actually reduces review work."},
'Customer support agent': {principle:'Keep business actions behind explicit policy and confirmation gates.', impact:'Action gates and idempotency aim to prevent unauthorized or duplicate changes. They add interaction steps, so resolution quality must be evaluated alongside safety; structured handoffs let a human continue without making the user repeat the issue.'},
'Trip planning agent': {principle:'Converge on one versioned plan; refresh quotes before confirmation.', impact:'A shared plan makes conflicts and progress visible to the user. Checkpoints reduce the need to restart long tasks, while bounded agent iterations limit cost. Quote refresh and confirmation protect against acting on outdated prices, at the expense of an extra review step.'},
'Fact-checking agent': {principle:'Stop at the evidence threshold or budget limit; abstain when needed.', impact:'Evidence-linked verdicts help users inspect why a claim is supported or unresolved. A bounded search budget controls waiting time and spend; explicit insufficient-evidence outcomes avoid turning a budget limit into false certainty. Per-stage checks make failures attributable.'},
'Multimodal assistant': {principle:'Allocate image detail and GPU capacity to the task, not the maximum.', impact:'Resolution and routing choices connect visual answer quality to response time and GPU cost. Stage-level traces distinguish visual misunderstanding from serving delays, while scoped caching and safety checks protect privacy and user trust.'},
'Text-to-video generation': {principle:'Admit work against a compute budget; recover jobs as durable workflows.', impact:'Admission control makes capacity limits and waiting time explicit. Durable job state supports status, cancellation, and recovery so users can understand long-running work. Quality settings must be compared against GPU time and cost per accepted output, not visual quality alone.'},
'Reasoning models': {principle:'Spend extra reasoning compute only when verified quality justifies it.', impact:'A reasoning budget turns answer quality, response time, and inference cost into an explicit product choice. Independent validators test whether added effort improves correctness; a concise answer and calibrated uncertainty matter more to the user than a longer explanation.'},
'AI coding assistant': {principle:'Separate fast completion from permissioned, verified agent execution.', impact:'A dedicated completion path protects editing flow, while scoped tools and reviewable diffs preserve developer control. Context and execution traces help explain failed edits. Task correctness, latency, and permission compliance must be assessed together.'}
};

const localeData = window.studyLocaleData;
const t = key => localeData?.labels?.[key] || key;
const caseContexts = {
  "study-docs": {
    "source": "gtsp-delivery",
    "sourceLabel": "GTSP document Q&A",
    "bridge": "GTSP document Q&A \u2192 permission-aware retrieval.",
    "connection": "Document Q&A at GTSP connects this design to a concrete constraint: an answer must respect the same access rules as its source. The extension adds versioned retrieval and source-level evals.",
    "can": "Retrieve authorized documents and answer with supporting passages.",
    "stop": "Do not expose restricted documents or treat missing evidence as a fact.",
    "human": "A knowledge owner resolves conflicting rules and approves source updates."
  },
  "study-research": {
    "source": "gtsp-delivery",
    "sourceLabel": "GTSP document Q&A",
    "bridge": "GTSP document Q&A informs a broader research workflow.",
    "connection": "GTSP work covered company document questions and controlled business requests. The research proposal changes the unit of work: a multi-question brief, a coverage rubric, and a report that exposes gaps and conflicting evidence.",
    "can": "Plan bounded research, track evidence coverage, and draft a source-linked report.",
    "stop": "Stop at the search budget; do not invent support or hide unresolved conflicts.",
    "human": "A reviewer confirms the brief, resolves consequential conflicts, and approves the report before external use.",
    "progression": [
      [
        "Existing experience",
        "Document Q&A and business-tool integration at GTSP."
      ],
      [
        "Next design step",
        "Question decomposition, an evidence ledger, gap-driven search, and a reviewable report."
      ],
      [
        "Validation",
        "Compare with direct RAG on fixed sources: coverage, support, reviewer corrections, and cost."
      ]
    ]
  },
  "study-support": {
    "source": "gtsp-delivery",
    "sourceLabel": "GTSP support integration",
    "bridge": "GTSP support integration \u2192 controlled business actions.",
    "connection": "Refund and order-change integration separates understanding a request from authorizing an operation. This design develops the permission checks, action gate, and recovery path around that boundary.",
    "can": "Classify requests, retrieve policy, and propose validated tool calls.",
    "stop": "Do not bypass permissions or retry an uncertain mutation blindly.",
    "human": "A named approver authorizes irreversible actions; unresolved failures go to a human with context."
  },
  "study-trip": {
    "source": "trip-delivery",
    "sourceLabel": "Remex trip planning",
    "bridge": "Remex trip planning \u2192 coordinated, recoverable plans.",
    "connection": "The delivered trip planner turns preferences into itinerary constraints. The next design question is whether parallel research improves the plan without introducing conflicting assumptions or duplicate bookings.",
    "can": "Research options and reconcile them against one versioned itinerary.",
    "stop": "Do not treat estimates as live quotes or a draft plan as a booking.",
    "human": "The traveler confirms trade-offs; booking or payment requires a named approver."
  },
  "study-fact": {
    "source": "analytics-project",
    "sourceLabel": "Twitter analytics",
    "bridge": "From Twitter analytics to source-aware verification.",
    "connection": "Twitter analytics established the ETL, storage, and cache foundation. This proposal carries source timestamps into claim verification, where recency and independent evidence matter more than repeated claims.",
    "can": "Break a claim into checkable parts, retrieve sources, and assess support.",
    "stop": "Do not count copied reports as independent evidence; stop at the search budget.",
    "human": "A reviewer resolves source conflicts and approves conclusions used for consequential decisions."
  },
  "study-multimodal": {
    "source": "commerce-project",
    "sourceLabel": "SpringCloud commerce",
    "bridge": "From commerce search to image-and-text assistance.",
    "connection": "The SpringCloud platform already includes product search, CDC, and a permission boundary. This proposal extends search to images while keeping catalog freshness and access control explicit.",
    "can": "Interpret images and text, retrieve permitted catalog items, and explain matches.",
    "stop": "Do not infer live inventory or authorize an order from an image match.",
    "human": "The user confirms the product and purchase; ambiguous visual matches need review."
  },
  "study-video": {
    "source": "remex",
    "sourceLabel": "Remex video Agent",
    "bridge": "Remex video Agent \u2192 durable generation jobs.",
    "connection": "The video Agent is in development. This architecture draws on Cloud Crafters deployment and monitoring experience to make job state, capacity, and recovery visible before expanding generation scope.",
    "can": "Queue generation within an approved budget and expose progress and failures.",
    "stop": "Do not exceed the compute budget or treat a failed job as delivered.",
    "human": "A named person approves irreversible actions; the customer reviews the output before release."
  },
  "study-reasoning": {
    "source": "trip-delivery",
    "sourceLabel": "Remex trip constraints",
    "bridge": "From trip constraints to verified reasoning budgets.",
    "connection": "Trip planning makes correctness concrete: an itinerary either respects its constraints or needs revision. This proposal uses verifiable tasks to test when additional reasoning is worth the latency and compute.",
    "can": "Allocate bounded reasoning effort and validate candidate answers.",
    "stop": "Do not use response length or model confidence as evidence of correctness.",
    "human": "A reviewer checks validator gaps and approves consequential decisions."
  },
  "study-coding": {
    "source": "cloud-crafters",
    "sourceLabel": "Cloud Crafters delivery",
    "bridge": "From engineering delivery to reviewable Agent changes.",
    "connection": "Cloud Crafters combined application development, IAM, and CI/CD. This proposal brings those delivery boundaries into coding assistance: scoped repository access, isolated checks, and an inspectable diff.",
    "can": "Read permitted code, propose edits, and run allowed checks in isolation.",
    "stop": "Do not read secrets, expand command permissions, or deploy autonomously.",
    "human": "The developer reviews the diff and approves merges, deployment, and permission changes."
  }
};
const contexts = localeData?.contexts || caseContexts;
const target=document.getElementById('studies');
const supportPaths = () => `<div class="support-paths" aria-label="${t('Proposed support paths')}"><h5>${t('Proposed support paths')}</h5>${[
  ['Read-only questions', 'Check document access', 'Retrieve evidence', 'Answer with sources or hand off'],
  ['Refunds and order changes', 'Validate permissions and parameters', 'Obtain required human approval', 'Execute once, record, or hand off on failure']
].map(([heading, ...steps]) => `<section><h6>${t(heading)}</h6><ol>${steps.map(step => `<li>${t(step)}</li>`).join('')}</ol></section>`).join('')}<p>${t('Shared state: request, evidence, approval, execution result, and handoff context.')}</p><p class="scope-caption">${t('Proposed workflow architecture for document questions and business actions.')}</p></div>`;
const boundaryMarkup = context => `<dl class="decision-boundaries" aria-label="${t('Design boundaries')}">${[
  ['Agent scope', context.can], ['Stop condition', context.stop], ['Human decision', context.human]
].map(([label, text]) => `<div><dt>${t(label)}</dt><dd>${text}</dd></div>`).join('')}</dl>`;
const allocated = ['study-docs', 'study-support', 'study-trip', 'study-video'];
const studyIds = ['study-docs', 'study-research', 'study-support', 'study-trip', 'study-fact', 'study-multimodal', 'study-video', 'study-reasoning', 'study-coding'];
(localeData?.groups || groups).forEach((group, groupIndex) => {
  const section = document.createElement('section');
  section.className = 'study-group'; section.id = group.id;
  section.innerHTML = `<div class="group-title"><h3>${group.title}</h3></div>`;
  group.items.forEach((study, studyIndex) => {
    const details = document.createElement('details');
    details.id = studyIds[[0, 2, 5, 7][groupIndex] + studyIndex];
    const context = contexts[details.id];
    const isAllocated = allocated.includes(details.id);
    const principle = study.principle || studySignals[study.title].principle;
    details.innerHTML = `<summary><div class="study-title"><h4>${study.title}</h4><p class="scope-preview">${t(isAllocated ? 'Architecture analysis' : 'Future project proposal')}</p><p class="quick-summary">${context.bridge}</p></div><span class="disclosure-arrow" aria-hidden="true"></span></summary>
      <div class="study-body">
        <div class="study-connection">${isAllocated ? `<div class="source-origin"><span>${t('Experience behind this design')}</span>${context.sourceLabel}</div>` : `<a class="source-link" href="#${context.source}"><span>${t('Experience behind this design')}</span>${context.sourceLabel}<span class="jump-arrow" aria-hidden="true"></span></a>`}<p>${context.connection}</p>${context.progression ? `<dl class="proposal-progression">${context.progression.map(([label, text]) => `<div><dt>${label}</dt><dd>${text}</dd></div>`).join('')}</dl>` : ''}</div>
        <p class="proposal-thesis"><strong>${t('Design priority')}</strong>${principle}</p>
        ${boundaryMarkup(context)}
        <p class="study-note">${t(isAllocated ? (details.id === 'study-video' ? 'In development / architecture notes' : 'Completed work / architecture notes') : 'Future project proposal')}</p>
        ${isAllocated ? `<p class="impact-note">${t('Proposed architecture extensions and evaluation plans.')}</p>` : ''}
        <div class="flow" aria-label="${t('Proposed architecture flow')}">${study.flow.map((step, index) => `${index ? '<b aria-hidden="true"></b>' : ''}<span>${step}</span>`).join('')}</div>
        ${[['Problem', study.problem], ['Architecture', study.architecture], ['Decisions & trade-offs', study.decisions], ['Product implications', study.impact || studySignals[study.title].impact], ['Evaluation plan', study.evaluation]].map(([label, text]) => `<article><h5>${t(label)}</h5><p>${text}</p></article>`).join('')}
      </div>`;
    if (details.id === 'study-support') details.querySelector('.flow').outerHTML = supportPaths();
    const destination = ['study-docs', 'study-support'].includes(details.id) ? document.getElementById('gtsp-studies') : ['study-trip', 'study-video'].includes(details.id) ? document.getElementById('remex-studies') : section;
    if (isAllocated) details.classList.add('allocated-study');
    destination.appendChild(details);
  });
  target.appendChild(section);
});
// A compact comparison makes the autonomy boundary visible without leaving the section.
const explorer = document.getElementById('boundary-explorer');
if (explorer) {
  const scenarios = [['study-docs', 'Document Q&A'], ['study-support', 'Refund request'], ['study-trip', 'Travel plan']];
  explorer.innerHTML = `<div class="scenario-switch" role="group" aria-label="${t('Choose a task')}">${scenarios.map(([id, label], index) => `<button type="button" data-case="${id}" aria-pressed="${index === 0}" aria-controls="scenario-result">${t(label)}</button>`).join('')}</div><div id="scenario-result" aria-live="polite" aria-atomic="true">${boundaryMarkup(contexts[scenarios[0][0]])}</div>`;
  explorer.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    explorer.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const result = document.getElementById('scenario-result');
    result.getAnimations().forEach(animation => animation.cancel());
    result.innerHTML = boundaryMarkup(contexts[button.dataset.case]);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) result.animate([{opacity: .5, transform: 'translateY(4px)'}, {opacity: 1, transform: 'none'}], {duration: 180, easing: 'ease-out'});
  }));
}
const foundation = document.createElement('section');
foundation.id = 'foundations'; foundation.className = 'study-group foundation';
foundation.innerHTML = localeData?.foundation || '<div class="group-title"><h3>Inference &amp; resource planning</h3></div><details id="inference-details"><summary><div class="study-title"><h4>LLM serving and capacity</h4><p class="scope-preview">Shared infrastructure across the proposals</p><p class="quick-summary">Latency, throughput, and GPU cost shape which Agent workflows are practical.</p></div><span class="disclosure-arrow" aria-hidden="true"></span></summary><div class="study-body"><p>Trace a request from API authentication and admission through tokenization, prefill, decoding, and streamed tokens. Estimate concurrency from model weights, KV cache growth, GPU memory headroom, and request lengths.</p><p>Compare continuous batching, cache reuse, and scheduling policies against latency and throughput objectives. Evaluate tensor and pipeline parallelism across GPUs against communication overhead, memory capacity, and operational complexity.</p><div class="foundation-topics">API / TOKENS · KV CACHE / MEMORY · BATCHING / SCHEDULING · MULTI-GPU TRADE-OFFS</div></div></details>';
target.appendChild(foundation);
