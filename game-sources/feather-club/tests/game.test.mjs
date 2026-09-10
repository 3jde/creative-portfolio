import test from 'node:test';
import assert from 'node:assert/strict';
import { Match, trajectory, powerFor, difficulty } from '../lib/game/model.ts';

test('蓄力有上限，快速点击也有最低击球力量', () => {
  assert.equal(powerFor(0), 0.25);
  assert.equal(powerFor(3), 1);
  assert.ok(powerFor(0.6) > powerFor(0.1));
});
test('飞行轨迹起终点准确并且越过球网', () => {
  const f = {
    from: { x: 0, y: 1.6, z: -4 },
    to: { x: 1, y: 0.1, z: 5.8 },
    arc: 2.3,
    duration: 2,
    t: 0,
  };
  assert.deepEqual(trajectory(f, 0), f.from);
  assert.deepEqual(trajectory(f, 1), f.to);
  assert.ok(trajectory(f, 4 / 9.8).y > 1.55);
});
test('难度具有逐级增加的移动速度与接球能力', () => {
  assert.ok(difficulty.easy.speed < difficulty.normal.speed);
  assert.ok(difficulty.normal.speed < difficulty.hard.speed);
  assert.ok(difficulty.easy.accuracy < difficulty.hard.accuracy);
});
test('暂停时球与比分不变化', () => {
  const m = new Match(() => 0.5);
  m.start();
  m.serve();
  m.update(0.05);
  m.pause();
  const before = JSON.stringify(m.ball);
  m.update(10);
  assert.equal(JSON.stringify(m.ball), before);
  assert.deepEqual(m.score, [0, 0]);
});
test('没有挥拍就会漏球，对手得分', () => {
  const m = new Match(() => 0.5);
  m.start();
  for (let i = 0; i < 400; i++) m.update(0.016);
  assert.ok(m.score[1] > 0);
});
test('远离羽毛球挥拍不能自动回击', () => {
  const m = new Match(() => 0.5);
  m.start();
  m.update(1.2);
  m.swing({ x: 50, y: 50 }, 1, false);
  assert.notEqual(m.lastHitter, 'player');
});
test('先到 11 分结束，结束后不再继续计分', () => {
  const m = new Match(() => 0.5);
  m.start();
  for (let i = 0; i < 11; i++) m.point(0, '测试');
  assert.equal(m.phase, 'over');
  assert.equal(m.score[0], 11);
  m.point(1, '测试');
  assert.equal(m.score[1], 0);
});
test('重新开始清除旧比赛结果', () => {
  const m = new Match();
  m.start();
  m.point(0, '测试');
  m.start();
  assert.deepEqual(m.score, [0, 0]);
  assert.equal(m.rally, 0);
});

test('球拍接触来球后回球，左右瞄准影响落点', () => {
  const m = new Match(() => 0.5);
  m.start();
  m.serve();
  for (let i = 0; i < 300 && m.ball.z < 3.8; i++) m.update(0.016);
  assert.equal(m.swing({ x: m.ball.x + 0.5, y: m.ball.y }, 0.8, false), true);
  assert.equal(m.lastHitter, 'player');
  assert.equal(m.rally, 1);
  assert.ok(m.flight.to.x > 0);
  assert.equal(m.flight.to.z, -5.65);
});
test('近网球在接球窗口内正常击打时可越过球网', () => {
  for (const z of [3, 4, 5]) {
    const m = new Match(() => 0.5);
    m.start();
    m.serve();
    for (let i = 0; i < 300 && m.ball.z < z; i++) m.update(0.016);
    assert.equal(m.swing({ x: m.ball.x, y: m.ball.y }, 0.8, true), true);
    const f = m.flight;
    assert.equal(f.to.z, -1.85);
    assert.ok(
      trajectory(f, f.from.z / (f.from.z - f.to.z)).y >= 1.55,
      `near shot from z=${z} hits net`,
    );
  }
});
test('正常底线回球后机器玩家可以回击', () => {
  const m = new Match(() => 0.5);
  m.start('hard');
  m.serve();
  while (m.ball.z < 3.8) m.update(0.016);
  m.swing({ x: m.ball.x, y: m.ball.y }, 0.7, false);
  for (let i = 0; i < 200 && m.lastHitter === 'player' && m.flight; i++)
    m.update(0.016);
  assert.equal(m.lastHitter, 'ai');
  assert.equal(m.rally, 2);
  assert.deepEqual(m.score, [0, 0]);
});
