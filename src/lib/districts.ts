/** The 64 districts of Bangladesh, alphabetical. */
export const DISTRICTS = [
    "Bagerhat",
    "Bandarban",
    "Barguna",
    "Barishal",
    "Bhola",
    "Bogura",
    "Brahmanbaria",
    "Chandpur",
    "Chapainawabganj",
    "Chattogram",
    "Chuadanga",
    "Cox's Bazar",
    "Cumilla",
    "Dhaka",
    "Dinajpur",
    "Faridpur",
    "Feni",
    "Gaibandha",
    "Gazipur",
    "Gopalganj",
    "Habiganj",
    "Jamalpur",
    "Jashore",
    "Jhalokati",
    "Jhenaidah",
    "Joypurhat",
    "Khagrachhari",
    "Khulna",
    "Kishoreganj",
    "Kurigram",
    "Kushtia",
    "Lakshmipur",
    "Lalmonirhat",
    "Madaripur",
    "Magura",
    "Manikganj",
    "Meherpur",
    "Moulvibazar",
    "Munshiganj",
    "Mymensingh",
    "Naogaon",
    "Narail",
    "Narayanganj",
    "Narsingdi",
    "Natore",
    "Netrokona",
    "Nilphamari",
    "Noakhali",
    "Pabna",
    "Panchagarh",
    "Patuakhali",
    "Pirojpur",
    "Rajbari",
    "Rajshahi",
    "Rangamati",
    "Rangpur",
    "Satkhira",
    "Shariatpur",
    "Sherpur",
    "Sirajganj",
    "Sunamganj",
    "Sylhet",
    "Tangail",
    "Thakurgaon",
] as const;

/**
 * Common alternative spellings, so typing a familiar older name still finds
 * the district. Keys are lowercase; values are the canonical district name.
 */
const ALIASES: Record<string, string> = {
    comilla: "Cumilla",
    chittagong: "Chattogram",
    barisal: "Barishal",
    jessore: "Jashore",
    bogra: "Bogura",
    nawabganj: "Chapainawabganj",
    chapainababganj: "Chapainawabganj",
    maulvibazar: "Moulvibazar",
    moulavibazar: "Moulvibazar",
    coxsbazar: "Cox's Bazar",
    coxbazar: "Cox's Bazar",
    jhenidah: "Jhenaidah",
    netrakona: "Netrokona",
    khagrachari: "Khagrachhari",
};

/** Normalise for matching: lowercase, strip anything that isn't a letter. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

/**
 * Districts matching `query`, ranked: prefix matches first, then substring,
 * each alphabetical. An empty query returns the full list.
 */
export function searchDistricts(query: string): string[] {
    const q = norm(query);
    if (!q) return [...DISTRICTS];

    const aliasHit = Object.entries(ALIASES)
        .filter(([alt]) => alt.startsWith(q))
        .map(([, canonical]) => canonical);

    const prefix: string[] = [];
    const contains: string[] = [];

    for (const d of DISTRICTS) {
        const n = norm(d);
        if (n.startsWith(q)) prefix.push(d);
        else if (n.includes(q)) contains.push(d);
    }

    // Alias matches rank alongside prefix hits, without duplicating.
    const ranked = [...prefix, ...aliasHit, ...contains];
    return ranked.filter((d, i) => ranked.indexOf(d) === i);
}
