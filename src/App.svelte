<script lang="ts">
  import { open } from "@tauri-apps/api/dialog";
  import { readDir, BaseDirectory } from "@tauri-apps/api/fs";
  import { convertFileSrc } from "@tauri-apps/api/tauri";
  import { invoke } from "@tauri-apps/api/tauri";
  import { onMount } from "svelte";
  import { ImageViewer } from "./canvas";
  import type { FileEntry } from "@tauri-apps/api/fs";

  let canvas: HTMLCanvasElement;
  let viewer: ImageViewer;
  let read_dir: string;
  let img_files: FileEntry[];
  let img_idx: number = 0;
  let img_node: HTMLImageElement;

  async function choose_dir() {
    open({
      directory: true,
      multiple: false,
      title: "Choose a directory", // including this speeds up dialog open time on macOS for unknown reason
    }).then(async (selecton) => {
      read_dir = selecton.toString();
      console.log("read dir: ", read_dir);

      img_files = await readDir(read_dir, { recursive: false });
      img_idx = 0;

      const path_str = convertFileSrc(img_files[img_idx].path);

      viewer.set_image(path_str);
      
      // img_node.src = path_str;
      // const start_time = new Date().getTime();
      // img_node.onload = () => {
      //   const load_time = new Date().getTime() - start_time;
      //   console.log(`Image loaded in ${load_time}ms`);
      // };
    });
  }

  function next() {
    if (img_idx < img_files.length - 1) {
      img_idx++;
    } else {
      img_idx = 0;
    }

    const path_str = convertFileSrc(img_files[img_idx].path);

    viewer.set_image(path_str);

    // const start_time = new Date().getTime();
    // img_node.src = path_str;
    // img_node.onload = () => {
    //   const load_time = new Date().getTime() - start_time;
    //   console.log(`Image loaded in ${load_time}ms`);
    // };
  }

  function prev() {
    if (img_idx > 0) {
      img_idx--;
    } else {
      img_idx = img_files.length - 1;
    }

    const path_str = convertFileSrc(img_files[img_idx].path);
    viewer.set_image(path_str);

    // img_node.src = path_str;
    // const start_time = new Date().getTime();
    // img_node.onload = () => {
    //   const load_time = new Date().getTime() - start_time;
    //   console.log(`Image loaded in ${load_time}ms`);
    // };
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      viewer.reset();
    }

    if (e.key === "o" && e.metaKey) {
      choose_dir();
    }

    if (e.key === "ArrowRight") {
      next();
    }

    if (e.key === "ArrowLeft") {
      prev();
    }
  });

  onMount(() => {
    viewer = new ImageViewer(canvas);
    // img_node.src = "./untitled.jpg";
  });
</script>

<main id="windowframe">
  <!-- <img bind:this={img_node} /> -->
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

    img {
      width: 50vw;
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
