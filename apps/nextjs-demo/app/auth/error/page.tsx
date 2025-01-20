import React from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  return (
    <div className="h-dvh w-dvw bg-neutral-50 flex flex-col items-center justify-center">
      <div className="max-w-sm w-full p-5 bg-red-100 border border-error/20 shadow rounded-lg text-center">
        <h1 className="font-bold mt-2 text-2xl tracking-wide capitalize">
          Error {String(params?.error_code).replaceAll("_", " ")}
        </h1>
        <p className="text-xl capitalize">
          {params && String(params?.error).replaceAll("_", " ")}
        </p>
        <p className="mt-1">{params?.error_description}</p>
      </div>
    </div>
  );
};

export default Page;