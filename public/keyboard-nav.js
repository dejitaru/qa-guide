console.log('Script cargado');

// Variables globales
let lastNavigationTime = 0;
const NAVIGATION_COOLDOWN = 300; // ms

// Función para hacer scroll instantáneo a un elemento
function scrollIntoViewFast(element) {
  if (!element) return;

  // Asegurarnos de que todos los details padres estén abiertos primero
  let parent = element.parentElement;
  while (parent) {
    if (parent.tagName === 'DETAILS') {
      parent.setAttribute('open', '');
    }
    parent = parent.parentElement;
  }

  try {
    // Usar scroll instantáneo para máxima velocidad
    element.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'nearest'
    });
  } catch (error) {
    console.error('Error al hacer scroll:', error);
  }
}

// Función para normalizar rutas
function normalizePath(path) {
  return path.endsWith('/') ? path : path + '/';
}

// Función para obtener todas las páginas del sidebar
function getSidebarItems() {
  const sidebarLinks = Array.from(document.querySelectorAll('nav[aria-label="Main"] a'));
  return sidebarLinks.map(link => ({
    href: normalizePath(link.getAttribute('href')),
    element: link
  })).filter(item => item.href);
}

// Función para encontrar la página actual
function findCurrentPageIndex(items) {
  const currentPath = normalizePath(window.location.pathname);
  return items.findIndex(item => item.href === currentPath);
}

// Función para expandir el menú actual y sus padres
function expandCurrentMenu() {
  const path = window.location.pathname;
  // Buscar el enlace activo
  const activeLink = document.querySelector(`nav[aria-label="Main"] a[href="${path}"]`);
  
  // Primero, remover la clase activa de todos los enlaces
  document.querySelectorAll('nav[aria-label="Main"] a').forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
  });

  if (activeLink) {
    // Marcar el enlace actual como activo
    activeLink.classList.add('active');
    activeLink.setAttribute('aria-current', 'page');

    // Encontrar todos los details padres y abrirlos
    let parent = activeLink.parentElement;
    while (parent) {
      if (parent.tagName === 'DETAILS') {
        parent.setAttribute('open', '');
      }
      parent = parent.parentElement;
    }

    // Hacer scroll al elemento activo
    scrollIntoViewFast(activeLink);
  }
}

// Función para navegar a la página anterior o siguiente
async function navigateToPage(direction) {
  const now = Date.now();
  if (now - lastNavigationTime < NAVIGATION_COOLDOWN) return;
  lastNavigationTime = now;

  const items = getSidebarItems();
  const currentIndex = findCurrentPageIndex(items);
  if (currentIndex === -1) return;

  const targetIndex = currentIndex + direction;
  if (targetIndex >= 0 && targetIndex < items.length) {
    const targetItem = items[targetIndex];
    scrollIntoViewFast(targetItem.element);
    window.location.href = targetItem.href;
  }
}

// Función para observar cambios en el DOM
function observeDOM() {
  // Usar un ResizeObserver para detectar cuando el sidebar se actualiza
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.tagName === 'NAV' && entry.target.getAttribute('aria-label') === 'Main') {
        expandCurrentMenu();
      }
    }
  });

  // Observar el sidebar
  const sidebar = document.querySelector('nav[aria-label="Main"]');
  if (sidebar) {
    resizeObserver.observe(sidebar);
  }

  // También observar cambios en el DOM para detectar cuando se añade el sidebar
  const domObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const sidebar = document.querySelector('nav[aria-label="Main"]');
        if (sidebar && !sidebar._observed) {
          resizeObserver.observe(sidebar);
          sidebar._observed = true;
          expandCurrentMenu();
        }
      }
    });
  });

  domObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Expandir el menú actual inmediatamente
  expandCurrentMenu();
}

// Función para inicializar la aplicación
function init() {
  // Inicializar observadores del DOM
  observeDOM();

  // Escuchar eventos de navegación de Astro
  document.addEventListener('astro:page-load', () => {
    expandCurrentMenu();
  });

  document.addEventListener('astro:after-swap', () => {
    expandCurrentMenu();
  });

  // Configurar la navegación por teclado
  document.addEventListener('keydown', (event) => {
    // Ignorar si el usuario está escribiendo en un campo de texto
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        navigateToPage(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        navigateToPage(1);
        break;
    }
  });
}

// Inicializar la aplicación
function init() {
  // Configurar la navegación por teclado y observar cambios
  observeDOM();

  // Escuchar eventos de navegación de Astro
  document.addEventListener('astro:page-load', () => {
    console.log('Astro: Página cargada');
    expandCurrentMenu();
  });

  document.addEventListener('astro:after-swap', () => {
    console.log('Astro: Contenido actualizado');
    expandCurrentMenu();
  });

  // Manejar eventos de teclado
  document.addEventListener('keydown', (event) => {
    // Ignorar si el usuario está escribiendo en un campo de texto
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        console.log('Tecla arriba presionada');
        navigateToPage(-1);
        break;
      case 'ArrowDown':
        console.log('Tecla abajo presionada');
        navigateToPage(1);
        break;
    }
  });
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);