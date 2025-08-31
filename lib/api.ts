// lib/api.ts

export type Country = {
  name: string;          // common name
  capital: string | null;
  population: number | null;
  flagPng: string | null;
  flagSvg: string | null;
  cca2: string | null;   // ISO 3166-1 alpha-2
};

const FIELDS =
  "name,capital,population,flags,cca2"; // keep payload lean

/**
 * Fetch all countries with selected fields from REST Countries API.
 * https://restcountries.com/
 */
export async function fetchCountriesDetailed(): Promise<Country[]> {
  const url = `https://restcountries.com/v3.1/all?fields=${encodeURIComponent(
    FIELDS
  )}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch countries (${res.status})`);
  }

  const raw = await res.json();
  const list: Country[] = (raw || []).map((c: any) => ({
    name: c?.name?.common ?? "",
    capital: Array.isArray(c?.capital) && c.capital.length ? c.capital[0] : null,
    population:
      typeof c?.population === "number" ? (c.population as number) : null,
    flagPng: c?.flags?.png ?? null,
    flagSvg: c?.flags?.svg ?? null,
    cca2: c?.cca2 ?? null,
  }));

  // Filter empties and sort by name
  return list
    .filter((c) => !!c.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}
