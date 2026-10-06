/**
 * Every claim this page makes about the app, written down once.
 *
 * The <title>, the meta description, the JSON-LD and the visible copy are all
 * rendered from these constants, which is the only reason they cannot drift.
 * They used to: the page listed Android as a shipping platform in its feature
 * grid while the download card right below it said "Not available in latest
 * release", and the footer said "free and open source" while nothing on the
 * page named the license. A crawler reads each of those places separately, so
 * each contradiction became a separate wrong answer.
 *
 * Keep the wording plain and self-contained. AI assistants quote short
 * paragraphs lifted straight out of the HTML, so a sentence that only makes
 * sense after you scroll is a sentence nobody quotes.
 *
 * Facts here are checked against ~/Desktop/OpenSource/Typeshala (src/,
 * docs/specs/, docs/release-notes/, src-tauri/tauri.conf.json). Nothing here is
 * invented: if a platform or layout is not in the app, it is not in this file.
 */

/** Canonical name. Used for <title>, og:site_name and JSON-LD `name`. */
export const TYPESHALA_NAME = "Typeshala";

/**
 * The Devanagari spelling. Nepal writes the app's name in both scripts, and
 * "टाइपशाला" is how most people search for it. It has to be in the markup, not
 * only in an image, for it to be indexed.
 */
export const TYPESHALA_DEVANAGARI = "टाइपशाला";

export const TYPESHALA_AUTHOR = "Abhishek Gaire";
export const TYPESHALA_AUTHOR_URL = "https://www.abhishekgaire.com.np";

/** MIT. LICENSE at the repo root is the authoritative copy. */
export const TYPESHALA_LICENSE = "https://opensource.org/licenses/MIT";

/**
 * The app's first public release (v1.0.0, docs/release-notes/v1.0.md in the app
 * repo). This is the `datePublished` in the JSON-LD — it moves only if the app
 * is ever re-released under a new name, which is to say never. The *latest*
 * release date comes from the GitHub API at render time instead; see
 * getReleaseMeta in app/typeshala/layout.tsx.
 */
export const TYPESHALA_DATE_PUBLISHED = "2026-09-16";

/**
 * One line, for the `featureList` in the JSON-LD. Schema.org wants a single
 * text value here rather than an array, so this stays a string even though it
 * reads like a list.
 */
export const TYPESHALA_FEATURE_LIST =
  "Traditional Preeti layout, Romanized Nepali typing, English QWERTY lessons, WPM and accuracy scoring, progress trends, fully offline use";

/** GitLab is the source of truth; GitHub is a CI mirror that carries releases. */
export const TYPESHALA_REPO_URL = "https://gitlab.com/abhishek_gaire/typeshala";
export const TYPESHALA_GITHUB_URL =
  "https://github.com/Abhishek-Gaire/Typeshala";

/**
 * Desktop installers are the only ships that exist. Android is built and works
 * (spec 0016) but is not published anywhere, so it is not in this list — see
 * the `status` field in types/typeshala.ts for how the page says so out loud.
 */
export const TYPESHALA_PLATFORMS = "Windows, macOS, Linux";

export type TypeshalaScreenshot = {
  src: string;
  width: number;
  height: number;
  /**
   * What the image shows, for anyone who cannot see it. Written as a
   * description of the interface, not as a caption repeated next to it.
   */
  alt: string;
  caption: string;
};

/**
 * Product screenshots live in the repo under public/typeshala, not in the
 * Supabase bucket the portfolio's project images use. The bucket denies
 * anonymous writes, so shipping an image there means a dashboard upload on
 * every change; a file in git deploys with the page and diffs like everything
 * else. (The /projects case-study row still points at the bucket PNG in
 * supabase/migrations/20260929000001_seed_2026_projects.sql:46 — migration
 * history, leave it.)
 *
 * Filenames carry keywords on purpose: `nepali-typing-tutor-preeti-…` is
 * indexable text that `typeshala.png` is not.
 *
 * The intrinsic size is the file's real pixel size, not a display size.
 * next/image needs the true ratio to reserve the box and avoid layout shift
 * as it loads.
 */
export const TYPESHALA_SCREENSHOTS: TypeshalaScreenshot[] = [
  {
    src: "/typeshala/nepali-typing-tutor-preeti-screenshot.webp",
    width: 1920,
    height: 1142,
    alt: "Typeshala's classic practice screen. A line of Nepali text in Devanagari sits above an on-screen keyboard whose key caps print the Preeti key position above each Devanagari letter it produces. The next key to press, Devanagari hari, is lit red on the third row of key caps. A toolbar above holds the Practice, Lessons and Options menus, Home, Top, Bottom, All, Game and Free buttons, a three-level selector with Level 1 active, and a running average speed.",
    caption:
      "The classic practice screen, rebuilt: a Devanagari prompt line, the on-screen keyboard with its Preeti key labels, and the next required key lit up before you press it.",
  },
];

