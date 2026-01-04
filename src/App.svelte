<script lang="ts">
  import { get } from "svelte/store";
  import {
    activeRunId,
    chooseTab,
    loadWorkspaceFromXml,
    runAllSimulations,
    runs,
    runSimulation,
  } from "./editor/editor";
  import {
    downloadBuiltMap,
    startMapBuilding,
    stopMapBuilding,
  } from "./simulation/map_building";
  import type { IntersectionAction } from "./simulation/map_roads";
  import {
    setIntersectionAction,
    showIntesections,
  } from "./simulation/map_roads";
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

  function newRun() {
    runs.update((r) => [...r, { color: "#ff0000", xml: null }]);
  }

  function deleteRun(idx: number) {
    const r = get(runs);
    runs.update((r) => {
      if (get(activeRunId) === idx) {
        activeRunId.set(0);
      }
      return r.filter((f, i) => i !== idx);
    });
  }

  let fileInput: HTMLInputElement;
  let forTab: number | undefined;

  function openFileBrowser(idx: number) {
    forTab = idx;
    fileInput.click();
  }

  async function handleFiles(event: Event) {
    console.log(forTab);
    const target = event.target as HTMLInputElement;
    const files = target.files
    console.log(files)
    if (files?.length && files?.length >= 1 && forTab != undefined) {
      const f = files[0];
      chooseTab(forTab)
      const content = await f.text()
      loadWorkspaceFromXml(content)
    }
  }

  function downloadTab(idx: number) {
    const name = prompt("Meeskonna nimi:");
    if (!name) return;

    const r = get(runs);
    console.log(r[idx].xml)
    const blob = new Blob([r[idx].xml || ""], {
      type: "application/xml",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.xml`;
    a.click();

    URL.revokeObjectURL(url);
  }
</script>

<div class="app">
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
        <button on:click={() => runSimulation()}>Jooksuta</button>
        <button on:click={() => runAllSimulations()}>Jooksuta kõiki</button>
        <button
          class:chosenA={!!$chosenPointA}
          on:click={() => choosePoint("pointA")}>Vali alguspunk</button
        >
        <button
          class:chosenB={!!$chosenPointB}
          on:click={() => choosePoint("pointB")}>Vali sihtpunkt</button
        >
        <!-- <button on:click={() => startBuilder()}>Map builder</button>
        <button on:click={() => downloadBuiltMap()}>Export builder</button> -->
        <!-- <button class="fullscreen">Fullscreen</button> -->
      </div>

      <div class="sim-runs">
        {#each $runs as run, idx}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="run"
            class:active={idx === $activeRunId}
            on:click={() => chooseTab(idx)}
          >
            <span>Katse {idx}</span>
            <span class="boxes">
              <button on:click={() => openFileBrowser(idx)}>Loe fail</button>
              <input
                type="file"
                accept=".xml"
                bind:this={fileInput}
                on:change={handleFiles}
                style="display: none;"
              />

              <button on:click={() => downloadTab(idx)}>Lae alla</button>
              <button
                disabled={$runs.length <= 1}
                on:click={() => deleteRun(idx)}>X</button
              >
            </span>
          </div>
        {/each}
        <button on:click={() => newRun()}>+ lisa</button>
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
