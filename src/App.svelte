<script>
  import { downloadBuiltMap, stopMapBuilding } from "./simulation/map_building";
  import { setIntersectionAction } from "./simulation/map_roads";

  let building = false;

  function startMapBuilding() {
    if (building) {
      building = false;
      return stopMapBuilding(app);
    }
    building = true;
    startMapBuilding(app);
  }
</script>

<div class="app">
  <!-- Top toolbar -->
  <header class="toolbar">
    <button>Save</button>
    <button>Open</button>
    <button>New</button>
    <button>Settings</button>
  </header>

  <!-- Main content -->
  <main class="main">
    <!-- Left side: editor -->
    <div id="blocklyDiv"></div>

    <!-- Right side: simulation -->
    <section class="simulation-area">
      <div class="simulation-map">
        <div id="pixiContainer"></div>
      </div>

      <div class="sim-controls">
        <button id="start-simulation">Start</button>
        <button on:click={() => setIntersectionAction("pointA")}
          >Select point A</button
        >
        <button on:click={() => setIntersectionAction("pointB")}
          >Select point B</button
        >
        <button on:click={() => startMapBuilding()}>Map builder</button>
        <button on:click={() => downloadBuiltMap()}>Export builder</button>
        <button class="fullscreen">Fullscreen</button>
      </div>

      <div class="sim-runs">
        {#each [1, 2, 3, 4, 5] as run}
          <div class="run" data-run={run}>
            <span>simulation_runs_this_file_name_{run}</span>
            <span class="boxes">▢ ▢ ▢</span>
          </div>
        {/each}
      </div>
    </section>
  </main>
</div>

<style>
  /* Optional: move styles.css here or keep external */
</style>
