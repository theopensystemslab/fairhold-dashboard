import Image from "next/image";

export const Ankle: React.FC = () => (
  <div className="footer p-8 bg-[rgb(var(--footer-background-rgb))]">
    <div className="w-[80rem] flex flex-col mx-auto gap-8">
      <h2 className="text-white h2-style text-xl">Share this survey</h2>
      <div className="flex-1 text-white">
          Invite others to take this survey so we can hear from the widest possible range of voices, and take this message to planners and politicians.
      </div>
      <div className="flex flex-row gap-8">
        {/* COL 1 */}
        <div className="flex flex-col md:w-1/4">
          <div className="flex flex-row items-center gap-3">
              <a href="https://tally.so/r/3E67QN" target="_blank"
              className="social-media-link w-inline-block">
                  <Image width={35} height={35} 
                  alt="Link icon"
                  src="/icons/link-circle-fill-svgrepo-com.svg"
                  loading="lazy"
                  className="min-h-[30px] invert brightness-0 w-[35px] h-[35px]" />
              </a>
              <p className="body-s text-white"><a href="https://tally.so/r/3E67QN" target="_blank">Copy link</a></p>
          </div>
        </div>
        {/* COL 2 */}
        <div className="hidden md:w-1/4 md:block" />
        {/* COL 3 */}
        <div className="hidden md:w-1/4 md:block" />
        {/* COL 4 */}
        <div className="flex flex-col gap-3 md:w-1/4">
          <div className="flex-1 flex-row body-s text-white">
              Share via social media
          </div>
          <div className="flex flex-row gap-3">
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
              <Image width={30} height={30} alt="LinkedIn logo"
                src="/icons/InBug-White.png"
                className="min-h-[30px] invert brightness-0" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
              <Image width={30} height={30} alt="Facebook logo"
                src="/icons/facebook.svg" 
                className="min-h-[30px] invert brightness-0" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
              <Image width={30} height={30} alt="Whatsapp logo"
                src="/icons/whatsapp.svg"
                className="min-h-[30px] invert brightness-0" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
              <Image width={30} height={30} alt="Mastodon logo"
                src="/icons/mastodon.svg"
                className="min-h-[30px] invert brightness-0" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
              <Image width={30} height={30} alt="Bluesky logo"
                src="/icons/bluesky.svg"
                className="min-h-[30px] invert brightness-0" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
              <Image width={30} height={30} alt="X logo"
                src="/icons/x.svg"
                className="min-h-[30px] invert brightness-0" />
            </a>
          </div>
        </div>
    </div>
    <hr className="h-px my-4 bg-white border-0"></hr>
    </div>
  </div>
)
