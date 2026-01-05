<script lang="ts">
  import { get } from "svelte/store";
  import {
    activeRunId,
    chooseTab,
    loadWorkspaceFromXml,
    runs,
    saveCurrentTab,
    tabName,
  } from "./editor/editor";
  import {
    downloadBuiltMap,
    startMapBuilding,
    stopMapBuilding,
  } from "./simulation/map_building";
  import type { IntersectionAction } from "./simulation/map_roads";
  import { setIntersectionAction, showMap } from "./simulation/map_roads";
  import { app, chosenPointA, chosenPointB } from "./simulation/simulation";
  import { debugs } from "./store";
  import { runAllSimulations, runSimulation } from "./runner";
  import { startCompetition } from "./competition";
  import { stopwatchList } from "./timer";
  import Stopwatch from "./Stopwatch.svelte";

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
    showMap();
    setIntersectionAction(point);
  }

  function newRun() {
    runs.update((r) => [...r, { color: "#ff0000", xml: null }]);
  }

  function deleteRun(idx: number) {
    saveCurrentTab();
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
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files?.length && files?.length >= 1 && forTab != undefined) {
      const f = files[0];
      chooseTab(forTab);
      const content = await f.text();
      loadWorkspaceFromXml(content);
    }
  }

  function downloadTab(idx: number) {
    const name = prompt("Meeskonna nimi:");
    if (!name) return;

    saveCurrentTab();

    const r = get(runs);
    console.log(r[idx].xml);
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

  function fullscreen() {
    const container = document.getElementById("fullscreen");
    container?.requestFullscreen();
    // app.renderer.resize(window.width, window.innerHeight);
    // Optional: scale your stage if needed
    // app.stage.scale.x = window.innerWidth / 800;
    // app.stage.scale.y = window.innerHeight / 600;
  }

  function updateRun(e: Event, idx: number) {
    runs.update((r) => {
      r[idx].name =
        (e.currentTarget as HTMLElement)?.textContent || `Katse ${idx}`;
      return r;
    });
  }

  const stoptime = (ms: number): string => {
    const seconds = (ms / 1000) % 60;
    const minutes = (ms / (1000 * 60)) % 60;
    const centiseconds = (ms / 10) % 100;

    return `${Math.floor(minutes).toString().padStart(2, "0")}:${Math.floor(
      seconds,
    )
      .toString()
      .padStart(2, "0")}.${Math.floor(centiseconds)
      .toString()
      .padStart(2, "0")}`;
  };
</script>

<div class="app">
  <!-- Main content -->
  <main class="main">
    <!-- Left side: editor -->
    <div id="blocklyDiv"></div>

    <!-- Right side: simulation -->
    <section id="fullscreen" class="simulation-area">
      <div class="simulation-map">
        <div id="pixiContainer"></div>
      </div>

      {#if !$stopwatchList.length}
        <div class="sim-controls">
          <button on:click={() => runSimulation()}>Jooksuta</button>
          <button on:click={() => runAllSimulations()}>Jooksuta kõiki</button>
          <button on:click={() => startCompetition()}>Compete</button>
          <button
            class:chosenA={!!$chosenPointA}
            on:click={() => choosePoint("pointA")}>Vali alguspunkt</button
          >
          <button
            class:chosenB={!!$chosenPointB}
            on:click={() => choosePoint("pointB")}>Vali sihtpunkt</button
          >
          <!-- <button on:click={() => startBuilder()}>Map builder</button>
          <button on:click={() => downloadBuiltMap()}>Export builder</button> -->
          <!-- <button class="fullscreen" on:click={() => fullscreen()}
            >Fullscreen</button
          > -->
        </div>
      {/if}

      {#if $stopwatchList.length}
        <div class="leaderboard">
          {#each $stopwatchList as timer, idx}
            <Stopwatch
              {timer}
              name={$runs[idx].name || tabName(idx)}
              color={$runs[idx].color}
            />
          {/each}
        </div>
      {/if}

      <div class="sim-runs">
        {#each $runs as run, idx}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="run"
            class:active={idx === $activeRunId}
            on:click={() => chooseTab(idx)}
          >
            <span contenteditable on:blur={(e) => updateRun(e, idx)}
              >{tabName(idx)}</span
            >
            <span class="boxes">
              <input
                type="color"
                value={run.color}
                on:change={(e) => {
                  runs.update((r) => {
                    r[idx].color = e.currentTarget.value;
                    return r;
                  });
                }}
              />

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

      <div class="debug-window">
        {#each $debugs as entry}
          <p>{entry}</p>
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

  .leaderboard {
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 10px;
  }
</style>
