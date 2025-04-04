import { ProConnectButton } from "../button/ProConnectButton";

export const Hero = ({
  logo,
  mainButton,
  banner,
  title,
  subtitle,
}: {
  logo: React.ReactNode;
  mainButton?: React.ReactNode;
  banner: string;
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="c__hero">
      <div className="c__hero__display">
        <div className="c__hero__display__captions">
          {logo}
          <h2>{title}</h2>
          <span>{subtitle}</span>
          {mainButton ? mainButton : <ProConnectButton />}
        </div>
        <img src={banner} alt="" />
      </div>
    </div>
  );
};

export const HomeGutter = ({ children }: { children: React.ReactNode }) => {
  return <div className="c__home-gutter">{children}</div>;
};
