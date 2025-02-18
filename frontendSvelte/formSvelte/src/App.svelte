<script>
    let name = $state()
    let responseMessage = $state();

    async function sendName(event) { //visto che deve fare una fecth deve essere asincrona
        event.preventDefault();
        //console.log(name);
        const res = await fetch("http://localhost:3000/utente", { //copiamo l'end point da frontend/index.html
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({name})
        });
        if (res.ok){
            const data = await res.json();
            console.log(data);
            responseMessage = data.message;
            console.log(responseMessage); //ricordati di avviare il server del backend
        } else {
            responseMessage = "Errore";
        }
    }
</script>


<h1>Benvenuto {name}</h1>
<form onsubmit={sendName}>
    <input type="text" bind:value={name} placeholder="Inserisci il tuo nome">
    <button type="submit">Invia</button>
</form>