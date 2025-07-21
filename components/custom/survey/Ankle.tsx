import "@app/webflow.css";
import Image from "next/image";

export const Ankle: React.FC = () => (
  <div className="footer p-8">
    <div className="w-[80rem] mx-auto">
        <h2 className="mb-4 ankle-heading">Share this survey</h2>
        <div className="flex-1 body-s white p-4">
            Invite others to take this survey so we can hear from the widest possible range of voices, and take this message to planners and politicians.
        </div>
        <div className="flex flex-row gap-8">
            <div className="flex flex-row items-center">
                <a href="https://tally.so/r/3E67QN" target="_blank"
                className="social-media-link w-inline-block">
                    <Image width="30" height="30" sizes="(max-width: 479px) 17vw, 30px"
                    alt="Link icon"
                    src="https://cdn.prod.website-files.com/665dd5e4ad0dc9aad281585c/6754843fdf51f215bb4ad40c_twitter%20white2023.png"
                    loading="lazy"
                    className="image-5"/>
                </a>
                <div className="body-s white">Copy link</div>
            </div>
            <div className="flex-1 flex-row body-s white p-4">
                Share via social media
            </div>
      </div>
    </div>
  </div>
)
