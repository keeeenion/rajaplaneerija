<script lang="ts">
  import { activeRunId, chooseTab, runSimulation } from "./editor/editor";
  import { downloadBuiltMap, startMapBuilding, stopMapBuilding } from "./simulation/map_building";
  import type { IntersectionAction } from "./simulation/map_roads";
  import { setIntersectionAction, showIntesections } from "./simulation/map_roads";
  import { app, chosenPointA, chosenPointB } from "./simulation/simulation";

  let building = false;

  function startBuilder() {
    if (building) {
      building = false;
      return stopMapBuilding(app);
    }
    building = true;
    startMapBuilding(app);
  }

  function choosePoint(point: IntersectionAction) {
    showIntesections();
    setIntersectionAction(point);
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
        <button on:click={() => runSimulation()}>Start</button>
        <button
          class:chosenA={!!$chosenPointA}
          on:click={() => choosePoint("pointA")}>Select point A</button
        >
        <button
          class:chosenB={!!$chosenPointB}
          on:click={() => choosePoint("pointB")}>Select point B</button
        >
        <button on:click={() => startBuilder()}>Map builder</button>
        <button on:click={() => downloadBuiltMap()}>Export builder</button>
        <button class="fullscreen">Fullscreen</button>
      </div>

      <div class="sim-runs">
        {#each [1, 2, 3, 4, 5] as run}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="run"
            class:active={run === $activeRunId}
            on:click={() => chooseTab(run)}
          >
            <span>simulation_runs_this_file_name_{run}</span>
            <span class="boxes">▢ ▢ ▢</span>
          </div>
        {/each}
      </div>
    </section>
  </main>
</div>

<style>
  .chosenA {
    background-color: #0b42e8;
    color: white;
  }
  .chosenB {
    background-color: #03a503;
  }
</style>
