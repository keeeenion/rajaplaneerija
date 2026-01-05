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
      .appendField('Kaal kahe naabri vahel');

    this.appendValueInput('B')
      .setCheck('Ristmik')
    // .appendField('kaugus naabrist B');

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

const TYPE_GETTER = "simulation_getters"

// Block definition
Blockly.Blocks[TYPE_GETTER] = {
  init() {
    this.appendDummyInput()
      .appendField('Küsi')
      .appendField(new Blockly.FieldDropdown([
        ['NUMBER', 'NUMBER'],
        ['NAABRID', 'NAABER'],
        ['KOORDINAAT', 'KOORDINAAT'],

        ['KAUGUS', 'KAUGUS'],
        ['EELMINE RISTMIK', 'EELMINE_RISTMIK'],
        ['KAS KÜLASTATUD', 'KAS_KÜLASTATUD'],
        ['KAS AVASTATUD', 'KAS_AVASTATUD'],
      ]), 'MODE')
      .appendField('ristmikult');

    this.appendValueInput('CENTER')
      .setCheck('Ristmik');

    this.setOutput(true, this.getOutputType());

    this.setInputsInline(true);
    this.setColour(300);
  },

  getOutputType() {
    const mode = this.getFieldValue('MODE');
    switch (mode) {
      case 'NUMBER':
      case 'KAUGUS':
        return 'Number';
      case 'NAABER':
      case 'EELMINE_RISTMIK':
        return 'Ristmik';
      case 'KOORDINAAT':
        return 'Array';
      case 'KAS_KÜLASTATUD':
      case 'KAS_AVASTATUD':
        return 'Boolean';
      default:
        return null;
    }
  }
};

// JavaScript generator
javascriptGenerator.forBlock[TYPE_GETTER] = function(block: any) {
  const mode = block.getFieldValue('MODE');
  const center = Blockly.JavaScript.valueToCode(block, 'CENTER', Blockly.JavaScript.ORDER_ATOMIC);

  switch (mode) {
    case 'NUMBER':
      return [`getNumber(${center})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    case 'NAABER':
      return [`getNeighbor(${center})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    case 'KAUGUS':
      return [`getDistance(${center})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    case 'KOORDINAAT':
      return [`getCoordinate(${center})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    case 'EELMINE_RISTMIK':
      return [`getPreviousIntersection(${center})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    case 'KAS_KÜLASTATUD':
      return [`isVisited(${center})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    case 'KAS_AVASTATUD':
      return [`isDiscovered(${center})`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    default:
      return ['null', Blockly.JavaScript.ORDER_ATOMIC];
  }
};

const TYPE_IN_LIST = 'ristmik_in_list';

Blockly.Blocks[TYPE_IN_LIST] = {
  init() {
    this.appendValueInput('LIST')
      .setCheck('Array')
      .appendField('Kas listis');

    this.appendValueInput('RISTMIK')
      .setCheck('Ristmik')
      .appendField('on ristmik');

    this.setOutput(true, 'Boolean');
    this.setColour(300);
  },
};

javascriptGenerator.forBlock[TYPE_IN_LIST] = (block) => {
  const list =
    javascriptGenerator.valueToCode(block, 'LIST', Order.ATOMIC) || '[]';

  const ristmik =
    javascriptGenerator.valueToCode(block, 'RISTMIK', Order.ATOMIC) || 'null';

  return [
    `${list}.includes(${ristmik})`,
    Order.FUNCTION_CALL,
  ];
};

const TYPE_DEBUG = 'debug_block';

Blockly.Blocks[TYPE_DEBUG] = {
  init() {
    this.appendValueInput('VALUE')
      .appendField('Debug: ')
      .appendField(new Blockly.FieldTextInput('Kirjeldus'), 'TEXT');

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  },
};

javascriptGenerator.forBlock[TYPE_DEBUG] = (block) => {
  const value =
    javascriptGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'undefined';

  const text = block.getFieldValue('TEXT') || '';

  return `simulation.debug(${JSON.stringify(text)}, ${value});\n`;
};
