(() => {
  const LOCAL_STORAGE_THEME_KEY = 'theme';
  const DATA_THEME_KEY = 'data-theme';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';
  const theme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || THEME_LIGHT;
  const $html = document.querySelector('html');
  const $themeToggler = document.querySelector('#theme-toggler');
  const $themeEmoji = document.querySelector('#theme-emoji');

  const setThemeEmoji = isLight => {
    const newEmoji = isLight ? '🌙' : '☀️';
    const newEmojiLabel = isLight ? 'Moon emoji' : 'Sun emoji';

    $themeEmoji.textContent = newEmoji;
    $themeEmoji.setAttribute('aria-label', newEmojiLabel);
  };

  const toggleTheme = () => {
    const isLight = $html.getAttribute(DATA_THEME_KEY) === THEME_LIGHT;
    const newTheme = isLight ? THEME_DARK : THEME_LIGHT;

    $html.setAttribute(DATA_THEME_KEY, newTheme);
    setThemeEmoji(newTheme === THEME_LIGHT);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
  };

  $themeToggler.addEventListener('click', toggleTheme);

  $html.setAttribute(DATA_THEME_KEY, theme);
  setThemeEmoji(theme === THEME_LIGHT);
})();
