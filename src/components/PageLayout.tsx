import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const PageLayout = ({ children }: Props) => {
  return (
    <div className="page-layout">
      <div className="page-content">
        {children}
      </div>

    </div>
  );
};

export default PageLayout;