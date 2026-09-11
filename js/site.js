const routes = window.IMP0STR_ROUTES || {};

document.querySelectorAll('[data-route]').forEach((link) => {
  const destination = routes[link.dataset.route];
  if (destination) link.href = destination;
});

document.getElementById('currentYear').textContent = new Date().getFullYear();
