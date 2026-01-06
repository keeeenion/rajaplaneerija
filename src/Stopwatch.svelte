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

{#if state.thinking}
<div class="bubble-container">
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
</div>
{/if}

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

    .bubble-container {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        height: 20px;
    }

    .bubble {
        width: 12px;
        height: 12px;
        background-color: #3b82f6; /* A nice blue */
        border-radius: 50%;
        animation: bounce 0.6s infinite alternate;
    }

    /* Stagger the animations using nth-child */
    .bubble:nth-child(2) {
        animation-delay: 0.2s;
    }

    .bubble:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes bounce {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(-15px);
        }
    }
</style>
