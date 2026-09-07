import Image from "next/image";
import { PRESS_ROOM_CONTACT_EMAIL, PRESS_ROOM_ASSETS } from "@/lib/press-room-content";

export default function PressPage() {
  return (
    <div className="w-full">
      {/* No About band on this page — the reference runs the grey wash straight
          to the foot, so the content column just holds the viewport open. */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-[72px] pt-10 md:pt-20 pb-16 md:pb-24 min-h-[calc(100vh-200px)]">
        <div className="mb-6 md:mb-8">
          <Image
            src={PRESS_ROOM_ASSETS.titlePress}
            alt="Press"
            width={291}
            height={93}
            className="h-[38px] md:h-[56px] w-auto"
            priority
          />
        </div>

        {/* Capped so the measure stays readable rather than running the column. */}
        <p className="text-[16px] md:text-[18px] leading-[26px] md:leading-[30px] max-w-[430px] font-lato font-normal">
          If you&rsquo;d like to write a story about Bubba or feature us in a
          video, please email{" "}
          <a
            href={`mailto:${PRESS_ROOM_CONTACT_EMAIL}`}
            className="no-underline hover:underline break-words"
            style={{ color: "#1a4336" }}
          >
            {PRESS_ROOM_CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
