function updateHelTime() {
  const el = document.getElementById('hel-time-clock');
  if (!el) return;

  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Helsinki',
    hour: '2-digit',
    minute: '2-digit',
  });

  el.textContent = formatter.format(new Date());
}

document.addEventListener('partials:loaded', () => {
  updateHelTime();
  setInterval(updateHelTime, 10 * 1000);
});
