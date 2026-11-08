export interface Step {
  text: string;
  title?: string;
}

/** Ordered list numbered 01, 02, 03… Steps with a title render title + description. */
export function NumberedSteps({ steps }: { steps: readonly Step[] }) {
  return (
    <ol>
      {steps.map(({ title, text }, index) => (
        <li key={text}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          {title ? (
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ) : (
            <p>{text}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
