import Image from "next/image";

export const Footer: React.FC = () => (
  <footer className="bg-[rgb(var(--footer-background-rgb))] text-white py-8 ">
    <div className="max-w-[1280px] mx-auto px-4">
      {/* ROW 1 */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* COL 1 */}
        <div className="flex flex-col md:w-1/4">
          <a href="#" className="mb-1 text-sm hover:underline opacity-90">Terms of use</a>
          <a href="#" className="mb-1 text-sm hover:underline opacity-90">Privacy</a>
          <a href="#" className="mb-1 text-sm hover:underline opacity-90">Accessibility</a>
          <a href="#" className="mb-1 text-sm hover:underline opacity-90">Contact us</a>
        </div>
        {/* COL 2 */}
        <div className="hidden md:w-1/4 md:block" />
        {/* COL 3 */}
        <div className="hidden md:w-1/4 md:block" />
        {/* COL 4 */}
        <div className="flex flex-row gap-3 md:w-1/4">
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

      <div className="h-20  "/>

      {/* ROW 2 */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* COL 1 */}
        <div className="flex flex-col items-start md:w-1/4">
          <span className="text-sm mb-8">Developed by</span>
          <a href="#" className="flex items-center gap-2 hover:opacity-60">
            <Image src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754893e21b56d4557aa3597_OSL_icon_white.svg"
              width={40} height={40} alt="OSL-logo" />
            <span className="text-white text-base leading-5">Open<br />Systems<br />Lab</span>
          </a>
        </div>

        {/* COL 2 */}
        <div className="flex flex-col items-start md:w-1/4">
          <span className="text-sm mb-8">Funded by</span>
          <div className="flex gap-6">
            <a href="#" className="hover:opacity-60">
              <Image src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754910ec9989275efe70268_TNCLFlogo.svg"
                width={179} height={60} alt="The National Lottery Community Fund Logo" />
            </a>
            <a href="#" className="hover:opacity-60">
              <Image src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754907fcfae984354b4cf6c_JRFlogo2024.svg"
                width={62} height={62} alt="JRF logo" />
            </a>
          </div>
        </div>

        {/* COL 3 */}
        <div className="md:w-1/4"/>

        {/* COL 4 */}
        <div className="flex flex-col items-start md:w-1/4">
          <span className="text-sm mb-2">© Open Systems Lab 2025</span>
          <span className="text-sm">
            Open Systems Lab / OSL is a non-profit company 9152368<br />
            registered in England &amp; Wales
          </span>
        </div>

      </div>
    </div>
  </footer>
)