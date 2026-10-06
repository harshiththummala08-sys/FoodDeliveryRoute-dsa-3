# DATA STRUCTURES AND ALGORITHMS | REVIEW 1

## FOOD DELIVERY ROUTE OPTIMIZATION
**DSA Project Title Selection & Initial Proposal**  
**Industry:** Food Delivery — Swiggy / Zomato

---

### Team Members
1. **T Harshith** — 2510030029
2. **D Siddhartha** — 2510030423
3. **S Anirudh** — 2510030418
4. **Ganesh** — 2510030111
5. **Bharath** — 2510030114

---

## Slide 1: Title & Framing
- **Project Title:** Food Delivery Route Optimization
- **Problem Formulation:** A DSA-based system that takes live orders, rider locations, and road distances as input, then outputs the best rider assignment, route, and ETA.
- **Industry Benchmark:** Swiggy, Zomato on-demand food logistics.
- **Project Goal:** Fastest feasible delivery with fair rider allocation.

---

## Slide 2: What We Are Going to Do
Simulate how Swiggy or Zomato decides which rider should deliver which order:
1. **Input:** Orders, restaurants, customers, available riders, rider location, and road distance/time.
2. **Decision:** Calculate assignment cost and choose the rider who can complete the order fastest.
3. **Result:** Show selected rider, optimized route, ETA, total distance, and rider workload.

---

## Slide 3: Data Structures Used
- **Graph / Adjacency List:** Road network for route and flow modelling.
- **Cost Matrix (2D Array):** Rider-order cost for assignment problem.
- **Queue / FIFO Buffer:** Process incoming orders in real time.
- **Hash Map:** Quick rider, order, and restaurant lookup in $O(1)$.
- **Priority Queue / Min-Heap:** Choose minimum ETA or minimum distance option in $O(\log K)$.
- **Array / Dynamic List:** Store riders, orders, routes, and results.

---

## Slide 4: Algorithms Covered
1. **Network Flow:** Manage rider capacity and multiple order movement.
2. **Bipartite Matching:** Match riders on one side with orders on the other.
3. **Assignment Problem (Hungarian):** Minimize total rider-order delivery cost.
4. **TSP (Travelling Salesman Problem):** Find best pickup-drop sequence for multi-order trips.
5. **Approximation Algorithms:** Get near-optimal routes faster than exact TSP for large instances.
6. **Randomized Algorithms:** Break ties and test alternate rider choices fairly.

---

## Slide 5: Features & Expected Outcome
- **Delivery Assignment:** Best rider for each order.
- **Route Optimization:** Shortest practical road path.
- **ETA Prediction:** Expected delivery arrival time.
- **Rider Allocation:** Balanced workload and reduced total distance.
- **Recommended Title:** *Food Delivery Route Optimization Using Network Flow, Matching and TSP*
