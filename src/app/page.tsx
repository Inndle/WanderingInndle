import { parse } from "csv-parse/sync";
import * as fs from "fs";
import GameWrapper from "./Components/GameWrapper";

const INPUT_PATH = "./data/character_data.csv";

export default function Home({ allCharacterData }: { allCharacterData: [string, string[]][] }) {
  return (
    <div
      className="background bg-cover bg-center flex justify-center"
      style={{
        height: "100vh",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundImage: `url(https://static.wixstatic.com/media/94aeec_7f348c6465ca474aa9503b3640e76faf~mv2.jpg/v1/fill/w_1290,h_885,al_c,q_90/file.jpg)`,
      }}
    >
      <div className="game-container overflow-y-scroll w-full h-full">
        <GameWrapper allCharacterData={new Map(allCharacterData)} />
      </div>
    </div>
  );
}

// ✅ Fetch data at build time
export async function getStaticProps() {
  const file = fs.readFileSync(INPUT_PATH, "utf8");
  const tempData: string[][] = parse(file, {});

  if (!tempData.length) {
    throw new Error("Didn't read in any characters");
  }

  const allCharacterData: [string, string[]][] = tempData.map((row) => [row[0], row.slice(1)]);

  return {
    props: { allCharacterData },
  };
}