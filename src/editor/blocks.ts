import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';


const TYPE_START = 'start_intersection';

Blockly.Blocks[TYPE_START] = {
  init() {
    this.appendDummyInput()
      .appendField('Alguspunkt');

    this.setOutput(true, 'Ristmik');
    this.setColour(200);
  },
};

javascriptGenerator.forBlock[TYPE_START] = () => {
  return ['simulation.startIntersection()', Order.FUNCTION_CALL];
};

const TYPE_TARGET = 'target_intersection';

Blockly.Blocks[TYPE_TARGET] = {
  init() {
    this.appendDummyInput()
      .appendField('Sihtpunkt');

    this.setOutput(true, 'Ristmik');
    this.setColour(200);
  },
};

javascriptGenerator.forBlock[TYPE_TARGET] = () => {
  return ['simulation.targetIntersection()', Order.FUNCTION_CALL];
};

const TYPE_DISTANCE = 'intersection_distance';

Blockly.Blocks[TYPE_DISTANCE] = {
  init() {
    this.appendValueInput('A')
      .setCheck('Ristmik')
      .appendField('Ristmiku A');

    this.appendValueInput('B')
      .setCheck('Ristmik')
      .appendField('kaugus ristmikust B');

    this.setOutput(true, 'Number');
    this.setColour(210);
  },
};

javascriptGenerator.forBlock[TYPE_DISTANCE] = (block) => {
  const A = javascriptGenerator.valueToCode(block, 'A', Order.ATOMIC) || 'null';
  const B = javascriptGenerator.valueToCode(block, 'B', Order.ATOMIC) || 'null';

  return [
    `simulation.distanceBetween(${A}, ${B})`,
    Order.FUNCTION_CALL,
  ];
};

const TYPE_NEIGHBORS = 'intersection_neighbors';

Blockly.Blocks[TYPE_NEIGHBORS] = {
  init() {
    this.appendValueInput('NODE')
      .setCheck('Ristmik')
      .appendField('Küsi ristmiku naabreid');

    this.setOutput(true, 'Array');
    this.setColour(180);
  },
};

javascriptGenerator.forBlock[TYPE_NEIGHBORS] = (block) => {
  const node =
    javascriptGenerator.valueToCode(block, 'NODE', Order.ATOMIC) || 'null';

  return [`simulation.neighbours(${node})`, Order.MEMBER];
};

const TYPE_NAME = 'intersection_name';

Blockly.Blocks[TYPE_NAME] = {
  init() {
    this.appendValueInput('NODE')
      .setCheck('Ristmik')
      .appendField('Küsi ristmiku nime');

    this.setOutput(true, 'String');
    this.setColour(180);
  },
};

javascriptGenerator.forBlock[TYPE_NAME] = (block) => {
  const node =
    javascriptGenerator.valueToCode(block, 'NODE', Order.ATOMIC) || 'null';

  return [`${node}.id`, Order.MEMBER];
};

const TYPE_RANDOM_FROM_LIST = 'random_intersection_from_list';

Blockly.Blocks[TYPE_RANDOM_FROM_LIST] = {
  init() {
    this.appendValueInput('LIST')
      .setCheck('Array')
      .appendField('Vali juhuslik ristmik naabritest');

    this.setOutput(true, 'Ristmik');
    this.setColour(260);
  },
};

javascriptGenerator.forBlock[TYPE_RANDOM_FROM_LIST] = (block) => {
  const list =
    javascriptGenerator.valueToCode(block, 'LIST', Order.ATOMIC) || '[]';

  return [
    `simulation.randomNeighbour(${list})`,
    Order.MEMBER,
  ];
};

const TYPE_LIST_MINUS = 'list_minus';

Blockly.Blocks[TYPE_LIST_MINUS] = {
  init() {
    this.appendValueInput('A')
      .setCheck('Array')
      .appendField('Loend A');

    this.appendValueInput('B')
      .setCheck('Array')
      .appendField('miinus B');

    this.setOutput(true, 'Array');
    this.setColour(260);
  },
};

javascriptGenerator.forBlock[TYPE_LIST_MINUS] = (block) => {
  const A = javascriptGenerator.valueToCode(block, 'A', Order.ATOMIC) || '[]';
  const B = javascriptGenerator.valueToCode(block, 'B', Order.ATOMIC) || '[]';

  return [
    `${A}.filter(x => !${B}.includes(x))`,
    Order.FUNCTION_CALL,
  ];
};

const TYPE_MIN_DISTANCE = 'min_distance_intersection';

Blockly.Blocks[TYPE_MIN_DISTANCE] = {
  init() {
    this.appendValueInput('LIST')
      .setCheck('Array')
      .appendField('Vali lähim ristmik');

    this.setOutput(true, 'Ristmik');
    this.setColour(300);
  },
};

javascriptGenerator.forBlock[TYPE_MIN_DISTANCE] = (block) => {
  const list =
    javascriptGenerator.valueToCode(block, 'LIST', Order.ATOMIC) || '[]';

  return [
    `${list}.slice().sort((a,b)=>(a.user_distance??Infinity)-(b.user_distance??Infinity))[0]`,
    Order.FUNCTION_CALL,
  ];
};

const TYPE_GREEDY = 'greedy_neighbor';

Blockly.Blocks[TYPE_GREEDY] = {
  init() {
    this.appendValueInput('CENTER')
      .setCheck('Ristmik')
      .appendField('Vali');

    this.appendValueInput('LIST')
      .setCheck('Array')
      .appendField('naaber loendist');

    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ['LÄHIM', 'MIN'],
        ['KAUGEM', 'MAX'],
      ]), 'MODE');

    this.setOutput(true, 'Ristmik');
    this.setColour(300);
  },
};

javascriptGenerator.forBlock[TYPE_GREEDY] = (block) => {
  const center =
    javascriptGenerator.valueToCode(block, 'CENTER', Order.ATOMIC) || 'null';
  const list =
    javascriptGenerator.valueToCode(block, 'LIST', Order.ATOMIC) || '[]';
  const mode = block.getFieldValue('MODE');

  const cmp =
    mode === 'MIN'
      ? '(a,b)=>simulation.distanceBetween(center,a)-simulation.distanceBetween(center,b)'
      : '(a,b)=>simulation.distanceBetween(center,b)-simulation.distanceBetween(center,a)';

  return [
    `${list}.slice().sort(${cmp})[0]`,
    Order.FUNCTION_CALL,
  ];
};
