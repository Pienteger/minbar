import {
  AlertCircle,
  Apple,
  ArrowRight,
  Bell,
  Bookmark,
  Book,
  Briefcase,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  Edit,
  File,
  FileText,
  Flag,
  Github,
  GraduationCap,
  HelpCircle,
  Home,
  Image,
  Instagram,
  Laptop,
  Link,
  Loader2,
  type LightbulbIcon as LucideProps,
  LogOut,
  Lock,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  MessageSquare,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Search,
  Settings,
  Share,
  Smile,
  SunMedium,
  Trash,
  Twitter,
  User,
  UserMinus,
  UserPlus,
  Users,
  X,
  Copy,
  Heart,
  Send,
  Camera,
  Paperclip,
  Mic,
  Video,
  Phone,
  type LucideIcon,
  Bold,
  Italic,
  Underline,
  Heading,
  List,
  ListOrdered,
  DollarSign,
  Gift,
  Globe,
  Pin,
  PlayIcon as Pray,
  ShoppingCartIcon as Shopping,
  PenToolIcon as Tool,
  Clock,
  Star,
  ArrowUp,
  BookOpen,
  Repeat,
  EyeOff,
  Reply,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  reply: Reply,
  eyeOff: EyeOff,
  repeat: Repeat,
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertCircle,
  user: User,
  userPlus: UserPlus,
  userMinus: UserMinus,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  gitHub: Github,
  copy: Copy,
  twitter: Twitter,
  check: Check,
  google: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      ></path>
    </svg>
  ),
  mosque: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="mosque"
      role="img"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M224 130a21.84 21.84 0 0 0-10 2.41V128c0-40.71-29.31-60.22-52.87-75.9C146.57 42.41 134 34 134 24a6 6 0 0 0-12 0c0 10-12.57 18.41-27.13 28.1C71.31 67.78 42 87.29 42 128v4.41A22 22 0 0 0 10 152v56a6 6 0 0 0 6 6h64a6 6 0 0 0 6-6v-32a10 10 0 0 1 20 0v32a6 6 0 0 0 6 6h32a6 6 0 0 0 6-6v-32a10 10 0 0 1 20 0v32a6 6 0 0 0 6 6h64a6 6 0 0 0 6-6v-56a22 22 0 0 0-22-22M101.52 62.09c10.37-6.9 20.38-13.56 26.48-21.57c6.1 8 16.11 14.67 26.48 21.57C175.41 76 199 91.71 201.73 122H54.27C57 91.71 80.59 76 101.52 62.09M22 152a10 10 0 0 1 20 0v50H22Zm138 2a22 22 0 0 0-22 22v26h-20v-26a22 22 0 0 0-44 0v26H54v-68h148v68h-20v-26a22 22 0 0 0-22-22m74 48h-20v-50a10 10 0 0 1 20 0Z"
      />
    </svg>
  ),
  apple: Apple,
  file: File,
  fileText: FileText,
  image: Image,
  home: Home,
  bell: Bell,
  chat: MessageSquare,
  messageCircle: MessageCircle,
  users: Users,
  search: Search,
  heart: Heart,
  send: Send,
  camera: Camera,
  smile: Smile,
  paperclip: Paperclip,
  mic: Mic,
  video: Video,
  phone: Phone,
  logout: LogOut,
  lock: Lock,
  mail: Mail,
  map: Map,
  mapPin: MapPin,
  calendar: Calendar,
  bookmark: Bookmark,
  book: Book,
  edit: Edit,
  link: Link,
  share: Share,
  flag: Flag,
  briefcase: Briefcase,
  graduationCap: GraduationCap,
  instagram: Instagram,
  contact: Mail,
  // Text formatting icons
  bold: Bold,
  italic: Italic,
  underline: Underline,
  heading: Heading,
  list: List,
  listOrdered: ListOrdered,
  info: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
  play: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  ban: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  dollar: DollarSign,
  gift: Gift,
  globe: Globe,
  pin: Pin,
  pray: Pray,
  shopping: Shopping,
  tool: Tool,
  clock: Clock,
  star: Star,
  arrowUp: ArrowUp,
  bookOpen: BookOpen,
};
