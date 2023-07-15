<script lang="ts">
  import Greet from "./lib/Greet.svelte";

  import { open } from "@tauri-apps/api/dialog";
  // import { appDir } from "@tauri-apps/api/path";
  import { readDir, BaseDirectory } from "@tauri-apps/api/fs";
  import { convertFileSrc } from "@tauri-apps/api/tauri";
  import { invoke } from "@tauri-apps/api/tauri";
  import { onMount } from "svelte";
  import { ImageViewer } from "./canvas";

  let canvas: HTMLCanvasElement;

  let read_dir: string;

  async function choose_dir() {
    open({
      directory: true,
      multiple: false,
      title: "Choose a directory", // including this speeds up dialog open time on macOS for unknown reason
    }).then(async (selecton) => {
      read_dir = selecton.toString();
      console.log("read dir: ", read_dir);

      const entries = await readDir(read_dir, { recursive: false });
      // console.log("entries: ", entries);

      entries.forEach((entry) => {
        console.log("entry: ", entry);
      });
    });
  }


  // works but doesnt zoom on cursor position
  onMount(() => {
    
    const viewer = new ImageViewer(canvas);

    // call the reset() function when the user presses the enter key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        viewer.reset();
      }
    });

  });
</script>

<main id="windowframe">
  <div id="toolbar">
    <button id="choose-dir" on:click={choose_dir}> Choose folder</button>
  </div>
  <canvas bind:this={canvas} />
  <div id="reel" />
</main>

<style lang="scss">



  main#windowframe {
    
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: calc(100vw - 2px);

    div#toolbar {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      height: 30px;
      width: calc(100vw - 2px);

      button#choose-dir {
        max-width: 200px;
        height: 28px;
      }
    }

    canvas {
      background-color: rgba(32, 32, 32, 0.7);
      width: calc(100vw - 2px);
      height: calc(100vh - 30px - 200px);

      cursor: grab;
      &:active {
        cursor: grabbing;
      }
    }

    div#reel {
      background-color: rgba(40, 40, 40, 1.0);
      height: 200px;
      width: calc(100vw - 2px);
    }
  }
</style>
