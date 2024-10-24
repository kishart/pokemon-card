fetchData();

async function fetchData() {
    try {
        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
        const noPokemonMessage = document.getElementById("noPokemonMessage");
        const pokemonDetails = document.getElementById("pokemonDetails");
        const pokemonSprite = document.getElementById("pokemonSprite");

        // Initially hide the details and show the "Find a pokemon first" message
        pokemonDetails.style.display = "none";
        pokemonSprite.style.display = "none";
        noPokemonMessage.style.display = "block";

        if (!pokemonName) {
            return; // Don't perform a fetch if there's no input
        }

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        if (!response.ok) {
            throw new Error("Could not fetch the resource");
        }

        const data = await response.json();
        const speciesUrl = data.species.url;
        const responseSpecies = await fetch(speciesUrl);
        const speciesData = await responseSpecies.json();

        // Set Pokémon sprite and show it
        pokemonSprite.src = data.sprites.front_default;
        pokemonSprite.style.display = "block";

        // Set Pokémon details and show them
        document.getElementById("pokeName").textContent = data.name.toUpperCase();

        const types = data.types.map(typeInfo => typeInfo.type.name);
        document.getElementById("pokeType").textContent = types.join(', ');

        document.getElementById("pokeHeight").textContent = data.height;
        document.getElementById("pokeWeight").textContent = data.weight;

        const pokeAbilities = data.abilities.map(abilityInfo => abilityInfo.ability.name);
        document.getElementById("pokeAbilities").textContent = pokeAbilities.join(', ');

        document.getElementById("pokeHabitat").textContent = speciesData.habitat ? speciesData.habitat.name : 'Unknown';
        document.getElementById("pokeCapture").textContent = speciesData.capture_rate;

        const evolvesFrom = speciesData.evolves_from_species ? speciesData.evolves_from_species.name : 'None';
        document.getElementById("pokeEvolvesFrom").textContent = evolvesFrom;

        const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
        document.getElementById("pokeFlavorText").textContent = flavorTextEntry ? flavorTextEntry.flavor_text : 'No description available';

        const abilityDescriptions = await Promise.all(
            data.abilities.map(async abilityInfo => {
                const abilityResponse = await fetch(abilityInfo.ability.url);
                const abilityData = await abilityResponse.json();
                const abilityFlavorText = abilityData.flavor_text_entries.find(entry => entry.language.name === 'en');
                return `${abilityInfo.ability.name}: ${abilityFlavorText ? abilityFlavorText.flavor_text : 'No description available'}`;
            })
        );
        document.getElementById("pokeAbilityDescriptions").textContent = abilityDescriptions.join('; ');

        const colorResponse = await fetch(speciesData.color.url);
        const colorData = await colorResponse.json();
        document.getElementById("pokemonCard").style.backgroundColor = colorData.name;

        // Hide the "Find a pokemon first" message and show the details now that data is successfully fetched
        noPokemonMessage.style.display = "none";
        pokemonDetails.style.display = "block";
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        document.getElementById("pokeName").textContent = 'Find a pokemon first';
        // Show the "Find a pokemon first" message in case of an error
        document.getElementById("noPokemonMessage").style.display = "block";
    }
}
