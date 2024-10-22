
fetchData();
async function fetchData() {

    try {
        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        if (!response.ok) {
            throw new Error("Could not fetch the resource")
        }

        const data = await response.json();
        const speciesUrl = data.species.url;
        const responseSpecies = await fetch(speciesUrl);
        const speciesData = await responseSpecies.json();

        const pokemonSprite = document.getElementById("pokemonSprite");
        pokemonSprite.src = data.sprites.front_default;
        pokemonSprite.style.display ="block";

        document.getElementById("pokeName").textContent = data.name;
        
        const types = [];
         data.types.forEach(typeInfo =>{
         types.push(typeInfo.type.name);
        });
        document.getElementById("pokeType").textContent = types.join(', ');
        document.getElementById("pokeHeight").textContent = data.height;
        document.getElementById("pokeWeight").textContent = data.weight;
        
        const pokeAbi = [];
         data.abilities.forEach(AbilityInfo =>{
            pokeAbi.push(AbilityInfo.ability.name);
        });
        document.getElementById("pokeAbilities").textContent = pokeAbi.join(', ');
        DocumentFragment.getElementById("pokeHabitat").textContent = speciesData.habitat.name;


        DocumentFragment.getElementById("pokeCapture").textContent = speciesData.capture_rate.name;



    

     






    }


    catch (error) {

    }
}










