# **App Name**: Sortable Table

## Core Features:

- Table Display: Display a table with mock client data (name, email, created at, updated at, status).
- Sort Panel: Implement a sort panel allowing users to add multiple sort criteria (e.g., Name, Created At) with ascending/descending toggles and drag-and-drop reordering for prioritization.
- Data Sorting: Update the table data based on the combined sort logic from the sort panel.

## Style Guidelines:

- Primary color: Neutral grays for the table background and text.
- Secondary color: Light shades of blue or green for row highlighting on hover.
- Accent: Teal (#008080) for sort indicators and interactive elements in the sort panel.
- Clear and readable font for table data and sort panel labels.
- Simple and intuitive icons for sorting direction (ascending/descending) and drag handles.
- Clean and organized layout with the sort panel positioned above the table.
- Subtle animations when applying or changing sort criteria.

## Original User Request:
create this page in react.jsx and use the following guidelines:

- A **table** view with mock data of clients (e.g., name, email, created at, updated at, status).
- A **Sort Panel** (like in the screenshot) where:
    - Users can **add multiple sort criteria** (e.g., sort by Name, Created At).
    - Each sort criterion should support ascending/descending toggle.
    - Sort criteria can be **dragged up/down to prioritize** their order.
- Table data should update based on the **combined sort logic**.

---

## ✨ Bonus (Optional but impressive)

- Persist the sort order in `localStorage` or URL params.
- Add subtle animations while sorting.
  