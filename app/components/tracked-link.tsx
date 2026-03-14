"use client";

import Link, { LinkProps } from "next/link";
import { trackEvent } from "../../lib/analytics";

type TrackedLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  eventName: string;
  eventMeta?: Record<string, string | number | boolean>;
};

export function TrackedLink({
  children,
  className,
  eventName,
  eventMeta,
  ...linkProps
}: TrackedLinkProps) {
  return (
    <Link
      {...linkProps}
      className={className}
      onClick={() => trackEvent(eventName, eventMeta)}
    >
      {children}
    </Link>
  );
}
