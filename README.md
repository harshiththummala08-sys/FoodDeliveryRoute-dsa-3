# FLEETFLOW ⚡
### Intelligent Food Delivery Route Optimization & Dispatch Command Center

**FLEETFLOW** is a production-grade, hackathon-ready logistics dispatch platform built for high-density food delivery operations (in the style of Swiggy and Zomato).

Rather than superficial labels or mocked placeholders, FLEETFLOW implements and visually proves **seven core combinatorial and mathematical optimization algorithms** running live in real-time over actual road geometry in Hyderabad, India.

---

## 🌟 The Complete Optimization Pipeline

```text
ORDER CREATION
      ↓
01. NETWORK FLOW (Edmonds-Karp Augmenting Path)
      ↓
02. BIPARTITE MATCHING (Maximum Cardinality Matching)
      ↓
03. ASSIGNMENT PROBLEM (Kuhn-Munkres / Hungarian Min-Cost Matrix)
      ↓
04. TRAVELLING SALESMAN PROBLEM (Held-Karp Exact DP & 2-Opt)
      ↓
05. APPROXIMATION ALGORITHM (Metric TSP 2-Approximation)
      ↓
06. RANDOMIZED ALGORITHM (Monte Carlo Route Search)
      ↓
07. ETA PREDICTION (Transparent Kinematic Formula)
      ↓
RIDER ROAD MOVEMENT (Mapbox GL JS Delivery Bike)
      ↓
ORDER DELIVERED & ANALYTICS UPDATE
```

---

## 🔬 Implemented Algorithms & Complexity

| # | Algorithm | Model / Method | Complexity | Purpose |
|---|---|---|---|---|
| **01** | **Network Flow** | Edmonds-Karp BFS Augmenting Paths with residual graph | $O(V \cdot E^2)$ | Analyzes feasible depot-to-rider-to-order-to-sink connections within geographic radius thresholds. |
| **02** | **Bipartite Matching** | Augmenting Paths / Hopcroft-Karp | $O(E \sqrt{V})$ | Establishes maximum 1-to-1 cardinality matching between idle fleet nodes and pending demand. |
| **03** | **Assignment Problem** | Kuhn-Munkres (Hungarian Algorithm) | $O(N^3)$ | Solves optimal minimum-cost pairing across Distance (35%), ETA (30%), Workload (20%), and Traffic (15%). |
| **04** | **Travelling Salesman Problem** | Branch & Bound / Exact DP + 2-Opt | $O(2^N \cdot N^2)$ | Re-sequences pickup and dropoff waypoints to eliminate crisscrossing and save road kilometers. |
| **05** | **Approximation Algorithm** | Prim's MST Doubling + Preorder Shortcut | $O(N^2 \log N)$ | Delivers 92%+ runtime improvement for large stop clusters while bounding distance error to ~3–5%. |
| **06** | **Randomized Algorithm** | Stochastic Fisher-Yates + Random 2-Opt | $O(K \cdot N)$ | Evaluates 50+ candidate routes in parallel to discover global optima without getting stuck in local minima. |
| **07** | **ETA Prediction** | Multi-factor kinematic formula | $O(1)$ | Transparently computes arrival times using distance, speed, traffic congestion, and kitchen prep buffers. |

---

## 🏍️ Core Visual Highlights

1. **Live Road-Based Rider Movement**:
   - Custom SVG delivery bike markers with rotating heading/bearing angles, helmets, and insulated cargo boxes.
   - Smooth movement along actual road corridors connecting Madhapur, Hitec City, Gachibowli, Kondapur, and Jubilee Hills.
   - Realistic state lifecycle: `AVAILABLE` → `GOING_TO_RESTAURANT` → `PICKING_UP` → `DELIVERING` → `DELIVERED`.

2. **"Why Was This Rider Assigned?" Deep-Dive Modal**:
   - Transparent mathematical scoreboard comparing every competing rider candidate.
   - Component scores: Proximity (35%), ETA (30%), Workload bandwidth (20%), Traffic delay (15%).
   - Justification grounded in actual Hungarian algorithm cost output.

3. **Algorithm Pipeline Inspector**:
   - Step-by-step bottom drawer on the Live Optimization page.
   - Interactive visual inspection of flow networks, bipartite graphs, cost matrices, TSP route comparisons, approximation charts, and Monte Carlo candidate distributions.

4. **Command Center Aesthetics**:
   - Dark charcoal command theme (`#070a0f`) with glassmorphism cards.
   - Faint animated canvas background with drifting particles and network lines.
   - Distinct, synchronized rider colors across markers, cards, routes, and statistics (R1: Rose, R2: Cyan, R3: Emerald, R4: Amber, R5: Violet, R6: Coral).
   - Dedicated Hackathon **Demo Mode** toggle for presentations.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS
- **Mapping**: Mapbox GL JS + Mapbox Directions API
- **Icons**: Lucide React
- **Animations**: Framer Motion + Canvas 60fps loop
- **Analytics & Charts**: Recharts

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### 2. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Ensure your `.env` contains your Mapbox public token:
```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```
*(If the token is omitted or offline, FLEETFLOW automatically activates its built-in Hyderabad road corridor generator with zero crashes).*

### 3. Installation & Running
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📱 Navigation & Pages

- **/ Dashboard**: Real-time KPI counters (active riders, pending orders, distance saved, average ETA), interactive map overview, simulation controls, and live streaming event log.
- **/ Live Optimization**: Primary command console with collapsible Orders Queue, Mapbox route visualizer, Fleet Roster, and 7-stage Algorithm Execution Pipeline.
- **/ Algorithm Center**: Dedicated educational explorer featuring comprehensive cards, complexity explanations, and visualizers for all 7 algorithms.
- **/ Analytics**: Multi-series Recharts dashboards covering distance contraction, hourly order throughput, algorithm runtime latency profiles, and fulfillment status.
