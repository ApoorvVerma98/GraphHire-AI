# GraphHire AI

GraphHire AI is a full-stack recruitment intelligence platform that leverages the power of Neo4j Graph Database to analyze candidate relationships, discover skill connections, identify skill gaps, and build optimized teams based on required technologies.

## Features

- Candidate Management
- Search Candidates by Skills
- Team Builder using Graph Traversal
- Skill Gap Analysis
- Graph Analytics Dashboard
- Interactive Knowledge Graph Visualization
- RESTful APIs
- Neo4j Graph Database Integration

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Force Graph

### Backend

- Node.js
- Express.js
- Neo4j Driver

### Database

- Neo4j

---

## Project Structure

```
graphhire-ai
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── src
│   ├── package.json
│   └── seedData.js
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/<your-username>/graphhire-ai.git
cd graphhire-ai
```

---

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000

NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

---

## Available APIs

### Candidate APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/candidates` | Get all candidates |
| GET | `/api/candidates/:id` | Get candidate details |
| GET | `/api/candidates/search?q=` | Search candidates by skill |
| POST | `/api/candidates/team-builder` | Build optimal team |
| GET | `/api/candidates/:id/skill-gap` | Find candidate skill gaps |

---

### Graph Analytics APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/graph/stats` | Graph statistics |
| GET | `/api/graph/top-skills` | Most popular skills |
| GET | `/api/graph/top-companies` | Companies with most candidates |

---

## Graph Features

- Candidate → Skill relationships
- Skill → Related Skill traversal
- Team optimization
- Skill gap discovery
- Graph analytics
- Interactive graph visualization

---

## Deployment

### Frontend

Deploy on Vercel

### Backend

Deploy on Render

---

## Screenshots

_Add application screenshots here._

---

## Future Improvements

- JWT Authentication
- Resume Upload
- AI Candidate Ranking
- Job Recommendation Engine
- Advanced Graph Analytics

---

## Author

**Apoorv Verma**

Full Stack MERN Developer