'use client'

import { useSettings } from '@/lib/settings-context'

export default function CookiePolicyPage() {
  const { settings, t } = useSettings()

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h1:mb-8 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-7 prose-p:mb-4 prose-ul:my-4 prose-li:my-2">
      <h1>{t('cookiePolicy')}</h1>
      
      <p className="lead text-lg text-muted-foreground font-medium">
        Last updated: January 01, 2026
      </p>

      <div className="space-y-8">
        <section>
          <p className="text-base leading-relaxed">
            This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of cookies We use, or the information We collect using Cookies and how that information is used.
          </p>
          <p className="text-base leading-relaxed">
            Cookies do not typically contain any information that personally identifies a user, but personal information that we store about You may be linked to the information stored in and obtained from Cookies. For further information on how We use, store and keep your personal data secure, see our Privacy Policy.
          </p>
          <p className="text-base leading-relaxed">
            We do not store sensitive personal information, such as mailing addresses, account passwords, etc. in the Cookies We use.
          </p>
        </section>

        <section>
          <h2>Interpretation and Definitions</h2>
          
          <h3>Interpretation</h3>
          <p>
            The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
          </p>

          <h3>Definitions</h3>
          <p>For the purposes of this Cookies Policy:</p>
          
          <dl className="space-y-4 mt-6">
            <div className="border-l-4 border-primary/30 pl-4">
              <dt className="font-semibold text-base mb-1">Company</dt>
              <dd className="text-muted-foreground">(referred to as either "the Company", "We", "Us" or "Our" in this Cookies Policy) refers to HesAppcım.</dd>
            </div>

            <div className="border-l-4 border-primary/30 pl-4">
              <dt className="font-semibold text-base mb-1">Cookies</dt>
              <dd className="text-muted-foreground">means small files that are placed on Your computer, mobile device or any other device by a website, containing details of your browsing history on that website among its many uses.</dd>
            </div>

            <div className="border-l-4 border-primary/30 pl-4">
              <dt className="font-semibold text-base mb-1">Website</dt>
              <dd className="text-muted-foreground">refers to HesAppcım, accessible from www.HesAppcım.com</dd>
            </div>

            <div className="border-l-4 border-primary/30 pl-4">
              <dt className="font-semibold text-base mb-1">You</dt>
              <dd className="text-muted-foreground">means the individual accessing or using the Website, or a company, or any legal entity on behalf of which such individual is accessing or using the Website, as applicable.</dd>
            </div>
          </dl>
        </section>

        <section>
          <h2>The use of the Cookies</h2>
          
          <h3>Type of Cookies We Use</h3>
          <p>
            Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close your web browser.
          </p>
          <p>
            We use both session and persistent Cookies for the purposes set out below:
          </p>

          <div className="space-y-6 mt-6">
            <div className="bg-card border rounded-lg p-5">
              <h4 className="text-lg font-semibold mb-3">Necessary / Essential Cookies</h4>
              <dl className="space-y-2">
                <div>
                  <dt className="font-medium text-sm text-muted-foreground">Type:</dt>
                  <dd className="ml-4">Session Cookies</dd>
                </div>
                <div>
                  <dt className="font-medium text-sm text-muted-foreground">Administered by:</dt>
                  <dd className="ml-4">Us</dd>
                </div>
                <div>
                  <dt className="font-medium text-sm text-muted-foreground">Purpose:</dt>
                  <dd className="ml-4">These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</dd>
                </div>
              </dl>
            </div>

            <div className="bg-card border rounded-lg p-5">
              <h4 className="text-lg font-semibold mb-3">Functionality Cookies</h4>
              <dl className="space-y-2">
                <div>
                  <dt className="font-medium text-sm text-muted-foreground">Type:</dt>
                  <dd className="ml-4">Persistent Cookies</dd>
                </div>
                <div>
                  <dt className="font-medium text-sm text-muted-foreground">Administered by:</dt>
                  <dd className="ml-4">Us</dd>
                </div>
                <div>
                  <dt className="font-medium text-sm text-muted-foreground">Purpose:</dt>
                  <dd className="ml-4">These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section>
          <h2>Your Choices Regarding Cookies</h2>
          <p>
            If You prefer to avoid the use of Cookies on the Website, first You must disable the use of Cookies in your browser and then delete the Cookies saved in your browser associated with this website. You may use this option for preventing the use of Cookies at any time.
          </p>
          <p>
            If You do not accept Our Cookies, You may experience some inconvenience in your use of the Website and some features may not function properly.
          </p>
          <p>
            If You'd like to delete Cookies or instruct your web browser to delete or refuse Cookies, please visit the help pages of your web browser.
          </p>

          <div className="bg-muted/50 rounded-lg p-5 mt-6">
            <h3 className="text-base font-semibold mb-3">Browser-Specific Instructions</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">•</span>
                <div>
                  <strong>Chrome:</strong>{' '}
                  <a href="https://support.google.com/accounts/answer/32050" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Google Support Page
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">•</span>
                <div>
                  <strong>Internet Explorer:</strong>{' '}
                  <a href="http://support.microsoft.com/kb/278835" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Microsoft Support Page
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">•</span>
                <div>
                  <strong>Firefox:</strong>{' '}
                  <a href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Mozilla Support Page
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">•</span>
                <div>
                  <strong>Safari:</strong>{' '}
                  <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Apple Support Page
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">•</span>
                <div>
                  <strong>Other browsers:</strong> Please visit your web browser's official web pages.
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2>More Information about Cookies</h2>
          <p>
            You can learn more about cookies here:{' '}
            <a href="https://www.termsfeed.com/blog/cookies/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              All About Cookies by TermsFeed
            </a>
          </p>
        </section>

        <section className="bg-primary/5 dark:bg-primary/10 p-6 rounded-lg border border-primary/20">
          <h2 className="mt-0">Contact Us</h2>
          <p className="mb-2">
            If you have any questions about this Cookies Policy, You can contact us:
          </p>
          <p className="mb-0">
            <strong>By email:</strong>{' '}
            <a href="mailto:support@hesappcim.app" className="text-primary hover:underline font-medium">
              support@hesappcim.app
            </a>
          </p>
        </section>

        <p className="text-sm text-muted-foreground text-center pt-8 border-t">
          Generated using TermsFeed Privacy Policy Generator
        </p>
      </div>
    </div>
  )
}
