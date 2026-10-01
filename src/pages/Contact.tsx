import { useState, type FormEvent } from 'react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { Copy, Mail } from '../components/Icons';
import { site } from '../data/site';
import { asset, pageHref } from '../lib/env';
import './Contact.css';

const SUBJECTS = ['General question', 'Game support', 'Bug report', 'Feedback & ideas', 'Press & business'];

const FAQ = [
  {
    q: 'Does the game need an internet connection?',
    a: 'No. The game works completely offline and doesn’t use the internet at all.',
  },
  {
    q: 'Are there ads or in-app purchases?',
    a: 'No. There are no ads and nothing to buy inside the game.',
  },
  {
    q: 'Do I have to unlock the other Santas or worlds?',
    a: 'No. All four Santas and all four worlds are available from the very start.',
  },
  {
    q: 'Can I change the controls?',
    a: 'Yes. In Settings you can choose Joystick, Swipe or Both, adjust the joystick sensitivity and move the joystick to wherever suits your thumb.',
  },
  {
    q: 'Where is my progress saved?',
    a: 'On your device only. Clearing the app’s data or uninstalling the game removes it.',
  },
];

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export default function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'opened'>('idle');
  const [copied, setCopied] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const subject = String(data.get('subject') ?? SUBJECTS[0]);
    const message = String(data.get('message') ?? '').trim();
    const device = String(data.get('device') ?? '').trim();

    const next: Errors = {};
    if (!name) next.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Please enter a valid email address so we can reply.';
    if (message.length < 10) next.message = 'Please write a little more (at least 10 characters).';
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    const body = [message, '', '—', `Name: ${name}`, `Reply to: ${email}`, ...(device ? [`Device / Android version: ${device}`] : [])].join(
      '\n',
    );
    const href = `mailto:${site.email}?subject=${encodeURIComponent(`[${site.name}] ${subject}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setStatus('opened');
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — the address is visible to copy by hand */
    }
  };

  const fieldProps = (id: keyof Errors) => ({
    id,
    name: id,
    'aria-invalid': errors[id] ? true : undefined,
    'aria-describedby': errors[id] ? `${id}-error` : undefined,
  });

  return (
    <Layout page="contact">
      <PageHero
        compact
        kicker="Contact us"
        title="Send a note to the workshop"
        lead="Found a bug, got stuck, or have an idea for the next world? We read every message."
        bg={asset('worlds/workshop-1672.webp')}
      />

      <section className="contact container-wide" aria-label="Contact options">
        <div className="contact__form-wrap clay-panel on-cream">
          <h2>Write to us</h2>
          <p className="contact__intro">
            Sending opens your email app with your message ready to go — nothing is stored on this website.
          </p>

          <form className="contact__form" noValidate onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input type="text" autoComplete="name" required {...fieldProps('name')} />
              {errors.name && (
                <p className="field__error" id="name-error">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="email">Your email</label>
              <input type="email" autoComplete="email" inputMode="email" required {...fieldProps('email')} />
              {errors.email && (
                <p className="field__error" id="email-error">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" defaultValue={SUBJECTS[0]}>
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="device">
                Device &amp; Android version <span className="field__opt">(optional, helps with bugs)</span>
              </label>
              <input id="device" name="device" type="text" placeholder="e.g. Pixel 7, Android 15" />
            </div>
            <div className="field field--full">
              <label htmlFor="message">Message</label>
              <textarea rows={6} required {...fieldProps('message')} />
              {errors.message && (
                <p className="field__error" id="message-error">
                  {errors.message}
                </p>
              )}
            </div>
            <div className="field--full contact__actions">
              <button type="submit" className="btn btn--red">
                <Mail /> Send message
              </button>
              <p className="contact__status" role="status">
                {status === 'opened' && 'Your email app should now be open with the message filled in. Just press send!'}
              </p>
            </div>
          </form>
        </div>

        <aside className="contact__side">
          <div className="info-card">
            <h2>Email</h2>
            <p>For support, feedback and anything else:</p>
            <div className="info-card__email">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <button type="button" className="icon-btn" onClick={copyEmail} aria-label="Copy email address">
                <Copy />
              </button>
            </div>
            <p className="info-card__copied" role="status">
              {copied ? 'Copied to clipboard' : ''}
            </p>
          </div>

          <div className="info-card">
            <h2>Developer</h2>
            <dl>
              <dt>Studio</dt>
              <dd>
                <span className="placeholder">{site.developer}</span>
              </dd>
              <dt>Location</dt>
              <dd>
                <span className="placeholder">{site.country}</span>
              </dd>
              <dt>Platform</dt>
              <dd>Android</dd>
            </dl>
          </div>

          <div className="info-card">
            <h2>Follow</h2>
            <ul className="info-card__socials">
              {site.socials.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <a href={s.href} rel="noopener" target="_blank">
                      {s.label}
                    </a>
                  ) : (
                    <>
                      {s.label} <span className="placeholder">[link]</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <img className="contact__gift" src={asset('objects/gift-green.webp')} alt="" width="256" height="256" loading="lazy" />
        </aside>
      </section>

      <section className="section faq" aria-labelledby="faq-title">
        <div className="container faq__inner">
          <p className="kicker reveal">Before you write</p>
          <h2 id="faq-title" className="reveal">
            Quick answers
          </h2>
          <div className="faq__list">
            {FAQ.map((f) => (
              <details key={f.q} className="faq__item reveal">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className="faq__more reveal">
            Curious about how your data is handled? Read our <a href={pageHref('privacy-policy/')}>Privacy Policy</a>.
          </p>
        </div>
      </section>
    </Layout>
  );
}
