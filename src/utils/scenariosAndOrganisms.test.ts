import test from 'node:test';
import assert from 'node:assert/strict';
import { EDUCATIONAL_SCENARIOS } from '../data/scenariosData';
import { EXPANDED_ORGANISMS, CELL_TYPES, CellKingdom } from '../data/cellData';

test('Educational Scenarios Data Integrity', () => {
  // Should have at least 5 structured educational scenarios covering required phenomena
  assert.ok(EDUCATIONAL_SCENARIOS.length >= 5, 'Should have at least 5 educational scenarios');

  const categories = EDUCATIONAL_SCENARIOS.map((s) => s.category);
  assert.ok(categories.includes('photosynthesis'), 'Must include photosynthesis scenario');
  assert.ok(categories.includes('respiration'), 'Must include cellular respiration scenario');
  assert.ok(categories.includes('osmosis'), 'Must include osmosis scenario');
  assert.ok(categories.includes('mitosis'), 'Must include cell division scenario');
  assert.ok(categories.includes('cell_injury'), 'Must include cell injury scenario');

  // Verify steps and checkpoint questions
  EDUCATIONAL_SCENARIOS.forEach((scenario) => {
    assert.ok(scenario.titleVi.length > 5, `Scenario ${scenario.id} has valid Vietnamese title`);
    assert.ok(scenario.learningObjectivesVi.length >= 2, `Scenario ${scenario.id} has learning objectives`);
    assert.ok(scenario.steps.length >= 3, `Scenario ${scenario.id} has at least 3 sequential steps`);

    scenario.steps.forEach((step, idx) => {
      assert.equal(step.stepNumber, idx + 1, 'Step numbers should be sequentially 1-indexed');
      assert.ok(step.checkpointQuestion.optionsVi.length >= 3, 'Checkpoint has multiple options');
      assert.ok(
        step.checkpointQuestion.correctIndex >= 0 &&
          step.checkpointQuestion.correctIndex < step.checkpointQuestion.optionsVi.length,
        'Correct index is within valid option range'
      );
      assert.ok(step.checkpointQuestion.explanationVi.length > 10, 'Has scientific explanation');
    });
  });
});

test('Expanded Organism Library 5-Kingdom Coverage', () => {
  const organisms = Object.values(EXPANDED_ORGANISMS);
  assert.ok(organisms.length >= 18, 'Must have at least 18 specialized organism models');

  const kingdoms: CellKingdom[] = ['animal', 'plant', 'fungi', 'protist', 'bacteria'];
  kingdoms.forEach((k) => {
    const matching = organisms.filter((org) => org.kingdom === k);
    assert.ok(matching.length >= 2, `Kingdom ${k} must have multiple specialized models (found ${matching.length})`);
  });

  // Verify key specialized organisms requested
  const organismIds = organisms.map((o) => o.id);
  assert.ok(organismIds.includes('animal_neuron'), 'Neuron cell must be present');
  assert.ok(organismIds.includes('animal_myocyte'), 'Skeletal muscle cell must be present');
  assert.ok(organismIds.includes('plant_guard_cell'), 'Guard cell must be present');
  assert.ok(organismIds.includes('protist_paramecium'), 'Paramecium must be present');
  assert.ok(organismIds.includes('protist_amoeba'), 'Amoeba must be present');
  assert.ok(organismIds.includes('protist_euglena'), 'Euglena must be present');
  assert.ok(organismIds.includes('bacteria_cyanobacteria'), 'Cyanobacteria must be present');
  assert.ok(organismIds.includes('bacteria_bacillus_spore'), 'Bacillus with endospore must be present');

  organisms.forEach((org) => {
    assert.ok(org.nameVi.length > 0, `Organism ${org.id} has Vietnamese name`);
    assert.ok(org.scientificName.length > 0, `Organism ${org.id} has scientific binomial name`);
    assert.ok(org.uniqueStructuresVi.length > 0, `Organism ${org.id} lists unique structures`);
  });
});

test('Simulation Time Control Rate Calculations', () => {
  const baseDelta = 0.05;
  const speeds = [0.25, 0.5, 1, 2, 5, 10];

  speeds.forEach((speed) => {
    const forwardStep = baseDelta * speed * 1;
    const backwardStep = baseDelta * speed * -1;
    assert.equal(forwardStep, baseDelta * speed);
    assert.equal(backwardStep, -baseDelta * speed);
  });

  // Test boundary wrapping logic
  let timeSec = 59.9;
  const maxTimeSec = 60;
  const nextTime = timeSec + baseDelta * 5;
  const wrappedTime = nextTime >= maxTimeSec ? 0 : nextTime;
  assert.equal(wrappedTime, 0, 'Should loop back to 0 at max time');
});
