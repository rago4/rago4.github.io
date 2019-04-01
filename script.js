(() => {
    const $emoji = document.getElementById('emoji');
    const wavingHandEmojis = ["👋🏿", "👋🏻", "👋🏾", "👋🏼", "👋🏽", "👋"];
    let index = 0;

    setInterval(() => {
        index = (index >= wavingHandEmojis.length - 1) ? 0 : index + 1;
        $emoji.textContent = wavingHandEmojis[index];
    }, 2000);
})();