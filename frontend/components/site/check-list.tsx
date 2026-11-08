import { Check } from "lucide-react";

/** Bullet list with a check icon, used for deliverables and beliefs. */
export function CheckList({ items, iconSize }: { items: readonly string[]; iconSize?: number }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>
          <Check size={iconSize} />
          {item}
        </li>
      ))}
    </ul>
  );
}
