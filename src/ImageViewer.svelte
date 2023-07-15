<script lang="ts">
  import { onMount } from "svelte";

  export function set_image(path: string) {
    img_node.src = path;
  }

  export function reset() {
    zoom = 1;
    pan_x = 0;
    pan_y = 0;
    img_node.style.transition = `transform 0.2s`;
    img_node.style.transform = `translate(${pan_x}px, ${pan_y}px) scale(${zoom})`;
  }

  //   export let src: string;
  let viewer: HTMLElement;
  let img_node: HTMLImageElement;

  let zoom: number = 1;
  let pan_x: number = 0;
  let pan_y: number = 0;

  onMount(() => {
    // img_node.src = src;
    img_node.src = "/untitled.jpg";

    viewer.addEventListener("wheel", handle_zoom);
    viewer.addEventListener("mousedown", () => {
      viewer.addEventListener("mousemove", handle_pan);
    });
    viewer.addEventListener("mouseup", () => {
      viewer.removeEventListener("mousemove", handle_pan);
    });

    img_node.addEventListener("transitionend", () => {
      img_node.style.transition = "";
    });
  });

  function transform_string(pan_x: number, pan_y: number, zoom: number) {
    return `translate(${pan_x}px, ${pan_y}px) scale(${zoom})`;
  }

  function handle_zoom(event: WheelEvent) {
    img_node.style.transition = "";
    const delta = event.deltaY;
    const zoom_factor = 0.1;

    if (delta > 0) {
      zoom -= zoom_factor;
    } else {
      zoom += zoom_factor;
    }

    zoom = Math.max(0.1, zoom);
    img_node.style.transform = transform_string(pan_x, pan_y, zoom);
  }

  function handle_pan(event: MouseEvent) {
    img_node.style.transition = "";
    pan_x += event.movementX;
    pan_y += event.movementY;
    img_node.style.transform = transform_string(pan_x, pan_y, zoom);
  }
</script>

<div bind:this={viewer}>
  <!-- svelte-ignore a11y-missing-attribute -->
  <img bind:this={img_node} />
</div>

<style lang="scss">
  div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    overflow: hidden;
    background-color: rgba(32, 32, 32, 0.7);
    user-select: none;
    -webkit-user-drag: none;
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }

  img {
    user-select: none;
    -webkit-user-drag: none;
    // width: 50%;
    height: 100%;
    width: auto;

    // transition: transform 0.25s;

    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }
</style>
