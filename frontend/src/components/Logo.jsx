import { Link } from "react-router-dom";

export const REAL_LOGO_URL =
  "https://customer-assets.emergentagent.com/job_ca65f773-3c93-4072-8d20-dcc5be5b8c4c/artifacts/eexgdp9b_WhatsApp%20Image%202026-05-01%20at%2011.24.50.jpeg";

export const Logo = ({ size = 36, withText = false, className = "" }) => {
  return (
    <Link to="/" data-testid="logo-home-link" className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={REAL_LOGO_URL}
        alt="ArtistKhojo"
        style={{ height: size, width: "auto" }}
        className="block object-contain select-none"
        draggable="false"
      />
      {withText && (
        <span className="sr-only">ArtistKhojo.in</span>
      )}
    </Link>
  );
};
