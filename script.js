'use strict';

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const compactLayout = window.matchMedia('(max-width: 940px)');

function setMenuOpen(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
}

function syncMenuLayout() {
    const focusInNav = nav.contains(document.activeElement);
    const focusOnToggle = document.activeElement === menuToggle;
    menuToggle.hidden = !compactLayout.matches;
    setMenuOpen(false);

    if (compactLayout.matches && focusInNav) menuToggle.focus();
    if (!compactLayout.matches && focusOnToggle) nav.querySelector('a').focus();
}

menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') === 'false');
});

nav.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !compactLayout.matches) return;

    setMenuOpen(false);
    const target = document.getElementById(link.hash.slice(1));
    target?.focus({ preventScroll: true });
});

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || menuToggle.getAttribute('aria-expanded') !== 'true') return;

    setMenuOpen(false);
    menuToggle.focus();
});

document.addEventListener('click', (event) => {
    if (!menuToggle.contains(event.target) && !nav.contains(event.target)) setMenuOpen(false);
});

header.addEventListener('focusout', (event) => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenuOpen(false);
});

compactLayout.addEventListener('change', syncMenuLayout);
header.classList.add('menu-ready');
syncMenuLayout();

const form = document.querySelector('#demo-form');
const fields = document.querySelector('#demo-fields');
const nameField = document.querySelector('#demo-name');
const phoneField = document.querySelector('#demo-phone');
const status = document.querySelector('#demo-status');

form.addEventListener('input', (event) => {
    event.target.setCustomValidity?.('');
    status.textContent = '';
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const phone = phoneField.value.trim();
    const digitCount = phone.replace(/\D/g, '').length;
    const validPhone = /^\+?[0-9()\s-]+$/.test(phone) && digitCount >= 10 && digitCount <= 15;

    nameField.setCustomValidity(nameField.value.trim() ? '' : 'Введите имя.');
    phoneField.setCustomValidity(validPhone ? '' : 'Введите от 10 до 15 цифр. Можно использовать +, пробелы, скобки и дефисы.');

    if (!form.reportValidity()) return;
    status.textContent = 'Поля заполнены корректно. Данные не отправлены.';
});

// Поля доступны только после подключения обработчика, который отменяет отправку.
fields.disabled = false;
