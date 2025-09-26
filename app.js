// app.js
// Ensure DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Sample nested data (Departments -> Members)
  const data = {
    departments: [
      {
        name: "Development",
        head: "Alice Johnson",
        description: "Frontend and backend development team.",
        members: [
          { name: "John Doe", role: "Frontend Developer", email: "john@example.com", bio: "Works on UI and accessibility." },
          { name: "Jane Smith", role: "Backend Developer", email: "jane@example.com", bio: "APIs and DB design." }
        ]
      },
      {
        name: "Design",
        head: "Michael Brown",
        description: "UI/UX and visual designers.",
        members: [
          { name: "Emma Wilson", role: "UI Designer", email: "emma@example.com", bio: "Design systems & prototypes." },
          { name: "Oliver White", role: "UX Researcher", email: "oliver@example.com", bio: "User interviews and testing." }
        ]
      },
      {
        name: "Product",
        head: "Sara Lee",
        description: "Product managers and strategy.",
        members: [
          { name: "Tom Hanks", role: "Product Manager", email: "tom@example.com", bio: "Roadmap and stakeholder mgmt." }
        ]
      }
    ]
  };

  // Add computed property for each member: initials (used in avatar)
  data.departments.forEach(dept => {
    dept.members.forEach(m => {
      m.initials = m.name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
    });
  });

  // Grab template and render
  const template = document.getElementById('team-template').innerHTML;
  const rendered = Mustache.render(template, data);
  document.getElementById('team-list').innerHTML = rendered;

  // Populate department filter dropdown
  const deptFilter = document.getElementById('dept-filter');
  data.departments.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.name;
    opt.textContent = d.name;
    deptFilter.appendChild(opt);
  });

  // Search and filter logic
  const searchInput = document.getElementById('search-input');

  function filterAndRender() {
    const q = searchInput.value.trim().toLowerCase();
    const deptVal = deptFilter.value;
    // Build filtered data copy
    const filtered = {
      departments: data.departments
        .filter(d => !deptVal || d.name === deptVal) // department filter
        .map(d => {
          // filter members by search query (name or role or email)
          const members = d.members.filter(m => {
            if (!q) return true;
            return (
              m.name.toLowerCase().includes(q) ||
              m.role.toLowerCase().includes(q) ||
              m.email.toLowerCase().includes(q)
            );
          });
          return Object.assign({}, d, { members });
        })
        .filter(d => d.members.length > 0) // remove departments with 0 members after search
    };

    const out = Mustache.render(template, filtered);
    document.getElementById('team-list').innerHTML = out;
  }

  // Event listeners
  searchInput.addEventListener('input', debounce(filterAndRender, 250));
  deptFilter.addEventListener('change', filterAndRender);

  // Simple debounce helper
  function debounce(fn, delay) {
    let t;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  }
});
