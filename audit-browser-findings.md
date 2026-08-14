# Browser audit findings

The single-page GentsAcademy app rendered successfully on the local running service. The home view showed the existing dark interface with navy gradients, gold typography and actions, Playfair Display headings, Inter body text, responsive cards, and the original promise “Education Is The New Freedom.” The navigation exposed Home, Catalogue, Pathways, My learning, and Start learning, with no language selector or duplicate-language route.

The home page displayed data-driven totals of 41 published courses, 6 academic areas, and 4 career pathways. The department section exposed Business and Entrepreneurship, IT and Technology, Hospitality Management, Tourism and Destination Management, and Interdisciplinary. Featured course cards loaded image assets, primary department labels, course codes, level, duration, workload, descriptions, and View course actions.

The catalogue route rendered the centralized registry with a search field, department selector, level selector, pathway selector, filter action, clear-filters action, and 41 course cards. Cards used the preserved dark card style and department-specific badges. The browser audit found no loading failure or missing application shell in the tested views.

The course detail view rendered the strategy-required metadata: primary department and code, level, duration, workload, course certificate type, measurable learning outcomes, four expandable modules, 20/30/20/30 assessment weighting with a 70% pass threshold, prerequisites and device expectations, capstone evidence, career relevance, low-bandwidth support, certificate rules, related courses, and a free enrollment action.

The enrollment route rendered a focused, labelled form for full name and email with a clear confirmation action and a low-bandwidth/privacy notice. The form was keyboard/focus-auditable and kept the established dark card, gold button, and serif-heading style.

The learner dashboard rendered a dedicated email-based lookup form and retained the same visual system. The underlying API flow was already verified with an enrollment, learner lookup, and progress update, so the page is ready to display active enrollments and module completion state.

The pathways view rendered four stackable programmes: Hotel Operations, Digital Tourism, Hospitality Entrepreneurship, and Responsible Service-Sector Leadership. Each pathway exposed its purpose, six recommended courses, and a View pathway action, confirming that the catalogue is no longer a flat list of unrelated courses.
