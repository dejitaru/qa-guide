console.log('Script cargado');

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado');

  // Obtener todas las páginas del sidebar
  const getSidebarItems = () => {
    console.log('Buscando enlaces en el sidebar');
    const sidebarLinks = Array.from(document.querySelectorAll('nav[aria-label="Main"] a'));
    console.log('Enlaces encontrados:', sidebarLinks.length);
    return sidebarLinks.map(link => ({
      href: link.getAttribute('href'),
      element: link
    })).filter(item => item.href);
  };

  // Encontrar la página actual en el sidebar
  const findCurrentPageIndex = (items) => {
    const currentPath = window.location.pathname;
    return items.findIndex(item => item.href === currentPath);
  };

  // Función para inspeccionar la estructura del sidebar
  const inspectSidebarStructure = () => {
    console.log('=== BUSCANDO SIDEBAR ===');

    // Probar diferentes selectores
    const selectors = [
      'nav[aria-label="Main"]',
      '.sidebar',
      'nav.sidebar',
      'aside nav',
      'nav',
      '[role="navigation"]'
    ];

    selectors.forEach(selector => {
      const element = document.querySelector(selector);
      console.log(`Selector "${selector}":`, element ? 'Encontrado' : 'No encontrado');
      if (element) {
        console.log('Estructura:', element.outerHTML);
      }
    });

    // Buscar todos los elementos nav
    const allNavs = document.querySelectorAll('nav');
    console.log('\nTodos los elementos nav encontrados:', allNavs.length);
    allNavs.forEach((nav, index) => {
      console.log(`\nNav ${index + 1}:`, {
        classes: nav.className,
        attributes: Array.from(nav.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', '),
        children: nav.children.length
      });
    });

    // Buscar todos los elementos aside
    const allAsides = document.querySelectorAll('aside');
    console.log('\nTodos los elementos aside encontrados:', allAsides.length);
    allAsides.forEach((aside, index) => {
      console.log(`\nAside ${index + 1}:`, {
        classes: aside.className,
        attributes: Array.from(aside.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', '),
        children: aside.children.length
      });
    });
  };

  // Navegar a la página anterior o siguiente
  const navigateToPage = (direction) => {
    const items = getSidebarItems();
    const currentIndex = findCurrentPageIndex(items);

    if (currentIndex === -1) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex >= 0 && targetIndex < items.length) {
      window.location.href = items[targetIndex].href;
    }
  };

  // Manejar eventos de teclado
  document.addEventListener('keydown', (event) => {
    // Ignorar si el usuario está escribiendo en un campo de texto
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        navigateToPage(-1);
        break;
      case 'ArrowDown':
        navigateToPage(1);
        break;
    }
  });

  // Inspeccionar la estructura del sidebar al cargar
  inspectSidebarStructure();
});