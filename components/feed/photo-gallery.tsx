// "use client"
//
// import type React from "react"
//
// import { useState, useEffect, useCallback } from "react"
// import Image from "next/image"
// import { AnimatePresence, motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Icons } from "@/components/icons"
// import { useMediaQuery } from "@/hooks/use-media-query"
// import { cn } from "@/lib/utils"
//
// interface PhotoGalleryProps {
//     images: string[]
//     initialIndex?: number
//     isOpen: boolean
//     onClose: () => void
// }
//
// export function PhotoGallery({ images, initialIndex = 0, isOpen, onClose }: PhotoGalleryProps) {
//     const [currentIndex, setCurrentIndex] = useState(initialIndex)
//     const [direction, setDirection] = useState(0)
//     const [touchStart, setTouchStart] = useState<number | null>(null)
//     const [touchEnd, setTouchEnd] = useState<number | null>(null)
//     const isMobile = useMediaQuery("(max-width: 768px)")
//
//     // Reset to initial index when opening
//     useEffect(() => {
//         if (isOpen) {
//             setCurrentIndex(initialIndex)
//         }
//     }, [isOpen, initialIndex])
//
//     // Handle keyboard navigation
//     useEffect(() => {
//         const handleKeyDown = (e: KeyboardEvent) => {
//             if (!isOpen) return
//
//             if (e.key === "ArrowLeft") {
//                 navigatePrevious()
//             } else if (e.key === "ArrowRight") {
//                 navigateNext()
//             } else if (e.key === "Escape") {
//                 onClose()
//             }
//         }
//
//         window.addEventListener("keydown", handleKeyDown)
//         return () => window.removeEventListener("keydown", handleKeyDown)
//     }, [isOpen, currentIndex, images.length])
//
//     // Navigate to previous image
//     const navigatePrevious = useCallback(() => {
//         if (currentIndex > 0) {
//             setDirection(-1)
//             setCurrentIndex(currentIndex - 1)
//         }
//     }, [currentIndex])
//
//     // Navigate to next image
//     const navigateNext = useCallback(() => {
//         if (currentIndex < images.length - 1) {
//             setDirection(1)
//             setCurrentIndex(currentIndex + 1)
//         }
//     }, [currentIndex, images.length])
//
//     // Touch handlers for swipe
//     const handleTouchStart = (e: React.TouchEvent) => {
//         setTouchStart(e.targetTouches[0].clientX)
//     }
//
//     const handleTouchMove = (e: React.TouchEvent) => {
//         setTouchEnd(e.targetTouches[0].clientX)
//     }
//
//     const handleTouchEnd = () => {
//         if (!touchStart || !touchEnd) return
//
//         const distance = touchStart - touchEnd
//         const isLeftSwipe = distance > 50
//         const isRightSwipe = distance < -50
//
//         if (isLeftSwipe && currentIndex < images.length - 1) {
//             navigateNext()
//         } else if (isRightSwipe && currentIndex > 0) {
//             navigatePrevious()
//         }
//
//         setTouchStart(null)
//         setTouchEnd(null)
//     }
//
//     if (!isOpen) return null
//
//     return (
//         <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
//             {/* Close button */}
//             <Button
//                 variant="ghost"
//                 size="icon"
//                 className="absolute top-4 right-4 z-50 text-white hover:bg-white/10 rounded-full"
//                 onClick={onClose}
//             >
//                 <Icons.close className="h-6 w-6" />
//             </Button>
//
//             {/* Image counter */}
//             {images.length > 1 && (
//                 <div className="absolute top-4 left-4 z-50 text-white text-sm bg-black/50 px-2 py-1 rounded-full">
//                     {currentIndex + 1} / {images.length}
//                 </div>
//             )}
//
//             {/* Main image container */}
//             <div
//                 className="relative w-full h-full flex items-center justify-center"
//                 onClick={(e) => e.stopPropagation()}
//                 onTouchStart={handleTouchStart}
//                 onTouchMove={handleTouchMove}
//                 onTouchEnd={handleTouchEnd}
//             >
//                 <AnimatePresence initial={false} custom={direction}>
//                     <motion.div
//                         key={currentIndex}
//                         custom={direction}
//                         initial={{ opacity: 0, x: direction * 50 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: -direction * 50 }}
//                         transition={{ duration: 0.2 }}
//                         className="absolute inset-0 flex items-center justify-center"
//                     >
//                         <div className="relative w-full h-full max-w-4xl max-h-[80vh] mx-auto">
//                             <Image
//                                 src={images[currentIndex] || "/placeholder.svg"}
//                                 alt={`Photo ${currentIndex + 1}`}
//                                 fill
//                                 className="object-contain"
//                                 priority
//                             />
//                         </div>
//                     </motion.div>
//                 </AnimatePresence>
//
//                 {/* Navigation buttons (only on desktop or if more than one image) */}
//                 {images.length > 1 && (
//                     <>
//                         {(!isMobile || images.length > 5) && (
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className={cn(
//                                     "absolute left-4 z-50 text-white hover:bg-white/10 rounded-full h-10 w-10",
//                                     currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100",
//                                 )}
//                                 onClick={(e) => {
//                                     e.stopPropagation()
//                                     navigatePrevious()
//                                 }}
//                                 disabled={currentIndex === 0}
//                             >
//                                 <Icons.chevronLeft className="h-6 w-6" />
//                             </Button>
//                         )}
//
//                         {(!isMobile || images.length > 5) && (
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className={cn(
//                                     "absolute right-4 z-50 text-white hover:bg-white/10 rounded-full h-10 w-10",
//                                     currentIndex === images.length - 1 ? "opacity-50 cursor-not-allowed" : "opacity-100",
//                                 )}
//                                 onClick={(e) => {
//                                     e.stopPropagation()
//                                     navigateNext()
//                                 }}
//                                 disabled={currentIndex === images.length - 1}
//                             >
//                                 <Icons.chevronRight className="h-6 w-6" />
//                             </Button>
//                         )}
//                     </>
//                 )}
//
//                 {/* Dot indicators for multiple images */}
//                 {images.length > 1 && (
//                     <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
//                         {images.map((_, index) => (
//                             <button
//                                 key={index}
//                                 className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
//                                 onClick={(e) => {
//                                     e.stopPropagation()
//                                     setDirection(index > currentIndex ? 1 : -1)
//                                     setCurrentIndex(index)
//                                 }}
//                                 aria-label={`Go to image ${index + 1}`}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useMediaQuery } from "@/hooks/use-media-query"
import { motion, AnimatePresence } from "framer-motion"
import { useSwipeable } from "react-swipeable"

interface PhotoGalleryProps {
    images: string[]
    initialIndex?: number
    isOpen: boolean
    onClose: () => void
}

export function PhotoGallery({ images, initialIndex = 0, isOpen, onClose }: PhotoGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const handlePrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }, [images.length])

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, [images.length])

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                handlePrevious()
            } else if (e.key === "ArrowRight") {
                handleNext()
            } else if (e.key === "Escape") {
                onClose()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleNext, handlePrevious, onClose])

    // Swipe handlers for mobile
    const swipeHandlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrevious,
        trackMouse: false,
    })

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
            <div
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
                {...swipeHandlers}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        <div className="relative max-w-4xl max-h-[80vh] w-full h-full">
                            <Image
                                src={images[currentIndex] || "/placeholder.svg"}
                                alt={`Photo ${currentIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation controls */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-black/50 rounded-full z-10"
                    onClick={onClose}
                >
                    <Icons.close className="h-6 w-6" />
                </Button>

                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-black/50 rounded-full z-10"
                            onClick={handlePrevious}
                        >
                            <Icons.chevronLeft className="h-6 w-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-black/50 rounded-full z-10"
                            onClick={handleNext}
                        >
                            <Icons.chevronRight className="h-6 w-6" />
                        </Button>

                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${
                                        index === currentIndex ? "bg-white" : "bg-white/50"
                                    } transition-colors`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setCurrentIndex(index)
                                    }}
                                />
                            ))}
                        </div>

                        <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
