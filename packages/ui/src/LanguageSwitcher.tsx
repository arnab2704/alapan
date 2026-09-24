import clsx from "clsx";

export interface LanguageSwitcherProps {
  current: "bn" | "en";
  onSelect: (locale: "bn" | "en") => void;
  className?: string;
}

const options: Array<{ code: "bn" | "en"; label: string }> = [
  { code: "bn", label: "বাংলা" },
  { code: "en", label: "English" }
];

export function LanguageSwitcher({ current, onSelect, className }: LanguageSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="Language / ভাষা"
      className={clsx(
        "inline-flex items-center rounded-full border border-ink-100 bg-cream-50 p-0.5 dark:border-ink-700 dark:bg-ink-800",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.code}
          type="button"
          aria-pressed={current === option.code}
          onClick={() => onSelect(option.code)}
          className={clsx(
            "min-h-8 rounded-full px-3 py-1 text-sm font-medium transition-colors",
            current === option.code
              ? "bg-alpona-500 text-white"
              : "text-ink-600 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-700"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
