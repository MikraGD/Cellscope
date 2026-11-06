import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePhotosynthesis,
  calculateRespiration,
  calculateOsmosis,
} from './bioCalculations';

test('Photosynthesis responds to light, CO2 and temperature limits', () => {
  // Test optimal conditions
  const optimal = calculatePhotosynthesis({
    lightIntensity: 60,
    co2Ppm: 800,
    temperature: 30,
    spectrum: 'white',
  });
  assert.ok(optimal.relativeRate > 50, `Expected optimal rate > 50, got ${optimal.relativeRate}`);
  assert.equal(optimal.chloroplastState, 'optimal');
  assert.ok(optimal.o2OutputMlPerHour > 0);

  // Test green light limitation (minimal absorption)
  const greenLight = calculatePhotosynthesis({
    lightIntensity: 60,
    co2Ppm: 800,
    temperature: 30,
    spectrum: 'green',
  });
  assert.ok(greenLight.relativeRate < optimal.relativeRate, 'Green light should yield lower rate than white');
  assert.ok(greenLight.limitingFactor.includes('lục'));

  // Test extreme heat denaturation (>42°C)
  const heatStress = calculatePhotosynthesis({
    lightIntensity: 60,
    co2Ppm: 800,
    temperature: 48,
    spectrum: 'white',
  });
  assert.equal(heatStress.relativeRate, 0, 'At 48°C Rubisco should be completely denatured');
  assert.equal(heatStress.chloroplastState, 'heat_stressed');
});

test('Respiration correctly switches between aerobic and fermentation pathways', () => {
  // Aerobic animal respiration
  const aerobic = calculateRespiration({
    glucoseLevelMm: 10,
    o2Percent: 21,
    temperature: 37,
    kingdom: 'animal',
  });
  assert.equal(aerobic.pathway, 'aerobic');
  assert.equal(aerobic.atpPerGlucose, 36);
  assert.ok(aerobic.mitochondriaActivity > 50);

  // Anaerobic yeast / fungi fermentation
  const yeastFermentation = calculateRespiration({
    glucoseLevelMm: 10,
    o2Percent: 0,
    temperature: 30,
    kingdom: 'fungi',
  });
  assert.equal(yeastFermentation.pathway, 'alcoholic_fermentation');
  assert.equal(yeastFermentation.atpPerGlucose, 2);
  assert.ok(yeastFermentation.byproducts.some(b => b.includes('Ethanol')));

  // Anaerobic animal fermentation (lactic acid)
  const animalFermentation = calculateRespiration({
    glucoseLevelMm: 10,
    o2Percent: 0,
    temperature: 37,
    kingdom: 'animal',
  });
  assert.equal(animalFermentation.pathway, 'lactic_fermentation');
  assert.ok(animalFermentation.byproducts.some(b => b.includes('Lactic')));
});

test('Osmosis correctly distinguishes animal cells from walled plant cells', () => {
  // Hypotonic solution: 100 mOsm/L vs 300 mOsm/L internal
  const animalHypotonic = calculateOsmosis({
    externalSoluteOsm: 100,
    hasCellWall: false,
  });
  assert.equal(animalHypotonic.solutionType, 'hypotonic');
  assert.equal(animalHypotonic.dangerStatus, 'fatal'); // Animal cells burst (lysis)
  assert.ok(animalHypotonic.cellMorphology.includes('Tan bào') || animalHypotonic.cellMorphology.includes('Vỡ'));

  const plantHypotonic = calculateOsmosis({
    externalSoluteOsm: 100,
    hasCellWall: true,
  });
  assert.equal(plantHypotonic.solutionType, 'hypotonic');
  assert.equal(plantHypotonic.dangerStatus, 'safe'); // Plant cell wall protects and maintains turgidity
  assert.ok(plantHypotonic.cellMorphology.includes('Trương nước'));

  // Hypertonic: 550 mOsm/L
  const plantHypertonic = calculateOsmosis({
    externalSoluteOsm: 550,
    hasCellWall: true,
  });
  assert.equal(plantHypertonic.solutionType, 'hypertonic');
  assert.ok(plantHypertonic.cellMorphology.includes('Co nguyên sinh'));
});
