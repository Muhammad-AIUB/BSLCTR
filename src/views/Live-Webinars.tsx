"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  Clock,
  Users,
  ExternalLink,
  Search,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

// Define TypeScript interfaces
interface Speaker {
  name: string;
  role: string;
  avatar: string;
}

interface Webinar {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  category: string;
  thumbnail: string;
  speakers: Speaker[];
  attendees: number;
  isLive: boolean;
  isFeatured?: boolean;
}

// Replace the webinars array with this Hepatology-focused data
const webinars: Webinar[] = [
  {
    id: "1",
    title: "PLEX(Plasma Exchange) in Liver Failure patients",
    description: "",
    date: "May 13, 2025 (Tuesday)",
    time: "10:30 AM",
    duration: "90 min",
    category: "Clinical Practice",
    thumbnail:
      "https://media.istockphoto.com/id/1402652565/video/live-webinar-button-icon-stamp-logo-label-isolated-on-white-background-motion-graphics-4k.jpg?s=640x640&k=20&c=jkkhgLYfRLYecnMk9Bgo8DxjzYHHTe8EFdFgMoVRBis=",
    speakers: [
      {
        name: "Dr. Sheikh Anisul Haque",
        role: "Keynote Speaker",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Professor Salimur Rahman",
        role: "Chairperson, Professor of Hepatology, President, BSLCTR",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Professor Faroque Ahmed",
        role: "Panelist, Vice-President, BSLCTR",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Dr. Md. Fazal Karim",
        role: "Panelist, Secretary General, BSLCTR",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    attendees: 1245,
    isLive: true,
    isFeatured: true,
  },
  // {
  //     id: "2",
  //     title: "Hepatitis B: New Therapeutic Targets and Cure Strategies",
  //     description:
  //         "Discover the latest research on novel antiviral therapies, immunomodulatory approaches, and potential curative strategies for chronic Hepatitis B infection.",
  //     date: "May 17, 2025",
  //     time: "11:00 AM EST",
  //     duration: "75 min",
  //     category: "Research",
  //     thumbnail: "/placeholder.svg?height=200&width=400",
  //     speakers: [
  //         {
  //             name: "Dr. David Wilson",
  //             role: "Professor of Virology and Hepatology",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //         },
  //     ],
  //     attendees: 876,
  //     isLive: true,
  // },
  // {
  //     id: "3",
  //     title: "Liver Transplantation: Optimizing Outcomes in Complex Cases",
  //     description:
  //         "Expert transplant surgeons discuss innovative techniques, patient selection criteria, and post-transplant management strategies for challenging liver transplant cases.",
  //     date: "May 20, 2025",
  //     time: "3:30 PM EST",
  //     duration: "120 min",
  //     category: "Surgical Techniques",
  //     thumbnail: "/placeholder.svg?height=200&width=400",
  //     speakers: [
  //         {
  //             name: "Dr. Emily Rodriguez",
  //             role: "Chief of Transplant Surgery",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //         },
  //         {
  //             name: "Dr. Thomas Wright",
  //             role: "Transplant Hepatologist",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //         },
  //     ],
  //     attendees: 932,
  //     isLive: true,
  // },
  // {
  //     id: "4",
  //     title: "Early Detection and Management of Hepatocellular Carcinoma",
  //     description:
  //         "Learn about the latest screening protocols, diagnostic imaging techniques, and treatment modalities for early-stage hepatocellular carcinoma in patients with chronic liver disease.",
  //     date: "May 22, 2025",
  //     time: "1:00 PM EST",
  //     duration: "60 min",
  //     category: "Diagnostics",
  //     thumbnail: "/placeholder.svg?height=200&width=400",
  //     speakers: [
  //         {
  //             name: "Dr. Alex Turner",
  //             role: "Director of Liver Cancer Program",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //         },
  //         {
  //             name: "Dr. Priya Patel",
  //             role: "Interventional Radiologist",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //         },
  //     ],
  //     attendees: 654,
  //     isLive: false,
  // },
  // {
  //     id: "5",
  //     title: "Autoimmune Liver Diseases: From Pathogenesis to Treatment",
  //     description:
  //         "This comprehensive webinar covers the latest understanding of autoimmune hepatitis, primary biliary cholangitis, and primary sclerosing cholangitis, with focus on diagnostic approaches and therapeutic strategies.",
  //     date: "May 25, 2025",
  //     time: "10:00 AM EST",
  //     duration: "90 min",
  //     category: "Treatment Advances",
  //     thumbnail: "/placeholder.svg?height=200&width=400",
  //     speakers: [
  //         {
  //             name: "Dr. James Lee",
  //             role: "Professor of Immunology and Hepatology",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //         },
  //     ],
  //     attendees: 1087,
  //     isLive: false,
  // },
  // {
  //     id: "6",
  //     title: "Alcoholic Liver Disease: New Insights and Therapeutic Approaches",
  //     description:
  //         "Explore recent advances in understanding the pathophysiology of alcoholic liver disease and emerging pharmacological and non-pharmacological interventions for patients with alcohol-related liver injury.",
  //     date: "May 28, 2025",
  //     time: "4:00 PM EST",
  //     duration: "75 min",
  //     category: "Clinical Practice",
  //     thumbnail: "/placeholder.svg?height=200&width=400",
  //     speakers: [
  //         {
  //             name: "Dr. Olivia Martinez",
  //             role: "Hepatology Research Director",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //         },
  //     ],
  //     attendees: 789,
  //     isLive: false,
  // },
  // {
  //     id: "7",
  //     title: "Pediatric Hepatology: Managing Rare Liver Disorders in Children",
  //     description:
  //         "Pediatric liver specialists discuss diagnosis and management of rare liver disorders in children, including biliary atresia, progressive familial intrahepatic cholestasis, and metabolic liver diseases.",
  //     date: "June 2, 2025",
  //     time: "1:30 PM EST",
  //     duration: "90 min",
  //     category: "Patient Care",
  //     thumbnail: "/placeholder.svg?height=200&width=400",
  //     speakers: [
  //         {
  //             name: "Dr. Robert Kim",
  //             role: "Chief of Pediatric Hepatology",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //         },
  //         {
  //             name: "Dr. Lisa Chen",
  //             role: "Pediatric Transplant Specialist",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //         },
  //     ],
  //     attendees: 542,
  //     isLive: false,
  // },
  // {
  //     id: "8",
  //     title: "Liver Fibrosis: Non-invasive Assessment and Antifibrotic Therapies",
  //     description:
  //         "This webinar covers the latest non-invasive methods for assessing liver fibrosis and discusses emerging antifibrotic therapies currently in clinical trials for various chronic liver diseases.",
  //     date: "June 5, 2025",
  //     time: "11:00 AM EST",
  //     duration: "60 min",
  //     category: "Research",
  //     thumbnail: "/placeholder.svg?height=200&width=400",
  //     speakers: [
  //         {
  //             name: "Dr. Andrew Parker",
  //             role: "Director of Hepatology Research",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //         },
  //     ],
  //     attendees: 876,
  //     isLive: false,
  // },
];

// Get all unique categories
const categories = Array.from(
  new Set(webinars.map((webinar) => webinar.category))
);

export default function LiveWebinars() {
  const [filter, setFilter] = useState<"all" | "live" | "upcoming">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featuredWebinar = webinars.find((webinar) => webinar.isFeatured);

  const filteredWebinars = webinars.filter((webinar) => {
    // Filter by tab
    const tabFilter =
      filter === "all"
        ? true
        : filter === "live"
        ? webinar.isLive
        : !webinar.isLive;

    // Filter by search
    const searchFilter =
      searchQuery === ""
        ? true
        : webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          webinar.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          webinar.speakers.some((speaker) =>
            speaker.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

    // Filter by category
    const categoryFilter =
      selectedCategory === null ? true : webinar.category === selectedCategory;

    return tabFilter && searchFilter && categoryFilter;
  });

  // Calculate time until webinar for non-live webinars
  const getTimeUntil = (dateStr: string, timeStr: string) => {
    const [month, day, year] = dateStr.split(" ");
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":");

    let hour = Number.parseInt(hours);
    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const monthMap: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const webinarDate = new Date(
      Number.parseInt(year),
      monthMap[month],
      Number.parseInt(day),
      hour,
      Number.parseInt(minutes)
    );

    const now = new Date();
    const diffMs = webinarDate.getTime() - now.getTime();

    if (diffMs <= 0) return "Starting soon";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHours}h ${diffMinutes}m`;
    }
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4 bg-gradient-to-r from-blue-600 to-sky-400 text-white px-4 py-1 rounded-full text-sm font-medium">
            Advancing Liver Health Education
          </div>
          <h1 className="pb-2 text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            Hepatology Live Webinars
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join our expert-led live webinars to enhance your knowledge of liver
            diseases, treatments, and research advancements in the field of
            Hepatology.
          </p>
        </motion.div>

        {featuredWebinar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12 rounded-lg overflow-hidden shadow-xl cursor-pointer"
            onClick={() => router.push(`/live`)}
          >
            <div className="bg-gradient-to-r from-blue-600 to-sky-400 p-1">
              <div className="bg-white dark:bg-slate-950 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={featuredWebinar.thumbnail || "/placeholder.svg"}
                      alt={featuredWebinar.title}
                      className="w-full h-full object-cover rounded-l-lg"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <Badge
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Star className="h-3 w-3 mr-1 fill-current" /> Featured
                      </Badge>
                      {featuredWebinar.isLive && (
                        <Badge
                          variant="destructive"
                          className="flex items-center gap-1"
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          LIVE NOW
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Badge
                          variant="outline"
                          className="bg-sky-50 text-sky-700 border-sky-200"
                        >
                          {featuredWebinar.category}
                        </Badge>
                        <div className="flex items-center text-sm text-sky-600">
                          <Clock className="h-3 w-3 mr-1" />
                          {featuredWebinar.duration}
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">
                        {featuredWebinar.title}
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        {featuredWebinar.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-sky-600 mb-4">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {featuredWebinar.date} • {featuredWebinar.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex -space-x-2">
                          {featuredWebinar.speakers.map((speaker, i) => (
                            <Avatar
                              key={i}
                              className="border-2 border-white h-8 w-8"
                            >
                              <AvatarImage
                                src={speaker.avatar || "/placeholder.svg"}
                                alt={speaker.name}
                              />
                              <AvatarFallback className="bg-sky-100 text-sky-800">
                                {speaker.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="text-sm">
                          {featuredWebinar.speakers.map((s, i) => (
                            <div key={i}>
                              <strong>{s.name}</strong> - {s.role}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        {featuredWebinar.isLive ? "Join Now" : "Register"}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search webinars..."
              className="pl-9 border-sky-200 focus-visible:ring-sky-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              className={
                selectedCategory === null ? "bg-blue-600 hover:bg-blue-700" : ""
              }
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={
                  selectedCategory === category
                    ? "bg-blue-600 hover:bg-blue-700"
                    : ""
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Tabs
          defaultValue="all"
          className="mb-8"
          value={filter}
          onValueChange={(value) =>
            setFilter(value as "all" | "live" | "upcoming")
          }
        >
          <div className="flex justify-center">
            <TabsList className="bg-sky-100">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                All Webinars
              </TabsTrigger>
              <TabsTrigger
                value="live"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Live Now
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Upcoming
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-6">
            {filteredWebinars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWebinars.map((webinar, index) => (
                  <WebinarCard
                    key={webinar.id}
                    webinar={webinar}
                    index={index}
                    getTimeUntil={getTimeUntil}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No webinars found matching your criteria.
                </p>
                <Button
                  variant="link"
                  className="text-blue-600 mt-2"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="live" className="mt-6">
            {filteredWebinars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWebinars.map((webinar, index) => (
                  <WebinarCard
                    key={webinar.id}
                    webinar={webinar}
                    index={index}
                    getTimeUntil={getTimeUntil}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No live webinars found matching your criteria.
                </p>
                <Button
                  variant="link"
                  className="text-blue-600 mt-2"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            {filteredWebinars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWebinars.map((webinar, index) => (
                  <WebinarCard
                    key={webinar.id}
                    webinar={webinar}
                    index={index}
                    getTimeUntil={getTimeUntil}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No upcoming webinars found matching your criteria.
                </p>
                <Button
                  variant="link"
                  className="text-blue-600 mt-2"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function WebinarCard({
  webinar,
  index,
  getTimeUntil,
}: {
  webinar: Webinar;
  index: number;
  getTimeUntil: (date: string, time: string) => string;
}) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full cursor-pointer"
      onClick={() => router.push(`/live`)}
    >
      <Card className="h-full flex flex-col overflow-hidden border-sky-100 hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300 py-0 pb-6">
        <div className="relative">
          <img
            src={webinar.thumbnail || "/placeholder.svg"}
            alt={webinar.title}
            className="w-full h-48 object-cover"
          />
          {webinar.isLive ? (
            <div className="absolute top-3 left-3">
              <Badge
                variant="destructive"
                className="flex items-center gap-1 animate-pulse"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                LIVE NOW
              </Badge>
            </div>
          ) : (
            <div className="absolute top-3 left-3">
              <Badge variant="default" className="bg-sky-600 hover:bg-sky-700">
                <Clock className="h-3 w-3 mr-1" />
                {getTimeUntil(webinar.date, webinar.time)}
              </Badge>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-white/80 backdrop-blur-sm"
            >
              <Users className="h-3 w-3 text-blue-600" />
              {webinar.attendees.toLocaleString()}
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge
              variant="outline"
              className="bg-sky-50 text-sky-700 border-sky-200"
            >
              {webinar.category}
            </Badge>
            <div className="flex items-center text-sm text-sky-600">
              <Clock className="h-3 w-3 mr-1" />
              {webinar.duration}
            </div>
          </div>
          <h3 className="text-xl font-semibold mt-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {webinar.title}
          </h3>
        </CardHeader>

        <CardContent className="flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {webinar.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-sky-600 mb-4">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {webinar.date} • {webinar.time}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex -space-x-2">
              {webinar.speakers.map((speaker, i) => (
                <Avatar
                  key={i}
                  className="border-2 border-white h-8 w-8 ring-2 ring-sky-100"
                >
                  <AvatarImage
                    src={speaker.avatar || "/placeholder.svg"}
                    alt={speaker.name}
                  />
                  <AvatarFallback className="bg-sky-100 text-sky-800">
                    {speaker.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="text-sm">
              {webinar.speakers.map((s) => (
                <div key={s.name}>
                  <strong>{s.name}</strong> - {s.role}
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 transition-all duration-300 shadow-md hover:shadow-lg"
            variant={webinar.isLive ? "destructive" : "default"}
            style={
              !webinar.isLive
                ? {
                    background: "linear-gradient(to right, #2563eb, #0ea5e9)",
                  }
                : {}
            }
          >
            {webinar.isLive ? "Join Now" : "Register"}
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
