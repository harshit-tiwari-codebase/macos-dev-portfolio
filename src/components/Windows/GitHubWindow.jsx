import React, { useEffect, useState } from "react";
import axios from "axios";

import MacWindow from "./MacWindow";
import { GitHubCalendar } from "react-github-calendar";

import {
  FaGithub,
  FaStar,
  FaCodeBranch,
  FaExternalLinkAlt,
} from "react-icons/fa";

const GitHubWindow = () => {
  const [repos, setRepos] = useState([]);

  const username = "harshit-tiwari-codebase";

  // Fetch GitHub Repositories
  useEffect(() => {
    const getRepos = async () => {
      try {

        // API Request
        const response = await axios.get(
          `https://api.github.com/users/${username}/repos`
        );

        // Response Data
        const data = response.data;

        // Filter useful repos only
        const featuredRepos = data
          .filter((repo) => !repo.fork && repo.description)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);

        // Store in state
        setRepos(featuredRepos);

      } catch (error) {
        console.log("GitHub API Error:", error);
      }
    };

    getRepos();
  }, []);

  return (
    <MacWindow>
      <div className="w-full h-full overflow-y-auto bg-[#0d1117] text-white p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <FaGithub />
              GitHub Workspace
            </h1>

            

            <p className="text-gray-400 mt-2">
              Explore my development projects and coding journey.
            </p>
          </div>

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >
            Visit Profile
          </a>
        </div>

        {/* Contribution Calendar */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Contribution Activity
          </h2>

          <div className="overflow-x-auto">
            <GitHubCalendar
              username={username}
              colorScheme="dark"
            />
          </div>
        </div>

        {/* Repository Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-5">
            Featured Repositories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {repos.map((repo) => (
              <div
                key={repo.id}
                className="
                  bg-[#161b22]
                  border border-[#30363d]
                  rounded-2xl
                  p-5
                  hover:border-blue-500
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >

                {/* Repo Title */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold truncate">
                    {repo.name}
                  </h3>

                  <FaGithub className="text-gray-400" />
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-5 line-clamp-3">
                  {repo.description}
                </p>

                {/* Language */}
                <div className="mb-5">
                  <span className="px-3 py-1 text-sm rounded-full bg-blue-500/20 text-blue-400">
                    {repo.language || "Code"}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-5 text-sm text-gray-400 mb-5">

                  <div className="flex items-center gap-2">
                    <FaStar />
                    {repo.stargazers_count}
                  </div>

                  <div className="flex items-center gap-2">
                    <FaCodeBranch />
                    {repo.forks_count}
                  </div>

                </div>

                {/* Buttons */}
                <div className="flex gap-3">

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      flex-1
                      flex items-center justify-center gap-2
                      px-4 py-2
                      rounded-xl
                      bg-white/10
                      hover:bg-white/20
                      transition
                    "
                  >
                    <FaGithub />
                    Code
                  </a>

                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        flex-1
                        flex items-center justify-center gap-2
                        px-4 py-2
                        rounded-xl
                        bg-blue-500
                        hover:bg-blue-600
                        transition
                      "
                    >
                      <FaExternalLinkAlt />
                      Live
                    </a>
                  )}

                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </MacWindow>
  );
};

export default GitHubWindow;