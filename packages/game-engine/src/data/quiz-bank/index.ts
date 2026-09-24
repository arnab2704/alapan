import type { Row } from "./types";
import { L01A } from "./l01a";
import { L01B } from "./l01b";
import { L02A } from "./l02a";
import { L02B } from "./l02b";
import { L03 } from "./l03";
import { L04 } from "./l04";
import { L05 } from "./l05";
import { L06 } from "./l06";
import { L07 } from "./l07";
import { L08 } from "./l08";
import { L09 } from "./l09";
import { L10 } from "./l10";

export type { Row, Opt } from "./types";

/** Authoring rows for each of the 10 levels, index 0 = Level 1. */
export const LEVEL_ROWS: Row[][] = [[...L01A, ...L01B], [...L02A, ...L02B], L03, L04, L05, L06, L07, L08, L09, L10];
