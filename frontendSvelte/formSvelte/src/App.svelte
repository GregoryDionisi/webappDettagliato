<!--Utilizziamo svelte e non svelte-kit perchè quest'ultimo è fullstack e quindi comprende anche il backend-->
<script>
    import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';

    let questions = $state([]);
    let results = $state();
    
    let formState = $state({
        answers: {},
        step: 0,
        error: "",
    }); //stato utilizzato per verificare se ci sono le risposte e quindi per poter andare avanti

    let loading = false;

    //array di animazioni Lottie per ogni step
    const lottieAnimations = [
        "https://lottie.host/c084d070-1921-4e2b-b1fb-83d7797f256b/jRXJCBlRZS.lottie", //animazione per lo step 1
        "https://lottie.host/7354322b-357b-48fa-94fa-09242f5bd1f3/ov3rLQErch.lottie",
        "https://lottie.host/cc7e055e-0734-48fe-a856-c40b4aa0a63d/GHZAcSSG1s.lottie",
        "https://lottie.host/288e725b-8808-405e-961e-bc64f90f7153/nT2XSX7PGk.lottie",
        "https://lottie.host/9a3f9537-ece6-42b6-8efc-2e9e245ee15b/fiWUPMFXTT.lottie",
        "https://lottie.host/20954e73-7f8a-4304-aea1-fcfa2596e1c5/VwpA9jpXib.lottie"
    ];
    
    const loopAnimations = [false, true, true, true, true, true];  //la prima animazione in loop, la seconda no

    function nextStep(id) {
        console.log("Step change:", formState.step); //debug
        if (formState.answers[id]) {
            if (formState.step < questions.length - 1) {
                loading = true; // Inizia il caricamento
                setTimeout(() => {
                    formState.step += 1;
                    formState.error = "";
                    animationKey++;
                    loading = false;
                }, 1000);
            } else {
                formState.step += 1;
                formState.error = "";
                sendAnswers();
            }
        } else {
            formState.error = `Please enter ${id}`;
        }
    }


    function resetForm() {
        formState.answers = {};
        formState.step = 0;
        formState.error = "";
    }

    //FETCH INIZIALE DELLE DOMANDE DAL BACKEND
    fetch("http://localhost:3000/questions")
        .then(response => response.json())
        .then(data => {
            questions = data;
        })
        .catch(() => {
            console.log("Error");
        });

async function sendAnswers() {
        try {
            const response = await fetch("http://localhost:3000/answers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    answers: formState.answers
                })
            });

            const data = await response.json();

            if (response.ok) {
                formState.error = "";
                fetchResults();
            } else {
                formState.error = data.error || "Error sending responses";
            }
    }catch(error) {
        console.log("Network error.");
    }
}


async function fetchResults() {
    try {
        const response = await fetch("http://localhost:3000/results");
        if (response.ok) {
            const data = await response.json();
            results = data;
            console.log(results);        
        }
    } catch (error) {
        console.error("Error fetching results:", error);
    }
}

//MODO ALTERNATIVO PER ESTRARRE LE DOMANDE DAL BACKEND USANDO LA FUNZIONE
/* async function fetchQuestions() {
        try {
            const res = await fetch("http://localhost:3000/questions");
            if (res.ok) {
                questions = await res.json(); //salva le domande nell'array
            }
        } catch (error) {
            console.error("Errore nel recupero delle domande", error);
        }
    } */   
</script>


<h1>Form Page</h1>
<h1>
    {formState.answers?.name ? formState.answers?.name : "User"}'s Form
</h1>
<div class="container">
    <div class="lottie-container">
        {#if loading}
            <div class="loading-overlay">
                <DotLottieSvelte
                    src="https://lottie.host/661906f7-583a-4c29-8204-36f923b5a4dd/GBcISFHQ0z.lottie"
                    autoplay
                    loop={true}
                    style="width: 100%; height: 100%;"/>
            </div>
        {/if}
        <DotLottieSvelte
            src={lottieAnimations[formState.step]}
            autoplay
            loop={loopAnimations[formState.step]}
            style="width: 100%; height: 100%;" />
    </div>
</div>
{#if formState.step >= questions.length}
    <p>Thank you for your answers, {formState.answers.name}!</p>
    <!-- Riepilogo risposte -->
      <div>
        <h2>Summary of your answers</h2>
        {#if results} <!--bisogna prima verificare che la richiesta a /result sia completata e che quindi dia result in output-->
        <div>
            <p><strong>{questions[0].question}:</strong> {results.name}</p>
            <p><strong>{questions[1].question}:</strong> {results.surname}</p>
            <p><strong>{questions[2].question}:</strong> {results.birthday}</p>
            <p><strong>{questions[3].question}:</strong> {results.sex}</p>
            <p><strong>{questions[4].question}:</strong> {results.skills}</p>
        </div>
            {:else}
                <p>No results found.</p>
            {/if}
        <div>
            <button
                onclick={resetForm}>
                Back to the first step
            </button>
        </div>
    </div>
{:else}
    <p>Step: {formState.step + 1}</p> <!--Per un utente sarebbe meglio vedere 1 invece di 0-->
 {/if}
 
 {#each questions as {id, question, type, options}, index}
 {#if formState.step === index} <!-- Per ogni domanda, verifica se formState.step corrisponde all'indice corrente. -->
     <div>
         {@render formStep({id, question, type, options})}
         {#if formState.error}
         <p style="color: red;">{formState.error}</p>
         {/if}
         <div>
             <button 
                 onclick={() => nextStep(id)}>
                 Next
             </button>
         </div>
     </div>
 {/if}
{/each}

<!-- {JSON.stringify(formState)} --> <!--utilizzato per il debug-->

 
{#snippet formStep ({id, question, type, options})}
<div>
    <label for={id}>{question}</label>
    {#if type === "radio"}
        <div>
            {#each options as option}
                <label>
                    <input
                        type="radio"
                        name={id}
                        value={option}
                        bind:group={formState.answers[id]}
                    />
                    <span>{option}</span> <!--tutti i radio buttons hanno lo stesso nome in modo che quando viene selezionato uno gli altri vengono deselezionati (comportamento di default dei radio buttons)-->
                </label> <!--bind:group utilizzato quando vuoi associare più input dello stesso gruppo a una singola variabile  e si usa solitamente con radio buttons e checkbox-->
            {/each}
        </div>
    {:else if type === "checkbox"}
        <div>
            {#each options as option}
                <label>
                    <input
                        type="checkbox"
                        name={id}
                        value={option}
                        bind:group={formState.answers[id]}
                    />
                    <span>{option}</span> <!--tutti i radio buttons hanno lo stesso nome in modo che quando viene selezionato uno gli altri vengono deselezionati (comportamento di default dei radio buttons)-->
                </label> <!--bind:group utilizzato quando vuoi associare più input dello stesso gruppo a una singola variabile  e si usa solitamente con radio buttons e checkbox-->
            {/each}
        </div>
    {:else}
        <input 
            {type} 
            id={id} 
            bind:value={formState.answers[id]}
        />
    {/if}
</div>
{/snippet}

<style>
    .lottie-container {
        width: 400px; //dimensioni animazione
        height: 400px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
    }

    .container {
        height: 25vh;
        
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>







