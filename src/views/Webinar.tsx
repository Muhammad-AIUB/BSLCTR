"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    CalendarIcon,
    Clock,
    Users,
    ExternalLink,
    Star,
    X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function PLEXWebinarCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Facebook Live URL - replace with actual URL when available
    const facebookLiveUrl = "https://www.facebook.com/share/v/1CpeXqXV3Q/";

    // Webinar details
    const webinar = {
        title: "PLEX(Plasma Exchange) in Liver Failure patients",
        date: "May 13, 2025 (Tuesday)",
        time: "10:30 AM",
        duration: "90 min",
        category: "Clinical Practice",
        thumbnail: "/placeholder.svg?height=400&width=600",
        attendees: 1245,
        description:
            "Join this important session on Plasma Exchange (PLEX) therapy for liver failure patients. Learn about the latest techniques, clinical outcomes, and best practices for implementing PLEX in acute and chronic liver failure cases.",
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
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="overflow-hidden border-sky-100 shadow-lg hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300">
                    <div className="bg-gradient-to-r from-blue-600 to-sky-400 p-1">
                        <div className="bg-white dark:bg-slate-950">
                            {/* Card Header with Image */}
                            <div className="relative">
                                <img
                                    src={
                                        webinar.thumbnail || "/placeholder.svg"
                                    }
                                    alt={webinar.title}
                                    className="w-full h-64 object-cover"
                                />

                                {/* Featured and Live badges */}
                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                    <Badge
                                        variant="default"
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Star className="h-3 w-3 mr-1 fill-current" />{" "}
                                        Featured
                                    </Badge>
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

                                {/* Attendees badge */}
                                <div className="absolute top-4 right-4">
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1 bg-white/80 backdrop-blur-sm"
                                    >
                                        <Users className="h-3 w-3 text-blue-600" />
                                        {webinar.attendees.toLocaleString()}
                                    </Badge>
                                </div>

                                {/* Play button overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className="bg-black/50 rounded-full p-6 animate-pulse cursor-pointer"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <div className="w-0 h-0 border-t-[20px] border-t-transparent border-l-[35px] border-l-white border-b-[20px] border-b-transparent ml-2"></div>
                                    </div>
                                </div>

                                {/* Gradient overlay */}
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
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
                                <h2 className="text-2xl font-bold mt-2">
                                    {webinar.title}
                                </h2>
                            </CardHeader>

                            <CardContent>
                                <p className="text-muted-foreground mb-6">
                                    {webinar.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm text-sky-600 mb-6">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>
                                        {webinar.date} • {webinar.time}
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">
                                            Keynote Speaker
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12 border-2 border-sky-100">
                                                <AvatarImage
                                                    src={
                                                        webinar.speakers[0]
                                                            .avatar ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={
                                                        webinar.speakers[0].name
                                                    }
                                                />
                                                <AvatarFallback className="bg-sky-100 text-sky-800">
                                                    {webinar.speakers[0].name.charAt(
                                                        0
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">
                                                    {webinar.speakers[0].name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {webinar.speakers[0].role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">
                                            Chairperson
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12 border-2 border-sky-100">
                                                <AvatarImage
                                                    src={
                                                        webinar.speakers[1]
                                                            .avatar ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={
                                                        webinar.speakers[1].name
                                                    }
                                                />
                                                <AvatarFallback className="bg-sky-100 text-sky-800">
                                                    {webinar.speakers[1].name.charAt(
                                                        0
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">
                                                    {webinar.speakers[1].name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {webinar.speakers[1].role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">
                                            Panelists
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {webinar.speakers
                                                .slice(2)
                                                .map((speaker, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <Avatar className="h-10 w-10 border-2 border-sky-100">
                                                            <AvatarImage
                                                                src={
                                                                    speaker.avatar ||
                                                                    "/placeholder.svg"
                                                                }
                                                                alt={
                                                                    speaker.name
                                                                }
                                                            />
                                                            <AvatarFallback className="bg-sky-100 text-sky-800">
                                                                {speaker.name.charAt(
                                                                    0
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">
                                                                {speaker.name}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {speaker.role}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-2 pb-6">
                                <Button
                                    size="lg"
                                    className="w-full gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg animate-pulse"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Join Live Broadcast
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Full-screen modal for Facebook Live */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
                    <div className="relative w-full h-full">
                        <div className="absolute top-2 right-2 z-50">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full bg-black/50 hover:bg-black/70 text-white"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="w-full aspect-video">
                            <iframe
                                src={facebookLiveUrl}
                                width="100%"
                                height="100%"
                                style={{ border: "none", overflow: "hidden" }}
                                scrolling="no"
                                frameBorder="0"
                                allowFullScreen={true}
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
