# DATA STRUCTURES AND ALGORITHMS | REVIEW 3

## FOOD DELIVERY ROUTE OPTIMIZATION
**Integrated DSA Framework for Rider Assignment, Route Optimization & ETA**  
**Industry:** Food Delivery — Swiggy / Zomato

---

### Team Members
1. **T Harshith** — 2510030029
2. **D Siddhartha** — 2510030423
3. **S Anirudh** — 2510030418
4. **Ganesh** — 2510030111
5. **Bharath** — 2510030114

---

## Slide 1: Continuity from Research Gap to Developed System
- Review 2 identified the gaps across isolated routing and allocation literature.
- Review 3 operationalizes the integrated DSA framework with mathematical formulations, implementation evidence, and evaluation readiness.

---

## Slide 2: The Decision Problem
- Multiple orders arriving dynamically.
- Spatially distributed available riders.
- Road network with traffic congestion and speed limits.
- Rider bag capacity limits.
- **Optimization Target:** Select a feasible rider and route that respects capacity while minimizing delivery cost and estimated time.

---

## Slide 3: Integrated DSA Delivery Engine
1. **Input Layer:** Orders, riders, restaurants, customers, road data.
2. **Feasibility:** Bipartite matching filters viable rider-order candidate pairs.
3. **Assignment:** Cost matrix + Hungarian optimization chooses candidates globally.
4. **Capacity:** Network flow checks bag and flow constraints.
5. **Routing:** Weighted graph + Dijkstra / Mapbox road geometry.
6. **Multi-Stop:** TSP (2-Opt) and 2-Approximation sequence complex routes.
7. **Decision:** Randomized tie-breaking resolves similar candidate alternatives.
8. **ETA Engine:** Travel time + speed + traffic multiplier + kitchen prep time.
9. **Output:** Rider, route, ETA, distance, and workload metrics.

---

## Slide 4: DSA Component Mapping Table

| Component | Mathematical Role | Produced Output |
|---|---|---|
| **Graph / Adjacency List** | Road network representation | Reachable navigation paths |
| **Bipartite Matching** | Feasible rider-order pairing | Compatible candidate pool |
| **Cost Matrix (2D Array)** | Assignment dispatch costs | Hungarian optimization input |
| **Network Flow** | Rider capacity constraints | Validated capacity bounds |
| **Priority Queue / Min-Heap** | Candidate ordering | Rapid lowest-cost extraction |
| **TSP + 2-Opt** | Multi-stop sequencing | Optimized tour sequence |
| **Metric 2-Approximation** | Scalable routing for large N | Polynomial-time tour order |
| **Randomized Selection** | Stochastic tie-breaking | Fair alternative selection |
| **Kinematic ETA Engine** | Arrival time computation | Realistic ETA window |

---

## Slide 5: System Adaptability & Scalability
- **More Orders:** Activates batching and metric 2-approximation.
- **More Riders:** Scales Hungarian matrix dimensions.
- **Multiple Stops:** Sequences pickup-drop pairs via 2-Opt.
- **Traffic Spikes:** Kinematic ETA recalculates travel speeds dynamically.
- **Tied Alternatives:** Randomized selection breaks ties without bias.
