"use client";

import { useState } from "react";
import Image from "next/image";
import { PRESS_ROOM_ASSETS, PRESS_ROOM_COLORS } from "@/lib/press-room-content";

type AssetDownload = {
  name: string;
};

type Asset = {
  name: string;
  downloads: AssetDownload[];
};

const ASSETS_DATA: Asset[] = [
  {
    name: "Logos",
    downloads: [{ name: "Logo 1" }, { name: "Logo 2" }, { name: "Logo 3" }],
  },
  {
    name: "App Images",
    downloads: [{ name: "Image 1" }, { name: "Image 2" }, { name: "Image 3" }],
  },
  {
    name: "Illustrations",
    downloads: [
      { name: "Illustration 1" },
      { name: "Illustration 2" },
      { name: "Illustration 3" },
    ],
  },
];

/* Three 262px tiles plus two 24px gutters — the row is capped rather than
   stretched across the full content column. */
const GRID = "grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 max-w-[822px]";
const TILE = "w-full aspect-[338/398] bg-black rounded-[14px] mb-2 md:mb-3";

export default function AssetsPage() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const selectedAssetData = ASSETS_DATA.find((a) => a.name === selectedAsset);

  return (
    <div className="w-full">
      {/* No About band here — the reference runs the grey wash to the foot. */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-[72px] pt-10 md:pt-20 pb-16 md:pb-24 min-h-[calc(100vh-200px)]">
        <div className="mb-6 md:mb-8">
          <Image
            src={PRESS_ROOM_ASSETS.titleAssets}
            alt="Assets"
            width={375}
            height={93}
            className="h-[38px] md:h-[56px] w-auto"
            priority
          />
        </div>

        {!selectedAsset ? (
          /* Category Selection View */
          <div className={GRID}>
            {ASSETS_DATA.map((asset) => (
              <button
                key={asset.name}
                type="button"
                className="text-left"
                onClick={() => setSelectedAsset(asset.name)}
                aria-label={`View ${asset.name}`}
              >
                <div className={`${TILE} transition-opacity hover:opacity-80`} />
                <p
                  className="text-[15px] md:text-[16px] font-lato font-normal"
                  style={{ color: PRESS_ROOM_COLORS.darkGreen }}
                >
                  {asset.name}
                </p>
              </button>
            ))}
          </div>
        ) : (
          /* Downloads View */
          <div>
            <button
              type="button"
              onClick={() => setSelectedAsset(null)}
              className="mb-5 md:mb-8 text-[14px] font-lato font-normal hover:opacity-70 transition-opacity"
              aria-label="Back to assets"
            >
              &larr; Back
            </button>

            <div className={GRID}>
              {selectedAssetData?.downloads.map((download) => (
                <div key={download.name}>
                  <div className={TILE} />
                  <button
                    type="button"
                    className="text-[15px] md:text-[16px] font-lato font-normal hover:underline"
                    style={{ color: PRESS_ROOM_COLORS.darkGreen }}
                    aria-label={`Download ${download.name}`}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