export const TYPESHALA_KEYWORDS = [
  "typeshala",
  "टाइपशाला",
  "nepali typing tutor",
  "nepali typing practice",
  "preeti typing",
  "preeti font typing tutor",
  "romanized nepali typing",
  "traditional preeti layout",
  "devanagari typing",
  "free typing tutor",
  "open source typing tutor",
  "typeshala download",
  "typeshala for windows",
  "typeshala for mac",
  "typeshala for linux",
  "नेपाली टाइपिङ",
];

/** ~165 characters: the point at which Google stops truncating. */
export const TYPESHALA_DESCRIPTION =
  "Free, open-source Nepali and English typing tutor for Windows, macOS and Linux. Practise Preeti, Romanized Nepali and QWERTY typing with lessons and progress stats.";

/**
 * The first thing on the page, and the paragraph AI assistants quote. One
 * "what is it" sentence, then the three facts people check before they
 * download: platforms, price, license.
 */
export const TYPESHALA_INTRO: string[] = [
  `${TYPESHALA_NAME} (${TYPESHALA_DEVANAGARI}) is a free, open-source typing tutor that teaches English and Nepali typing. It runs natively on ${TYPESHALA_PLATFORMS} and needs no account, no subscription and no network connection.`,
  "It teaches three layouts from the same set of structured lessons: English QWERTY, Romanized Nepali for people who type नेपाली in Latin letters, and Traditional Preeti — the legacy Nepali key layout that turns familiar QWERTY key positions into Devanagari text.",
  "The original Typshala that Nepali learners used for years is a 16-bit Windows program that no longer runs on a modern 64-bit machine without an emulator. Typeshala rebuilds that tutor as a native desktop app, keeping the layout, the drill structure and the lesson progression, and adding speed and accuracy scoring, progress trends and a bilingual interface.",
];

export type TypeshalaFaqEntry = {
  question: string;
  answer: string;
};

/**
 * Also rendered as FAQPage JSON-LD in app/typeshala/layout.tsx. Both come from
 * this array on purpose: structured data that disagrees with the visible text
 * is a manual action risk, and the cheapest way to never have that is to have
 * only one copy of the answer.
 */
export const TYPESHALA_FAQ: TypeshalaFaqEntry[] = [
  {
    question: "Is Typeshala free and open source?",
    answer: `Yes. ${TYPESHALA_NAME} costs nothing, has no ads, no in-app purchases and no account system. It is released under the MIT license, so you can read, modify and redistribute it. The source lives on GitLab, which is the project's source of truth; GitHub carries the built installers.`,
  },
  {
    question: "What is the Preeti layout, and does Typeshala support it?",
    answer:
      "Preeti is the traditional Nepali typing layout. You press the key positions you learned on the old tutor and Nepali text appears in Devanagari, the standard Unicode form of the script. Typeshala implements that mapping itself rather than relying on a system font or a Nepali keyboard driver, so Preeti typing works the same on Windows, macOS and Linux.",
  },
  {
    question: "Can I practise Nepali typing on a Mac or Linux?",
    answer:
      "Yes. There are native installers for macOS on both Apple Silicon and Intel, and for Linux as AppImage, .deb and .rpm. The Windows builds ship as both an .exe installer and an .msi package. Every platform runs the same lessons, the same Preeti and Romanized layouts, and the same progress tracking.",
  },
  {
    question: "Does Typeshala work offline, and where is my progress stored?",
    answer:
      "It works entirely offline. All of your progress, scores and settings are stored on your own device by the app's local store — there are no accounts, no cloud sync and no network calls at all. Uninstalling the app removes your data with it, and nothing about how you type is ever sent anywhere.",
  },
  {
    /*
     * "Classic", not "DOS-era" and not "original". The predecessor was a
     * 16-bit Windows program (per the app README: "Windows-era … 16-bit
     * application"), so calling it DOS-era in the question while the answer
     * says 16-bit Windows hands an AI two different facts about one program.
     * The answer's first sentence names it again, which is what pins the two
     * together for a summariser.
     */
    question: "How is this different from the classic Typshala?",
    answer:
      "The classic Typshala was a 16-bit Windows program. On a modern 64-bit Windows machine it needs an emulator or a compatibility layer before it will run at all, and it only runs on Windows. Typeshala is a rewrite: same layout, same drill structure, same progression, but built with Tauri, React and Rust so it is a native app on Windows, macOS and Linux, with speed and accuracy scoring, progress trends, themes and a bilingual interface.",
  },
];