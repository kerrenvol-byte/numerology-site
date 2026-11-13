/* =====================================================================
   מנוע החישוב והתוכן של האתר. משותף לעמוד הראשי (index.html) וללוח העיתוי (luach.html).

   החישובים זהים למחשבון המלא של קרן:
   - ייעוד: חיבור כל ספרות תאריך הלידה, ואז צמצום. מספרי מאסטר 11/22/33 נשמרים בתצוגה.
   - שנה אישית: יום לידה + חודש לידה + השנה האוניברסלית של יום ההולדת האחרון.
     לילידי יולי-דצמבר מתווסף 1. השנה מתחלפת ביום ההולדת.
   - חודש אישי: שנה אישית + חודש קלנדרי. יום אישי: חודש אישי + יום קלנדרי.
   - רבעונים: ייעוד + שנה אוניברסלית, ייעוד + שנה אישית, סכום השניים, שנה אוניברסלית + שנה אישית.

   הטקסטים למטה מיועדים לעריכה של קרן. משנים רק את מה שבין המרכאות.
   ===================================================================== */
(function (root) {
  "use strict";

  /* ---------- טקסטים: מחזורי זמן (שנה / חודש / יום אישיים) ---------- */
  const CYCLE = {
    1: { word: "התחלה",    year: "זמן טוב לפתוח משהו חדש ולקחת החלטה שדחית. מה שמתחיל עכשיו נותן כיוון לשנים הבאות.",
         good: "לפתוח, ליזום, להחליט על כיוון, לפעול בעצמך", wait: "לחכות לאישור של אחרים, להיגרר אחרי מה שכבר נגמר" },
    2: { word: "שיתוף",    year: "פחות דחיפה קדימה, יותר קשרים, סבלנות והקשבה. דברים מתקדמים דרך אנשים ודורשים זמן.",
         good: "שיחות, שיתופי פעולה, תיאום ציפיות, איסוף מידע", wait: "מהלכים חדים, לחץ לקבל תשובה מיידית" },
    3: { word: "ביטוי",    year: "זמן להראות את מה שיש לך: לדבר, ליצור, לצאת החוצה. קל להתפזר, אז כדאי לבחור מעט דברים.",
         good: "להציג, לפרסם, לשווק, מפגשים, רעיונות חדשים", wait: "התחייבות ארוכה שדורשת משמעת, פיזור על יותר מדי דברים" },
    4: { word: "בנייה",    year: "עבודה, סדר, תקציב ושגרה. פחות נוצץ, אבל זו השנה שעליה נשען מה שתבני אחר כך.",
         good: "סדר, ניירת, חוזים, תקציב, עבודה יסודית", wait: "קיצורי דרך, הימורים, שינויים חדים" },
    5: { word: "שינוי",    year: "תנועה, הזדמנויות לא מתוכננות ורצון לצאת מהמוכר. כדאי להשאיר מקום לגמישות ולא לנעול הכול מראש.",
         good: "שינוי, מעבר, מכירה ושיווק, היכרויות, ניסוי", wait: "התחייבות ארוכת טווח, החלטה נמהרת שקשה לבטל" },
    6: { word: "אחריות",   year: "הבית, המשפחה, הקשרים הקרובים והמחויבויות עולים למרכז. זמן טוב לסדר מה שדורש טיפול.",
         good: "בית, משפחה, זוגיות, שיחה שמתקנת, התחייבות מהלב", wait: "עימות מיותר, לקחת על עצמך את הכול" },
    7: { word: "התבוננות", year: "פחות רעש, יותר למידה וזמן עם עצמך. שנה להבין לפני שפועלים, ולא למהר להחלטות גדולות.",
         good: "לחקור, ללמוד, לבדוק לעומק, לנוח, לתכנן", wait: "חתימות, פגישות עסקיות חשובות, השקות" },
    8: { word: "תוצאות",   year: "עבודה, כסף, סמכות והחלטות מעשיות. זמן לבקש את מה שמגיע לך ולסגור דברים שנבנו.",
         good: "כסף, משא ומתן, בקשת העלאה, החלטות עסקיות", wait: "לוותר על מה שמגיע לך, להחליט מהרגש בלבד" },
    9: { word: "סיום",     year: "זמן לסגור מעגלים ולפנות מקום. מה שכבר לא מתאים נושר, כדי שתהיה התחלה חדשה בשנה הבאה.",
         good: "לסיים, לשחרר, לסגור מעגל, לתת", wait: "התחלות חדשות, התחייבות חדשה וארוכה" }
  };

  /* ---------- טקסטים: איך את מחליטה (לפי המספר) ---------- */
  const DECIDE = {
    1:  { title: "המנהיגה",       how: "מחליטה מהר ובעצמך, מתוך היגיון, ביטחון ורצון להוביל.",                  watch: "פזיזות וגאווה. לפני החלטה גדולה, לשמוע עוד דעה אחת." },
    2:  { title: "המגשרת",        how: "מחליטה דרך הקשבה ואינטואיציה, ורואה את כל הצדדים.",                     watch: "היסוס ותלות בדעה של אחרים. לקבוע לעצמך מועד להחלטה." },
    3:  { title: "המרוממת",       how: "מחליטה מתוך התלהבות, יצירתיות ואופטימיות.",                             watch: "פיזור, דחיינות וחשש ממחויבות. לבחור דבר אחד ולסיים אותו." },
    4:  { title: "הבנאית",        how: "מחליטה לאט וביסודיות, אחרי שבדקת את הפרטים ואת המסגרת.",                watch: "התקבעות ועומס. להשאיר מקום לגמישות ולא לחכות לוודאות מלאה." },
    5:  { title: "ההרפתקנית",     how: "קולטת מהר, רואה הרבה אפשרויות ונמשכת לתנועה ולשינוי.",                  watch: "פיזור וקושי להכריע. לצמצם לשתי אפשרויות לפני שמחליטים." },
    6:  { title: "האומנית",       how: "מחליטה מתוך אחריות, צדק והשפעת ההחלטה על הקרובים אלייך.",               watch: "להחליט בשביל כולם חוץ ממך. לשאול קודם מה את צריכה." },
    7:  { title: "החוקרת",        how: "מחליטה אחרי חקירה, לימוד והקשבה לאינטואיציה.",                          watch: "חשדנות וניתוח בלי סוף. להגדיר מראש מתי המידע מספיק." },
    8:  { title: "הווינרית",      how: "מחליטה בצורה עניינית, עם כוח רצון, משמעת ויכולת עסקית.",                watch: "צורך לשלוט ותחרותיות. להתחשב באנשים שבדרך למטרה." },
    9:  { title: "לוחמת הצדק",    how: "מחליטה באומץ ובכנות, עם ראייה רחבה של התמונה.",                         watch: "חוסר סבלנות ותגובה חדה. לחכות לילה לפני החלטה שנולדה מכעס." },
    11: { title: "המנהיגה השקטה", how: "מחליטה מתוך רגישות, חוכמה ואינטואיציה גבוהה.",                          watch: "לשלב היגיון עם אינטואיציה ולבחור דרך אחת ממוקדת." },
    22: { title: "קבלנית הבנייה", how: "מחליטה מתוך חזון גדול, חריצות ואחריות מעשית.",                          watch: "פרפקציוניזם שמעכב ועומס יתר. לאפשר גמישות מחשבתית." },
    33: { title: "ריפוי הלב",     how: "מחליטה מתוך אהבה, הכלה וחשיבה חיובית.",                                 watch: "לאזן בין נתינה לבין הצרכים שלך." }
  };
  const ZERO_NOTE = "האפס שבמספר מוסיף עיכוב התחלתי בביטוי שלו, ועם הזמן דווקא מעצים אותו.";

  const ROLES = {
    destiny: { label: "ייעוד",    weight: "50%", text: "השיעור המרכזי שלך, והכיוון שהחלטות גדולות צריכות לשרת." },
    day:     { label: "יום לידה", weight: "25%", text: "הטיפוס הטבעי שלך ואופן הפעולה ביום־יום." },
    name:    { label: "שם פרטי",  weight: "25%", text: "הדרך שבה את מקבלת החלטות בפועל." }
  };

  /* ---------- בדיקת החלטה ----------
     לכל סוג החלטה: כמה כל מספר (1-9) מתאים לו. 2 = זמן מתאים, 1 = אפשרי, 0 = עדיף לחכות.
     הסדר בשורה: מספר 1, 2, 3, 4, 5, 6, 7, 8, 9.
     הטבלה הזו היא שכבה שנבנתה לכלי, מעל המשמעויות של המספרים. קרן מאשרת ומתקנת אותה. */
  const DECISIONS = [
    { id: "start",  name: "להתחיל משהו חדש",       hint: "עסק, פרויקט, השקה, לימודים",              fit: [2, 1, 2, 1, 2, 1, 0, 2, 0] },
    { id: "sign",   name: "לחתום או להתחייב",       hint: "חוזה, שכירות, עבודה חדשה",                fit: [1, 1, 0, 2, 0, 2, 0, 2, 0] },
    { id: "talk",   name: "שיחה חשובה או משא ומתן", hint: "שיחה עם מנהל, לקוח, בן זוג",              fit: [1, 2, 2, 1, 1, 2, 0, 2, 1] },
    { id: "money",  name: "החלטה כספית",            hint: "רכישה גדולה, בקשת העלאה, תמחור",          fit: [1, 1, 0, 2, 0, 1, 0, 2, 0] },
    { id: "change", name: "שינוי או מעבר",          hint: "דירה, עבודה, כיוון חדש",                  fit: [2, 0, 1, 0, 2, 1, 0, 1, 1] },
    { id: "close",  name: "לסיים או לעזוב",         hint: "לסגור מעגל, להיפרד, להתפטר",              fit: [1, 0, 1, 1, 1, 0, 1, 1, 2] },
    { id: "home",   name: "קשר, בית ומשפחה",        hint: "שיחה זוגית, מעבר לגור יחד, החלטה משפחתית", fit: [1, 2, 1, 1, 0, 2, 0, 1, 1] },
    { id: "rest",   name: "לעצור ולחשוב",           hint: "חופשה, לימוד, זמן לפני החלטה",            fit: [0, 2, 1, 1, 1, 1, 2, 0, 2] }
  ];
  /* משקל כל שכבה בציון הסופי של תאריך */
  const WEIGHTS = { day: 3, month: 2, year: 1 };
  const VERDICTS = {
    2: { label: "עיתוי מתאים" },
    1: { label: "אפשרי, בתשומת לב" },
    0: { label: "עדיף לחכות" }
  };
  /* המשפט שמסביר את התוצאה, לפי המצב */
  const VERDICT_TEXT = {
    good:       "היום האישי תומך בהחלטה הזו, וגם התקופה שסביבו.",
    dayOnly:    "היום עצמו מתאים, אבל החודש והשנה פחות תומכים. אפשר לפעול, בצעד מדוד.",
    neutral:    "אין כאן התנגדות, וגם לא רוח גבית מיוחדת. אם אפשר לבחור, יש ימים מתאימים יותר.",
    periodOnly: "התקופה תומכת בהחלטה הזו, אבל היום הזה פחות. כדאי לבחור יום אחר בקרבת מקום.",
    wait:       "התאריך הזה מתאים יותר לדברים אחרים. אם אפשר, כדאי לחכות או לבחור תאריך אחר."
  };
  const FIT_LABELS = { 2: "מתאים", 1: "אפשרי", 0: "עדיף לחכות" };

  /* ---------- חישוב ---------- */
  const LETTERS = {
    "א": 1, "י": 1, "ק": 1,
    "ב": 2, "כ": 2, "ך": 2, "ר": 2,
    "ג": 3, "ל": 3, "ש": 3,
    "ד": 4, "מ": 4, "ם": 4, "ת": 4,
    "ה": 5, "נ": 5, "ן": 5,
    "ו": 6, "ס": 6,
    "ז": 7, "ע": 7,
    "ח": 8, "פ": 8, "ף": 8,
    "ט": 9, "צ": 9, "ץ": 9
  };

  const digitSum = v => String(v).replace(/\D/g, "").split("").reduce((a, d) => a + Number(d), 0);
  const reduce = n => { n = Math.abs(Math.trunc(n)); while (n > 9) n = digitSum(n); return n; };

  /* מספר מקורי, מסלול הצמצום ומספר מאסטר אם יש. 24 -> "24/6", 38 -> "38/11", 8 -> "8" */
  function identity(value) {
    const path = [value];
    while (path[path.length - 1] > 9) path.push(digitSum(path[path.length - 1]));
    const master = path.find(p => p === 11 || p === 22 || p === 33) || null;
    const rootNum = path[path.length - 1];
    const significant = master || rootNum;
    return { raw: value, root: rootNum, master, significant, path,
             display: value === significant ? String(value) : value + "/" + significant,
             zero: value > 9 && value < 100 && value % 10 === 0 };
  }

  function nameValue(name) {
    const total = [...String(name || "")].reduce((a, ch) => a + (LETTERS[ch] || 0), 0);
    return { total, reduced: reduce(total) };
  }

  /* "1991-10-30" -> {y, m, d}, או null אם התאריך לא קיים */
  function parseDate(str) {
    const mt = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(str || ""));
    if (!mt) return null;
    const y = +mt[1], m = +mt[2], d = +mt[3];
    const t = new Date(y, m - 1, d);
    if (y < 1000 || t.getFullYear() !== y || t.getMonth() !== m - 1 || t.getDate() !== d) return null;
    return { y, m, d };
  }
  const toDate = o => new Date(o.y, o.m - 1, o.d);
  const fromDate = t => ({ y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() });
  const iso = o => o.y + "-" + String(o.m).padStart(2, "0") + "-" + String(o.d).padStart(2, "0");
  const addDays = (o, n) => { const t = toDate(o); t.setDate(t.getDate() + n); return fromDate(t); };
  const addMonths = (o, n) => fromDate(new Date(o.y, o.m - 1 + n, o.d));

  function destinyOf(birth) { return identity(digitSum(String(birth.d) + String(birth.m) + String(birth.y))); }

  function lastBirthdayYear(birth, on) {
    const t = toDate(on), thisYear = new Date(on.y, birth.m - 1, birth.d);
    return t >= thisYear ? on.y : on.y - 1;
  }

  /* כל מחזורי הזמן של תאריך מסוים */
  function cycles(birth, on) {
    const lby = lastBirthdayYear(birth, on);
    const universalYear = reduce(digitSum(lby));
    const dayNum = reduce(birth.d), monthNum = reduce(birth.m);
    const year = reduce(dayNum + monthNum + universalYear + (birth.m >= 7 ? 1 : 0));
    const hiddenBase = reduce(dayNum + monthNum + universalYear);
    const hiddenYear = reduce(hiddenBase + destinyOf(birth).root);
    const month = reduce(year + on.m);
    const day = reduce(month + on.d);
    return { lastBirthdayYear: lby, universalYear, year, hiddenBase, hiddenYear, month, day };
  }

  /* 12 החודשים של שנה קלנדרית. בחודש יום ההולדת המספר מתחלף ביום ההולדת */
  function yearMonths(birth, y) {
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const start = cycles(birth, { y, m, d: 1 });
      const out = { m, num: start.month, year: start.year, shiftDay: null, numAfter: null };
      if (m === birth.m && birth.d > 1) {
        const last = new Date(y, m, 0).getDate();
        const after = cycles(birth, { y, m, d: Math.min(birth.d, last) });
        if (after.month !== start.month || after.year !== start.year) {
          out.shiftDay = Math.min(birth.d, last); out.numAfter = after.month; out.yearAfter = after.year;
        }
      }
      return out;
    });
  }

  /* ארבעת הרבעונים של השנה האישית הנוכחית, מיום ההולדת האחרון */
  function quarters(birth, on) {
    const c = cycles(birth, on), dest = destinyOf(birth).root;
    const raw = [dest + c.universalYear, dest + c.year, 0, c.universalYear + c.year];
    raw[2] = reduce(raw[0]) + reduce(raw[1]);
    const start = fromDate(new Date(c.lastBirthdayYear, birth.m - 1, birth.d));
    return raw.map((r, i) => {
      const from = addMonths(start, i * 3), to = addDays(addMonths(start, (i + 1) * 3), -1);
      const t = toDate(on);
      return { index: i + 1, num: reduce(r), from, to, current: t >= toDate(from) && t <= toDate(to) };
    });
  }

  /* הפרופיל: ייעוד, יום לידה ושם פרטי */
  function profile(birth, firstName) {
    const nv = nameValue(firstName);
    return { destiny: destinyOf(birth), day: identity(birth.d), name: nv.total ? identity(nv.total) : null };
  }
  function decideText(id) {
    const base = DECIDE[id.significant];
    return { title: base.title, how: base.how, watch: base.watch, zero: id.zero ? ZERO_NOTE : "" };
  }

  /* בדיקת החלטה לתאריך אחד */
  function checkDate(birth, decisionId, on) {
    const dec = DECISIONS.find(x => x.id === decisionId);
    if (!dec) return null;
    const c = cycles(birth, on);
    const parts = ["day", "month", "year"].map(layer => ({ layer, num: c[layer], fit: dec.fit[c[layer] - 1] }));
    const score = parts.reduce((a, p) => a + p.fit * WEIGHTS[p.layer], 0);
    const max = 2 * (WEIGHTS.day + WEIGHTS.month + WEIGHTS.year);
    /* היום האישי קובע: יום שלא מתאים לא יסומן כמתאים, גם אם התקופה תומכת.
       יום מתאים צריך גם תמיכה כלשהי מהחודש או מהשנה כדי לקבל "עיתוי מתאים". */
    const dayFit = parts[0].fit, around = parts[1].fit * WEIGHTS.month + parts[2].fit * WEIGHTS.year;
    let verdict, why;
    if (dayFit === 2)      { verdict = around >= 2 ? 2 : 1; why = verdict === 2 ? "good" : "dayOnly"; }
    else if (dayFit === 1) { verdict = around >= 2 ? 1 : 0; why = verdict === 1 ? "neutral" : "wait"; }
    else                   { verdict = 0; why = around >= 4 ? "periodOnly" : "wait"; }
    return { date: on, cycles: c, parts, score, max, verdict, text: VERDICT_TEXT[why] };
  }

  /* התאריכים המתאימים ביותר להחלטה, בטווח ימים */
  function bestDates(birth, decisionId, from, days, count) {
    const all = [];
    for (let i = 0; i < days; i++) {
      const r = checkDate(birth, decisionId, addDays(from, i));
      if (r && r.verdict === 2) all.push(r);
    }
    return all.sort((a, b) => b.score - a.score || toDate(a.date) - toDate(b.date)).slice(0, count)
              .sort((a, b) => toDate(a.date) - toDate(b.date));
  }

  const api = { CYCLE, DECIDE, ROLES, DECISIONS, WEIGHTS, VERDICTS, FIT_LABELS,
                digitSum, reduce, identity, nameValue, parseDate, toDate, fromDate, iso, addDays, addMonths,
                destinyOf, cycles, yearMonths, quarters, profile, decideText, checkDate, bestDates };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Engine = api;
})(typeof window !== "undefined" ? window : globalThis);
