import AboutSection from "@/app/components/press-room/AboutSection";
import { PRESS_ROOM_COLORS } from "@/lib/press-room-content";

type FeaturedPost = {
  title: string;
  description: string;
  date: string;
};

type BrandAsset = {
  name: string;
};

const FEATURED_POST: FeaturedPost = {
  title: "Title of post would go here",
  description: "Description of the post would go here",
  date: "June 12, 2026",
};

const LATEST_POSTS: FeaturedPost[] = Array(3).fill({
  title: "Title of post would go here",
  description: "Description of the post would go here",
  date: "June 12, 2026",
});

const BRAND_ASSETS: BrandAsset[] = [
  { name: "Logos" },
  { name: "App Images" },
  { name: "Illustrations" },
];

export default function PressRoomHome() {
  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 md:py-16">
        {/* Featured Section */}
        <section
          className="mb-12 pb-12 md:mb-20 md:pb-20 border-b"
          style={{ borderColor: PRESS_ROOM_COLORS.divider }}
        >
          <h2
            className="text-[13px] tracking-widest mb-6 font-sfpro font-bold"
            style={{ color: PRESS_ROOM_COLORS.darkGreen }}
          >
            FEATURED
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] lg:gap-12 items-start">
            {/* Featured Image */}
            <div className="w-full max-w-[380px] aspect-[424/394] bg-black rounded-[14px]" />

            {/* Featured Content */}
            <div className="pt-5 lg:pt-12">
              <h3 className="text-[20px] md:text-[24px] leading-tight mb-2 md:mb-3 font-lato font-bold">
                {FEATURED_POST.title}
              </h3>
              <p className="text-[14px] text-black mb-2 md:mb-3 font-lato font-normal">
                {FEATURED_POST.description}
              </p>
              <p className="text-[13px] text-gray-500 font-lato font-normal">
                {FEATURED_POST.date}
              </p>
            </div>
          </div>
        </section>

        {/* Latest Section */}
        <section
          className="mb-12 pb-12 md:mb-20 md:pb-20"
        >
          <h2
            className="text-[13px] tracking-widest mb-6 -mt-2 font-sfpro font-bold"
            style={{ color: PRESS_ROOM_COLORS.darkGreen }}
          >
            LATEST
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 max-w-[1040px]">
            {LATEST_POSTS.map((post, index) => (
              <article key={index}>
                <div className="w-full aspect-square bg-black rounded-[14px] mb-3" />
                <h3 className="text-[18px] md:text-[20px] leading-tight mb-2 font-lato font-bold max-w-[220px]">
                  {post.title}
                </h3>
                <p className="text-[14px] text-black mb-1 font-lato font-normal">
                  {post.description}
                </p>
                <p className="text-[14px] text-gray-500 font-lato font-normal">
                  {post.date}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Brand Assets Section */}
        <section
          className="mb-0 pb-4"
        >
          <h2
            className="text-[16px] tracking-widest mb-8 font-sfpro font-bold"
            style={{ color: PRESS_ROOM_COLORS.darkGreen }}
          >
            BRAND ASSETS
          </h2>
          {/* Scrolls on phones with the next tile peeking, so it reads as a
              deliberate carousel rather than a row clipped mid-word. */}
          <div className="flex gap-5 md:gap-6 overflow-x-auto pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 snap-x snap-mandatory">
            {BRAND_ASSETS.map((asset) => (
              <div
                key={asset.name}
                className="flex-shrink-0 snap-start w-[70%] max-w-[240px] sm:w-[215px] lg:w-[260px]"
              >
                <div className="w-full aspect-[338/398] bg-black rounded-[14px] mb-3" />
                <p className="text-[15px] md:text-[16px] pl-1 font-lato font-normal">
                  {asset.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <AboutSection />
    </div>
  );
}
