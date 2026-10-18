import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeText,
  checkWordOrder,
  calculatePercentage,
  formatTime,
  isCorrectAnswer,
  getPerformanceTier,
} from './pureLogic.ts';

test('normalizeText strips punctuation, converts lowercase and trims', () => {
  assert.equal(normalizeText('¡Hola, Madridistas!'), 'hola madridistas');
  assert.equal(normalizeText('  ¿Cómo se siente?  '), 'cómo se siente');
});

test('checkWordOrder correctly identifies matching sentence sequences', () => {
  const user = ['Estoy', 'muy', 'feliz.'];
  const target = ['estoy', 'muy', 'feliz'];
  assert.equal(checkWordOrder(user, target), true);

  const wrongOrder = ['muy', 'estoy', 'feliz'];
  assert.equal(checkWordOrder(wrongOrder, target), false);

  const missingWords = ['Estoy', 'muy'];
  assert.equal(checkWordOrder(missingWords, target), false);
});

test('calculatePercentage handles regular and edge cases', () => {
  assert.equal(calculatePercentage(15, 15), 100);
  assert.equal(calculatePercentage(12, 15), 80);
  assert.equal(calculatePercentage(0, 15), 0);
  assert.equal(calculatePercentage(5, 0), 0);
});

test('formatTime formats seconds into mm:ss', () => {
  assert.equal(formatTime(6), '00:06');
  assert.equal(formatTime(75), '01:15');
  assert.equal(formatTime(0), '00:00');
});

test('isCorrectAnswer performs case-insensitive comparison', () => {
  assert.equal(isCorrectAnswer('A', 'a'), true);
  assert.equal(isCorrectAnswer('B ', 'b'), true);
  assert.equal(isCorrectAnswer('C', 'B'), false);
});

test('getPerformanceTier classifies scores correctly', () => {
  assert.equal(getPerformanceTier(95, 100).tier, 'galactico');
  assert.equal(getPerformanceTier(80, 100).tier, 'titular');
  assert.equal(getPerformanceTier(60, 100).tier, 'canterano');
  assert.equal(getPerformanceTier(30, 100).tier, 'principiante');
});
