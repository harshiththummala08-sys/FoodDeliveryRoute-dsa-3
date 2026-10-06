# DATA STRUCTURES AND ALGORITHMS | REVIEW 2

## FOOD DELIVERY ROUTE OPTIMIZATION
**Literature Review and Gap Analysis**  
**Industry:** Food Delivery — Swiggy / Zomato

---

### Team Members
1. **T Harshith** — 2510030029
2. **D Siddhartha** — 2510030423
3. **S Anirudh** — 2510030418
4. **Ganesh** — 2510030111
5. **Bharath** — 2510030114

---

## Slide 1: Project Framing
- High-volume incoming orders with limited riders at different locations.
- Multiple restaurant → customer routes with workload, capacity & service-time constraints.
- Workflow: Order → Restaurant → Rider Assignment → Route Optimization → ETA Prediction → Delivery.

---

## Slide 2: Evidence Base 1 — Literature Review on Route Optimization
1. **Dijkstra (1959):** *A note on two problems in connexion with graphs.* Label-setting shortest-path method. Static edge weights; foundation for road-graph routing.
2. **Dantzig & Ramser (1959):** *The truck dispatching problem.* Linear programming based near-optimal dispatching. Classical offline fleet routing setting (VRP).
3. **Steever et al. (2019):** *Dynamic courier routing for a food delivery service.* MILP + auction-based heuristic (VFCDP). Models flexible food-court delivery; re-optimization increases complexity.
4. **Reyes et al. (2018):** *Vehicle routing with roaming delivery locations.* VRP model + construction and local-search heuristics. Shows delivery location and time choices affect routing efficiency.

---

## Slide 3: Evidence Base 2 — Rider Assignment & Allocation
1. **Kuhn (1955):** *The Hungarian method for the assignment problem.* Finds optimal assignment when every worker–job cost is known in $O(N^3)$.
2. **Ford & Fulkerson (1956):** *Maximal flow through a network.* Augmenting-path max-flow method. Formalizes capacity constraints for delivery allocation.
3. **Shmoys & Tardos (1993):** *An approximation algorithm for the generalized assignment problem.* Polynomial-time approximation under capacity bounds.
4. **Alonso-Mora et al. (2017):** *On-demand high-capacity ride-sharing via dynamic trip-vehicle assignment.* Scales dynamic assignment and rebalancing.

---

## Slide 4: Critical Analysis & Synthesis
- Routing and allocation are often treated as isolated decision layers.
- Road-network shortest paths lack dynamic courier allocation.
- Abstract assignment matrices omit road geometry and dynamic traffic conditions.
- Synthesis: An integrated framework is required to chain feasibility matching, assignment cost minimization, capacity verification, and kinematic ETA prediction.

---

## Slide 5: Evidence-Linked Gaps
- **GAP 1:** Existing research prioritizes routing over rider assignment. *Need for a unified assignment + routing pipeline.*
- **GAP 2:** Classical assignment models abstract away road distance and ETA details. *Need to connect allocation cost with route-derived travel time.*
- **GAP 3:** Exact solvers fail to scale in dynamic high-volume settings. *Need for a scalable educational algorithmic workflow combining TSP 2-Approximation and randomized tie-breaking.*

---

## Slide 6: Planned Methodology & References
- Pipeline: Orders + Riders → Bipartite Matching → Assignment (Hungarian) → Capacity (Network Flow) → Dijkstra / TSP → Metric Approximation → Randomized Tie-breaking → Kinematic ETA.
- Complete citations for papers [1] through [8].
