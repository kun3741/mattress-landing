/// <reference types="react" />
/// <reference types="react-dom" />

// Global JSX namespace declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module "next/link" {
  import { ComponentProps } from "react";
  export default function Link(props: ComponentProps<"a"> & { href: string }): JSX.Element;
}

declare module "next/navigation" {
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
  };
  export function useSearchParams(): URLSearchParams;
  export function usePathname(): string;
}
