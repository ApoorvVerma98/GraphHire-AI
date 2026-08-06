# GraphHire AI

GraphHire AI is a recruitment-intelligence application for exploring candidate capabilities as a connected graph. It helps a hiring manager build a small team for a required set of skills and identify a candidate's next useful skills through graph traversal.

> **Before submitting:** replace the two placeholders below with your real public links.
>
> - Hosted demo: `ADD_DEPLOYED_FRONTEND_URL`
> - Screen recording: `ADD_SCREEN_RECORDING_URL`

## Why a graph database?

Recruitment questions are fundamentally relationship questions: which candidates know which skills, which projects required those skills, and what related capability should a person learn next? In a relational database, queries that follow changing numbers of candidate-to-skill-to-skill or candidate-to-project-to-technology links require increasingly complex joins and anti-joins.

CognoDB's openCypher graph model expresses those paths directly. For example, the Skill Gap Explorer follows a two-hop path from a candidate's known skill to a related skill, then excludes skills the candidate already knows. The Team Builder starts from `Candidate-[:KNOWS]->Skill` relationships and selects a small group whose combined coverage satisfies a requested skill set.

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

### Skill Gap Explorer

1. A user enters a candidate ID.
2. Cypher follows `Candidate → Skill → RELATED_TO → Skill`.
3. The query excludes skills already connected to that candidate and returns a suggested next skill plus known prerequisite skills.

This is a genuine multi-hop graph traversal and is awkward to maintain as a variable-depth relational join.

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

## Screenshots

Add current screenshots before submission:

1. Dashboard and Team Builder result with the interactive graph.
2. Skill Gap Explorer result.
3. Database-unavailable error state.

## Submission checklist

- [ ] Hosted demo URL added at the top of this README
- [ ] Screen-recording URL added at the top of this README
- [ ] Current screenshots added above
- [ ] CognoDB password rotated if the previous `.env` was shared
- [ ] `client` lint and production build pass
- [ ] Seed script runs against the live CognoDB instance
- [ ] Deployed frontend can call the deployed backend
