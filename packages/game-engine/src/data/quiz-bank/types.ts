/** An answer option: a bare string when it reads the same in both languages (numbers, years - digits are localised automatically), or [bengali, english]. */
export type Opt = string | [string, string];

/**
 * A compact authoring row for the level quiz bank:
 * [category, questionBn, questionEn, correct, wrong1, wrong2, wrong3].
 * The correct answer is always written FIRST (easier to author and audit);
 * the served order is shuffled deterministically by the engine.
 * Category codes: hi history, ge geography, cu culture, li literature,
 * re religion, fe festival, la language, ar arts & entertainment, pe personalities.
 */
export type Row = [string, string, string, Opt, Opt, Opt, Opt];
