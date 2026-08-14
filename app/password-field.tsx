"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

export function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  disabled,
  hint,
  showStrength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  /** Renders the strength meter. Only meaningful while choosing a password. */
  showStrength?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const hintId = useId();

  return (
    <label>
      {label}
      <span className="password-field">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          // Stops the browser accepting input the server would reject anyway,
          // so an over-long password fails at the keyboard rather than at submit.
          maxLength={MAX_PASSWORD_LENGTH}
          aria-describedby={hint ? hintId : undefined}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          title={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
      {showStrength && value.length > 0 && <StrengthMeter password={value} />}
      {hint && (
        <small className="field-hint" id={hintId}>
          {hint}
        </small>
      )}
    </label>
  );
}

/** Mirrors the server's minPasswordLength of 8. */
export const MIN_PASSWORD_LENGTH = 8;
/** Mirrors the server's maxPasswordLength of 128. */
export const MAX_PASSWORD_LENGTH = 128;

export function passwordProblem(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Use ${MAX_PASSWORD_LENGTH} characters or fewer.`;
  }
  return null;
}

export type PasswordStrength = {
  /** 0 weak, 1 fair, 2 good, 3 strong. */
  score: 0 | 1 | 2 | 3;
  label: string;
  /** The single most useful thing to change, or null once strong. */
  advice: string | null;
};

/** Sequences a keyboard-walking guess would try early. */
const SEQUENCES = ["abcdefghijklmnopqrstuvwxyz", "01234567890", "qwertyuiop", "asdfghjkl", "zxcvbnm"];

function hasRun(lower: string): boolean {
  return SEQUENCES.some((sequence) => {
    for (let index = 0; index + 4 <= sequence.length; index += 1) {
      const run = sequence.slice(index, index + 4);
      if (lower.includes(run) || lower.includes([...run].reverse().join(""))) return true;
    }
    return false;
  });
}

/**
 * A deliberately small heuristic rather than a dictionary library: it runs on
 * every keystroke and only needs to steer people away from the passwords that
 * fall first, not to produce a true entropy estimate.
 */
export function passwordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "Weak", advice: "Use at least 8 characters." };

  const lower = password.toLowerCase();
  const classes =
    Number(/[a-z]/.test(password)) +
    Number(/[A-Z]/.test(password)) +
    Number(/[0-9]/.test(password)) +
    Number(/[^A-Za-z0-9]/.test(password));

  let points = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) points += 1;
  if (password.length >= 12) points += 1;
  if (password.length >= 16) points += 1;
  if (classes >= 2) points += 1;
  if (classes >= 3) points += 1;

  // Repetition and keyboard runs make a long password no harder to guess, so
  // they cancel out the length credit rather than merely failing to earn it.
  const repeated = /(.)\1{2,}/.test(password);
  const singleClassWord = classes === 1 && /^[a-z]+$/.test(lower);
  if (repeated || hasRun(lower) || singleClassWord) points -= 2;

  let advice: string | null = null;
  if (password.length < MIN_PASSWORD_LENGTH) {
    advice = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  } else if (repeated || hasRun(lower)) {
    advice = "Avoid repeated characters and keyboard runs.";
  } else if (password.length < 12) {
    advice = "Longer is stronger — aim for 12 or more.";
  } else if (classes < 3) {
    advice = "Mix in capitals, numbers or symbols.";
  }

  const score = (points <= 1 ? 0 : points === 2 ? 1 : points === 3 ? 2 : 3) as 0 | 1 | 2 | 3;
  return {
    score,
    label: ["Weak", "Fair", "Good", "Strong"][score],
    // A long passphrase rates Strong on length alone; still asking it for
    // symbols would read as the meter refusing to be satisfied.
    advice: score === 3 ? null : advice,
  };
}

function StrengthMeter({ password }: { password: string }) {
  const { score, label, advice } = passwordStrength(password);

  return (
    <span className="password-strength" data-score={score}>
      <span className="password-strength-bars" aria-hidden="true">
        {[0, 1, 2, 3].map((step) => (
          <span key={step} className={step <= score ? "is-filled" : undefined} />
        ))}
      </span>
      {/* Announced politely so a screen reader hears the rating settle rather
          than every intermediate value while typing. */}
      <span className="password-strength-text" role="status" aria-live="polite">
        <strong>{label}</strong>
        {advice && ` — ${advice}`}
      </span>
    </span>
  );
}
