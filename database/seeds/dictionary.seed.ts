/**
 * Seeds the ContentSource + DictionaryWord tables from the same bundled
 * word list the web app uses offline (apps/web/src/components/shobdoshakti/
 * sampleDictionary.ts), so local development has real rows to query.
 *
 * This is USER_SUBMITTED/INTERNAL sample data for development only - not a
 * licensed dictionary import. Do not point this script at scraped or
 * commercial dictionary content without a ContentSource row classifying its
 * license first (see docs/architecture/v0.1-foundation.md#licensing).
 */
import { PrismaClient } from "@prisma/client";
import { normalizeForDictionary } from "@alapon/bengali";

const prisma = new PrismaClient();

const SAMPLE_WORDS = [
  "মা",
  "বাবা",
  "ভাই",
  "বোন",
  "দাদা",
  "দিদি",
  "নাম",
  "আম",
  "জল",
  "ফুল",
  "গান",
  "বই",
  "চাল",
  "মাছ",
  "হাত",
  "পা",
  "মন",
  "দিন",
  "রাত",
  "ভাত",
  "দুধ",
  "চা",
  "পানি",
  "আকাশ",
  "বাতাস",
  "গাছ",
  "পাখি",
  "নদী",
  "গ্রাম",
  "শহর",
  "বাড়ি",
  "স্কুল",
  "কলম",
  "ছাত্র",
  "বন্ধু",
  "কলা",
  "কথা",
  "ক্ষমা",
  "বিদ্যা",
  "সকাল",
  "বিকাল",
  "সন্ধ্যা"
];

async function main() {
  const source = await prisma.contentSource.upsert({
    where: { id: "seed-sample-dictionary" },
    update: {},
    create: {
      id: "seed-sample-dictionary",
      sourceName: "Alapon V0.1 sample word list",
      license: "INTERNAL",
      rightsStatus: "Internal development seed data, not for production import.",
      retrievedAt: new Date()
    }
  });

  for (const word of SAMPLE_WORDS) {
    const normalizedWord = normalizeForDictionary(word);
    await prisma.dictionaryWord.upsert({
      where: { normalizedWord },
      update: {},
      create: {
        word,
        normalizedWord,
        partOfSpeech: "UNKNOWN",
        difficulty: 1,
        frequency: 1,
        validForGame: true,
        sourceId: source.id,
        license: "INTERNAL",
        confidence: 1
      }
    });
  }

  await prisma.game.upsert({
    where: { slug: "shobdoshakti" },
    update: {},
    create: {
      slug: "shobdoshakti",
      nameBn: "শব্দশক্তি",
      nameEn: "ShobdoShakti",
      type: "WORD_BOARD",
      status: "ACTIVE"
    }
  });

  console.log(`Seeded ${SAMPLE_WORDS.length} dictionary words and the ShobdoShakti game row.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
