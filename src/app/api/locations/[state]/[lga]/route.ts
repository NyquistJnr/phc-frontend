import { NextRequest, NextResponse } from "next/server";
import locationsData from "@/src/data/full.json";

type Ward = { name: string; latitude: number; longitude: number };
type LGA = { name: string; wards: Ward[] };
type State = { state: string; lgas: LGA[] };

const data: State[] = locationsData as State[];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ state: string; lga: string }> },
) {
  const { state: stateParam, lga: lgaParam } = await params;
  const namesOnly = request.nextUrl.searchParams.get("names_only") === "true";

  const decode = (s: string) => decodeURIComponent(s).toLowerCase();

  const state = data.find((s) => s.state.toLowerCase() === decode(stateParam));
  if (!state) {
    return NextResponse.json(
      { error: `State "${stateParam}" not found` },
      { status: 404 },
    );
  }

  const lga = state.lgas.find((l) => l.name.toLowerCase() === decode(lgaParam));
  if (!lga) {
    return NextResponse.json(
      { error: `LGA "${lgaParam}" not found in ${state.state}` },
      { status: 404 },
    );
  }

  return NextResponse.json({
    state: state.state,
    lga: lga.name,
    wards: namesOnly ? lga.wards.map((w) => w.name) : lga.wards,
  });
}
