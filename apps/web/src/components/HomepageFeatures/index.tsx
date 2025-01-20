import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    Svg: require("@site/static/img/happy.svg").default,
    description: (
      <>
        Next Mods was designed to let you add major functionality to your{" "}
        <a href="https://nextjs.org" target="_blank">
          Next.JS
        </a>{" "}
        effortlessly and rapidly.
      </>
    ),
  },
  {
    title: "Open Sourced",
    Svg: require("@site/static/img/opensource.svg").default,
    description: (
      <>
        Our{" "}
        <a
          href="https://github.com/cheekEprogrammer/next-mods-turborepo"
          target="_blank"
        >
          codebase
        </a>{" "}
        is fully open sourced. Help us develop Next Mods and shape its future.
      </>
    ),
  },
  {
    title: "Save Time",
    Svg: require("@site/static/img/time.svg").default,
    description: (
      <>Focus on what you do best, and let Next Mods handle the rest.</>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
