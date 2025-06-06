"use client";
import React from "react";
import Fadeup from "../ui/fadeup";
import Image from "next/image";

interface Item {
  title: string;
  desc: string;
  image: string;
}

const StackCard = ({
  item,
  index,
  isMatched,
}: {
  item: Item;
  index: number;
  isMatched: boolean;
}) => {
  return (
    <Fadeup delay={(index % 4) * 0.1} duration={0.4}>
      <div
        className={`${
          isMatched
            ? "bg-indigo-900 shadow-2xl shadow-indigo-300"
            : "bg-primary"
        } rounded-lg p-4 flex flex-col gap-1 transition-colors duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-center w-full p-4 sm:p-8">
          {item?.image && (
            <Image
              height={48}
              width={48}
              src={item.image}
              alt={item.title}
              className="xs:w-12 xs:h-12 sm:w-18 sm:h-18 object-cover rounded-full"
            />
          )}
        </div>
        <p
          className={`${
            isMatched ? "" : "border-border/70 text-gray-600"
          } text-xs sm:text-sm  border  w-fit px-2 rounded-sm`}
        >
          {item.desc}
        </p>
        {/* <p className="text-lg tracking-wide font-medium sm:hidden">
          {item.title.length > 6 ? item.title.slice(0, 6) + ".." : item.title}
        </p> */}
        <p className="text-base sm:text-lg tracking-wide font-medium ">
          {item.title}
        </p>
      </div>
    </Fadeup>
  );
};

export default StackCard;
