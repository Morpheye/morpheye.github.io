function initPokemonCombobox(names) {
    const input = document.getElementById('pokemon-search');
    const list = document.getElementById('pokemon-combobox-list');

    let activeIndex = -1;
    let currentMatches = [];

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function highlight(name, query) {
        const idx = name.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1 || query.length === 0) return escapeHtml(name);

        const before = escapeHtml(name.slice(0, idx));
        const match = escapeHtml(name.slice(idx, idx + query.length));
        const after = escapeHtml(name.slice(idx + query.length));
        return `${before}<mark>${match}</mark>${after}`;
    }

    function closeList() {
        list.innerHTML = '';
        activeIndex = -1;
        currentMatches = [];
    }

    function renderMatches(query) {
        currentMatches = names
            .filter(name => name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 50); // keep the panel snappy on long lists

        activeIndex = -1;

        if (query.length === 0 || currentMatches.length === 0) {
            list.innerHTML = query.length === 0
                ? ''
                : '<li class="combobox-empty">No Pokémon match that search</li>';
            return;
        }

        list.innerHTML = currentMatches
            .map((name, i) => `<li class="combobox-option" data-index="${i}">${highlight(name, query)}</li>`)
            .join('');
    }

    function setActive(index) {
        const options = list.querySelectorAll('.combobox-option');
        options.forEach(opt => opt.classList.remove('is-active'));
        if (index >= 0 && index < options.length) {
            options[index].classList.add('is-active');
            options[index].scrollIntoView({ block: 'nearest' });
        }
        activeIndex = index;
    }

    function selectMatch(name) {
        input.value = name;
        closeList();
    }

    input.addEventListener('input', () => {
        renderMatches(input.value.trim());
    });

    input.addEventListener('focus', () => {
        if (input.value.trim().length > 0) renderMatches(input.value.trim());
    });

    input.addEventListener('keydown', (e) => {
        if (currentMatches.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive(Math.min(activeIndex + 1, currentMatches.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive(Math.max(activeIndex - 1, 0));
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0) {
                e.preventDefault();
                selectMatch(currentMatches[activeIndex]);
            }
        } else if (e.key === 'Escape') {
            closeList();
        }
    });

    list.addEventListener('mousedown', (e) => {
        // mousedown (not click) so it fires before the input's blur event
        const option = e.target.closest('.combobox-option');
        if (!option) return;
        const index = parseInt(option.dataset.index, 10);
        selectMatch(currentMatches[index]);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.combobox')) closeList();
    });
}