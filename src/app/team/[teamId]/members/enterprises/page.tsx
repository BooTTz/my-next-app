"use client";
import { redirect } from "next/navigation";
import { use } from "react";
export default function EnterprisesPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = use(params);
  redirect(`/team/${teamId}/members`);
}
