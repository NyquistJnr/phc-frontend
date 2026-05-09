import { NextRequest, NextResponse } from "next/server";
import locationsData from "@/src/data/full.json";

type Ward = { name: string; latitude: number; longitude: number };
type LGA = { name: string; wards: Ward[] };
type State = { state: string; lgas: LGA[] };

const data: State[] = locationsData as State[];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ state: string }> },
) {
  const { state: stateParam } = await params;
  const namesOnly = request.nextUrl.searchParams.get("names_only") === "true";

  const state = data.find(
    (s) =>
      s.state.toLowerCase() === decodeURIComponent(stateParam).toLowerCase(),
  );

  if (!state) {
    return NextResponse.json(
      { error: `State "${stateParam}" not found` },
      { status: 404 },
    );
  }

  return NextResponse.json({
    state: state.state,
    lgas: namesOnly ? state.lgas.map((l) => l.name) : state.lgas,
  });
}
