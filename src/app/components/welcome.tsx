import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Building2,
  Users,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Home,
  KeyRound,
  CreditCard,
  ListChecks,
  MessagesSquare,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ForceLightTheme, useTheme } from '../contexts/theme-context';

const features = [
  {
    icon: Building2,
    title: 'Panel Unificado',
    description:
      'Acceda a todas las funcionalidades desde una sola plataforma segura.',
  },
  {
    icon: Users,
    title: 'Múltiples Roles',
    description:
      'Funcionalidades personalizadas para administradores, propietarios e inquilinos.',
  },
  {
    icon: FileText,
    title: 'Gestión de Propiedades',
    description:
      'Administrar inventario, contratos y pagos de manera centralizada.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguro y Confiable',
    description:
      'Autenticación robusta y aislamiento de datos por rol y por propietario.',
  },
];

const steps = [
  {
    icon: Home,
    title: 'Registre su propiedad',
    description:
      'Cargue los datos básicos (dirección, tipo, renta esperada) y deje que el sistema la mantenga visible para los inquilinos correctos.',
  },
  {
    icon: KeyRound,
    title: 'Cree un contrato',
    description:
      'Configure fechas, renta mensual, depósito y día de pago. Las partes firman digitalmente y la propiedad pasa a "Ocupado".',
  },
  {
    icon: CreditCard,
    title: 'Cobre el alquiler',
    description:
      'Los pagos mensuales se generan automáticamente. Inquilinos reciben alertas y pueden registrar pagos con un solo clic.',
  },
];

const roleContent = {
  arrendador: {
    label: 'Arrendador',
    headline: 'Administre sus propiedades sin perder el control',
    bullets: [
      {
        icon: ListChecks,
        title: 'Enmiendas con acuerdo mutuo',
        body: 'Proponga cambios de renta, depósito o fecha de fin. La contraparte los aprueba o rechaza; el contrato se actualiza solo.',
      },
      {
        icon: CreditCard,
        title: 'Cobro sin seguimiento manual',
        body: 'Vea en un panel cuánto se cobró, cuánto está pendiente y qué pagos están próximos a vencer.',
      },
      {
        icon: MessagesSquare,
        title: 'Conversación con cada inquilino',
        body: 'Toda la comunicación queda registrada en el mismo lugar, sin necesidad de apps externas.',
      },
    ],
  },
  inquilino: {
    label: 'Inquilino',
    headline: 'Toda la información de su alquiler en un solo lugar',
    bullets: [
      {
        icon: FileText,
        title: 'Contrato siempre a la vista',
        body: 'Consulte fechas, monto mensual, día de pago y el historial completo de enmiendas aceptadas.',
      },
      {
        icon: CreditCard,
        title: 'Pagos en tres clics',
        body: 'Registre un pago desde el detalle del contrato. El sistema actualiza el saldo y notifica al arrendador.',
      },
      {
        icon: Sparkles,
        title: 'Propuestas transparentes',
        body: 'Reciba notificaciones cuando hay una propuesta de cambio o cierre pendiente de su decisión.',
      },
    ],
  },
  /*
  administrador: {
    label: 'Administrador',
    headline: 'Visión global y herramientas de control',
    bullets: [
      {
        icon: BarChart3,
        title: 'Reportes exportables',
        body: 'Genere reportes de propiedades, contratos, pagos e ingresos en Excel desde el panel.',
      },
      {
        icon: ShieldCheck,
        title: 'Aislamiento por rol',
        body: 'Cada arrendador solo ve sus propios datos; los inquilinos solo ven lo que les corresponde.',
      },
      {
        icon: Users,
        title: 'Gestión de usuarios',
        body: 'Cree cuentas, asigne roles, active o desactive accesos. Todo con un flujo de invitación por correo.',
      },
    ],
  },
  */
} as const;

type RoleKey = keyof typeof roleContent;

const faq = [
  {
    q: '¿Necesito descargar algo?',
    a: 'No. RentManager es una aplicación web: se accede desde cualquier navegador moderno, en escritorio o móvil.',
  },
  {
    q: '¿Qué pasa con los datos si dejo de usar la plataforma?',
    a: 'Sus datos permanecen en la base de datos y puede reactivarlos en cualquier momento. Al cerrar la cuenta se eliminan tras 30 días de gracia.',
  },
  {
    q: '¿Puedo cambiar el día de cobro cada mes?',
    a: 'Sí. El día de pago es uno de los campos enmendables y se ajusta con la aprobación de la otra parte.',
  },
  {
    q: '¿Cómo funciona el cierre de un contrato?',
    a: 'Cualquiera de las partes puede proponer el cierre. Si la otra parte lo aprueba, el contrato pasa a CANCELADO y los pagos pendientes se cancelan automáticamente.',
  },
  {
    q: '¿Cuántos roles existen?',
    a: 'Tres: Administrador (control total), Arrendador (gestiona sus propiedades) e Inquilino (consulta y paga).',
  },
  {
    q: '¿Puedo invitar a un inquilino por correo?',
    a: 'Sí. El sistema genera un enlace de invitación; el inquilino completa su registro y queda vinculado al contrato.',
  },
];

