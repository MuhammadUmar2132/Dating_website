import Image from "next/image";

import {
  PRESS_ROOM_ASSETS,
  PRESS_ROOM_COLORS,
  PRESS_ROOM_ABOUT_TEXT,
} from "@/lib/press-room-content";

export default function AboutSection() {
  return (
    <section
      className="pt-10 md:pt-14 pb-10 md:pb-12 mb-8 text-white"
      style={{ backgroundColor: PRESS_ROOM_COLORS.darkGreen }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          <div>
            <h2 className="text-[13px] tracking-widest mb-6 lg:mb-10 lg:-mt-6 text-white font-sfpro font-bold">
              ABOUT
            </h2>
            <p className="text-[15px] md:text-[17px] leading-[26px] md:leading-[32px] font-lato font-normal lg:mt-2">
              {PRESS_ROOM_ABOUT_TEXT}
            </p>
          </div>
          <div className="flex justify-center items-center">
            <Image
              src={PRESS_ROOM_ASSETS.bLogo}
              alt="Bubba Logo"
              width={160}
              height={160}
              className="w-[92px] lg:w-[130px] h-auto opacity-90 lg:-mt-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
