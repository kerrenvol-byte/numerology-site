// הרצה: node --test tests/
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const E = createRequire(import.meta.url)("../engine.js");
const d = s => E.parseDate(s);

test("דוגמת המפה: 30.10.1991, קרן, בתאריך 30.10.2026", () => {
  const birth = d("1991-10-30"), on = d("2026-10-30");
  const p = E.profile(birth, "קרן");
  assert.equal(p.destiny.display, "24/6");
  assert.equal(p.day.display, "30/3");
  assert.equal(p.day.zero, true);
  assert.equal(p.name.display, "8");
  const c = E.cycles(birth, on);
  assert.deepEqual([c.year, c.hiddenBase, c.hiddenYear, c.month, c.day], [6, 5, 2, 7, 1]);
});

test("השנה האישית מתחלפת ביום ההולדת", () => {
  const birth = d("1991-10-30");
  assert.equal(E.cycles(birth, d("2026-10-29")).lastBirthdayYear, 2025);
  assert.equal(E.cycles(birth, d("2026-10-30")).lastBirthdayYear, 2026);
  assert.equal(E.cycles(birth, d("2026-10-29")).year, 5);
});

test("15.3 ב-2027 נותן שנה אישית 2, בלי תוספת לילידי ינואר-יוני", () => {
  assert.equal(E.cycles(d("1990-03-15"), d("2027-12-31")).year, 2);
});

test("מספרי מאסטר נשמרים בתצוגה", () => {
  assert.equal(E.identity(38).display, "38/11");
  assert.equal(E.identity(29).significant, 11);
  assert.equal(E.identity(22).display, "22");
  assert.equal(E.identity(7).display, "7");
});

test("תאריך שלא קיים נדחה", () => {
  assert.equal(E.parseDate("2026-02-30"), null);
  assert.equal(E.parseDate("abc"), null);
});

test("חודשי השנה: בחודש יום ההולדת המספר מתחלף", () => {
  const months = E.yearMonths(d("1991-10-30"), 2027);
  assert.equal(months.length, 12);
  const oct = months[9];
  assert.equal(oct.shiftDay, 30);
  assert.equal(oct.num, E.cycles(d("1991-10-30"), d("2027-10-01")).month);
  assert.equal(oct.numAfter, E.cycles(d("1991-10-30"), d("2027-10-30")).month);
  assert.equal(months[0].shiftDay, null);
});

test("רבעונים: ארבעה, רצופים, ואחד מהם נוכחי", () => {
  const q = E.quarters(d("1991-10-30"), d("2026-11-13"));
  assert.equal(q.length, 4);
  assert.equal(E.iso(q[0].from), "2026-10-30");
  assert.equal(E.iso(q[3].to), "2027-10-29");
  assert.equal(q.filter(x => x.current).length, 1);
  assert.equal(q[0].current, true);
  for (let i = 1; i < 4; i++) assert.equal(E.iso(q[i].from), E.iso(E.addDays(q[i - 1].to, 1)));
});

test("בדיקת החלטה: הציון נשען על יום, חודש ושנה", () => {
  const r = E.checkDate(d("1991-10-30"), "sign", d("2026-10-30"));
  assert.deepEqual(r.parts.map(p => p.num), [1, 7, 6]);
  assert.deepEqual(r.parts.map(p => p.fit), [1, 0, 2]);
  assert.equal(r.score, 1 * 3 + 0 * 2 + 2 * 1);
  assert.equal(r.verdict, 1);
  assert.equal(E.checkDate(d("1991-10-30"), "nope", d("2026-10-30")), null);
});

test("כל טבלאות ההחלטה שלמות, וכל מספר מכוסה", () => {
  for (const dec of E.DECISIONS) {
    assert.equal(dec.fit.length, 9, dec.id);
    assert.ok(dec.fit.every(f => [0, 1, 2].includes(f)), dec.id);
    assert.ok(dec.fit.includes(2), dec.id);
  }
  for (let n = 1; n <= 9; n++) { assert.ok(E.CYCLE[n].word); assert.ok(E.DECIDE[n].how); }
  for (const n of [11, 22, 33]) assert.ok(E.DECIDE[n].how);
});

test("תאריכים מומלצים: רק עיתוי מתאים, בסדר כרונולוגי", () => {
  const best = E.bestDates(d("1991-10-30"), "start", d("2026-11-13"), 90, 6);
  assert.ok(best.length > 0 && best.length <= 6);
  assert.ok(best.every(r => r.verdict === 2));
  for (let i = 1; i < best.length; i++) assert.ok(E.toDate(best[i].date) > E.toDate(best[i - 1].date));
});
