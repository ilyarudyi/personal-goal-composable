"use client";
import dynamic from "next/dynamic";

import React from "react";
import { ConfiguratorProvider } from "@threekit/configurator";
import Form from "../components/Form";

const Player = dynamic(() => import("../components/Player"), { ssr: false });

export default function Home() {
  const auth = {
    orgId: process.env.NEXT_PUBLIC_ORG_ID ?? "",
    host: process.env.NEXT_PUBLIC_HOST ?? "",
    publicToken: process.env.NEXT_PUBLIC_PUBLIC_TOKEN ?? "",
    branch: "",
  };
  const assetId = process.env.NEXT_PUBLIC_ASSET_ID ?? "";

  return (
    <main className="flex h-full w-full flex-row items-center bg-white">
      <ConfiguratorProvider auth={auth}>
        <div className="flex w-8/12 h-full">
          <Player auth={auth} assetId={assetId} assetKey={assetId} />
        </div>
        <>
          <Form assetId={assetId} assetKey={assetId} />
        </>
      </ConfiguratorProvider>
    </main>
  );
}
