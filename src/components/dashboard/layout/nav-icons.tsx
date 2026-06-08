import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { Book as BookIcon } from '@phosphor-icons/react/dist/ssr/Book';
import { Sword as SwordIcon } from '@phosphor-icons/react/dist/ssr/Sword';
import { MagicWand as MagicWandIcon } from "@phosphor-icons/react/dist/ssr/MagicWand";
import { Medal as MedalIcon } from '@phosphor-icons/react/dist/ssr/Medal';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { ChatCircleDots as ChatCircleDotsIcon } from '@phosphor-icons/react/dist/ssr/ChatCircleDots';
import { ChartBarHorizontal as ChartBarHorizontalIcon } from "@phosphor-icons/react/dist/ssr/ChartBarHorizontal";
import { Lightbulb as LightBulbIcon } from '@phosphor-icons/react/dist/ssr/Lightbulb';
import { Storefront as StorefrontIcon } from '@phosphor-icons/react/dist/ssr/Storefront';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'user': UserIcon,
  'users': UsersIcon,
  'book': BookIcon,
  'sword': SwordIcon,
  'badge': MedalIcon,
  'magic-wand': MagicWandIcon,
  'upload': UploadIcon,
  'chat-circle-dots': ChatCircleDotsIcon,
  'chart-bar-horizontal': ChartBarHorizontalIcon,
  'lightbulb': LightBulbIcon,
  'storefront': StorefrontIcon,
} as Record<string, Icon>;
