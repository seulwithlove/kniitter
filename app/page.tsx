"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectBox from "./projectbox/page";

const mockData = [
  {
    id: 0,
    content: "muffler",
    isCompleted: true,
  },
  {
    id: 1,
    content: "socks",
    isCompleted: false,
  },
  {
    id: 2,
    content: "cardigan",
    isCompleted: false,
  },
];

export default function Home() {
  const [projects, setProjects] = useState(mockData);

  const idRef = useRef(3);
  const [content, setContent] = useState("");
  const onCreate = () => {
    const newProject = {
      id: idRef.current++,
      content: content,
      isCompleted: false,
    };
    setProjects((pre) => [newProject, ...pre]);
    setContent("");
  };

  return (
    <div className="mx-auto h-full">
      <div className="flex h-full w-full flex-col justify-around gap-3 bg-amber-500">
        <div className="flex flex-1 place-items-center border-2 border-blue-500">
          <Input
            placeholder="Name your knit project!"
            type="text"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setContent(e.target.value);
            }}
          />
          <Button onClick={onCreate}>+</Button>
        </div>

        <div className="flex flex-2 flex-col gap-3 border-2 border-green-400">
          <div>Ongoing projects</div>
          <ProjectBox projects={projects} />
        </div>
      </div>
    </div>
  );
}
