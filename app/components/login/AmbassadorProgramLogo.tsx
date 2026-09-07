import Image from "next/image";

type Props = {
  size?: number;
  className?: string;
};

/**
 * `size` is the intrinsic width/height handed to next/image — it decides which
 * optimised variant gets fetched, not how big the logo paints. CSS does that
 * (.left-program-logo is 92px). It defaults to the source file's own 228px:
 * at 48 the browser was fetching a 48px file for a 92px box and upscaling it
 * ~2x, which is what made the mark look pixelated.
 */
export function AmbassadorProgramLogo({ size = 228, className = "" }: Props) {
  return (
    <Image
      src="/images/ambassador-logo.png"
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      priority
    />
  );
}