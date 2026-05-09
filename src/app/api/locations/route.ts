import { NextRequest, NextResponse } from "next/server";
import locationsData from "@/src/data/full.json";

type Ward = {
  name: string;
  latitude: number;
  longitude: number;
};

type LGA = {
  name: string;
  wards: Ward[];
};

type State = {
  state: string;
  lgas: LGA[];
};

const data: State[] = locationsData as State[];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const stateName = searchParams.get("state");
  const lgaName = searchParams.get("lga");
  const namesOnly = searchParams.get("names_only") === "true";

  // /api/locations?state=Abia&lga=Bende → wards for that LGA
  if (stateName && lgaName) {
    const state = findState(stateName);
    if (!state) return notFound(`State "${stateName}" not found`);

    const lga = findLGA(state, lgaName);
    if (!lga) return notFound(`LGA "${lgaName}" not found in ${state.state}`);

    return NextResponse.json({
      state: state.state,
      lga: lga.name,
      wards: namesOnly ? lga.wards.map((w) => w.name) : lga.wards,
    });
  }

  // /api/locations?state=Abia → LGAs (+ wards) for that state
  if (stateName) {
    const state = findState(stateName);
    if (!state) return notFound(`State "${stateName}" not found`);

    return NextResponse.json({
      state: state.state,
      lgas: namesOnly ? state.lgas.map((l) => l.name) : state.lgas,
    });
  }

  // /api/locations → all states
  return NextResponse.json({
    states: namesOnly ? data.map((s) => s.state) : data,
  });
}

function normalize(str: string) {
  return str.trim().toLowerCase();
}

function findState(name: string) {
  return data.find((s) => normalize(s.state) === normalize(name)) ?? null;
}

function findLGA(state: State, name: string) {
  return state.lgas.find((l) => normalize(l.name) === normalize(name)) ?? null;
}

function notFound(message: string) {
  return NextResponse.json({ error: message }, { status: 404 });
}
