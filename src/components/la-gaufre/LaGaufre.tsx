import { Gaufre } from "@gouvfr-lasuite/integration";
import "@gouvfr-lasuite/integration/dist/css/gaufre.css";

export const LaGaufre = ({ src }: {src?: string}) => {
  const source = !!src ? src : "https://integration.lasuite.numerique.gouv.fr/api/v1/gaufre.js"
  return (
    <>
      <script
        src={source}
        id="lasuite-gaufre-script"
        async
        defer
      ></script>
      <Gaufre variant="small" />
    </>
  );
};
