import { IconType } from "../components/Icon";

interface socialMedia {
  isAvailable: boolean;
  isFollowable: boolean;
  icon: IconType;
  title: string;
  message: string;
  link: string;
  linkText: string;
}

export const socialMediaData: socialMedia[] = [
  {
    isAvailable: true,
    isFollowable: false,
    icon: "whatsapp",
    title: "Whatsapp",
    message: "Leave me a message",
    link: "#",
    linkText: "+98 901 786 7178",
  },
  {
    isAvailable: true,
    isFollowable: false,
    icon: "email",
    title: "Email",
    message: "Mail to me",
    link: "#",
    linkText: "miladvaghefdev@gmail.com",
  },
  {
    isAvailable: true,
    isFollowable: false,
    icon: "telegram",
    title: "Telegram",
    message: "Message me anytime",
    link: "#",
    linkText: "@miladvaghef",
  },
  {
    isAvailable: false,
    isFollowable: true,
    icon: "linkedin",
    title: "Linkedin",
    message: "Let’s talk business ",
    link: "#",
    linkText: "@miladvaghef",
  },
  {
    isAvailable: true,
    isFollowable: true,
    icon: "github",
    title: "Github",
    message: "Check how I code",
    link: "#",
    linkText: "@miladvaghef",
  },
  {
    isAvailable: true,
    isFollowable: true,
    icon: "instagram",
    title: "Instagram",
    message: "Know me some more",
    link: "#",
    linkText: "@miladvaghef",
  },
];
