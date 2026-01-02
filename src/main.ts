import "./simulation/simulation";
import "./editor/editor";

import App from './App.svelte'
import { mount } from "svelte";
import { initSimulation } from "./simulation/simulation";
import { initEditor } from "./editor/editor";

mount(App, {
    target: document.getElementById('app') as HTMLElement
})

initSimulation("assets/map.png");
initEditor();