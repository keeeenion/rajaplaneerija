import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';


const TYPE_START = 'start_intersection';

Blockly.Blocks[TYPE_START] = {
  init() {
    this.appendDummyInput()
      .appendField('alguspunkt');

    this.setOutput(true, 'Ristmik');
    this.setColour(160);
  },
};

javascriptGenerator.forBlock[TYPE_START] = () => {
  return ['simulation.startIntersection()', Order.FUNCTION_CALL];
};

const TYPE_TARGET = 'target_intersection';

Blockly.Blocks[TYPE_TARGET] = {
  init() {
    this.appendDummyInput()
      .appendField('sihtpunkt');

    this.setOutput(true, 'Ristmik');
    this.setColour(160);
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
      .appendField('ajakulu ristmikust');

    this.appendValueInput('B')
      .setCheck('Ristmik')
      .appendField('naabrini');

    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(160);
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
      .appendField('vali juhuslik ristmik loendist');

    this.setOutput(true, 'Ristmik');
    this.setColour(160);
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
      .appendField('elemendid loendist');

    this.appendValueInput('B')
      .setCheck('Array')
      .appendField('mis ei sisaldu loendis');

    this.setInputsInline(true);
    this.setOutput(true, 'Array');
    this.setColour(160);
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

const TYPE_GREEDY = 'greedy_neighbor';

Blockly.Blocks[TYPE_GREEDY] = {
  init() {
    this.appendValueInput('CENTER')
      .setCheck('Ristmik')
      .appendField('tagasta ajaliselt kõige')
      .appendField(new Blockly.FieldDropdown([
        ['SUUREMA', 'SUUREMA'],
        ['VÄIKSEMA', 'VÄIKSEMA'],
      ]), 'MODE')
      .appendField('ajakuluga naaber ristmikule');

    this.setOutput(true, 'Ristmik');
    this.setColour(160);
  },
};

javascriptGenerator.forBlock[TYPE_GREEDY] = (block) => {
  const ristmik = javascriptGenerator.valueToCode(block, 'CENTER', Order.ATOMIC);
  const mode = block.getFieldValue('MODE');

  return [
    `simulation.greedy_distance(${ristmik},"${mode}")`,
    Order.FUNCTION_CALL,
  ];
};

const TYPE_GETTER = "simulation_getters";

Blockly.Blocks[TYPE_GETTER] = {
  init(this: Blockly.Block) {
    const dropdown = new Blockly.FieldDropdown([
      ['RISTMIKU NUMBER', 'NUMBER'],
      ['NAABRID', 'NAABER'],
      ['KOORDINAAT', 'KOORDINAAT'],
      ['MÄÄRATUD AJAKULU ALGUSEST', 'KAUGUS'],
      ['MÄÄRATUD EELMINE RISTMIK', 'EELMINE_RISTMIK'],
      ['KAS MÄÄRATUD KÜLASTATUKS', 'KAS_KÜLASTATUD'],
      ['KAS MÄÄRATUD AVASTATUKS', 'KAS_AVASTATUD'],
    ], (newValue: string) => {
      (this as any).updateOutput_(newValue);
      return undefined;
    });

    this.appendDummyInput()
      .appendField('küsi')
      .appendField(dropdown, 'MODE')
      .appendField('ristmikult');

    this.appendValueInput('CENTER')
      .setCheck('Ristmik');

    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setColour(160);
  },

  updateOutput_(this: Blockly.Block, mode?: string) {
    const currentMode = mode || this.getFieldValue('MODE');
    let newType: string | string[] | null;

    switch (currentMode) {
      case 'NUMBER':
      case 'KAUGUS':
        newType = 'Number';
        break;
      case 'NAABER':
      case 'EELMINE_RISTMIK':
        newType = 'Ristmik';
        break;
      case 'KOORDINAAT':
        newType = 'Array';
        break;
      case 'KAS_KÜLASTATUD':
      case 'KAS_AVASTATUD':
        newType = 'Boolean';
        break;
      default:
        newType = null;
    }

    const connection = this.outputConnection;
    if (connection && (connection as any).check_ !== newType) {
      this.setOutput(true, newType);
    }
  },

  onchange(this: Blockly.Block, event: Blockly.Events.Abstract) {
    const ws = this.workspace as Blockly.WorkspaceSvg;
    if (!ws || (ws.isDragging && ws.isDragging())) return;

    if (event.type === Blockly.Events.BLOCK_CREATE || event.type === Blockly.Events.BLOCK_CHANGE) {
      (this as any).updateOutput_();
    }
  }
};

javascriptGenerator.forBlock[TYPE_GETTER] = function (block: Blockly.Block) {
  const mode = block.getFieldValue('MODE');
  const ristmik = javascriptGenerator.valueToCode(block, 'CENTER', Order.ATOMIC) || 'null';

  return [`simulation.getter(${ristmik}, "${mode}")`, Order.FUNCTION_CALL];
};

const TYPE_SETTER = "simulation_setters";

Blockly.Blocks[TYPE_SETTER] = {
  init(this: Blockly.Block) {
    const dropdown = new Blockly.FieldDropdown([
      ['MÄÄRATUD AJAKULU ALGUSEST', 'KAUGUS'],
      ['MÄÄRATUD EELMINE RISTMIK', 'EELMINE_RISTMIK'],
      ['KAS MÄÄRATUD KÜLASTATUKS', 'KAS_KÜLASTATUD'],
      ['KAS MÄÄRATUD AVASTATUKS', 'KAS_AVASTATUD'],
    ], (newValue: string) => {
      (this as any).updateValueInput_(newValue);
      return undefined;
    });

    this.appendDummyInput()
      .appendField('määra ristmiku');

    this.appendValueInput('CENTER')
      .setCheck('Ristmik');

    this.appendDummyInput()
      .appendField(dropdown, 'MODE');

    this.appendValueInput('VALUE')
      .appendField('väärtuseks');

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);

    (this as any).updateValueInput_();
  },

  updateValueInput_(this: Blockly.Block, mode?: string) {
    const currentMode = mode || this.getFieldValue('MODE');
    let type: string | null;

    switch (currentMode) {
      case 'EELMINE_RISTMIK':
        type = 'Ristmik';
        break;
      case 'KOORDINAAT':
        type = 'Array';
        break;
      case 'KAS_KÜLASTATUD':
      case 'KAS_AVASTATUD':
        type = 'Boolean';
        break;
      case 'KAUGUS':
        type = 'Number';
        break;
      default:
        type = null;
    }

    const valueInput = this.getInput('VALUE');
    if (valueInput && valueInput.connection) {
      const conn = valueInput.connection as any;
      if (conn.check_ !== type) {
        valueInput.setCheck(type);
      }
    }
  },

  onchange(this: Blockly.Block, event: Blockly.Events.Abstract) {
    const ws = this.workspace as Blockly.WorkspaceSvg;
    if (!ws || (ws.isDragging && ws.isDragging())) return;

    if (event.type === Blockly.Events.BLOCK_CREATE ||
      event.type === Blockly.Events.BLOCK_CHANGE ||
      event.type === Blockly.Events.FINISHED_LOADING) {
      (this as any).updateValueInput_();
    }
  }
};

javascriptGenerator.forBlock[TYPE_SETTER] = function (block: Blockly.Block) {
  const mode = block.getFieldValue('MODE');
  const ristmik = javascriptGenerator.valueToCode(block, 'CENTER', Order.ATOMIC) || 'null';
  const value = javascriptGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || 'null';

  return `simulation.setter(${ristmik}, "${mode}", ${value});\n`;
};

const TYPE_IN_LIST = 'ristmik_in_list';

Blockly.Blocks[TYPE_IN_LIST] = {
  init() {
    this.appendValueInput('RISTMIK')
      .setCheck('Ristmik')
      .appendField('ristmik');

    this.appendValueInput('LIST')
      .setCheck('Array')
      .appendField('sisaldub loendis');

    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setColour(160);
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
      .appendField('prindi tahvlile: ')
      .appendField(new Blockly.FieldTextInput('KIRJELDUS'), 'TEXT');

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

const TYPE_STRAIGHT_LINE = 'straightline_distance';

Blockly.Blocks[TYPE_STRAIGHT_LINE] = {
  init() {
    this.appendValueInput('A')
      .setCheck('Ristmik')
      .appendField('sirgjooneline distantsi hinnang ristmikust');

    this.appendValueInput('B')
      .setCheck('Ristmik')
      .appendField('ristmikuni');

    this.setInputsInline(true);
    this.setOutput(true, 'Ristmik');
    this.setColour(160);
  },
};

// todo
javascriptGenerator.forBlock[TYPE_STRAIGHT_LINE] = (block) => {
  const A = javascriptGenerator.valueToCode(block, 'A', Order.ATOMIC);
  const B = javascriptGenerator.valueToCode(block, 'B', Order.ATOMIC);

  return [
    `simulation.pythagoras(${A},${B})`,
    Order.FUNCTION_CALL,
  ];
};

const TYPE_EMPTY_LIST = 'empty_list';

Blockly.Blocks[TYPE_EMPTY_LIST] = {
  init() {
    this.appendDummyInput()
      .appendField('uus tühi loend');

    this.setOutput(true, 'Array');
    this.setColour(260);
  },
};

javascriptGenerator.forBlock[TYPE_EMPTY_LIST] = () => {
  return ['[]', Order.ATOMIC];
};

const TYPE_ALL = 'all_intersections';

Blockly.Blocks[TYPE_ALL] = {
  init() {
    this.appendDummyInput()
      .appendField('uus loend kõigi ristmikega');

    this.setOutput(true, 'Array');
    this.setColour(260);
  },
};

javascriptGenerator.forBlock[TYPE_ALL] = () => {
  return ['simulation.allIntersections()', Order.ATOMIC];
};

const TYPE_REMOVE = 'remove_from_list';

Blockly.Blocks[TYPE_REMOVE] = {
  init() {
    this.appendValueInput('LIST')
      .setCheck('Array')
      .appendField('eemalda loendist');
    this.appendValueInput('ITEM')
      .setCheck(null)
      .appendField('element');

    this.setInputsInline(true);
    this.setOutput(true, 'Array');
    this.setColour(260);
    this.setTooltip('Tagastab uue loendi, kus märgitud element on eemaldatud.');
  },
};

javascriptGenerator.forBlock[TYPE_REMOVE] = (block, generator) => {
  const list = generator.valueToCode(block, 'LIST', Order.MEMBER) || '[]';
  const item = generator.valueToCode(block, 'ITEM', Order.NONE) || 'null';

  const code = `${list}.filter(x => x !== ${item})`;

  return [code, Order.FUNCTION_CALL];
};