const navLinks = [
  { href: '#features', label: 'Funcionalidades' },
  { href: '#how', label: 'Cómo funciona' },
  { href: '#roles', label: 'Para tu rol' },
  { href: '#faq', label: 'Preguntas' },
];

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const Icon = resolvedTheme === 'dark' ? Sun : Moon;
  const label = resolvedTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function StickyNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={
        'sticky top-0 z-40 w-full border-b transition-all ' +
        (scrolled
          ? 'border-border-subtle bg-background/80 shadow-elev-xs backdrop-blur'
          : 'border-transparent bg-transparent')
      }
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-elev-sm">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-foreground">RentManager</span>
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Iniciar sesión
          </Button>
          <Button size="sm" onClick={() => navigate('/login')} className="gap-1">
            Empezar
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className="mx-auto mt-24 max-w-6xl scroll-mt-20 px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-elev-xs">
          Flujo simple
        </span>
        <h2 id="how-title" className="mt-3 text-h2 font-semibold tracking-tight text-foreground">
          Cómo funciona
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Tres pasos para empezar a gestionar sus alquileres. Sin instalaciones, sin capacitaciones largas.
        </p>
      </div>

      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative rounded-2xl border border-border-subtle bg-card p-6 shadow-elev-xs"
          >
            <span className="absolute -top-3 left-6 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-elev-sm">
              {index + 1}
            </span>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted text-primary ring-1 ring-inset ring-border-subtle">
              <step.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function RoleSection() {
  const [active, setActive] = useState<RoleKey>('arrendador');
  return (
    <section
      id="roles"
      aria-labelledby="roles-title"
      className="mx-auto mt-24 max-w-6xl scroll-mt-20 px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-elev-xs">
          Para tu rol
        </span>
        <h2 id="roles-title" className="mt-3 text-h2 font-semibold tracking-tight text-foreground">
          Adaptado a cómo trabajas
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Cambia de pestaña para ver qué hace RentManager por cada tipo de usuario.
        </p>
      </div>

      <Tabs
        value={active}
        onValueChange={(v) => setActive(v as RoleKey)}
        className="mt-8"
      >
        <TabsList className="mx-auto flex w-fit">
          {(Object.keys(roleContent) as RoleKey[]).map((key) => (
            <TabsTrigger key={key} value={key}>
              {roleContent[key].label}
            </TabsTrigger>
          ))}
        </TabsList>
        {(Object.keys(roleContent) as RoleKey[]).map((key) => (
          <TabsContent key={key} value={key} className="mt-8">
            <div className="rounded-2xl border border-border-subtle bg-card p-6 shadow-elev-xs sm:p-8">
              <h3 className="text-h3 font-semibold text-foreground">
                {roleContent[key].headline}
              </h3>
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {roleContent[key].bullets.map((b) => (
                  <li key={b.title} className="rounded-xl bg-background p-4 ring-1 ring-border-subtle">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-muted text-primary">
                      <b.icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{b.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="mx-auto mt-24 max-w-4xl scroll-mt-20 px-6"
    >
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-elev-xs">
          Preguntas frecuentes
        </span>
        <h2 id="faq-title" className="mt-3 text-h2 font-semibold tracking-tight text-foreground">
          Resolvemos tus dudas
        </h2>
      </div>
      <Accordion type="single" collapsible className="mt-8 rounded-2xl border border-border-subtle bg-card px-4 shadow-elev-xs">
        {faq.map((item, idx) => (
          <AccordionItem key={item.q} value={`faq-${idx}`}>
            <AccordionTrigger className="text-sm font-medium text-foreground">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function FinalCta() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto mt-24 max-w-6xl px-6">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-12 text-center shadow-elev-md sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.18)_0%,transparent_70%)]"
        />
        <h2 className="relative text-h2 font-semibold tracking-tight text-primary-foreground sm:text-[2rem]">
          Empieza a gestionar tus alquileres hoy
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
          Cree su cuenta gratis y configure su primera propiedad en menos de cinco minutos.
        </p>
        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/login')}
            className="gap-2"
          >
            Crear cuenta gratis
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => navigate('/login')}
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            Ya tengo cuenta
          </Button>
        </div>
      </div>
    </section>
  );
}

function Welcome() {
  const navigate = useNavigate();

  return (
    <ForceLightTheme>
      <div id="top" className="relative min-h-screen overflow-hidden bg-background">
        {/* Brand-tinted radial background using only design tokens. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,theme(colors.primary.muted.DEFAULT)_0%,theme(colors.background)_70%)]"
        />

        <StickyNav />

        <main className="mx-auto flex max-w-6xl flex-col px-6 pb-20">
          {/* Hero */}
          <section className="flex flex-col items-center justify-center pt-20 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-elev-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Plataforma integral para gestión de alquileres
            </span>
            <h1 className="text-display font-bold tracking-tight text-foreground sm:text-[2.75rem]">
              Sistema de Gestión de Arrendamientos
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Una plataforma integral para gestionar el ciclo completo de alquileres,
              desde la publicación de propiedades hasta el cobro mensual.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="gap-2"
              >
                Comenzar
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/login')}
              >
                Ya tengo cuenta
              </Button>
            </div>
          </section>

          {/* Features */}
          <section
            id="features"
            aria-labelledby="features-title"
            className="mt-16 scroll-mt-20"
          >
            <h2 id="features-title" className="sr-only">
              Funcionalidades
            </h2>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-border-subtle bg-card p-6 text-left shadow-elev-xs transition-all hover:-translate-y-0.5 hover:shadow-elev-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted text-primary ring-1 ring-inset ring-border-subtle">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <HowItWorks />
          <RoleSection />
          <FaqSection />
          <FinalCta />
        </main>

        <footer className="border-t border-border-subtle bg-card/40 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} RentManager. Todos los derechos reservados.
        </footer>
      </div>
    </ForceLightTheme>
  );
}

export default Welcome;

