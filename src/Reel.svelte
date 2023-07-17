<script lang="ts">
  import { onMount } from "svelte";
  import { invoke } from "@tauri-apps/api/tauri";
  import { convertFileSrc } from "@tauri-apps/api/tauri";
  import ImageBlobReduce from "image-blob-reduce";

  // import { lazyLoad } from "./lazy_load";

  let reel: HTMLDivElement;
  let images: string[] = [];
  // let rust_test: HTMLImageElement;

  const reducer = new ImageBlobReduce();

  export function set_images(imgs: string[]) {
    images = imgs;
  }

  export function next() {
    reel.scrollBy(100, 0);
  }

  export function prev() {
    reel.scrollBy(-100, 0);
  }

  let lazy_load_opts = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  };

  export const lazyLoad = (image, src_url) => {
    const loaded = () => {
      image.style.opacity = "1"; // REPL hack to apply loading animation
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // console.log("src_url: ", src_url);
        // invoke("downscale_img", {
        //   img_file_path: src_url,
        // }).then((res) => {
        //   image.src = "data:image/jpeg;base64," + res;
        // });

        let img_blob = fetch(convertFileSrc(src_url)).then((r) => {
          r.blob().then((blob) => {
            reducer.toBlob(blob, { max: 150 }).then((blob) => {
              image.src = URL.createObjectURL(blob);
            });
          });
        });

        // image.src = src_url; // replace placeholder src with the image src on observe
        if (image.complete) {
          // check if instantly loaded
          loaded();
        } else {
          image.addEventListener("load", loaded); // if the image isn't loaded yet, add an event listener
        }
      }
    }, lazy_load_opts);
    observer.observe(image); // intersection observer

    return {
      destroy() {
        image.removeEventListener("load", loaded); // clean up the event listener
      },
    };
  };

  onMount(() => {
    // Invoke the command
    // invoke("downscale_img", {
    //   img_file_path:
    //     "/Users/aryadaroui/Documents/Code/Cull/Test_data/small.png",
    // }).then((res) => {
    //   // print class name of res
    //   // console.log(res.constructor.name);
    //   rust_test.src = "data:image/jpeg;base64," + res;
    // });

    reel.addEventListener("wheel", (event) => {
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

  <div class="reel-item">
    <!-- <img bind:this={rust_test} /> -->
  </div>

  {#each images as image}
    <div class="reel-item">
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- <img src={image} /> -->
      <img use:lazyLoad={image} />
    </div>
  {/each}

  <div class="reel-item">
    <div id="pad" />
  </div>

  <div id="center-marker" />
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

    .reel-item {
      border: 1px solid gray;
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
      image-rendering: optimizeSpeed;
    }

    #center-marker {
      position: absolute;
      left: 50vw;
      width: 1px;
      height: 200px;
      border: 1px solid white;
    }
  }
</style>
