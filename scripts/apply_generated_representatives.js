const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data", "visual-dictionary.json");
const OUT_DIR = path.join(ROOT, "app", "generated", "representatives");

const GENERATED_DIR = path.join(
  process.env.USERPROFILE || process.env.HOME,
  ".codex",
  "generated_images",
  "019e9386-1677-7ba3-a5f8-34326630868f"
);

const replacements = [
  {
    id: "cyberpunk",
    file: "ig_02879523271df06e016a4413248dcc8191a84b6af45db8fb9b.png",
    notes: "Generated replacement: stronger neon, rain, megacity, and corporate dystopia cues."
  },
  {
    id: "dieselpunk",
    file: "ig_02879523271df06e016a4413d407d4819188b795ef4f0c7697.png",
    notes: "Generated replacement: stronger diesel machinery, smokestacks, interwar industry, and militarized atmosphere."
  },
  {
    id: "cosmic_horror",
    file: "ig_02879523271df06e016a44141b8af881919beb817a9c4000c6.png",
    notes: "Generated replacement: stronger cyclopean ruins, cosmic void, and unknowable-scale dread."
  },
  {
    id: "techwear",
    file: "ig_02879523271df06e016a441466afc0819187e608c9be2bf35b.png",
    notes: "Generated replacement: clearer black technical clothing, modular straps, rain shell, and urban utility."
  },
  {
    id: "military_sf",
    file: "ig_02879523271df06e016a4414c349048191a2d08498e98cb0a0.png",
    notes: "Generated replacement: replaces toy-like image with futuristic military vehicles, base structures, and exosuit silhouettes."
  },
  {
    id: "post_apocalyptic",
    file: "ig_02879523271df06e016a441509a97c8191858360e94def874c.png",
    notes: "Generated replacement: stronger abandoned city, overgrown street, rusted vehicles, and collapse cues."
  },
  {
    id: "towerpunk",
    file: "ig_02879523271df06e016a44155e456c81919700a5ae1b3a8d24.png",
    notes: "Generated replacement: clearer vertical city, stacked towers, skybridges, and layered infrastructure."
  },
  {
    id: "concretepunk",
    file: "ig_02879523271df06e016a4415ac20d88191b36d7cd2a314a1e1.png",
    notes: "Generated replacement: stronger raw concrete, monumental stairs, hard shadows, and brutal spatial mass."
  },
  {
    id: "skycitypunk",
    file: "ig_02879523271df06e016a4415f695bc819190ef93f1c1bba95d.png",
    notes: "Generated replacement: clearer sky city with floating platforms, bridges, gardens, and cloud-layer scale."
  },
  {
    id: "subterranean_punk",
    file: "ig_02879523271df06e016a44164597ac81919209a974a96913a0.png",
    notes: "Generated replacement: clearer underground urbanism with layered tunnels, housing, pipes, and warm artificial light."
  },
  {
    id: "submerged_city_punk",
    file: "ig_02879523271df06e016a4416f22ee88191919d2427e96de713.png",
    notes: "Generated replacement: stronger submerged city image with flooded avenues, drowned buildings, and waterline perspective."
  },
  {
    id: "biopunk",
    file: "ig_02879523271df06e016a44174b233c8191aced6cdecb2553b1.png",
    notes: "Generated replacement: clearer biotech laboratory, glass tanks, organic growth, and bio-machine cues."
  },
  {
    id: "steampunk",
    file: "ig_0f75be696e926c27016a44a9d232108191a5ff92757038719f.png",
    notes: "Generated replacement: clearer Victorian steam machinery, brass pipes, gears, and airship cues."
  },
  {
    id: "retrofuturism",
    file: "ig_0f75be696e926c27016a44aa96a860819180fcc499b470501b.png",
    notes: "Generated replacement: stronger mid-century old-future architecture, bubble cars, chrome curves, and optimistic space-age cues."
  },
  {
    id: "space_opera",
    file: "ig_0f75be696e926c27016a44aaf74a748191aa4321e29b43c730.png",
    notes: "Generated replacement: clearer galactic scale with starships, orbital structures, planet horizon, and epic space-opera mood."
  },
  {
    id: "ruined_city",
    file: "ig_0f75be696e926c27016a44ab7004188191a1923a1a375a9f94.png",
    notes: "Generated replacement: stronger abandoned urban core, collapsed facades, vegetation, and deserted city scale."
  },
  {
    id: "castlepunk",
    file: "ig_0f75be696e926c27016a44abcb892c8191833b409218da770e.png",
    notes: "Generated replacement: clearer fortress silhouette with concentric walls, towers, gatehouse, and defensive architecture."
  },
  {
    id: "aqueductpunk",
    file: "ig_0f75be696e926c27016a44ac2a945c81918b11093f89e8bb03.png",
    notes: "Generated replacement: stronger aqueduct urbanism with repeated arches, elevated water channels, and civic water infrastructure."
  },
  {
    id: "greenhousepunk",
    file: "ig_0f75be696e926c27016a44ac8a68d881918b16c7159ad3907f.png",
    notes: "Generated replacement: clearer greenhouse architecture with glass ribs, humid botanical interior, and cultivation infrastructure."
  },
  {
    id: "floating_city_punk",
    file: "ig_08fde24b9ff5514a016a44ad73ff408191baa731e4de37b099.png",
    notes: "Generated replacement: stronger floating city with raft platforms, stilt houses, water walkways, boats, and harbor life."
  },
  {
    id: "railpunk",
    file: "ig_08fde24b9ff5514a016a44addbb7bc8191b39b830f4fcc8e63.png",
    notes: "Generated replacement: clearer railway architecture with vaulted station roof, tracks, platforms, and rail infrastructure."
  },
  {
    id: "monumentpunk",
    file: "ig_08fde24b9ff5514a016a44ae4ed5948191a07440eff2c7bbf4.png",
    notes: "Generated replacement: stronger monumental architecture with broad stairs, memorial plaza, monolithic pillars, and imposing scale."
  },
  {
    id: "dark_fantasy",
    file: "ig_0191e28e238d1d02016a44b0372b0c819185d53ad46e042ebb.png",
    notes: "Generated replacement: stronger cursed fortress, dead forest, storm sky, and dark fantasy atmosphere."
  },
  {
    id: "gothic_fantasy",
    file: "ig_0191e28e238d1d02016a44b09fdaa081919d669f9a3317ba8c.png",
    notes: "Generated replacement: clearer gothic castle/cathedral interior, pointed arches, stained glass, candlelight, and moonlit decay."
  },
  {
    id: "dampunk",
    file: "ig_0191e28e238d1d02016a44b100ab7481919a25a99e70a733f3.png",
    notes: "Generated replacement: stronger dam megastructure with curved concrete wall, spillways, turbine halls, and canyon scale."
  },
  {
    id: "glasspunk",
    file: "ig_0191e28e238d1d02016a44b16b029881918528eff5133bb88f.png",
    notes: "Generated replacement: clearer glass architecture with transparent towers, atrium bridges, reflections, and crisp daylight."
  },
  {
    id: "modularpunk",
    file: "ig_0191e28e238d1d02016a44b1da53e48191993102f1a884785a.png",
    notes: "Generated replacement: stronger modular architecture with stacked prefab units, visible seams, plug-in balconies, and service cores."
  },
  {
    id: "containerpunk",
    file: "ig_0191e28e238d1d02016a44b25081e88191893c922fc64e73cf.png",
    notes: "Generated replacement: clearer container architecture with stacked shipping containers, corrugated steel, stairs, rooftop gardens, and port context."
  },
  {
    id: "brutalism",
    file: "ig_0af3252ad788bc63016a44b3de1b148191ac3d2226254952b5.png",
    notes: "Generated replacement: clearer brutalist architecture with raw concrete slabs, monumental stairs, deep shadows, and austere mass."
  },
  {
    id: "art_deco",
    file: "ig_0af3252ad788bc63016a44b4169e3c8191a0a7beb0ab028fec.png",
    notes: "Generated replacement: stronger Art Deco cues with stepped skyscraper geometry, brass, marble, sunburst ornament, and glamorous symmetry."
  },
  {
    id: "victorian",
    file: "ig_0af3252ad788bc63016a44b4a401e4819190af1907edb9bd1a.png",
    notes: "Generated replacement: clearer Victorian street architecture with bay windows, brickwork, gas lamps, wrought iron, and fog."
  },
  {
    id: "neon_noir",
    file: "ig_0af3252ad788bc63016a44b4e2e1b48191bc0ebeb82aa8793a.png",
    notes: "Generated replacement: stronger neon noir image with rainy alley, neon reflections, detective silhouette, smoky doorway, and noir lighting."
  },
  {
    id: "liminal_space",
    file: "ig_0af3252ad788bc63016a44b522effc819199bab2320bdd5aed.png",
    notes: "Generated replacement: clearer liminal corridor with fluorescent lighting, empty commercial-school transition, repeating doors, and uncanny stillness."
  },
  {
    id: "body_horror",
    file: "ig_0fee972237d63793016a44b5a0bee881919791f2d1633e60cd.png",
    notes: "Generated replacement: symbolic body horror with clinical room, organic membrane, distorted hand silhouette, and unsettling non-gory transformation cues."
  }
];

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function altFor(entry) {
  const cues = [];
  for (const category of ["visual_elements", "materials", "settings"]) {
    cues.push(...(entry.tags?.[category] || []));
  }
  return `${entry.name}の生成代表画像。${unique(cues).slice(0, 5).join(", ")}`;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const dictionary = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const entriesById = new Map(dictionary.entries.map((entry) => [entry.id, entry]));

  for (const replacement of replacements) {
    const entry = entriesById.get(replacement.id);
    if (!entry) throw new Error(`Unknown entry id: ${replacement.id}`);

    const sourcePath = path.join(GENERATED_DIR, replacement.file);
    if (!fs.existsSync(sourcePath)) throw new Error(`Missing generated image: ${sourcePath}`);

    const destName = `${replacement.id}.png`;
    const destPath = path.join(OUT_DIR, destName);
    fs.copyFileSync(sourcePath, destPath);

    const webPath = `/app/generated/representatives/${destName}`;
    entry.representative_image = {
      thumbnail_url: webPath,
      image_url: webPath,
      source_page_url: webPath,
      source: "OpenAI image generation",
      creator: "OpenAI",
      license: "AI-generated local project asset",
      license_url: "https://openai.com/policies/terms-of-use",
      alt: altFor(entry),
      notes: replacement.notes
    };
  }

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(dictionary, null, 2)}\n`, "utf8");
  console.log(`Applied ${replacements.length} generated representative images`);
}

main();
