import type { StaticImageData } from "next/image";
import almond from "@/components/images/Almond.jpg";
import heroDriedFruits from "@/components/images/hero-dried-fruits.webp";
import heroFruitPlatter from "@/components/images/hero-fruit-platter.webp";
import heroFruitsNuts from "@/components/images/hero-fruits-nuts.webp";
import homeScreenPhoto from "@/components/images/home-screen-right-side-photo.jpg";
import logo from "@/components/images/logo.png";
import powder from "@/components/images/powder.jpg";

const localImages: Record<string, StaticImageData> = {
  "/assets/images/Almond.jpg": almond,
  "/assets/images/hero-dried-fruits.webp": heroDriedFruits,
  "/assets/images/hero-fruit-platter.webp": heroFruitPlatter,
  "/assets/images/hero-fruits-nuts.webp": heroFruitsNuts,
  "/assets/images/home-screen-right-side-photo.jpg": homeScreenPhoto,
  "/assets/images/logo.png": logo,
  "/assets/images/powder.jpg": powder,
};

export function resolveStoreImage(image: string): StaticImageData | string {
  return localImages[image] ?? image;
}
