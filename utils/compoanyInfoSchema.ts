export interface CompoanyInfoSchema {
  name: string;
  url: string;
  logo: string;
  email: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    telephone: string;
    contactType: string;
    availableLanguage: string[];
  };
}

export function createCompanyInfoSchema(info: CompoanyInfoSchema): string {
  return `
    <script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: info.name,
  url: info.url,
  logo: info.logo,
  email: info.email,
  telephone: info.telephone,
  address: {
    "@type": "PostalAddress",
    ...info.address
  },
  contactPoint: {
    "@type": "ContactPoint",
    ...info.contactPoint
  }
}, null, 2)}
</script>
  `;
}