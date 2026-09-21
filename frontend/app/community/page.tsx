import type { Metadata } from "next";
import ComingSoonPage from "@/components/layout/ComingSoonPage";

export const metadata: Metadata = {
  title: "Community",
};

export default function CommunityPage() {
  return (
    <ComingSoonPage
      title="Find your people."
      description="The Community is coming soon: a focused space for student builders, early adopters, and campus conversations that move ideas forward."
    />
  );
}
