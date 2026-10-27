import {
  ChevronsUpDownIcon,
  HomeIcon,
  InboxIcon,
  SettingsIcon,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Family } from './types.js';

const tags = Array.from({ length: 30 }, (_, i) => `v2.${30 - i}.0`);

export const navigation: Family = {
  id: 'navigation',
  title: 'Navigation et structure',
  demos: [
    {
      id: 'breadcrumb',
      title: 'Breadcrumb',
      render: () => (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Ateliers</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Céramique</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ),
    },
    {
      id: 'pagination',
      title: 'Pagination',
      render: () => (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ),
    },
    {
      id: 'tabs',
      title: 'Tabs',
      render: () => (
        <Tabs defaultValue="apercu" className="w-80">
          <TabsList>
            <TabsTrigger value="apercu">Aperçu</TabsTrigger>
            <TabsTrigger value="avis">Avis</TabsTrigger>
            <TabsTrigger value="infos">Infos</TabsTrigger>
          </TabsList>
          <TabsContent value="apercu" className="text-sm text-muted-foreground">
            Un atelier pour imaginer des services attentifs.
          </TabsContent>
          <TabsContent value="avis" className="text-sm text-muted-foreground">
            4,8 / 5 sur 120 avis.
          </TabsContent>
          <TabsContent value="infos" className="text-sm text-muted-foreground">
            45 minutes, gratuit.
          </TabsContent>
        </Tabs>
      ),
    },
    {
      id: 'navigation-menu',
      title: 'Navigation Menu',
      render: () => (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Découvrir</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-72 gap-1 p-1">
                  {['Ateliers', 'Conférences', 'Visites'].map((label) => (
                    <li key={label}>
                      <NavigationMenuLink href="#">{label}</NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#">Favoris</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      ),
    },
    {
      id: 'menubar',
      title: 'Menubar',
      render: () => (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Fichier</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Nouveau <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>Ouvrir…</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Exporter</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Édition</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Annuler <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>Rétablir</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      ),
    },
    {
      id: 'sidebar',
      title: 'Sidebar',
      render: () => (
        <SidebarProvider className="min-h-0 w-64 overflow-hidden rounded-xl border">
          <Sidebar collapsible="none" className="w-full">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Espace</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive>
                        <HomeIcon /> Accueil
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <InboxIcon /> Messages
                      </SidebarMenuButton>
                      <SidebarMenuBadge>3</SidebarMenuBadge>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <SettingsIcon /> Réglages
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      ),
    },
    {
      id: 'accordion',
      title: 'Accordion',
      render: () => (
        <Accordion className="w-80" defaultValue={['q1']}>
          <AccordionItem value="q1">
            <AccordionTrigger>Faut-il un compte ?</AccordionTrigger>
            <AccordionContent>
              Non, le mode manuel fonctionne sans compte.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>Où sont mes données ?</AccordionTrigger>
            <AccordionContent>
              Dans .ds-studio/, sur votre machine.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      id: 'collapsible',
      title: 'Collapsible',
      render: () => (
        <Collapsible className="w-72 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">3 révisions</span>
            <CollapsibleTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Afficher" />
              }
            >
              <ChevronsUpDownIcon />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2 grid gap-1 text-muted-foreground">
            <span>r3 · light.primary</span>
            <span>r2 · radius.base</span>
            <span>r1 · migration</span>
          </CollapsibleContent>
        </Collapsible>
      ),
    },
    {
      id: 'scroll-area',
      title: 'Scroll Area',
      render: () => (
        <ScrollArea className="h-48 w-48 rounded-lg border">
          <div className="p-3 text-sm">
            <p className="mb-2 font-medium">Versions</p>
            {tags.map((tag) => (
              <div key={tag}>
                {tag}
                <Separator className="my-1.5" />
              </div>
            ))}
          </div>
        </ScrollArea>
      ),
    },
    {
      id: 'resizable',
      title: 'Resizable',
      render: () => (
        // Le groupe impose height: 100 % en ligne : la hauteur vient du parent.
        <div className="h-40 max-w-md">
          <ResizablePanelGroup
            orientation="horizontal"
            className="rounded-lg border text-sm"
          >
            <ResizablePanel defaultSize="40%">
              <div className="flex h-full items-center justify-center">
                Liste
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="60%">
              <div className="flex h-full items-center justify-center">
                Détail
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ),
    },
    {
      id: 'carousel',
      title: 'Carousel',
      render: () => (
        <div className="px-12">
          <Carousel className="w-56">
            <CarouselContent>
              {[1, 2, 3, 4].map((n) => (
                <CarouselItem key={n}>
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center text-3xl font-semibold">
                      {n}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      ),
    },
  ],
};
