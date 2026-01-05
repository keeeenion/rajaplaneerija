<script lang="ts">
    import type { StopwatchActions } from "./timer";

    export let timer: StopwatchActions;
    export let name: string;
    export let color: string;

    $: state = $timer;

    function stoptime(ms: number): string {
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        const c = Math.floor((ms % 1000) / 10);
        return `${m}:${(s % 60).toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}`;
    }
</script>

<div class="timer-item" style="border-left: 4px solid {color}">
    <span class="timer-name">{name}</span>
    <span class="timer-value">{stoptime(state.elapsed)}</span>
</div>

<style>
    .timer-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #f5f5f5;
        border-radius: 4px;
    }

    .timer-name {
        margin-right: 5px;
    }

    .timer-value {
        font-weight: bold;
        font-family: monospace;
        font-size: 15px;
    }
</style>
