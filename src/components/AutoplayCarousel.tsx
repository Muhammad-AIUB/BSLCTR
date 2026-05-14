"use client";

import React, { useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

export default function AutoplayCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const intervalRef = useRef<number | null>(null);

  // Set up autoplay
  useEffect(() => {
    if (!api) return;

    // Start autoplay when component mounts
    intervalRef.current = window.setInterval(() => {
      api.scrollNext();
    }, 3000); // Change slide every 3 seconds

    // Clean up interval when component unmounts
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api]);

  return (
    <div className="w-full overflow-hidden">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index} className="w-full">
              <div className="w-full h-full">
                <img
                  src="https://img.freepik.com/free-vector/stages-liver-disease_1308-47516.jpg?t=st=1745861629~exp=1745865229~hmac=f8c38890e589d12e14c22003cce4bcfa7943eb1782913a7352be1211a5d8cbde&w=1060"
                  alt={`Liver disease stages ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
}
