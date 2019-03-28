function document_loaded(callback) {
    document.addEventListener('DOMContentLoaded', () => {
        axios({
            method: 'get',
            url: './deck.json',
            headers: {
                'Accept': 'application/json'
            }
        }).then(res => {
            document.getElementsByTagName('title')[0].innerText = res.data.title;

            add_css(`./assets/reveal.js/css/theme/${res.data.theme}.css`);
            add_css(`./assets/css/deck-${res.data.theme}.css`);

            axios.all(res.data.deck.map((name) => {
                return axios.get(`./slides/${name}.html`, {
                    responseType: 'text'
                });
            })).then(axios.spread((...args) => {
                const d = args.map((o) => o.data).join('');
                document.getElementById('deck').innerHTML = d;
                callback();
            }));
        });
    });
}

function add_css(url) {
    const link = document.createElement('LINK');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    document.getElementsByTagName( 'head' )[0].appendChild( link );
}

const DeckLoaderFactory = () => {
    const loader = {
        loaded: (callback) => {
            document_loaded(callback);
        }
    };

    return loader;
};

const DeckLoader = DeckLoaderFactory();