<script>
    let {name} = $props()
</script>

<div>
    <!--{#if name}
        <h1>{name}'s form</h1>
    {/if}-->

    <h1>
    {name ? name : "User"}'s Form
    </h1>
</div>