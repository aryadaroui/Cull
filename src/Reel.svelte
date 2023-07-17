<script lang="ts">
  import { onMount } from "svelte";
  import { lazyLoad } from "./lazy_load";

  let reel: HTMLDivElement;
  let images: string[] = ["/untitled.jpg"];

  export function set_images(imgs: string[]) {
    images = imgs;
  }

  export function next() {
    reel.scrollBy(100, 0);
  }

  export function prev() {
    reel.scrollBy(-100, 0);
  }

  //   // grab some place holder images
  //   async function fetchData() {
  //     const res = await fetch(
  //       "https://jsonplaceholder.typicode.com/photos?_start=0&_limit=20"
  //     );
  //     const data = await res.json();

  //     if (res.ok) {
  //       return data;
  //     } else {
  //       throw new Error(data);
  //     }
  //   }

  onMount(() => {
    reel.addEventListener("wheel", (event) => {
      // console.log(event.deltaY);

      if (!event.deltaY) {
        return;
      } else if (Math.abs(event.deltaY) < 20) {
        // ignore small movements, like trackpad scrolling
        return;
      }

      //@ts-ignore - .scrollLeft IS a property of currentTarget
      event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
      event.preventDefault();
    });
  });

  //   {#await fetchData()}
  //     <p>loading</p>
  //   {:then items}
  //     {#each items as image}
  //       <figure>
  //         <!-- svelte-ignore a11y-missing-attribute -->
  //         <img use:lazyLoad={image.url} />
  //       </figure>
  //     {/each}
  //   {:catch error}
  //     <p style="color: red">{error.message}</p>
  //   {/await}
</script>

<div bind:this={reel} class="reel">
  <div class="reel-item">
    <div id="pad" />
  </div>

  {#each images as image}
    <div class="reel-item">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src={image} />
    </div>
  {/each}

  <div class="reel-item">
    <div id="pad" />
  </div>

  <!-- <div id="center-marker" /> -->
</div>

<style lang="scss">
  div.reel {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    // justify-content: center;
    scroll-behavior: smooth;
    align-items: center;

    background-color: rgba(40, 40, 40, 1);
    height: 200px;
    width: calc(100vw - 2px);
    flex-wrap: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    // height: 100vh;
    // width: 100vw;
    background-color: rgba(32, 32, 32, 0.7);

    scroll-snap-type: x mandatory;

    ::-webkit-scrollbar {
		width: 0;
      display: none;
    }

    #pad {
      width: calc(50vw - 75px - 20px - 2px);
      height: 200px;
      background-color: rgba(16, 16, 16, 0.2);
    }

    img {
      max-height: 150px;
      scroll-snap-align: center;
      cursor: pointer;
      margin: 0 20px;
      // scroll-margin-left: 50vw;
    }

    #center-marker {
      position: absolute;
      left: 50vw;
      width: 1px;
      height: 200px;
      border: 1px solid red;
    }
  }
</style>
