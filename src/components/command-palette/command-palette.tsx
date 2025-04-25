"use client";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { searchIndex } from "@/constants/searchIndex";
import { SearchItem } from "@/types";
import { useAppContext } from "@/context/AppContext";

export default function CommandPalette() {
  const { isOpen, closePalette, openPalette, setAmongUsCount } =
    useAppContext();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);

  const fuse = new Fuse<SearchItem>(searchIndex, {
    keys: ["title", "content"],
    threshold: 0.3,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      }
      if (e.key === "Escape" || e.key === "Enter") {
        setQuery("");
        closePalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openPalette, closePalette]);

  useEffect(() => {
    if (query.trim() === "") return setResults([]);
    setResults(fuse.search(query).map((res) => res.item));
  }, [query]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setAmongUsCount(0);
      return;
    }

    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("among us")) {
      setAmongUsCount(6);
      setResults([]);
    } else {
      setAmongUsCount(0);
      setResults(fuse.search(query).map((res) => res.item));
    }
  }, [query, setAmongUsCount]);

  return isOpen ? (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex pt-40 justify-center m-4">
      <div className="bg-primary w-full max-w-lg p-4 rounded-lg shadow-lg h-fit">
        <input
          type="text"
          autoFocus
          placeholder="Search something..."
          className="w-full px-4 py-2 mb-4 border border-border outline-none rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className="w-full max-h-96 overflow-y-auto scrollbar">
          {results.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="block p-2 hover:bg-secondary rounded"
                onClick={() => closePalette()}
              >
                <strong className="capitalize">{item.title}</strong>
                <p className="text-sm text-gray-500 capitalize">
                  {item.content}
                </p>
              </a>
            </li>
          ))}
        </ul>
        <div className="w-full flex justify-end">
          <button
            className="mt-4 text-blue-500 hover:underline cursor-pointer"
            onClick={() => closePalette()}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
