const fileName = "funboxRules.json";

/**
 * Fetch all rules from commanderRules.json
 * @returns 
 */
async function fetchRules() {
  const response = await fetch(fileName);
  if (!response.ok) {
    throw new Error(`Failed to fetch rules.json: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Gets a random rule, optionally filtered by volatility
 */
async function getRandomRule(volatilityFilter = null) {
    // apply filter
    const rules = await fetchRules();
    let filtered = null;
    if (typeof volatilityFilter === 'number') {
        filtered = rules.filter(rule => rule.volatility === volatilityFilter);
    } else if (volatilityFilter && typeof volatilityFilter === 'object') {
        const { min, max } = volatilityFilter;
        filtered = rules.filter(rule => {
        if (min !== undefined && rule.volatility < min) return false;
        if (max !== undefined && rule.volatility > max) return false;
        return true;
        });
    } else {
        filtered = rules;
    }

    if (filtered.length === 0) {
        throw new Error('No rules match the given volatility filter.');
    }
 
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
}