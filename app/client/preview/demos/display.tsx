import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { toast } from 'sonner';
import {
  BellIcon,
  CalendarIcon,
  CircleAlertIcon,
  InfoIcon,
  InboxIcon,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';
import { Marker, MarkerContent, MarkerIcon } from '@/components/ui/marker';
import {
  Progress,
  ProgressCircle,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  UsageBar,
  UsageBarHeader,
  UsageBarLegend,
  UsageBarLegendItem,
  UsageBarSegment,
  UsageBarTrack,
} from '@/components/ui/usage-bar';
import type { Family } from './types.js';

const chartData = [
  { mois: 'Jan', ateliers: 12, visites: 8 },
  { mois: 'Fév', ateliers: 18, visites: 11 },
  { mois: 'Mar', ateliers: 15, visites: 14 },
  { mois: 'Avr', ateliers: 22, visites: 9 },
  { mois: 'Mai', ateliers: 27, visites: 16 },
];
const chartConfig = {
  ateliers: { label: 'Ateliers', color: 'var(--chart-2)' },
  visites: { label: 'Visites', color: 'var(--chart-4)' },
} satisfies ChartConfig;

function ProgressDemo() {
  const [value, setValue] = useState(20);
  useEffect(() => {
    const timer = setInterval(
      () => setValue((v) => (v >= 100 ? 10 : v + 15)),
      1200,
    );
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex w-80 items-center gap-6">
      <Progress value={value} className="flex-1">
        <ProgressLabel>Import</ProgressLabel>
        <ProgressValue />
      </Progress>
      <ProgressCircle
        value={value}
        className="size-10"
        aria-label="Progression"
      />
    </div>
  );
}

export const display: Family = {
  id: 'display',
  title: 'Affichage de données',
  demos: [
    {
      id: 'card',
      title: 'Card',
      render: () => (
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Faire moins, mais mieux.</CardTitle>
            <CardDescription>Atelier · 45 min · Bordeaux</CardDescription>
            <CardAction>
              <Badge variant="secondary">6 places</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Un atelier pour imaginer des services plus attentifs au quotidien.
          </CardContent>
          <CardFooter className="gap-2">
            <Button>Réserver</Button>
            <Button variant="ghost">Plus tard</Button>
          </CardFooter>
        </Card>
      ),
    },
    {
      id: 'item',
      title: 'Item',
      render: () => (
        <ItemGroup className="w-96">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <CalendarIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Céramique douce</ItemTitle>
              <ItemDescription>Samedi 14 h · 6 places</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Voir
              </Button>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <BellIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Rappel activé</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      ),
    },
    {
      id: 'table',
      title: 'Table',
      render: () => (
        <Table className="max-w-md">
          <TableCaption>Révisions récentes</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Révision</TableHead>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ['r3', 'light.primary', 'manuel'],
              ['r2', 'radius.base', 'import'],
              ['r1', 'dark.ring', 'codex'],
            ].map(([r, key, source]) => (
              <TableRow key={r}>
                <TableCell className="font-medium">{r}</TableCell>
                <TableCell className="font-mono text-xs">{key}</TableCell>
                <TableCell className="text-right">{source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ),
    },
    {
      id: 'empty',
      title: 'Empty',
      render: () => (
        <Empty className="w-96 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>Aucun favori</EmptyTitle>
            <EmptyDescription>
              Ajoutez un atelier pour le retrouver ici.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline">Explorer</Button>
          </EmptyContent>
        </Empty>
      ),
    },
    {
      id: 'alert',
      title: 'Alert',
      render: () => (
        <div className="grid w-96 gap-3">
          <Alert>
            <InfoIcon />
            <AlertTitle>Révision enregistrée</AlertTitle>
            <AlertDescription>
              Les deux aperçus utilisent la nouvelle valeur.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>Proposition périmée</AlertTitle>
            <AlertDescription>
              Rechargez puis refaites le diff.
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      id: 'progress',
      title: 'Progress',
      render: () => <ProgressDemo />,
    },
    {
      id: 'usage-bar',
      title: 'Usage Bar',
      render: () => (
        <UsageBar max={100} className="w-96 gap-3 text-sm">
          <UsageBarHeader>
            <span className="font-medium">Stockage</span>
            <span className="text-muted-foreground">68 / 100 Mo</span>
          </UsageBarHeader>
          <UsageBarTrack>
            <UsageBarSegment value={38} name="Tokens" variant="primary" />
            <UsageBarSegment value={20} name="Historique" />
            <UsageBarSegment value={10} name="Brief" variant="striped" />
          </UsageBarTrack>
          <UsageBarLegend>
            <UsageBarLegendItem variant="primary">Tokens</UsageBarLegendItem>
            <UsageBarLegendItem>Historique</UsageBarLegendItem>
            <UsageBarLegendItem variant="striped">Brief</UsageBarLegendItem>
          </UsageBarLegend>
        </UsageBar>
      ),
    },
    {
      id: 'chart',
      title: 'Chart',
      render: () => (
        <ChartContainer config={chartConfig} className="h-56 w-full max-w-md">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mois"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="ateliers" fill="var(--color-ateliers)" radius={4} />
            <Bar dataKey="visites" fill="var(--color-visites)" radius={4} />
          </BarChart>
        </ChartContainer>
      ),
    },
    {
      id: 'marker',
      title: 'Marker',
      render: () => (
        <div className="grid w-80 gap-3 text-sm">
          <Marker>
            <MarkerIcon>
              <InfoIcon />
            </MarkerIcon>
            <MarkerContent>Conversation archivée</MarkerContent>
          </Marker>
          <Marker variant="separator">
            <MarkerContent>Aujourd’hui</MarkerContent>
          </Marker>
          <Marker variant="border">
            <MarkerContent>Section suivante</MarkerContent>
          </Marker>
        </div>
      ),
    },
    {
      id: 'sonner',
      title: 'Sonner (toast)',
      render: () => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast('Révision enregistrée', {
                description: 'Démonstration locale, rien n’est écrit.',
              })
            }
          >
            Afficher un toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error('Échec de démonstration')}
          >
            Toast d’erreur
          </Button>
        </div>
      ),
    },
  ],
};
