export {
  createBoard,
  withPlacement,
  getFormedWords,
  getAt,
  isInBounds,
  cellKey,
  getBonusType,
  getCenter
} from "./board";
export { createTileBag, drawTiles, shuffle } from "./tileBag";
export { validateMove } from "./validateMove";
export type { ValidateMoveOptions } from "./validateMove";
export { scoreMove, scoreFormedWord, scoreFormedWords, FULL_RACK_BONUS } from "./score";
export { initGame, applyMove } from "./gameState";
export type { InitGameOptions, ApplyMoveResult } from "./gameState";
export { buildDistributionFromWords } from "./distribution";
export { buildWordSeededBag } from "./wordSeededBag";
export type { WordSeededBagOptions } from "./wordSeededBag";
export { getLevel, getAllLevels, getAllTargetWords, TOTAL_LEVELS, DATASET_VERSION } from "./levels";
export type { WordLevel } from "./levels";
export {
  getWordJaalLevel,
  getWordJaalCombination,
  getWordJaalLevelSummaries,
  TOTAL_WORDJAAL_LEVELS
} from "./wordJaalLevels";
export type { WordJaalLevel, WordJaalCombination, WordJaalLevelSummary } from "./wordJaalLevels";
export {
  checkWordJaalGuess,
  scoreWordJaalWord,
  canFormWordFromLetters,
  WORDJAAL_TILE_SCORES
} from "./wordJaal";
export type { WordJaalGuessResult, WordJaalGuessOutcome } from "./wordJaal";
export {
  getAllQuizQuestions,
  getQuizQuestionById,
  getDailyQuiz,
  checkQuizAnswer,
  scoreQuiz,
  DAILY_QUIZ_SIZE
} from "./quiz";
export type { QuizQuestion, QuizOption, QuizCategory } from "./quiz";
export type {
  Tile,
  LetterDistribution,
  BoardCell,
  PlacedTile,
  Board,
  BonusType,
  Direction,
  FormedWord,
  MoveValidationResult,
  MoveError,
  MoveErrorCode,
  DictionaryLookup,
  GameState
} from "./types";
export {
  getQuizSet,
  getQuizLevelQuestionCount,
  getTotalLevelQuizQuestions,
  getAllLevelQuizQuestions
} from "./quizLevels";
export type { QuizSetData } from "./quizLevels";
export {
  QUIZ_LEVEL_COUNT,
  QUIZ_SETS_PER_LEVEL,
  QUIZ_PASS_FRACTION,
  QUIZ_LEVELS,
  quizSetKey,
  isValidQuizSet,
  passScoreFor,
  recordQuizSetResult,
  isQuizSetPassed,
  previousQuizSet,
  isQuizSetUnlocked,
  isQuizLevelUnlocked,
  countPassedSets,
  getNextQuizSet
} from "./quizProgress";
export type { QuizLevelInfo, QuizSetResult, QuizProgressMap } from "./quizProgress";
export {
  getLearnUnits,
  getAllLearnLessons,
  getLearnLesson,
  getDistractorPool,
  generateExercises,
  getDailyLearnMoment,
  MAX_PRACTICE_EXERCISES
} from "./learn";
export type {
  DailyLearnMoment,
  LearnItem,
  LearnKind,
  LearnLesson,
  LearnUnit,
  LearnText,
  LearnExercise,
  FlashExercise,
  ChooseExercise,
  ChooseQuestion,
  ExampleExercise,
  MatchExercise,
  BuildExercise
} from "./learn";
export {
  EMPTY_LEARN_PROGRESS,
  XP_PER_CORRECT,
  XP_LESSON_BONUS,
  starsForAccuracy,
  nextStreak,
  recordLessonResult,
  countCompletedLessons,
  getNextLessonId
} from "./learnProgress";
export type { LearnProgress, LessonRecord } from "./learnProgress";
export { mulberry32 } from "./quiz";
export {
  shareGrid,
  cleanChallengeName,
  buildChallengeQuery,
  parseChallenge,
  compareToChallenge
} from "./quizShare";
export type { QuizChallenge, ChallengeOutcome } from "./quizShare";
export { participationStreak } from "./participation";
export {
  DAILY_ROUNDS,
  difficultyForLevel,
  getDailyChallengeSpec,
  isRoundAvailable,
  isValidChallengeDate,
  resolveDailyChallenge,
  summarizeDailyResult
} from "./dailyChallenge";
export type {
  DailyChallengeContent,
  DailyChallengeOverride,
  DailyChallengeSpec,
  DailyDifficulty,
  DailyRoundContent,
  DailyResultSummary,
  DailyRoundSpec
} from "./dailyChallenge";
