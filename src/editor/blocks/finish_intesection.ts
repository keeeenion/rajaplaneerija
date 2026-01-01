import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

const TYPE = 'finish_intesection';

Blockly.Blocks[TYPE] = {
  init() {
    this.appendDummyInput()
      .appendField('Sihtpunkt');

    this.setOutput(true, 'Number');
    this.setColour(210);
    this.setTooltip('');
  },
};

javascriptGenerator.forBlock[TYPE] = () => {
  return ['simulation.startingIntersection', 5]; // todo
};
