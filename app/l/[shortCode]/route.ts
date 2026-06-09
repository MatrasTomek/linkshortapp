import { getShortLinkByShortCode } from "@/data/short-links";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  const { shortCode } = await params;

  const link = await getShortLinkByShortCode(shortCode);

  if (!link) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.redirect(link.url, { status: 307 });
}
