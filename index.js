fetchData();
async function fetchData() {
    try {
        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        if (!response.ok) {
            throw new Error("Could not fetch the resource");
        }

        const data = await response.json();
        const speciesUrl = data.species.url;
        const responseSpecies = await fetch(speciesUrl);
        const speciesData = await responseSpecies.json();

        // Set Pokémon sprite
        const pokemonSprite = document.getElementById("pokemonSprite");
        pokemonSprite.src = data.sprites.front_default;
        pokemonSprite.style.display = "block";

        // Set Pokémon name, type, height, weight, and abilities
        document.getElementById("pokeName").textContent = data.name.toUpperCase();

        const types = data.types.map(typeInfo => typeInfo.type.name);
        document.getElementById("pokeType").textContent = types.join(', ');

        document.getElementById("pokeHeight").textContent = data.height;
        document.getElementById("pokeWeight").textContent = data.weight;

        const pokeAbilities = data.abilities.map(abilityInfo => abilityInfo.ability.name);
        document.getElementById("pokeAbilities").textContent = pokeAbilities.join(', ');

        // Set habitat
        document.getElementById("pokeHabitat").textContent = speciesData.habitat ? speciesData.habitat.name : 'Unknown';

        // Set capture rate
        document.getElementById("pokeCapture").textContent = speciesData.capture_rate;

        // Set evolve-from species
        const evolvesFrom = speciesData.evolves_from_species ? speciesData.evolves_from_species.name : 'None';
        document.getElementById("pokeEvolvesFrom").textContent = evolvesFrom;

        // Set flavor text (description)
        const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
        document.getElementById("pokeFlavorText").textContent = flavorTextEntry ? flavorTextEntry.flavor_text : 'No description available';

        // Fetch ability flavor texts
        const abilityDescriptions = await Promise.all(
            data.abilities.map(async abilityInfo => {
                const abilityResponse = await fetch(abilityInfo.ability.url);
                const abilityData = await abilityResponse.json();
                const abilityFlavorText = abilityData.flavor_text_entries.find(entry => entry.language.name === 'en');
                return `${abilityInfo.ability.name}: ${abilityFlavorText ? abilityFlavorText.flavor_text : 'No description available'}`;
            })
        );
        document.getElementById("pokeAbilityDescriptions").textContent = abilityDescriptions.join('; ');

        // Set background color based on Pokémon color
        const colorResponse = await fetch(speciesData.color.url);
        const colorData = await colorResponse.json();
        const cardColor = colorData.name;
        document.getElementById("pokemonCard").style.backgroundColor = cardColor;

    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        document.getElementById("pokeName").textContent = 'Find a pokemon first';
    }
}
