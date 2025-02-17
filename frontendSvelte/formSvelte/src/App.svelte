<script>
    import Header from "./lib/Header.svelte";
 
    //let name = $state(); //variabile reattiva che reagisce ai cambiamenti della UI
 
    let formState = $state({
        answers: {},
        step: 0,
        error: "",
    });
 
    const QUESTION = [
        {
            id: "name",
            question: "What is your name?",
            type:"text"
        },
        {
            id: "birthday",
            question: "What is your birthday?",
            type:"date"
        },
        {
            id: "color",
            question: "What is your favourite color?",
            type: "color"
        }
    ]
   
    function nextStep(id) {
 
        if (formState.answers[id]){ //IMPORTANTISSIMO: quando usiamo formState.answers.id cerchiamo una proprietà letteralmente chiamata "id", mentre se usiamo formState.answers[id] usiamo il valore contenuto nella variabile id
                formState.step += 1; //perchè answers risulterebbe così answers: {id: "name"} e quindi si cerca "dentro" la proprietà id, ovvero name
                formState.error = "";
            } else {
                formState.error = `Please enter your ${id}`;
            }
    }
   
</script>
 
<h1>Form Page</h1>
 
<Header name = {formState.answers?.name}/> <!--? -> se c'è lo metto senno niente-->

{#if formState.step >= QUESTION.length}
    <p>Thank you for your answers, {formState.answers.name}!</p>
{:else}
    <p>Step: {formState.step + 1}</p> <!--Per un utente sarebbe meglio vedere 1 invece di 0-->
 {/if}
 
{#each QUESTION as {id, question,type}, bob} <!--bob è il contatore che conterà ogni singola iterazione-->
    {#if formState.step === bob} <!--Prende come parametri id, question e type destrutturati--> 
        {@render formStep({id, question, type})}
    {/if}
{/each}
 
<!-- {JSON.stringify(formState)} -->
 
   
         <!--<button onclick = {() => {
            if (formState.birthday !== ""){
                formState.step += 1;
                formState.error = "";
            } else {
                formState.error = "Please enter your birthday";
            }
        }}>Next</button> -->
 
 
{#if formState.error}
    <p>{formState.error}</p>
{/if}
 
{#snippet formStep ({id,question,type})} <!--Prende come parametri id, question e type destrutturati-->
<div>
    <label for = {id}>{question} </label>
    <input {type} bind:value = {formState.answers[id]} /> <!--per collegare l'input a una variabile usiamo bind-->
</div>
<button onclick={() => nextStep(id)}>Next</button> <!--IMPORTANTISSIMO: quando richiamo una funzione con un parametro uso l'arrow function -->
{/snippet}