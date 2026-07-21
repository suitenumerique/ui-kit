import { Gaufre } from "@gouvfr-lasuite/integration";
import "@gouvfr-lasuite/integration/dist/css/gaufre.css";

export const LaGaufre = () => {
  return (
    <>
      <script
        src="https://integration.lasuite.numerique.gouv.fr/api/v1/gaufre.js"
        id="lasuite-gaufre-script"
        async
        defer
      ></script>
      <Gaufre variant="small" />
    </>
  );
};
