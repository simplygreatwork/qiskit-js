/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const assert = require('assert');

const buildCircuit = require('../lib/buildCircuit');
const buildCircuits = require('../lib/buildCircuits');
const utils = require('../lib/utils');
const { version } = require('../package.json');

const expectedCircuit =
  `// Cirtuit generated by Qiskit.js, version: ${version}\n\n` +
  'include "qelib1.inc";\n\n' +
  'qreg q[4];\n' +
  'creg c[4];\n\n' +
  'h q[0];\n' +
  'h q[1];\n' +
  'h q[2];\n' +
  'h q[3];\n\n' +
  'measure q[0] -> c[0];\n' +
  'measure q[1] -> c[1];\n' +
  'measure q[2] -> c[2];\n' +
  'measure q[3] -> c[3];\n';

describe('devs:ibm:buildCircuit', () => {
  it('should return a circuit for the default lenght', () =>
    assert.equal(buildCircuit(), expectedCircuit));

  it('should return a circuit with the provided option "lenght"', () => {
    const circuit = buildCircuit(2);

    assert.equal(circuit.slice(0, 10), expectedCircuit.slice(0, 10));

    const splitted = circuit.split('\n').filter(Boolean);
    assert.equal(splitted[splitted.length - 1], 'measure q[1] -> c[1];');
  });
});

describe('devs:ibm:buildCircuits', () => {
  it('should return a group of circuits for the default options', () => {
    const circuits = buildCircuits();

    assert.equal(16, circuits.length);
    utils.map(circuits, circuit => assert.equal(circuit, expectedCircuit));
  });

  it(
    'should return a group of circuits for "lenght" option' +
      'higher than the supported by "backendQubits" (odd)',
    () => {
      const circuits = buildCircuits(4, 5);

      assert.equal(4, circuits.length);

      const splitted = circuits[2].split('\n').filter(Boolean);
      assert.equal(splitted[splitted.length - 1], 'measure q[4] -> c[4];');

      const splitted3 = circuits[3].split('\n').filter(Boolean);
      assert.equal(splitted3[splitted3.length - 1], 'measure q[0] -> c[0];');
    },
  );

  const message =
    'should return a single circuits (keeping array format) for' +
    ' "lenght" option lower than the supported by "backendQubits"';

  it(message, () => {
    const circuits = buildCircuits(4, 16);

    assert.equal(1, circuits.length);
    const splitted = circuits[0].split('\n').filter(Boolean);
    assert.equal(splitted[splitted.length - 1], 'measure q[15] -> c[15];');
  });

  it(`${message} (odd)`, () => {
    let circuits = buildCircuits(4, 7);

    assert.equal(3, circuits.length);
    let splitted = circuits[0].split('\n').filter(Boolean);
    assert.equal(splitted[splitted.length - 1], 'measure q[6] -> c[6];');

    circuits = buildCircuits(3, 16);

    assert.equal(1, circuits.length);
    splitted = circuits[0].split('\n').filter(Boolean);
    assert.equal(splitted[splitted.length - 1], 'measure q[11] -> c[11];');
  });
});
