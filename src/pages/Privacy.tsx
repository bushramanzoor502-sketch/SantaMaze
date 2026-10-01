import { useEffect, useRef, type ReactNode } from 'react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { site } from '../data/site';
import { asset, pageHref } from '../lib/env';
import './Legal.css';

const P = ({ children }: { children: ReactNode }) => <span className="placeholder">{children}</span>;
const Mail = () => <a href={`mailto:${site.email}`}>{site.email}</a>;

interface Section {
  id: string;
  title: string;
  body: ReactNode;
}

// Every statement below reflects the game as built: only the VIBRATE
// permission, no INTERNET permission, no ads/analytics/billing SDKs, and
// progress kept in a local save file.
const sections: Section[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    body: (
      <>
        <p>
          {site.name} (shown on Android as “{site.storeLabel}”) is a mobile game developed and published by{' '}
          <P>{site.developer}</P>, based in <P>{site.country}</P> (“we”, “us”, “our”).
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
          <strong>We do not collect personal information through the game.</strong> The game does not ask for your
          name, email address, location, contacts or any other personal details, and it does not create an account.
        </p>
        <p>
          The game does not request Android’s internet permission, so it has no way of sending information from your
          device to us or to anyone else.
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
        <p>This file never leaves your device through the game, and we cannot see it.</p>
      </>
    ),
  },
  {
    id: 'permissions',
    title: 'Device permissions',
    body: (
      <>
        <p>
          The game requests one permission: <strong>Vibrate</strong>, used for haptic feedback (for example when
          Santa bumps into a wall). You can turn haptic feedback off at any time in the game’s Settings.
        </p>
        <p>The game does not request access to your location, camera, microphone, contacts, photos or files.</p>
      </>
    ),
  },
  {
    id: 'third-parties',
    title: 'Advertising, analytics and third-party services',
    body: (
      <>
        <p>
          The current version of the game contains <strong>no advertising</strong>, <strong>no analytics</strong>,{' '}
          <strong>no crash-reporting services</strong> and <strong>no in-app purchases</strong>. No third-party
          software development kits that collect data are included.
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
        The game is designed to be enjoyed by players of all ages. Because it does not collect personal information
        from anyone, it does not knowingly collect personal information from children. If you believe a child has sent
        us personal information by email, contact us at <Mail /> and we will delete it.
      </p>
    ),
  },
  {
    id: 'retention',
    title: 'Keeping and deleting your data',
    body: (
      <p>
        Your save file stays on your device until you remove it. You can delete all game data at any time by clearing
        the app’s storage in Android Settings or by uninstalling the game. If you email us, we keep your message only
        as long as needed to answer it, and you can ask us to delete it.
      </p>
    ),
  },
  {
    id: 'website',
    title: 'This website',
    body: (
      <>
        <p>
          This website does not use cookies, advertising or analytics, and it has no user accounts. To display the
          site:
        </p>
        <ul>
          <li>
            it is hosted on <strong>GitHub Pages</strong>, which may record technical information such as your IP
            address in server logs for security purposes, under GitHub’s Privacy Statement;
          </li>
          <li>
            its fonts are loaded from <strong>Google Fonts</strong>, which receives your IP address when your browser
            requests them, under Google’s Privacy Policy.
          </li>
        </ul>
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
        rights to access, correct or delete personal information about you. As the game does not collect personal
        information, there is usually nothing for us to provide — but if you have contacted us by email, you can ask us
        to access or delete that correspondence by writing to <Mail />.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        If a future version of the game adds features that handle data differently — for example online services — we
        will update this policy before that version is released and change the “Last updated” date at the top of this
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
          <P>{site.developer}</P>
          <br />
          <P>[Postal address, if required]</P>
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
            Short version: the game works offline, shows no ads and keeps your progress on your device. <br />
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
              <li>No personal information collected</li>
              <li>No internet connection used by the game</li>
              <li>No ads, analytics or in-app purchases</li>
              <li>Progress saved only on your device</li>
              <li>One permission: vibration, for haptics</li>
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

          <p className="legal__note">
            Highlighted items in <span className="placeholder">[brackets]</span> are placeholders that will be replaced
            with the developer’s details.
          </p>
        </article>
      </div>
    </Layout>
  );
}
