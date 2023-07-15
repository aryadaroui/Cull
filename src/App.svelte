<script lang="ts">
  import { open } from "@tauri-apps/api/dialog";
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
      entries.forEach((entry) => {
        console.log("entry: ", entry);
      });
    });
  }

  let viewer: ImageViewer;

  onMount(() => {
    viewer = new ImageViewer(canvas);

    // call the reset() function when the user presses the enter key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        viewer.reset();
      }

      if (e.key === "o" && e.metaKey) {
        choose_dir();
      }

      if (e.key === "ArrowRight") {
        // viewer.next();
        console.log("next");
      }

      if (e.key === "ArrowLeft") {
        // viewer.prev();
        console.log("prev");
      }
    });
  });
</script>

<main id="windowframe">
  <canvas bind:this={canvas} />
  <div id="toolbar">
    <button id="choose-dir" on:click={choose_dir}> Choose folder</button>
    <button
      id="choose-dir"
      on:click={() => {
        viewer.reset();
      }}
    >
      Reset</button
    >
  </div>

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
      background-color: rgba(37, 37, 37, 1);

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
      background-color: rgba(40, 40, 40, 1);
      height: 200px;
      width: calc(100vw - 2px);
    }
  }
</style>
