import * as Blockly from "blockly";
import toolbox from './toolbox'

// define blocks
import './blocks/starting_intesection';
import './blocks/finish_intesection';
import './blocks/distance_between_intersections';
import './blocks/roads_for_intersection';

function createLeiaTeekondProcedure(workspace: Blockly.Workspace) {
    // add the starting point always
    Blockly.serialization.blocks.append(
        {
            editable: false,
            deletable: false,
            type: 'procedures_defnoreturn',
            x: 50,
            y: 50,
            fields: {
                NAME: 'leia teekond',
            },
            extraState: {
                params: ['start', 'end'],
            },
        },
        workspace
    );
}

const blocklyDiv = document.getElementById('blocklyDiv');
if (blocklyDiv) {
    const workspace = Blockly.inject(blocklyDiv, {
        toolbox,
        move: {
            drag: true,
            scrollbars: true,
            wheel: true
        }
    });

    createLeiaTeekondProcedure(workspace);
}