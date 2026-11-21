"use client";
import { useState } from "react";
import { formatCpf } from "../../lib/format";
import { Field } from "./field";

/** Campo de CPF com máscara 000.000.000-00. */
export function CpfField({ defaultValue = "" }: { defaultValue?: string }) {
  const [value, setValue] = useState(() => formatCpf(defaultValue));
  return (
    <Field
      name="cpf"
      label="CPF"
      inputMode="numeric"
      maxLength={14}
      placeholder="000.000.000-00"
      value={value}
      onChange={(event) => setValue(formatCpf(event.target.value))}
    />
  );
}
