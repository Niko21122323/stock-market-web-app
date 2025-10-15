import Link from "next/link";

const FooterLink = ({ text, linkText, href }: FooterLinkProps) => {
  return (
    <div className="text-center pt-4">
      <p className="text-sm text-muted-foreground">
        {text}
        {``}
        <Link
          href={href}
          className="text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out pl-1"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default FooterLink;
