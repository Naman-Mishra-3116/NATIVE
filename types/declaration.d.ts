declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.svg" {
  import * as React from "react";
  const content: React.FC<SvgProps>;
  export default content;
}
