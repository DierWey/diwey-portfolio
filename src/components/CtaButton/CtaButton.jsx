import { Link } from "react-router-dom";

export default function CtaButton({
  to = null,          // route interne → <Link>
  href = null,        // externe ou fichier → <a>
  target = null,
  type = "button",     // submit / reset si <button>
  variant = "primary",
  size = "lg",
  children,
  className = "",
}) {
  const classes = ["cta", `cta--${variant}`, `cta--${size}`, className]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return <Link to={to} className={classes}>{children}</Link>;
  }

  if (href) {
    const rel = target === "_blank" ? "noreferrer noopener" : undefined;
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
      </a>
    );
  }

  return <button type={type} className={classes}>{children}</button>;
}