import { Button } from '@/components/ui/button';
import { t } from '@/i18n';

export default function App() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 data-testid="home-title" className="text-3xl font-bold">
          {t('home.title')}
        </h1>
        <p data-testid="home-subtitle" className="text-muted-foreground">
          {t('home.subtitle')}
        </p>
      </header>
      <Button data-testid="home-start-button" size="lg">
        {t('home.startButton')}
      </Button>
    </main>
  );
}
