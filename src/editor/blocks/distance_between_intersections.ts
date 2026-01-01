import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';

const TYPE = 'distance_between_intersections';

/* -------- Block definition -------- */
Blockly.Blocks[TYPE] = {
  init() {
    this.appendValueInput('A')
      .setCheck('Number')
      .appendField('Ristmiku');

    this.appendValueInput('B')
      .setCheck('Number')
      .appendField('kaugust ristmikust');

    this.setOutput(true, 'Number');
    this.setColour(210);
    this.setTooltip('Tagastab kahe ristmiku vahelise kauguse');
  },
};

/* -------- Generator -------- */
javascriptGenerator.forBlock[TYPE] = (block) => {
  const A =
    javascriptGenerator.valueToCode(block, 'A', Order.ATOMIC) || '0';

  const B =
    javascriptGenerator.valueToCode(block, 'B', Order.ATOMIC) || '0';

  return [
    `simulation.distanceBetween(${A}, ${B})`,
    Order.FUNCTION_CALL,
  ];
};
