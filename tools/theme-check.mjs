import { themeCheckRun } from '@shopify/theme-check-node';
const root = process.argv[2];
const { offenses } = await themeCheckRun(root);
const bySeverity = { 0: 'ERROR', 1: 'WARNING', 2: 'INFO' };
const groups = {};
for (const o of offenses) {
  const key = bySeverity[o.severity] || String(o.severity);
  (groups[key] ||= []).push(o);
}
for (const key of ['ERROR', 'WARNING', 'INFO']) {
  const list = groups[key] || [];
  console.log(`\n===== ${key}: ${list.length} =====`);
  for (const o of list.slice(0, 60)) {
    const file = (o.uri || '').replace('file://' + root + '/', '');
    console.log(`${file}:${(o.start?.line ?? 0) + 1}  [${o.check}] ${o.message}`);
  }
  if (list.length > 60) console.log(`... et ${list.length - 60} de plus`);
}
