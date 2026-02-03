"use client";
import { useRouter } from "next/navigation";

export default function SecretCopyrightButton() {
  const router = useRouter();
  return (
    <button
      className="align-baseline font-medium italic bg-transparent border-none outline-none p-0 m-0 cursor-pointer transition-colors"
      onClick={() => {
        router.push("/secret");
      }}
      aria-label="Secret Access"
      type="button"
      style={{
        display: "inline",
        font: "inherit",
        color: "inherit",
        transition: "color 0.3s",
      }}
      onMouseOver={e => {
        e.currentTarget.style.color = "var(--color-accent)";
      }}
      onFocus={e => {
        e.currentTarget.style.color = "var(--color-accent)";
      }}
      onMouseOut={e => {
        e.currentTarget.style.color = "inherit";
      }}
      onBlur={e => {
        e.currentTarget.style.color = "inherit";
      }}
    >
      Tasso
    </button>
  );
}
