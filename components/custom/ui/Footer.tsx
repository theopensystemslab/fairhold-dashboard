import "@app/webflow.css";

import Image from "next/image";

export const Footer: React.FC = () => (
  <footer className="footer">
    <div className="w-layout-blockcontainer container w-container">
      <div className="columns w-row">
        <div className="column-6 w-col w-col-3"><a href="#" className="footer-link-block w-inline-block">
          <div className="body-s">Terms of
            use</div>
        </a><a href="#" className="footer-link-block w-inline-block">
            <div className="body-s">Privacy</div>
          </a><a href="#" className="footer-link-block w-inline-block">
            <div className="body-s">Accessibility</div>
          </a><a href="#" className="footer-link-block w-inline-block">
            <div className="body-s">Contact
              us</div>
          </a>
          <div className="spacer"></div>
        </div>
        <div className="column-4 w-col w-col-6"></div>
        <div className="column-5 w-col w-col-3">
          <div className="social-links">
            <a href="https://twitter.com/WikiHouse" target="_blank"
            className="social-media-link w-inline-block">
              <Image width="30" height="30" sizes="(max-width: 479px) 17vw, 30px"
              alt="Twitter logo"
              src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754843fdf51f215bb4ad40c_twitter%20white2023.png"
              loading="lazy"
              className="image-5"/>
            </a>
              <a href="https://github.com/wikihouseproject/Skylark" target="_blank"
                className="github-link w-inline-block">
                  <Image width="30" height="30" loading="lazy" alt="Github logo"
                  src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754843fdf51f215bb4ad406_Github2023.png"/>
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCdaCCzZijlUBU6ntv_Xrd8w" target="_blank"
                    className="social-media-link w-inline-block">
                    <Image width="30" height="30" loading="lazy" alt="Youtube logo"
                      src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754843fdf51f215bb4ad404_youtube%20white-01.png"
                      className="image-5"/>
                        </a></div>
        </div>
      </div>
      <div className="columns w-row">
        <div className="column-6 w-col w-col-3">
          <div className="body-s white">Developed by</div>
          <div className="spacer _20"></div><a href="#" className="osl-logo w-inline-block">
            <Image
              src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754893e21b56d4557aa3597_OSL_icon_white.svg"
              loading="lazy" width="40" height="40" alt="OSL-logo"/>
            <div className="spacer _10"></div>
            <div className="osl-text _20">Open<br/>Systems<br/>Lab</div>
          </a>
          <div className="spacer"></div>
        </div>
        <div className="column-4 w-col w-col-6">
          <div className="body-s white">Funded by</div>
          <div className="spacer _20"></div>
          <div className="funders-logos-wrapper"><a href="#" className="logo-link w-inline-block">
            <Image
            src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754910ec9989275efe70268_TNCLFlogo.svg"
            loading="lazy" height="60" width="179" alt="The National Lottery Community Fund Logo"/></a>
            <div className="spacer _30"></div><a href="#" className="logo-link w-inline-block">
              <Image
              src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754907fcfae984354b4cf6c_JRFlogo2024.svg"
                loading="lazy" height="62" alt="JRF logo" width="62"/></a>
          </div>
        </div>
        <div className="column-5 w-col w-col-3">
          <div className="body-s white">© Open Systems
            Lab 2025 <br/><br/>Open Systems Lab / OSL is a non-profit company 9152368<br/>
            registered in England &amp; Wales
          </div>
        </div>
      </div>
    </div>
  </footer>
)