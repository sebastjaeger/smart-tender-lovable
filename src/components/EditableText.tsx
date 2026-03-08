import { type CSSProperties, useCallback, useRef, useState } from "react";

interface EditableTextProps {
  /** Current value to display */
  value: string;
  /** Called with the new value when the user saves. Can return a promise to
   *  keep the field in editing mode until the save completes. */
  onSave: (value: string) => void | Promise<void>;
  /** Placeholder shown when the value is empty */
  placeholder?: string;
  /** Use a multiline textarea instead of a single-line input */
  multiline?: boolean;
  /** Additional CSS applied to the inner input / textarea element */
  style?: CSSProperties;
}

/**
 * Inline-editable text that renders an invisible input matching the
 * surrounding font. Click to edit, Enter / blur to save, Escape to cancel.
 *
 * Wrap this component in any typography element (`<Title>`, `<Text>`, …) —
 * the input inherits font styles via `font: inherit`.
 */
export function EditableText({
  value,
  onSave,
  placeholder,
  multiline = false,
  style,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const savingRef = useRef(false);

  // Callback ref: focus the element and place the cursor at the end when
  // editing starts.
  const editRef = useCallback(
    (node: HTMLInputElement | HTMLTextAreaElement | null) => {
      if (node) {
        node.focus();
        const len = node.value.length;
        node.setSelectionRange(len, len);
      }
    },
    [],
  );

  const startEditing = () => {
    if (!isEditing) {
      setDraft(value);
      setIsEditing(true);
    }
  };

  const cancel = () => {
    setIsEditing(false);
    setDraft(value);
  };

  const save = async () => {
    if (savingRef.current) return;

    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      savingRef.current = true;
      try {
        await onSave(trimmed);
      } finally {
        savingRef.current = false;
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!isEditing) return;
    if (e.key === "Escape") {
      cancel();
    } else if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      save();
    }
  };

  const sharedProps = {
    ref: isEditing ? editRef : undefined,
    value: isEditing ? draft : value,
    readOnly: !isEditing,
    placeholder,
    onClick: () => startEditing(),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft(e.target.value),
    onKeyDown: handleKeyDown,
    onBlur: () => {
      if (isEditing) save();
    },
    style: {
      font: "inherit",
      color: "inherit",
      background: "none",
      border: "none",
      outline: "none",
      padding: 0,
      margin: 0,
      width: "100%",
      resize: "none" as const,
      cursor: isEditing ? "text" : "pointer",
      caretColor: isEditing ? "auto" : "transparent",
      ...style,
    },
  };

  if (multiline) {
    return <textarea {...sharedProps} rows={1} />;
  }
  return <input {...sharedProps} />;
}
