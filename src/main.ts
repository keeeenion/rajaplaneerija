import "./simulation/simulation";
import "./editor/editor";

import App from './App.svelte'
import { mount } from "svelte";
import { initSimulation } from "./simulation/simulation";
import { initEditor } from "./editor/editor";
import { prepareStage } from "./simulation/map_data";

mount(App, {
    target: document.getElementById('app') as HTMLElement
})

prepareStage(1)
initSimulation("assets/map.png");
initEditor();