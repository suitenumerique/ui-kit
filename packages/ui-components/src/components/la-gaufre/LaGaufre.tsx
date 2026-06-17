import { Gaufre } from "@gouvfr-lasuite/integration";
// Gaufre's styles are pulled into the kit's single stylesheet from
// library.scss (alongside the other external-dependency CSS), so this
// component does not import them itself.

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
