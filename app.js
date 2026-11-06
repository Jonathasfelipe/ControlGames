// Interações do portal: menu, filtros e pesquisa.
// Control Games — interações simples, sem serviços externos.
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menu-toggle');
  const navigation = document.getElementById('site-nav');
  menuButton?.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
  navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  }));

  const cards = [...document.querySelectorAll('.news-card')];
  const buttons = [...document.querySelectorAll('.filter-chip')];
  const search = document.getElementById('news-search');
  const noResults = document.getElementById('no-results');
  let currentFilter = 'todos';

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
  function updateCards() {
    const q = normalize(search?.value || '').trim();
    let visible = 0;
    for (const card of cards) {
      const categories = (card.dataset.category || '').split(' ');
      const categoryMatches = currentFilter === 'todos' || categories.includes(currentFilter);
      const searchMatches = !q || normalize(card.innerText + ' ' + (card.dataset.search || '')).includes(q);
      card.hidden = !(categoryMatches && searchMatches);
      if (!card.hidden) visible++;
    }
    if (noResults) noResults.hidden = visible > 0;
  }
  for (const button of buttons) {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter || 'todos';
      for (const b of buttons) {
        const active = b === button;
        b.classList.toggle('selected', active);
        b.setAttribute('aria-pressed', String(active));
      }
      updateCards();
    });
  }
  search?.addEventListener('input', updateCards);
});
