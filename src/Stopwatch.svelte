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
    <div class="name-container">
        {#if state.thinking}
            <div class="bubble-container">
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
            </div>
        {/if}
        <span class="timer-name">{name}</span>
    </div>

    <span class="timer-value">
        {#if state.failed}
            <span class="failed-x">✕</span>
        {:else}
            {stoptime(state.elapsed)}
        {/if}
    </span>
</div>

<style>
    .timer-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #f5f5f5;
        border-radius: 4px;
        margin-top: 20px;
    }

    .name-container {
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .timer-name {
        margin-right: 5px;
    }

    .timer-value {
        font-weight: bold;
        font-family: monospace;
        font-size: 15px;
    }

    .failed-x {
        color: #ef4444;
        font-size: 18px;
        font-family: Arial, sans-serif;
    }

    .bubble-container {
        position: absolute;
        top: -25px;
        left: 0;
        display: flex;
        gap: 4px;
        align-items: center;
        height: 20px;
    }

    .bubble {
        width: 6px;
        height: 6px;
        background-color: #3b82f6;
        border-radius: 50%;
        animation: bounce 0.6s infinite alternate;
    }

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
            transform: translateY(-8px);
        }
    }
</style>
