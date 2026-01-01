import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';

const TYPE = 'roads_for_intersection';

/* -------- Block definition -------- */
Blockly.Blocks[TYPE] = {
  init() {
    this.appendValueInput('INTERSECTION')
      .setCheck('Number')
      .appendField('teed ristmikul');

    this.setOutput(true); // List / Array
    this.setColour(210);
    this.setTooltip('Tagastab kõik teed, mis on ühendatud antud ristmikuga');
  },
};

/* -------- Generator -------- */
javascriptGenerator.forBlock[TYPE] = (block) => {
  const intersection =
    javascriptGenerator.valueToCode(
      block,
      'INTERSECTION',
      Order.ATOMIC
    ) || '0';

  return [
    `simulation.roadsForIntersection(${intersection})`,
    Order.FUNCTION_CALL,
  ];
};
