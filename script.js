window.onload = function () {
    document.body.classList.remove('no-js');

    const $projects = document.getElementById('projects');

    function getLatestRepos(data, count) {
        const repos = data.filter(({ name }) => name !== 'rago4.github.io' && name !== 'android');

        repos.sort(({ updated_at: date1 }, { updated_at: date2 }) => {
            return (
                new Date(date1) > new Date(date2) ?
                    -1 :
                    Date(date1) < new Date(date2) ? 1 : 0
            );
        });

        return repos.splice(0, count);
    }

    function displayRepos(repos) {
        const span = document.createElement('span');
        const list = document.createElement('ul');
        let item, link;

        repos.forEach(({ name, html_url }) => {
            item = document.createElement('li');

            link = document.createElement('a');
            link.setAttribute('href', html_url);
            link.classList.add('link');
            link.textContent = name;

            item.appendChild(link);
            list.appendChild(item);
        });

        span.textContent = 'Here is the list of my latest projects:';

        $projects.appendChild(span);
        $projects.appendChild(list);
    }

    function fetchAndDisplayRecentRepos() {
        const ENDPOINT = 'https://api.github.com/users/rago4/repos';

        $projects.textContent = 'Loading latest projects...';

        fetch(ENDPOINT)
            .then(response => {
                if (!response.ok) throw new Error('Response not ok.');

                return response.json();
            })
            .then(json => {
                const repos = getLatestRepos(json, 3);
                $projects.textContent = '';
                displayRepos(repos);
            })
            .catch(error => {
                console.error(error);

            });
    }

    fetchAndDisplayRecentRepos();
}