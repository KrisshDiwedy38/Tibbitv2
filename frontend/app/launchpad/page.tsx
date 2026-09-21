import type { Metadata } from "next";
import ComingSoonPage from "@/components/layout/ComingSoonPage";

export const metadata: Metadata = {
  title: "Launchpad",
};

export default function LaunchpadPage() {
  return (
    <ComingSoonPage
      title="Build the next thing."
      description="The Launchpad is being tuned for student founders who want to validate ideas, find collaborators, and turn campus momentum into something real."
    />
  );
}
