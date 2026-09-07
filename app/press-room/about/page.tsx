import Image from "next/image";

import {
  PRESS_ROOM_ASSETS,
  PRESS_ROOM_COLORS,
  PRESS_ROOM_ABOUT_TEXT,
  PRESS_ROOM_TAGLINE,
} from "@/lib/press-room-content";

export default function AboutPage() {
  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-[72px] pt-10 md:pt-20 pb-12 md:pb-20">
        <div className="mb-6 md:mb-8">
          <Image
            src={PRESS_ROOM_ASSETS.titleAboutBubba}
            alt="About Bubba"
            width={683}
            height={93}
            /* "About Bubba" is the longest of the four titles, so it steps down
               further on phones than News / Assets / Press do. */
            className="h-[32px] md:h-[56px] w-auto"
            priority
          />
        </div>

        <div className="relative">
          <p className="text-[16px] md:text-[18px] leading-[28px] md:leading-[32px] font-lato font-normal lg:w-[520px]">
            {PRESS_ROOM_ABOUT_TEXT}
          </p>

          {/* Beside the copy on desktop, centred beneath it on phones. */}
          <div className="mt-10 flex justify-center lg:mt-0 lg:block lg:absolute lg:top-[6px] lg:left-[700px]">
            <Image
              src={PRESS_ROOM_ASSETS.bLogoGreen}
              alt=""
              width={175}
              height={271}
              aria-hidden="true"
              className="w-[92px] lg:w-[132px] h-auto"
            />
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <section
        className="py-[70px] md:py-[150px] text-white"
        style={{ backgroundColor: PRESS_ROOM_COLORS.darkGreen }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-[26px] md:text-[32px] font-canela font-medium">
            {PRESS_ROOM_TAGLINE}
          </h2>
        </div>
      </section>
    </div>
  );
}
