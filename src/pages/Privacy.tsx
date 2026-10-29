import { useEffect, useRef, type ReactNode } from 'react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { site } from '../data/site';
import { asset, pageHref } from '../lib/env';
import './Legal.css';

const Mail = () => <a href={`mailto:${site.email}`}>{site.email}</a>;

interface Section {
  id: string;
  title: string;
  body: ReactNode;
}

// Every statement below reflects the game as built: Firebase Analytics,
// Crashlytics (with NDK) and Cloud Messaging; the VIBRATE, POST_NOTIFICATIONS
// and INTERNET permissions; no ads or billing; progress kept in a local save file.
const sections: Section[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    body: (
      <>
        <p>
          {site.name} (shown on Android as “{site.storeLabel}”) is a mobile game developed and published by{' '}
          {site.developer}, based in {site.country} (“we”, “us”, “our”).
        </p>
        <p>
          This Privacy Policy explains what information the game and this website handle, and the choices you have. If
          you have any questions, contact us at <Mail />.
        </p>
      </>
    ),
  },
  {
    id: 'collect',
    title: 'Information we collect',
    body: (
      <>
        <p>
          <strong>We do not ask for personal information.</strong> The game does not ask for your name, email address,
          phone number, location, contacts or photos, and it does not create an account.
        </p>
        <p>
          To fix crashes, understand how the game is played and send occasional notifications, the game uses services
          from Google’s Firebase platform (see <a href="#third-parties">Firebase services</a> below). When your device
          is online, these services automatically collect:
        </p>
        <ul>
          <li>
            <strong>Device and app information</strong> — device model, Android version, language, app version, and an
            approximate location (country or region) derived from your IP address;
          </li>
          <li>
            <strong>Identifiers</strong> — a random app instance ID created by Firebase, a push-notification token and,
            where your device settings allow it, the Android advertising ID;
          </li>
          <li>
            <strong>Usage information</strong> — for example when the game is opened, how long it is played and which
            screens are visited;
          </li>
          <li>
            <strong>Crash information</strong> — if the game crashes, a report with the error details and the state of
            the app and device at the time.
          </li>
        </ul>
        <p>
          We use this information only to keep the game working well and to improve it. We do not sell it, and we do
          not use it to show ads.
        </p>
      </>
    ),
  },
  {
    id: 'on-device',
    title: 'Information stored on your device',
    body: (
      <>
        <p>
          To remember your progress between sessions, the game keeps a small save file in its private storage on your
          device. It contains only game data:
        </p>
        <ul>
          <li>your selected world, level and Santa;</li>
          <li>your gift total and your progress and stars in each world;</li>
          <li>your settings (music, volume, sounds, haptics and control options);</li>
          <li>the state of a level you leave part-way through, so you can resume it;</li>
          <li>whether you have already seen the movement tutorial.</li>
        </ul>
        <p>This save file is not sent to us or to Firebase, and we cannot see it.</p>
      </>
    ),
  },
  {
    id: 'permissions',
    title: 'Device permissions',
    body: (
      <>
        <p>The game requests these permissions:</p>
        <ul>
          <li>
            <strong>Vibrate</strong> — for haptic feedback (for example when Santa bumps into a wall). You can turn
            haptic feedback off at any time in the game’s Settings.
          </li>
          <li>
            <strong>Notifications</strong> — to send occasional game news. On Android 13 and later you are asked
            first, and you can turn notifications off at any time in your device’s Settings.
          </li>
          <li>
            <strong>Internet and network state</strong> — used by the Firebase services to send usage and crash data
            and to receive notifications. The game itself is fully playable offline.
          </li>
        </ul>
        <p>The game does not request access to your location, camera, microphone, contacts, photos or files.</p>
      </>
    ),
  },
  {
    id: 'third-parties',
    title: 'Firebase services',
    body: (
      <>
        <p>
          The game uses the following services from Google LLC, which processes the data on our behalf under the{' '}
          <a href="https://policies.google.com/privacy" rel="noopener" target="_blank">
            Google Privacy Policy
          </a>{' '}
          and the{' '}
          <a href="https://firebase.google.com/support/privacy" rel="noopener" target="_blank">
            Firebase privacy and security terms
          </a>
          :
        </p>
        <ul>
          <li>
            <strong>Firebase Analytics</strong> — measures how the game is used (sessions, screens, app version, device
            type and approximate country), so we can see what works and what to improve.
          </li>
          <li>
            <strong>Firebase Crashlytics</strong> — sends a crash report when the game crashes, so we can find and fix
            the problem.
          </li>
          <li>
            <strong>Firebase Cloud Messaging</strong> — delivers push notifications to your device using a
            notification token.
          </li>
        </ul>
        <p>
          The game contains <strong>no advertising</strong> and <strong>no in-app purchases</strong>. Data may be
          processed on Google servers outside your country, and analytics and crash data are deleted automatically
          after the retention period described in Google’s documentation.
        </p>
        <p>
          You can limit this collection by resetting or deleting your advertising ID in your device’s Google settings,
          turning off notifications for the game, or playing with your device offline.
        </p>
      </>
    ),
  },
  {
    id: 'backup',
    title: 'Android device backup',
    body: (
      <p>
        If you have turned on backup in your Android settings, Android may include the game’s save file in your device
        backup so your progress can be restored on a new device. This backup is handled by Google under your Google
        account settings and Google’s Privacy Policy; we do not have access to it. You can manage backups in your
        device’s settings.
      </p>
    ),
  },
  {
    id: 'links',
    title: 'Sharing and links to other services',
    body: (
      <>
        <p>The game’s Settings screen includes a few shortcuts that hand you over to other apps:</p>
        <ul>
          <li>
            <strong>Share</strong> opens Android’s share sheet with a short invitation message. You choose which app,
            if any, to share with; the game does not see what you choose.
          </li>
          <li>
            <strong>Rate</strong> opens the game’s page in the Google Play Store.
          </li>
          <li>
            <strong>Privacy</strong> and <strong>More Games</strong> open web pages in your browser.
          </li>
        </ul>
        <p>Once you leave the game, the privacy policy of the app or website you are using applies.</p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children’s privacy',
    body: (
      <p>
        The game is designed to be enjoyed by players of all ages. It does not ask anyone, including children, for
        personal details such as a name, email address or photo, and it shows no ads. The usage and crash data
        described above is used only to run and improve the game. If you believe a child has sent us personal
        information, contact us at <Mail /> and we will delete it.
      </p>
    ),
  },
  {
    id: 'retention',
    title: 'Keeping and deleting your data',
    body: (
      <p>
        Your save file stays on your device until you remove it. You can delete all game data on your device at any
        time by clearing the app’s storage in Android Settings or by uninstalling the game. Analytics and crash data
        are deleted automatically after Google’s retention period, and you can ask us to delete data linked to your
        device by writing to <Mail />. If you email us, we keep your message only as long as needed to answer it.
      </p>
    ),
  },
  {
    id: 'website',
    title: 'This website',
    body: (
      <>
        <p>
          This website does not use cookies, advertising or analytics, and it has no user accounts. Its fonts are loaded
          from <strong>Google Fonts</strong>, which receives your IP address when your browser requests them, under
          Google’s Privacy Policy.
        </p>
        <p>
          The <a href={pageHref('contact/')}>contact form</a> does not send anything on its own — it opens your email app
          with your message filled in. We receive only what you choose to send, and we use it only to reply to you.
        </p>
      </>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights',
    body: (
      <p>
        Depending on where you live (for example under the GDPR in the EU/UK or the CCPA in California), you may have
        rights to access, correct or delete personal information about you, or to object to its processing. To make a
        request — about analytics or crash data from your device, or emails you have sent us — write to <Mail />.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        If a future version of the game handles data differently — for example by adding new services — we will update
        this policy before that version is released and change the “Last updated” date at the top of this
        page. We encourage you to check this page from time to time.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <>
        <p>Questions or requests about this Privacy Policy can be sent to:</p>
        <address>
          {site.developer}, {site.country}
          <br />
          Email: <Mail />
        </address>
      </>
    ),
  },
];

export default function Privacy() {
  // Prerendered open (readable without JS); folded away on small screens.
  const toc = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (toc.current && window.matchMedia('(max-width: 1000px)').matches) toc.current.open = false;
  }, []);

  return (
    <Layout page="privacy">
      <PageHero
        compact
        kicker="Legal"
        title="Privacy Policy"
        lead={
          <>
            Short version: no ads, no account, and your progress stays on your device. We use Firebase to fix crashes
            and improve the game. <br />
            <span className="legal-updated">Last updated: {site.privacyLastUpdated}</span>
          </>
        }
        bg={asset('scenes/night-village-1280.webp')}
      />

      <div className="legal container-wide">
        <aside className="legal__toc">
          <details open ref={toc}>
            <summary>On this page</summary>
            <nav aria-label="Privacy Policy sections">
              <ol>
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </details>
        </aside>

        <article className="legal__body">
          <section className="legal__glance" aria-labelledby="glance-title">
            <h2 id="glance-title">At a glance</h2>
            <ul>
              <li>No account and no personal details asked for</li>
              <li>No ads and no in-app purchases</li>
              <li>Firebase Analytics and Crashlytics to improve the game</li>
              <li>Optional push notifications</li>
              <li>Progress saved only on your device</li>
            </ul>
          </section>

          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="legal__section" aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`}>
                <span className="legal__num">{String(i + 1).padStart(2, '0')}</span>
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </article>
      </div>
    </Layout>
  );
}
