# Graph Report - TypeSlayer  (2026-11-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 245 nodes · 433 edges · 10 communities (6 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8e376156`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9

## God Nodes (most connected - your core abstractions)
1. `PlayScene` - 36 edges
2. `react` - 12 edges
3. `useAuth()` - 11 edges
4. `Player` - 10 edges
5. `MenuScene` - 10 edges
6. `TestScene` - 9 edges
7. `phaser` - 8 edges
8. `BackgroundManager` - 7 edges
9. `Enemy` - 7 edges
10. `Game()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `LoginForm()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/Auth/LoginForm.jsx → client/src/context/AuthContext.jsx
- `RegisterForm()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/Auth/RegisterForm.jsx → client/src/context/AuthContext.jsx
- `Navbar()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/Navbar/Navbar.jsx → client/src/context/AuthContext.jsx
- `App()` --calls--> `Game()`  [EXTRACTED]
  client/src/App.jsx → client/src/components/Game.jsx
- `App()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/App.jsx → client/src/context/AuthContext.jsx

## Import Cycles
- None detected.

## Communities (10 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (38): dependencies, axios@^1.11.0, phaser@^3.70.0, react@^18.2.0, react-dom@^18.2.0, description, devDependencies, eslint@^8.45.0 (+30 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (9): BackgroundManager, Enemy, levelData, allyTypes, allyWords, config, enemyTypes, Player (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (24): bcryptjs, express, generateToken(), jwt, protect(), Joi, validateGameSession(), validateLogin() (+16 more)

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (12): App(), LoginForm(), RegisterForm(), Game(), Navbar(), AuthContext, AuthProvider(), useAuth() (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (28): cors, dotenv, express-rate-limit, helmet, joi, jsonwebtoken, mongoose, author (+20 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (14): mongoose, authLimiter, gameSessionLimiter, generalLimiter, rateLimit, allowedOrigins, app, clientDist (+6 more)

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PlayScene` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05858585858585859 - nodes in this community are weakly interconnected._
- **Why does `phaser` connect `Community 2` to `Community 0`, `Community 7`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.0967741935483871 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Community 4` to `Community 0`, `Community 7`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.09247311827956989 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._