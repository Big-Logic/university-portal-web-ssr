// Everything that names the product, in one place, so an institution
// running its own copy re-brands the whole app by editing this file
// rather than hunting the name through markup and metadata. Nothing
// here is a secret and all of it renders in the browser, so it's plain
// module state rather than env config -- if a single deployment ever
// needs to serve two brands, this is the file to back with an env var
// (a NEXT_PUBLIC_ one, unlike API_URL, since it has to reach the
// client bundle).
//
// Copy that merely mentions the product without naming it stays where
// it's rendered. This is the name, not the marketing.

export const APP_NAME = "Basecourse";

// The one-liner under the name on the signed-out screens, and the
// opening of the app's own meta description.
export const APP_TAGLINE = "Student record system";
