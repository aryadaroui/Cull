<script lang="ts">
  export let choose_dir: () => void;
  //   export let filter: () => void;
  //   export let export_files: () => void;

  //   export let heart: () => void;
  //   export let star_1: () => void;
  //   export let star_2: () => void;
  //   export let star_3: () => void;

  export let filename: string = "untitled.jpg";

  export let center: () => void;
  //   export let settings: () => void;
</script>

<div id="toolbar">
  <div class="group">
    <button id="choose-dir" on:click={choose_dir}>Choose folder</button>
    <button id="filter">Filter</button>
    <button id="export">Export</button>
  </div>

  <div class="group">
    <button id="heart">❤️</button>
    <div class="spacer" />
    <button id="star-1">⭐️</button>
    <button id="star-2">⭐️</button>
    <button id="star-3">⭐️</button>
  </div>

  <p>{filename}</p>
  <div class="spacer" />
  <button id="center" on:click={center}>Center</button>
  <button id="settings">Settings</button>
</div>

<style lang="scss">
  div#toolbar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 30px;
    width: calc(100vw - 2px);
    background-color: rgba(37, 37, 37, 1);

    button {
      max-width: 200px;
      height: 28px;
      user-select: none;
      -webkit-user-select: none;
      -webkit-user-drag: none;
    }
    p {
      font-family: sans-serif;
      color: #aaa;
      user-select: none;
      -webkit-user-select: none;
      -webkit-user-drag: none;
      cursor: default;
    }
  }

  div.group {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 30px;
    width: calc(100vw - 2px);
    background-color: rgba(37, 37, 37, 1);
  }

  div.spacer {
    width: 2%;
    max-width: 10px;
  }
</style>
