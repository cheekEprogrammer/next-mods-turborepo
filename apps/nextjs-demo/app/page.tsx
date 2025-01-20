import React from "react";
import { promises as fs } from "fs";

const Page = async () => {
  let data;
  let packageJson;
  try {
    const file = await fs.readFile(process.cwd() + "/next-mods.json", "utf8");
    const packageFile = await fs.readFile(
      process.cwd() + "/package.json",
      "utf8"
    );
    data = JSON.parse(file);
    packageJson = JSON.parse(packageFile);
  } catch (error) {
    data = null;
  }

  return (
    <div className="p-10">
      <pre className="bg-gray-800 w-fit pl-5 pb-2 text-white rounded shadow border">
        <div className="text-red-500">
          {" _____         _      _____       _       "}
        </div>
        <div className="text-green-500">
          {"|   | |___ _ _| |_   |     |___ _| |___   "}
        </div>
        <div className="text-blue-500">
          {"| | | | -_|_'_|  _|  | | | | . | . |_ -|  "}
        </div>
        <div className="text-yellow-500">
          {"|_|___|___|_,_|_|    |_|_|_|___|___|___|  "}
        </div>
        <h1 className="mt-1">Next.JS Demo Application with Next Mods</h1>
      </pre>

      <div className="mt-5">
        {data ? (
          <div className="space-y-4">
            Status: <span className="text-green-600 font-bold">Installed</span>
            <div>
              <p className="mb-4 font-bold">
                {packageJson.dependencies["next-mods"] === "*"
                  ? "Development Build"
                  : `v${packageJson.dependencies["next-mods"]}`}
              </p>
              <h2 className="">
                {data.functions.length === 1
                  ? "1 Function"
                  : `${data.functions.length} Functions`}{" "}
                Installed
              </h2>
              <ul className="list-disc pl-5">
                {data.functions.length > 0 &&
                  data.functions.map((func: any, index: number) => (
                    <li key={index} className="capitalize font-medium">
                      {func}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ) : (
          <>
            Status:{" "}
            <span className="text-red-600 font-bold">Not Installed</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
