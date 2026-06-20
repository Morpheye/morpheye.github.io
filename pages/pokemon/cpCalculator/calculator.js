const levelScaling = {
    "1": 0.094000000,
    "1.5": 0.135137432,
    "2": 0.166397870,
    "2.5": 0.192650919,
    "3": 0.215732470,
    "3.5": 0.236572661,
    "4": 0.255720050,
    "4.5": 0.273530381,
    "5": 0.290249880,
    "5.5": 0.306057377,
    "6": 0.321087600,
    "6.5": 0.335445036,
    "7": 0.349212680,
    "7.5": 0.362457751,
    "8": 0.375235590,
    "8.5": 0.387592406,
    "9": 0.399567280,
    "9.5": 0.411193551,
    "10": 0.422500010,
    "10.5": 0.432926419,
    "11": 0.443107550,
    "11.5": 0.453059958,
    "12": 0.462798390,
    "12.5": 0.472336083,
    "13": 0.481684950,
    "13.5": 0.490855800,
    "14": 0.499858440,
    "14.5": 0.508701765,
    "15": 0.517393950,
    "15.5": 0.525942511,
    "16": 0.534354330,
    "16.5": 0.542635767,
    "17": 0.550792690,
    "17.5": 0.558830576,
    "18": 0.566754520,
    "18.5": 0.574569153,
    "19": 0.582278910,
    "19.5": 0.589887917,
    "20": 0.597400010,
    "20.5": 0.604818814,
    "21": 0.612157290,
    "21.5": 0.619399365,
    "22": 0.626567130,
    "22.5": 0.633644533,
    "23": 0.640652950,
    "23.5": 0.647580967,
    "24": 0.654435630,
    "24.5": 0.661214806,
    "25": 0.667934000,
    "25.5": 0.674577537,
    "26": 0.681164920,
    "26.5": 0.687680648,
    "27": 0.694143650,
    "27.5": 0.700538673,
    "28": 0.706884210,
    "28.5": 0.713164996,
    "29": 0.719399090,
    "29.5": 0.725571552,
    "30": 0.731700000,
    "30.5": 0.734741009,
    "31": 0.737769480,
    "31.5": 0.740785574,
    "32": 0.743789430,
    "32.5": 0.746781211,
    "33": 0.749761040,
    "33.5": 0.752729087,
    "34": 0.755685510,
    "34.5": 0.758630378,
    "35": 0.761563840,
    "35.5": 0.764486065,
    "36": 0.767397170,
    "36.5": 0.770297266,
    "37": 0.773186500,
    "37.5": 0.776064962,
    "38": 0.778932750,
    "38.5": 0.781790055,
    "39": 0.784636970,
    "39.5": 0.787473578,
    "40": 0.790300010,
    "40.5": 0.792803950,
    "41": 0.795300010,
    "41.5": 0.797803920,
    "42": 0.800300010,
    "42.5": 0.802803890,
    "43": 0.805300010,
    "43.5": 0.807803870,
    "44": 0.810300010,
    "44.5": 0.812803840,
    "45": 0.815300010,
    "45.5": 0.817803790,
    "46": 0.820300010,
    "46.5": 0.822803780,
    "47": 0.825300010,
    "47.5": 0.827803750,
    "48": 0.830300010,
    "48.5": 0.832803750,
    "49": 0.835300010,
    "49.5": 0.837799990,
    "50": 0.840299990,
    "50.5": 0.84280371,
    "51": 0.845300010
};

let pokemonStats = [];
let loadingPromise = null;

/**
 * Fetch all pokemon stats if they haven't been fetched yet
 * @returns 
 */
async function fetchPokemon() {
    if (pokemonStats.length > 0) return pokemonStats;

    if (!loadingPromise) {
        loadingPromise = fetch(
            "https://pogoapi.net/api/v1/pokemon_stats.json"
        ).then(r => r.json());
    }

    pokemonStats = await loadingPromise;
    return pokemonStats;
}

async function populatePokemonList() {
    await fetchPokemon();
 
    return pokemonStats.map(pokemon =>
        pokemon.form === "Normal"
            ? pokemon.pokemon_name
            : `${pokemon.pokemon_name} (${pokemon.form})`
    );
}

function parsePokemonSelection(selection) {
    const match = selection.match(/^(.*?)\s*\((.*?)\)$/);

    if (match) {
        return {
            pokemonName: match[1],
            form: match[2]
        };
    }

    return {
        pokemonName: selection,
        form: "Normal"
    };
}

/**
 * Gets a random rule, optionally filtered by volatility
 */
async function getStats(pokemonName, form, attackIV, defenseIV, staminaIV) {
    await fetchPokemon();
    const pokemon = pokemonStats.find(
        p => p.pokemon_name === pokemonName && p.form === form
    );

    return {
        attack: pokemon.base_attack + Number(attackIV),
        defense: pokemon.base_defense + Number(defenseIV),
        stamina: pokemon.base_stamina + Number(staminaIV)
    };
}

async function calculate(attack, defense, stamina, level) {
    const cpm = levelScaling[level];
    const raw = (attack * Math.sqrt(defense) * Math.sqrt(stamina) * Math.pow(cpm, 2)) / 10;
    return {
        attack: attack * cpm,
        defense: defense * cpm,
        stamina: stamina * cpm,
        cp: Math.max(10, Math.floor(raw))
    };
}