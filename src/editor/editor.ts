import * as Blockly from "blockly";
import toolbox from './toolbox'

const blocklyDiv = document.getElementById('blocklyDiv');
if (blocklyDiv) {
    const ws = Blockly.inject(blocklyDiv, {
        toolbox,
    });
}