export interface ServiceProvider {
  id: string;
  name: string;
  loginUrl: string;
  logo?: string;
}

export const DOMAIN_REGISTRARS: ServiceProvider[] = [
  {
    id: "godaddy",
    name: "GoDaddy",
    loginUrl: "https://sso.godaddy.com/",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    loginUrl: "https://dash.cloudflare.com/login",
    logo: "/logos/cloudflare.webp",
  },
  {
    id: "squarespace",
    name: "Squarespace",
    loginUrl: "https://account.squarespace.com/project-picker",
    logo: "/logos/squarespace.webp",
  },
  {
    id: "domaincom",
    name: "Domain.com",
    loginUrl: "https://www.domain.com/my-account/login",
  },
  {
    id: "namecheap",
    name: "Namecheap",
    loginUrl: "https://www.namecheap.com/myaccount/login/",
  },
];

/** Login URLs for preset platforms (not domain registrars) */
export const PLATFORM_LOGIN_URLS: Record<string, string> = {
  Pipedrive: "https://app.pipedrive.com/auth/login",
  "cal.com": "https://app.cal.com/auth/login",
  Resend: "https://resend.com/login",
};

/** Maps platform names to logo image paths in /public/logos/ */
export const PLATFORM_LOGOS: Record<string, string> = {
  "cal.com": "/logos/calcom.webp",
  Pipedrive: "/logos/pipedrive.webp",
  Cloudflare: "/logos/cloudflare.webp",
  Squarespace: "/logos/squarespace.webp",
  Resend: "/logos/resend.webp",
};

export function getRegistrarById(id: string): ServiceProvider | undefined {
  return DOMAIN_REGISTRARS.find((r) => r.id === id);
}
