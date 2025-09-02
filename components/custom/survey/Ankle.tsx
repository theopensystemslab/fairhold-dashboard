import Image from "next/image";

export const Ankle: React.FC = () => (
  <div className="footer p-8 bg-[rgb(var(--survey-black))]">
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
                  <Image width="30" height="30" sizes="(max-width: 479px) 17vw, 30px"
                  alt="Link icon"
                  src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754843fdf51f215bb4ad40c_twitter%20white2023.png"
                  loading="lazy"
                  className="image-5"/>
              </a>
              <div className="body-s  text-white">Copy link</div>
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
            <a href="https://twitter.com/WikiHouse" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
              <Image width={30} height={30} alt="Twitter logo"
                src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754843fdf51f215bb4ad40c_twitter%20white2023.png"
                className="min-h-[30px]" />
            </a>
            <a href="https://github.com/wikihouseproject/Skylark" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
              <Image width={30} height={30} alt="Github logo"
                src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754843fdf51f215bb4ad406_Github2023.png" />
            </a>
            <a href="https://www.youtube.com/channel/UCdaCCzZijlUBU6ntv_Xrd8w" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
              <Image width={30} height={30} alt="Youtube logo"
                src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754843fdf51f215bb4ad404_youtube%20white-01.png"
                className="min-h-[30px]" />
            </a>
                        <a href="https://twitter.com/WikiHouse" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
              <Image width={30} height={30} alt="Twitter logo"
                src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754843fdf51f215bb4ad40c_twitter%20white2023.png"
                className="min-h-[30px]" />
            </a>
            <a href="https://github.com/wikihouseproject/Skylark" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
              <Image width={30} height={30} alt="Github logo"
                src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754843fdf51f215bb4ad406_Github2023.png" />
            </a>
            <a href="https://www.youtube.com/channel/UCdaCCzZijlUBU6ntv_Xrd8w" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
              <Image width={30} height={30} alt="Youtube logo"
                src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754843fdf51f215bb4ad404_youtube%20white-01.png"
                className="min-h-[30px]" />
            </a>
          </div>
        </div>
    </div>
    </div>
  </div>
)
