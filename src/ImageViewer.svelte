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

      const cursor_x = event.clientX - viewer.clientLeft;
      const cursor_y = event.clientY - viewer.clientTop;
      const cursor_x_ratio = cursor_x / viewer.clientWidth;
      const cursor_y_ratio = cursor_y / viewer.clientHeight;

      const zoom_factor = 0.08;
      const max_zoom = 10;
      const min_zoom = 0.1;
      const zoom_delta = (event.deltaY > 0 ? -1 : 1) * zoom_factor;
      const new_zoom = Math.min(
        Math.max(zoom + zoom_delta, min_zoom),
        max_zoom
      );

      const pan_x_delta =
        (cursor_x_ratio - 0.5) * viewer.clientWidth * (zoom - new_zoom);
      const pan_y_delta =
        (cursor_y_ratio - 0.5) * viewer.clientHeight * (zoom - new_zoom);
      const new_pan_x = pan_x + pan_x_delta;
      const new_pan_y = pan_y + pan_y_delta;

      zoom = new_zoom;
      pan_x = new_pan_x;
      pan_y = new_pan_y;

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
