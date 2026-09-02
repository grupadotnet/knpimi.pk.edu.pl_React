import LogoBotland from '/logo_botland_kn.png';
import LogoBotlandW from '/white-logo-botland.png';
import LogoPK from '/svg/PK_POZIOM_CMYK.svg';
// import LogoPK_eng from '/svg/PK_POZIOM_CMYK_w.svg';
import LogoPK_w from '/svg/PK_POZIOM_CMYK_w.svg';
// import LogoPK_eng_w from '/PK_POZIOM_INVERT.png';
import LogoWM from '/svg/PK_WM_CMYK.svg';
import LogoWM_w from '/svg/PK_WM_CMYK_w.svg';
// import LogoWM_eng from '/PK_WM.png';
// import LogoWM_eng_w from '/PK_WM.png';

import {
  RiFacebookCircleLine,
  RiInstagramLine,
  RiTwitterXLine,
  RiYoutubeLine,
} from '@remixicon/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';
import { useScrollAndWidth } from '@/lib/useScrollAndWidth.tsx';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme-provider.tsx';
import { Map, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

setWorkerUrl(workerUrl);

interface Social {
  href: string;
  icon: React.ElementType;
  name: string;
}

const socials: Social[] = [
  {
    href: 'https://facebook.com',
    icon: RiFacebookCircleLine,
    name: 'Facebook',
  },
  {
    href: 'https://instagram.com',
    icon: RiInstagramLine,
    name: 'Instagram',
  },
  {
    href: 'https://twitter.com',
    icon: RiTwitterXLine,
    name: 'Twitter',
  },
  {
    href: 'https://youtube.com',
    icon: RiYoutubeLine,
    name: 'YouTube',
  },
];

const lightStyle =
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const darkStyle =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const coords = [50.076039972227136, 19.99445118155016].toReversed() as [
  number,
  number,
];

// Moved to module scope so it's created once and reused across renders
const footerLogos: Record<string, string[]> = {
  light: [LogoPK, LogoWM, LogoBotland],
  dark: [LogoPK_w, LogoWM_w, LogoBotlandW],
};

export default function Footer() {
  const { actualTheme } = useTheme();

  const { t } = useTranslation();
  const { isMobile } = useScrollAndWidth(useRef(null), '', 1024);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if container has valid size (width > 0 && height > 0)
    const rect = mapContainerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.warn(
        'Map container has no dimensions. WebGL context might be lost.'
      );
      return;
    }

    const map = new Map({
      container: mapContainerRef.current,
      style: actualTheme === 'dark' ? darkStyle : lightStyle,
      center: coords,
      zoom: 12,
    });
    mapInstanceRef.current = map;

    map.addControl(new NavigationControl(), 'top-right');
    new Marker()
      .setLngLat(coords) // Match your center coordinates
      .addTo(map);

    return () => {};
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const newStyle = actualTheme === 'dark' ? darkStyle : lightStyle;
    const updateStyle = () => {
      map.setStyle(newStyle);
    };

    if (map.isStyleLoaded()) {
      updateStyle();
    } else {
      map.once('load', updateStyle);
    }
  }, [actualTheme]);

  const footerURLs: string[] = [
    'https://www.pk.edu.pl',
    'https://mech.pk.edu.pl/',
    'https://botland.com.pl/',
  ];

  return (
    <footer className={' w-11/12 m-auto text-center *:my-20 text-white'}>
      <section
        className={
          'grid md:grid-cols-3 md:grid-rows-2 grid-cols-1 grid-rows-4  justify-items-center content-center'
        }
      >
        <div className="md:col-span-3 relative h-full md:w-1/2 w-full">
          <div
            ref={mapContainerRef}
            className="absolute size-full rounded-xl"
          />
        </div>
        <Card
          className={`flex flex-col items-center gap-8 py-8 sm:items-start bg-background ${!isMobile ? 'col-span-2' : ''}`}
        >
          <CardHeader>
            <CardTitle className={'justify-items-start'}>
              <span className="text-foreground">
                {t('Footer.social.title', 'Znajdziesz nas też na')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-10 sm:justify-start sm:gap-14">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 text-foreground transition-colors duration-500"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 stroke-[1.5] " />

                  <span className="hidden text-[11px] font-light uppercase tracking-[0.2em] transition-transform duration-500 group-hover:translate-x-1 sm:block after:content-[''] relative after:absolute after:border-b-2 after:inset-0 after:scale-x-[0.01] after:opacity-0 group-hover:after:scale-x-100 group-hover:after:opacity-100 after:transition-all after:duration-300 after:ease-in-out after-gradient-border">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className={'bg-background  '}>
          <CardContent>
            {footerLogos[actualTheme].map((logo, i) => (
              <a
                href={footerURLs[i]}
                target="_blank"
                key={footerURLs[i]}
                rel="noreferrer"
              >
                <img
                  srcSet={logo}
                  src={logo}
                  alt=""
                  key={logo}
                  className={'h-15 my-1.5'}
                />
              </a>
            ))}
          </CardContent>
        </Card>
      </section>
      <span>
        {t(
          'Footer.copyright',
          '© 2025-2026 Koło Naukowe Programistów i Miłośników Informatyki na Politechnice Krakowskiej'
        )}
      </span>
    </footer>
  );
}
