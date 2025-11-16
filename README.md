👑 Super Admin Dashboard
Overview
A simple web-based admin dashboard to manage clubs, events, students, and admins. Built with plain HTML, CSS and JavaScript. Data is persisted in the browser using localStorage. Responsive design for desktop, tablet and mobile.

Features
Club management: add / delete clubs
Event management: add events linked to clubs
Student management: add students with email and linked club
Admin management: add admins linked to clubs
Data persistence with localStorage
Responsive layout with media queries
No backend required (client-side only)
Project structure
Technologies
HTML5
CSS3 (Flexbox, media queries, animations)
JavaScript (Vanilla) — DOM manipulation, localStorage
Quick start
Clone or download the repository:
Open super_admin.html in your browser, or use VS Code Live Server.
No build or install required.

Usage (UI)
Clubs: fill the club name (and description) → click "Add Club". Clubs show in the clubs table.
Events: enter event name, choose a club → click "Add Event".
Students: enter student name, email and choose a club → click "Add Student".
Admins: enter admin name and choose a club → click "Add Admin".
All changes are saved to localStorage and persist after refreshing the page.

Data saved in localStorage
Keys used:

clubs — array of club objects
events — array of event objects
students — array of student objects (includes email)
admins — array of admin objects
idcounter — numeric id generator
Example objects
Club:

Event:

Student:

Admin:

Notes & limitations
Data is stored in the browser only (per device and per browser). Clearing site data or localStorage removes everything.
Do not store sensitive data (passwords, tokens) in localStorage.
This is a client-side demo; for multi-user persistence or security, add a backend API and proper auth.
Responsive & accessibility notes
The layout uses a sidebar and a main area. Media queries adapt the sidebar and layout on smaller screens.
Tables are adjusted for mobile; layout can be improved further (e.g. accessible table markup or card view on small screens).
Troubleshooting
If data doesn't persist:
Open browser DevTools (F12) → Console: look for errors.
Check localStorage (Application tab in DevTools) to confirm keys exist.
If JavaScript stops working:
Look for console errors such as "Cannot read property ... of null" — usually means an element ID/class in HTML doesn't match the JS selector.
Development tips
Use a feature branch, commit changes, and open a Pull Request before merging to main.
Example local workflow:
Future improvements
Backend persistence (API + database)
Authentication / role-based access
Edit and search for records
CSV/Excel export & import
File upload for events/clubs
Contributing
Fork the repo or create a feature branch on the project.
Make changes and commit with clear messages.
Push your branch and open a Pull Request describing the change.


