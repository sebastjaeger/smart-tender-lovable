import { Group, Text, UnstyledButton } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";

interface BackLinkProps {
  label: string;
  href?: string;
  onClick?: () => void;
}

export function BackLink({ label, href, onClick }: BackLinkProps) {
  const handleMouseEnter = (e: MouseEvent<HTMLElement>) => {
    // cf. main.tsx
    e.currentTarget.style.color = "#6366f1";
  };

  const handleMouseLeave = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = "";
  };

  const content = (
    <Group gap={4}>
      <IconChevronLeft size={16} style={{ opacity: 0.7 }} />
      <Text size="sm" fw={500}>
        {label}
      </Text>
    </Group>
  );

  const style = {
    color: "var(--mantine-color-dimmed)",
    textDecoration: "none",
    transition: "color 0.15s ease",
    display: "inline-flex",
  };

  if (href) {
    return (
      <Link
        to={href}
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </Link>
    );
  }

  return (
    <UnstyledButton
      onClick={onClick}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </UnstyledButton>
  );
}
