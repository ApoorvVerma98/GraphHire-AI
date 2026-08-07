# GraphHire AI

GraphHire AI is a recruitment-intelligence application built on a graph database. It enables hiring managers to explore candidates, assemble coverage-based teams, and identify logical next skills for growth.

The data is fictional but realistic, designed to support product-engineering hiring scenarios.

Candidate skills are modeled with role-relevant proficiency and years of experience on each `KNOWS` relationship. The seed script is idempotent and replaces existing GraphHire data to keep the demo dataset consistent.

> **Before submitting:** replace the screen recording placeholder below with your real public link.
>
> - Hosted demo: https://graph-hire-ai.vercel.app/
> - Screen recording://https://www.loom.com/share/961dcdc9fb384c91bef723b5e340ef0f

## Why a graph database?

Recruitment questions are fundamentally relationship questions: which candidates know which skills, which projects required those skills, and what related capability should a person learn next? In a relational database, queries that follow changing numbers of candidate-to-skill-to-skill or candidate-to-project-to-technology links require increasingly complex joins and anti-joins.

CognoDB's openCypher graph model expresses those paths directly. The Skill Gap Explorer follows a two-hop traversal from a candidate's known skill to a related skill, then excludes skills already known by the candidate. The Team Builder starts from `Candidate-[:KNOWS]->Skill` relationships and selects a compact team whose combined coverage satisfies the requested skill set.

## Graph data model

```text
(Candidate {id, name, role, email, location, experience})
  ├─[:HAS_ROLE]──────────────> (Role {name})
  ├─[:KNOWS {level, years}]─> (Skill {name})
  ├─[:WORKED_AT]────────────> (Company {name})
  ├─[:WORKED_ON]────────────> (Project {name})
  └─[:HAS_CERTIFICATION]────> (Certification {name})

(Project)-[:USES]───────────> (Technology {name})
(Project)-[:REQUIRES]───────> (Skill)
(Skill)-[:RELATED_TO]───────> (Skill)
```

`RELATED_TO` represents curated complementary or next-step skills, such as `Node.js → Express`, `Docker → Kubernetes`, and `Java → Spring Boot`.

## Main user flows

### Team Builder

1. A user selects the skills required for a project.
2. Cypher returns every candidate with one or more matching `KNOWS` relationships.
3. The backend applies a deterministic greedy set-cover algorithm: at each step it selects the candidate covering the most still-uncovered skills.
4. The UI shows the recommended team, each member's new contribution, unmatched requested skills, and an interactive candidate-skill graph.
5. This is intentionally a minimal coverage recommendation, not a full list of every candidate who knows any selected skill.

### Skill Gap Explorer

1. A user enters a candidate ID.
2. Cypher follows `Candidate → Skill → RELATED_TO → Skill`.
3. The query excludes skills already connected to that candidate and returns a suggested next skill plus known prerequisite skills.

If the returned result is empty, the current related-skill graph has no adjacent next-step skill that the candidate does not already know. This is a valid graph outcome: the model simply has no further recommendation for that candidate in the current skill relationship set.

This is a multi-hop graph traversal and is more natural in a graph model than as a variable-depth relational join.

## Key Cypher queries

### Candidate skill coverage

```cypher
MATCH (c:Candidate)-[:KNOWS]->(s:Skill)
WHERE s.name IN $requiredSkills
WITH c, collect(DISTINCT s.name) AS candidateSkills
RETURN c.id, c.name, c.role, candidateSkills
```

The `$requiredSkills` value is parameterised through the official Neo4j JavaScript driver. It provides the candidate coverage data used by the application-layer greedy set-cover selection.

### Multi-hop skill gap traversal

```cypher
MATCH (c:Candidate {id: $candidateId})-[:KNOWS]->(s:Skill)-[:RELATED_TO]->(related:Skill)
WHERE NOT (c)-[:KNOWS]->(related)
RETURN DISTINCT related.name, collect(s.name)
```

This parameterised query traverses two relationships and finds related skills not yet held by the selected candidate.

## Technology stack

- Frontend: React, Vite, Axios, Tailwind CSS, React Force Graph
- Backend: Node.js, Express
- Database: CognoDB Cloud over Bolt using the official `neo4j-driver`

## Project structure

```text
client/                         React/Vite frontend
  src/components/               Team Builder, Skill Gap Explorer, dashboard, graph UI
  src/services/api.js           API client
server/                         Express backend
  config/db.js                  CognoDB driver and connection status
  queries/                      Parameterised Cypher queries
  services/                     Graph access and set-cover logic
  controllers/                  HTTP request handlers
  routes/                       API endpoints
  seed/                         Realistic seed data and idempotent data loader
```

## CognoDB Cloud setup

1. Create an account at [CognoDB Cloud](https://console.cognodb.com/signup).
2. Create a free `c0` database instance.
3. Save the displayed Bolt URI and generated password. CognoDB shows the password only once.
4. Copy `server/.env.example` to `server/.env` and set the values:

   ```env
   PORT=5000
   URI=bolt+s://<instance-id>.databases.cognodb.cloud
   DB_USERNAME=cognodb
   DB_PASSWORD=<your-cognodb-password>
   CLIENT_URL=http://localhost:5173
   ```

5. Copy `client/.env.example` to `client/.env`:

   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

Never commit `.env` files. If credentials have been shared, rotate the CognoDB password before deploying.

## Run locally

### Backend

```bash
cd server
npm install
npm run seed
npm run dev
```

The API starts at `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173`.

### Quality checks

```bash
cd client
npm run lint
npm run build
```

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/candidates` | List candidates with skills |
| `GET` | `/api/candidates/search?q=` | Search candidates by name or skill |
| `GET` | `/api/candidates/:id` | Candidate details and projects |
| `POST` | `/api/candidates/team-builder` | Build a greedy skill-coverage team |
| `GET` | `/api/candidates/:id/skill-gap` | Explore multi-hop skill recommendations |
| `GET` | `/api/graph/stats` | Node and relationship counts |
| `GET` | `/health` | Backend and database availability |

## Deployment

Deploy `server` and `client` independently.

- Backend: set `URI`, `DB_USERNAME`, `DB_PASSWORD`, and `CLIENT_URL` in the hosting provider environment settings.
- Frontend: set `VITE_API_BASE_URL` to the public backend URL, without `/api` at the end.
- Confirm `CLIENT_URL` exactly matches the deployed frontend origin so the Express CORS policy permits it.


