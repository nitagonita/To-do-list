// ==== VERSION BANNER (sanity check) ====
(function() {
  const VER = 'debug-4';
  document.title = 'Todo (' + VER + ')';
  let b = document.getElementById('js-version-banner');
  if (!b) {
    b = document.createElement('div');
    b.id = 'js-version-banner';
    b.style.position = 'fixed';
    b.style.right = '12px';
    b.style.bottom = '12px';
    b.style.padding = '6px 10px';
    b.style.background = '#222';
    b.style.color = '#fff';
    b.style.borderRadius = '8px';
    b.style.fontSize = '12px';
    b.style.zIndex = '9999';
    document.body.appendChild(b);
  }
  b.textContent = 'JS LOADED: ' + VER;
  console.log('[BOOT] app.js loaded', VER);
})();

// ==== APP ====
let todos = [];
let currentFilter = 'all';

const form  = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const listEl = document.querySelector('#todo-list');
const countEl = document.querySelector('#todo-count');
const errorMessage = document.querySelector('#error-message');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.querySelector('#clear-completed');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) {
    errorMessage.textContent = 'Todo cannot be empty!';
    input.style.border = '2px solid red';
    return;
  }
  errorMessage.textContent = '';
  input.style.border = '';

  todos.push({ id: String(Date.now()), text, completed: false });
  input.value = '';
  render();
});

listEl.addEventListener('change', (e) => {
  if (e.target.matches('input[type="checkbox"][data-action="toggle"]')) {
    const li = e.target.closest('li[data-id]');
    const id = li.dataset.id;
    const t = todos.find(t => t.id === id);
    if (t) t.completed = e.target.checked;
    render();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active')?.classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.filter; // all | active | completed
    render();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  render();
});

function render() {
  let visible = todos;
  if (currentFilter === 'active') visible = todos.filter(t => !t.completed);
  if (currentFilter === 'completed') visible = todos.filter(t => t.completed);

  listEl.innerHTML = '';

  if (visible.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No todos here — add one!';
    li.className = 'empty-state';
    listEl.appendChild(li);
  } else {
    visible.forEach(t => listEl.appendChild(makeItem(t)));
  }

  const remaining = todos.filter(t => !t.completed).length;
  countEl.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} remaining`;
}

function makeItem(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (todo.completed ? ' completed' : '');
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('data-action', 'toggle');

  const label = document.createElement('span');
  label.setAttribute('data-role', 'label');
  label.textContent = todo.text;

  li.appendChild(checkbox);
  li.appendChild(label);
  return li;
}
