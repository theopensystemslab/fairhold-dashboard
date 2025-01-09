import { Drawer } from "./Drawer";

export const MaintenanceExplainerDrawer = () => (
  <Drawer
    title="How much will you spend on maintenance and improvements?"
    buttonTitle="What is this?"
    description="Fairhold treats homes as durables: their value depends on whether they are well cared-for. If you own a home you probably already spend more than you think on occasional maintenance and upgrades and replacing kitchens, bathrooms and appliances."
  >
    <div className="text-sm text-white space-y-7 mt-7">
      <div>
        <p>
          Which best describes your approach?
        </p>
      </div>
      <div>
        <b>None 0%</b>
        <p>I won&apos;t spend anything on maintenance. Over time the house will degrade.</p>
      </div>
      <div>
        <b>Low 1.5%</b>
        <p>I will do the minimum to keep the home habitable, only replacing appliances or fittings when they break. Over time things will begin look tatty but the house will remain habitable.</p>
      </div>
      <div>
        <b>Medium 2%</b>
        <p>I will do enough to keep things nice, replacing things when they&apos;re old, decorating occasionally and re-fitting bathrooms and kitchens every decade or so.</p>
      </div>
      <div>
        <b>High 2.5%</b>
        <p>I will keep things nice, and also improve the property at some point during my time there. For example, extending the house or doing an energy retrofit project.</p>
      </div>
      <div>
        <a href="#" className="text-white">Find out more about how we have modelled building depreciation</a>
      </div>
    </div>
  </Drawer >
)