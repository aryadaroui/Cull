<script lang="ts">
  import { onMount } from "svelte";

  export function set_image(path: string) {
    img_node.src = path;
  }

  export function reset() {
    zoom = 1;
    pan_x = 0;
    pan_y = 0;
    velocity_x = 0;
    velocity_y = 0;

    img_node.style.transition = `transform 0.2s cubic-bezier(.5, 1.5, .7, .9)`;
    img_node.style.transform = transform_string(pan_x, pan_y, zoom);
  }

  //   export let src: string;
  let viewer: HTMLElement;
  let img_node: HTMLImageElement;

  let zoom: number = 1;
  let pan_x: number = 0;
  let pan_y: number = 0;
  let velocity_x: number = 0;
  let velocity_y: number = 0;

  onMount(() => {
    // img_node.src = src;
    img_node.src = "/untitled.jpg";

    let last_x: number = 0;
    let last_y: number = 0;
    let is_dragging: boolean = false;

    img_node.addEventListener("transitionend", () => {
      img_node.style.transition = "";
    });

    viewer.addEventListener("wheel", (event) => {
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
    });

    viewer.addEventListener("mousedown", (event: MouseEvent) => {
      event.preventDefault();
      is_dragging = true;
      last_x = event.clientX;
      last_y = event.clientY;
    });

    viewer.addEventListener("mousemove", (event: MouseEvent) => {
      if (is_dragging) {
        const delta_x = event.clientX - last_x;
        const delta_y = event.clientY - last_y;
        last_x = event.clientX;
        last_y = event.clientY;
        pan_x += delta_x;
        pan_y += delta_y;
        img_node.style.transform = transform_string(pan_x, pan_y, zoom);
        velocity_x = delta_x;
        velocity_y = delta_y;
      }
    });

    viewer.addEventListener("mouseup", () => {
      is_dragging = false;
      const inertia_interval = setInterval(() => {
        if (Math.abs(velocity_x) < 0.1 && Math.abs(velocity_y) < 0.1) {
          clearInterval(inertia_interval);
          return;
        }
        pan_x += velocity_x;
        pan_y += velocity_y;
        img_node.style.transform = transform_string(pan_x, pan_y, zoom);
        velocity_x *= 0.97;
        velocity_y *= 0.97;
      }, 1);
    });
  });

  function transform_string(pan_x: number, pan_y: number, zoom: number) {
    return `translate(${pan_x}px, ${pan_y}px) scale(${zoom})`;
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
    -webkit-user-select: none;
    -webkit-user-drag: none;
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }

  img {
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
    height: 100%;
    width: auto;

    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }
</style>
