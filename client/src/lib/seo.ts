import { useEffect } from "react";
import { siteConfig } from "@/lib/siteConfig";

interface SeoOptions {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSeo({ title, description, path, image }: SeoOptions) {
  useEffect(() => {
    const fullTitle = `${title} · ${siteConfig.name}`;
    document.title = fullTitle;
    const desc =
      description ||
      `Purchase ranks, coins, and crate keys to enhance your ${siteConfig.name} experience.`;
    setMeta("name", "description", desc);
    const url = `${siteConfig.websiteUrl}${path || ""}`;
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", siteConfig.name);
    setMeta("property", "og:image", image || "");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  }, [title, description, path, image]);
}
