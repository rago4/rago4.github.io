(() => {
    const $emoji = document.getElementById('emoji');
    const wavingHandEmojis = ["👋🏿", "👋🏻", "👋🏾", "👋🏼", "👋🏽", "👋"];
    let index = 0;

    setInterval(() => {
        $emoji.textContent = wavingHandEmojis[index];
        index = (index >= wavingHandEmojis.length - 1) ? 0 : index + 1;
    }, 1500);
})();