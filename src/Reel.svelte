<script lang="ts">
  import { lazyLoad } from "./lazy_load";

  // grab some place holder images
  async function fetchData() {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/photos?_start=0&_limit=20"
    );
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }
</script>

<div id="reel">
  {#await fetchData()}
    <p>loading</p>
  {:then items}
    {#each items as image}
      <figure>
        <img use:lazyLoad={image.url} alt={image.title} />
      </figure>
    {/each}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>

<style lang="scss">

	#reel {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;

		height: 200px;
		flex-wrap: nowrap;
		overflow-x: scroll;
		overflow-y: hidden;
		// height: 100vh;
		// width: 100vw;
		background-color: rgba(32, 32, 32, 0.7);
	}
</style>
